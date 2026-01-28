import { Module } from '@nestjs/common';
import { LifeAreasModule } from '../modules/life-areas/life-areas.module';
import { PracticesModule } from '../modules/practices/practices.module';
import { AuthModule } from '../modules/auth/auth.module';
import { GardenGuideModule } from '../modules/garden-guide/garden-guide.module';
import { ReflectionsModule } from '../modules/reflections/reflections.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    LifeAreasModule,
    PracticesModule,
    ReflectionsModule,
    GardenGuideModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
