import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from 'src/auth/auth.module';

import { UploadModule } from '../upload/upload.module';
import { PetController } from './controllers/pet.controller';
import { PetResolver } from './resolvers/pet.resolver';
import { PetService } from './services/pet.service';

@Module({
  imports: [AuthModule, UploadModule, ConfigModule.forRoot()],
  providers: [PetResolver, PetService],
  controllers: [PetController],
  exports: [PetService],
})
export class PetModule {}
