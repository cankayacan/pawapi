import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import axios from 'axios';

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);

  private readonly googleMapsApiUrl =
    'https://maps.googleapis.com/maps/api/geocode/json';

  private readonly apiKey = process.env.GOOGLE_MAPS_API_KEY;

  async getGeocode(address: string): Promise<{ lat: number; lng: number }> {
    try {
      const response = await axios.get(this.googleMapsApiUrl, {
        params: {
          address: address,
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message);
      }

      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } catch (error) {
      console.error(error);
      this.logger.error(error.message);
      throw new HttpException(
        'Error while fetching geocode',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private parseAddressComponents(addressComponents: any[]): {
    street: string;
    streetNumber: string;
    postCode: string;
    city: string;
  } {
    const result = {
      street: '',
      streetNumber: '',
      postCode: '',
      city: '',
    };

    for (const component of addressComponents) {
      const types = component.types;
      if (types.includes('route')) result.street = component.long_name;
      else if (types.includes('street_number'))
        result.streetNumber = component.long_name;
      else if (types.includes('postal_code'))
        result.postCode = component.long_name;
      else if (types.includes('locality')) result.city = component.long_name;
    }

    return result;
  }

  async getAddressParts(fullAddress: string): Promise<{
    street: string;
    streetNumber: string;
    postCode: string;
    city: string;
  }> {
    try {
      const response = await axios.get(this.googleMapsApiUrl, {
        params: {
          address: fullAddress,
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message);
      }

      return this.parseAddressComponents(
        response.data.results[0].address_components,
      );
    } catch (error) {
      console.error(error);
      this.logger.error(error.message);
      throw new HttpException(
        'Error while fetching address parts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
