import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user' })
  login(@Body() credentials: any) {
    return this.authService.login(credentials);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() data: any) {
    return this.authService.register(data);
  }
}
