import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilsNestJsModule } from '@nxacme/utils-nestjs';

@Module({
  imports: [UtilsNestJsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
