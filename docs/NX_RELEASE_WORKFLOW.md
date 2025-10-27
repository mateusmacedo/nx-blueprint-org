# 📦 Nx Release Workflow

## Visão Geral

Este documento explica como usar o **Nx Release** com configuração granular de Git no workspace. A configuração atual utiliza propriedades `git` específicas para cada fase do release (`version.git` e `changelog.git`), o que requer o uso de subcomandos específicos em vez do comando global `nx release`.

## 🔍 Por Que o Comando Global Falha

### Erro Comum

```bash
$ pnpm exec nx release --dry-run

NX   The "release" top level command cannot be used with granular git configuration. 
Instead, configure git options in the "release.git" property in nx.json, 
or use the version, changelog, and publish subcommands or programmatic API directly.
```

### Causa Raiz

O erro ocorre porque o `nx.json` possui **configuração Git granular**:

```json
"release": {
  "version": {
    "git": {
      "commit": true,
      "tag": true,
      "commitMessage": "📦 release(release): launch release {version}",
      "tagMessage": "📦 release(release): launch release {version}"
    }
  },
  "changelog": {
    "git": {
      "commit": true,
      "tag": true,
      "commitMessage": "📦 release(release): launch release {version}",
      "tagMessage": "📦 release(release): launch release {version}"
    }
  }
}
```

Quando o Nx detecta configurações `git` em múltiplos níveis, considera isso uma "configuração granular" e não consegue determinar qual configuração usar no nível global.

## ✅ Solução: Usar Subcomandos Específicos

### Comandos Corretos para Dry-Run

```bash
# 1. Verificar versioning (sem aplicar mudanças)
pnpm exec nx release version --dry-run

# 2. Verificar changelog (sem aplicar mudanças)  
pnpm exec nx release changelog --dry-run

# 3. Verificar publish (sem aplicar mudanças)
pnpm exec nx release publish --dry-run
```

### Comandos para Execução Real

```bash
# 1. Aplicar versionamento e criar commit/tag
pnpm exec nx release version

# 2. Gerar changelog e criar release no GitHub
pnpm exec nx release changelog

# 3. Publicar pacotes
pnpm exec nx release publish
```

## 🔄 Workflow Recomendado

### Release Completo com Validação

```bash
# Passo 1: Validar versioning
pnpm exec nx release version --dry-run

# Passo 2: Aplicar versioning
pnpm exec nx release version

# Passo 3: Validar changelog
pnpm exec nx release changelog --dry-run

# Passo 4: Gerar changelog e criar release no GitHub
pnpm exec nx release changelog

# Passo 5: Publicar (se aplicável)
pnpm exec nx release publish
```

### Release Rápido (sem validação)

```bash
# Para releases rápidos quando você tem certeza das mudanças
pnpm exec nx release version
pnpm exec nx release changelog
pnpm exec nx release publish
```

## 📋 Configuração Atual

### Estrutura do nx.json

```json
{
  "release": {
    "projectsRelationship": "independent",
    "releaseTagPattern": "{projectName}@v{version}",
    "projects": [
      "@nxacme/*",
      "!@nxacme/source"
    ],
    "version": {
      "preVersionCommand": "pnpm nx run-many -t build",
      "conventionalCommits": true,
      "generatorOptions": {
        "fallbackCurrentVersionResolver": "disk"
      },
      "git": {
        "commit": true,
        "tag": true,
        "commitMessage": "📦 release(release): launch release {version}",
        "tagMessage": "📦 release(release): launch release {version}"
      }
    },
    "changelog": {
      "automaticFromRef": true,
      "createRelease": "github",
      "git": {
        "commit": true,
        "tag": true,
        "commitMessage": "📦 release(release): launch release {version}",
        "tagMessage": "📦 release(release): launch release {version}"
      },
      "projectChangelogs": {
        "renderOptions": {
          "authors": true,
          "commitReferences": true,
          "versionTitleDate": true
        }
      }
    }
  }
}
```

### Características da Configuração

- **`projectsRelationship: "independent"`**: Cada projeto é versionado independentemente
- **`conventionalCommits: true`**: Usa Conventional Commits para determinar versões
- **`createRelease: "github"`**: Cria releases automaticamente no GitHub
- **`preVersionCommand`**: Executa build antes do versionamento

## 🚀 Integração com CI/CD

### GitHub Actions Workflow

```yaml
name: Release
on:
  push:
    branches: [main]
    paths-ignore:
      - 'docs/**'
      - '*.md'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Release version
        run: pnpm exec nx release version

      - name: Release changelog
        run: pnpm exec nx release changelog

      - name: Push changes
        run: git push --follow-tags

      - name: Release publish
        run: pnpm exec nx release publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Validação de Release em PRs

```yaml
name: Release Validation
on:
  pull_request:
    branches: [main]

jobs:
  validate-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Validate release version
        run: pnpm exec nx release version --dry-run

      - name: Validate release changelog
        run: pnpm exec nx release changelog --dry-run
```

## 🔧 Troubleshooting

### Problema: "granular git configuration"

**Solução**: Use subcomandos específicos em vez de `nx release`:

```bash
# ❌ Não funciona
pnpm exec nx release --dry-run

# ✅ Funciona
pnpm exec nx release version --dry-run
pnpm exec nx release changelog --dry-run
```

### Problema: Commits não são criados

**Verificar**:
- Token GitHub tem permissões adequadas
- Branch está atualizada
- Não há mudanças não commitadas

### Problema: Tags não são criadas

**Verificar**:
- Configuração `git.tag: true` está presente
- Permissões de push para tags
- Padrão de tag está correto

### Problema: Release não é criado no GitHub

**Verificar**:
- `createRelease: "github"` está configurado
- Token GitHub tem permissão `contents: write`
- Projeto tem changelog válido

## 📚 Alternativas de Configuração

### Configuração Centralizada (Alternativa)

Se preferir usar `nx release` diretamente, mova a configuração Git para o nível superior:

```json
{
  "release": {
    "git": {
      "commit": true,
      "tag": true,
      "commitMessage": "📦 release(release): launch release {version}",
      "tagMessage": "📦 release(release): launch release {version}"
    },
    "version": {
      "preVersionCommand": "pnpm nx run-many -t build",
      "conventionalCommits": true
    },
    "changelog": {
      "automaticFromRef": true,
      "createRelease": "github"
    }
  }
}
```

**Vantagens**:
- Permite usar `nx release --dry-run`
- Configuração mais simples

**Desvantagens**:
- Menos controle granular por fase
- Mesma configuração Git para todas as fases

## 📖 Recursos Adicionais

- [Documentação Oficial Nx Release](https://nx.dev/features/manage-releases)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Releases API](https://docs.github.com/en/rest/releases/releases)

## 🎯 Resumo

1. **Configuração granular** requer uso de subcomandos específicos
2. **Use `nx release version`** para versionamento
3. **Use `nx release changelog`** para changelog e releases GitHub
4. **Use `nx release publish`** para publicação de pacotes
5. **Sempre valide** com `--dry-run` antes de executar
6. **Configure tokens** adequadamente para CI/CD
