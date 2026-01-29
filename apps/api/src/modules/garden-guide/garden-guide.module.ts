import { Module } from '@nestjs/common';
import { GardenGuideController } from './garden-guide.controller';
import { GardenGuideService } from './garden-guide.service';

@Module({
  controllers: [GardenGuideController],
  providers: [GardenGuideService],
  exports: [GardenGuideService],
})
export class GardenGuideModule {}
