import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PracticesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.practice.findMany({
      include: { lifeArea: true },
    });
  }

  findOne(id: string) {
    return this.prisma.practice.findUniqueOrThrow({
      where: { id },
      include: { lifeArea: true, logs: { orderBy: { completedAt: 'desc' }, take: 30 } },
    });
  }

  create(data: any) {
    return this.prisma.practice.create({ data });
  }

  log(practiceId: string, data: any) {
    return this.prisma.practiceLog.create({
      data: { ...data, practiceId },
    });
  }

  update(id: string, data: any) {
    return this.prisma.practice.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.practice.delete({ where: { id } });
  }
}
