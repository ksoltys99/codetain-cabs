import { Inject, Injectable } from '@nestjs/common';
import {
  Client,
  DirectionsRequest,
  TravelMode,
} from '@googlemaps/google-maps-services-js';
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

  async getTravelDetails(from: string, to: string) {
    const request: DirectionsRequest = {
      params: {
        origin: from,
        destination: to,
        mode: TravelMode.driving,
        key: this.apiKey,
      },
    };
    return await this.client.directions(request).then((res) => {
      const result = JSON.parse(JSON.stringify(res.data.routes[0].legs[0]));
      const distance: number = result.distance.value;
      const travelTime = result.duration.text;
      return {
        distance,
        travelTime,
      };
    });
  }

  async getPostalCodePrefix(address: string) {
    const args = {
      params: {
        key: this.apiKey,
        address: address,
      },
    };

    return await this.client.geocode(args).then((response) => {
      const result = JSON.parse(JSON.stringify(response.data.results[0]));
      let prefix;
      result.address_components.forEach((element: any) => {
        element.types.forEach((type: any) => {
          //if (type == 'postal_code_prefix') prefix = element.short_name;
          if (type == 'postal_code')
            prefix = element.short_name.substring(0, 2);
        });
      });
      if (!prefix) return "Couldn't find postal code prefix";
      return prefix;
      //return result;
    });
  }
}
