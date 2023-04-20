import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';
import { Client } from '@googlemaps/google-maps-services-js';

@Module({
  imports: [],
  providers: [MapsService, { provide: 'GoogleMapsClient', useClass: Client }],
  exports: [MapsService],
})
export class MapsModule {}
