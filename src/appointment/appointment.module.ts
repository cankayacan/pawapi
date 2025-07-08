import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { PetOwnerModule } from 'src/pet-owner/pet-owner.module';
import { PetModule } from 'src/pet/pet.module';

import { UploadModule } from '../upload/upload.module';
import { AppointmentResolver } from './resolvers/appointment.resolver';
import { AppointmentService } from './services/appointment.service';

@Module({
  imports: [
    EmailModule,
    AuthModule,
    UploadModule,
    ConfigModule.forRoot(),
    PetModule,
    PetOwnerModule,
  ],
  providers: [AppointmentResolver, AppointmentService],
  controllers: [],
})
export class AppointmentModule {}
