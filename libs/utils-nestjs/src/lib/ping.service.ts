import { Injectable } from '@nestjs/common';

@Injectable()
export class PingService {
  /**
   * Retorna uma resposta de ping simples
   * @returns string 'pong'
   */
  ping(): string {
    return 'pong';
  }

  /**
   * Retorna informações de health check com timestamp
   * @returns objeto com status e timestamp atual
   */
  healthCheck(): { status: string; timestamp: Date } {
    return {
      status: 'ok',
      timestamp: new Date(),
    };
  }
}
