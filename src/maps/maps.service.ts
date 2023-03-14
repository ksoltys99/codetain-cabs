import { Injectable } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MapsService {
  client: Client;
  constructor(private readonly configService: ConfigService) {
    this.client = new Client();
  }

  async getGeolocalisation(address: string) {
    const args = {
      params: {
        key: this.configService.get('GOOGLE_API_KEY'),
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
