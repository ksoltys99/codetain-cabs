import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';
import { Coords } from './coords.interface';

@Injectable()
export class MapsService {
  private apiKey: string = this.configService.get('GOOGLE_API_KEY');
  constructor(
    private readonly configService: ConfigService,
    @Inject('GoogleMapsClient') private client: Client,
  ) {}

  async getGeolocalisation(address: string): Promise<Coords> {
    const args = {
      params: {
        key: this.apiKey,
        address: address,
      },
    };

    return await this.client.geocode(args).then((response) => {
      const result = JSON.parse(
        JSON.stringify(response.data.results[0].geometry.location),
      );
      return result;
    });
  }
}
