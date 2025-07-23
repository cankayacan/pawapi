import { Module } from '@nestjs/common';

import { CaregiverResolver } from './resolvers/caregiver.resolver';
import { CaregiverService } from './services/caregiver.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CaregiverService, CaregiverResolver],
  exports: [CaregiverService],
})
export class CaregiverModule {}
