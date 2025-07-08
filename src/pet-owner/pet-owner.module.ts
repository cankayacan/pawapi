import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { PetModule } from 'src/pet/pet.module';
import { UploadModule } from 'src/upload/upload.module';

import { PetOwnerController } from './controllers/pet-owner.controller';
import { PetOwnerResolver } from './resolvers/pet-owner.resolver';
import { GeocodingService } from './services/geocoding.service';
import { PetOwnerService } from './services/pet-owner.service';

@Module({
  imports: [
    EmailModule,
    AuthModule,
    UploadModule,
    PetModule,
    ConfigModule.forRoot(),
  ],
  providers: [PetOwnerResolver, PetOwnerService, GeocodingService],
  controllers: [PetOwnerController],
  exports: [PetOwnerService],
})
export class PetOwnerModule {}
