import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LifeAreasService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.lifeArea.findMany({
      include: { practices: true },
    });
  }

  findOne(id: string) {
    return this.prisma.lifeArea.findUniqueOrThrow({
      where: { id },
      include: { practices: true, reflections: true },
    });
  }

  create(data: any) {
    return this.prisma.lifeArea.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.lifeArea.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.lifeArea.delete({ where: { id } });
  }
}
