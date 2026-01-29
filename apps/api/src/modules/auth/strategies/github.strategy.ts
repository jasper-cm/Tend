import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from '../auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || 'temporary-id-to-prevent-crash',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'temporary-secret-to-prevent-crash',
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, emails, displayName, username, photos } = profile;

    const user = await this.authService.findOrCreateOAuthUser({
      provider: 'github',
      providerId: id,
      email: emails?.[0]?.value,
      displayName: displayName || username,
      avatarUrl: photos?.[0]?.value,
    });

    return user;
  }
}
