import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';

import { AppointmentModule } from './appointment/appointment.module';
import { AuthModule } from './auth/auth.module';
import { CaregiverModule } from './caregiver/caregiver.module';
import { HealthModule } from './health/health.module';
import { LoggerMiddleware } from './logger-middleware';
import { PetOwnerModule } from './pet-owner/pet-owner.module';
import { PetModule } from './pet/pet.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UploadModule,
    PetModule,
    PetOwnerModule,
    AppointmentModule,
    CaregiverModule,
    HealthModule,
  ],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
