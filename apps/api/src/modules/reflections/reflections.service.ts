import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReflectionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(lifeAreaId?: string) {
    return this.prisma.reflection.findMany({
      where: lifeAreaId ? { lifeAreaId } : undefined,
      include: { lifeArea: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.reflection.findUniqueOrThrow({
      where: { id },
      include: { lifeArea: true },
    });
  }

  create(data: any) {
    return this.prisma.reflection.create({ data });
  }
}
