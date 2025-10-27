import { Module } from '@nestjs/common';
import { PingService } from './ping.service';

@Module({
	controllers: [],
	providers: [PingService],
	exports: [PingService],
})
export class UtilsNestJsModule {}
