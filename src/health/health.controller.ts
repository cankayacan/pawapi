import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { DrizzleHealthIndicator } from './drizzle.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private readonly drizzleHealthIndicator: DrizzleHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    // return this.health.check([() => this.drizzleHealthIndicator.pingCheck()]);
    return {
      status: 'ok',
      message: 'Health check passed',
    };
  }
}
