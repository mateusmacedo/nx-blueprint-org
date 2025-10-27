import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PingService } from '@nxacme/utils-nestjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly pingService: PingService,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('ping')
  ping() {
    return this.pingService.ping();
  }

  @Get('health')
  healthCheck() {
    return this.pingService.healthCheck();
  }
}
