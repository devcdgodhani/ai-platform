import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JWTPayload, UserProfile } from '@ai-platform/shared-types';
import { getApiEnv } from '@ai-platform/shared-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getApiEnv().JWT_SECRET,
    });
  }

  validate(payload: JWTPayload): Partial<UserProfile> {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
