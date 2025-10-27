import { Test, TestingModule } from '@nestjs/testing';
import { PingService } from './ping.service';

describe('PingService', () => {
  let service: PingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PingService],
    }).compile();

    service = module.get<PingService>(PingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ping', () => {
    it('should return "pong"', () => {
      // Arrange & Act
      const result = service.ping();

      // Assert
      expect(result).toBe('pong');
    });
  });

  describe('healthCheck', () => {
    it('should return object with status "ok" and valid timestamp', () => {
      // Arrange
      const beforeCall = new Date();

      // Act
      const result = service.healthCheck();

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
    });

    it('should return different timestamps on multiple calls', async () => {
      // Arrange & Act
      const result1 = service.healthCheck();
      // Adiciona um pequeno delay para garantir timestamps diferentes
      await new Promise(resolve => setTimeout(resolve, 1));
      const result2 = service.healthCheck();

      // Assert
      expect(result1.timestamp).not.toEqual(result2.timestamp);
      expect(result1.timestamp.getTime()).toBeLessThanOrEqual(result2.timestamp.getTime());
    });
  });
});
