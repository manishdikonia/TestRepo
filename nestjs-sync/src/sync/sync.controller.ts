import { Controller, Get, Post, Body } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'nestjs-sync' };
  }

  @Post('trigger-sync')
  async triggerSync(@Body() data: any) {
    // This endpoint can be used to manually trigger synchronization
    // or handle specific sync scenarios
    return { message: 'Sync triggered', data };
  }
}