# Scripts Utilitários

Este diretório contém funções comuns essenciais para scripts específicos.
**IMPORTANTE:** Use funcionalidades nativas do Nx sempre que possível.

## 📁 Estrutura

```
utils/
├── README.md                        # Este arquivo
└── common-functions.sh              # Funções comuns essenciais
```

## ⚠️ IMPORTANTE: Use Nx 20 nativo

**NÃO use funções customizadas para funcionalidades que o Nx 20 já fornece:**

- **Detecção de mudanças:** `nx affected --target=test --base=origin/main`
- **Cobertura:** `nx test --coverage` ou `nx affected --target=test --coverage`
- **Cache:** Nx gerencia automaticamente via `nx.json`
- **Retry:** Nx tem retry nativo via configuração
- **Paralelização:** `nx run-many --target=test --parallel=3`
- **Análise:** `nx graph`, `nx report`, `nx show projects`
- **Execução:** `nx exec` para scripts customizados
- **Configuração:** `nx.json` com `targetDefaults`, `namedInputs`

## 🔧 Funções Disponíveis

### `common-functions.sh`
Biblioteca de funções comuns essenciais para scripts específicos.

#### Funções de Logging
```bash
log_info "Mensagem informativa"
log_success "Operação concluída"
log_error "Erro encontrado"
log_warning "Aviso importante"
log_debug "Informação de debug"
log_step "Executando passo..."
```

#### Funções de Validação
```bash
# Validar pré-requisitos essenciais (pnpm, node, nx.json)
validate_prerequisites

# Verificar se estamos em ambiente CI
if is_ci_environment; then
    log_info "Executando em ambiente CI"
fi
```

#### Funções de Informação
```bash
# Obter informações básicas do workspace
get_workspace_info

# Mostrar estatísticas de performance
show_performance_stats "$start_time" "$end_time" "Operação"
```

## 📝 Como Usar

### Para funcionalidades padrão, use Nx 20:
```bash
# Detecção de mudanças
nx affected --target=test --base=origin/main

# Cobertura
nx test --coverage

# Paralelização
nx run-many --target=test --parallel=3

# Análise
nx graph
nx report
```

### Para funcionalidades específicas, use funções:
```bash
# Carregar funções comuns
source scripts/utils/common-functions.sh

# Usar funções específicas
log_info "Iniciando operação específica"
validate_prerequisites
get_workspace_info
```
