import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';

@Module({
  imports: [],
  providers: [MapsService],
  exports: [MapsService],
})
export class MapsModule {}
