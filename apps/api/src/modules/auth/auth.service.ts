import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(_credentials: any) {
    // TODO: Implement JWT-based authentication
    return { message: 'Auth not yet implemented' };
  }

  async register(_data: any) {
    // TODO: Implement user registration
    return { message: 'Registration not yet implemented' };
  }
}
