import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GitHubAuthGuard } from './guards/github-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user with email and password' })
  @ApiBody({ type: LoginDto })
  login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refreshTokens(data.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  // OAuth: Google
  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  googleAuth() {
    // Guard redirects to Google
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const authResult = await this.authService.login(req.user);
    const redirectUrl = new URL(process.env.FRONTEND_URL || 'http://localhost:4200');
    redirectUrl.pathname = '/auth/callback';
    redirectUrl.searchParams.set('accessToken', authResult.accessToken);
    redirectUrl.searchParams.set('refreshToken', authResult.refreshToken);
    res.redirect(redirectUrl.toString());
  }

  // OAuth: GitHub
  @Public()
  @UseGuards(GitHubAuthGuard)
  @Get('github')
  @ApiOperation({ summary: 'Initiate GitHub OAuth login' })
  githubAuth() {
    // Guard redirects to GitHub
  }

  @Public()
  @UseGuards(GitHubAuthGuard)
  @Get('github/callback')
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubAuthCallback(@Req() req: any, @Res() res: Response) {
    const authResult = await this.authService.login(req.user);
    const redirectUrl = new URL(process.env.FRONTEND_URL || 'http://localhost:4200');
    redirectUrl.pathname = '/auth/callback';
    redirectUrl.searchParams.set('accessToken', authResult.accessToken);
    redirectUrl.searchParams.set('refreshToken', authResult.refreshToken);
    res.redirect(redirectUrl.toString());
  }
}
