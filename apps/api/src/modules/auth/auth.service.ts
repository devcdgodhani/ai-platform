import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { RedisService } from '../../infrastructure/cache/redis.service';
import { REDIS_KEYS, REDIS_TTL } from '@ai-platform/shared-config';
import type { AuthTokens, JWTPayload, UserProfile } from '@ai-platform/shared-types';
import { getApiEnv } from '@ai-platform/shared-config';
import { createLogger } from '@ai-platform/logger';

const logger = createLogger('api:auth');

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserProfile | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role as never, createdAt: user.createdAt };
  }

  async login(user: UserProfile): Promise<AuthTokens & { user: UserProfile }> {
    const payload: JWTPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const tokenFamily = uuid();
    const refreshToken = this.jwtService.sign(
      { sub: user.id, tokenFamily },
      { secret: getApiEnv().REFRESH_TOKEN_SECRET, expiresIn: getApiEnv().REFRESH_TOKEN_EXPIRY },
    );

    // Store refresh token in Redis
    await this.redis.setJson(
      REDIS_KEYS.refreshToken(user.id, tokenFamily),
      { refreshToken, used: false },
      REDIS_TTL.USER_SESSION,
    );

    logger.info({ userId: user.id }, 'User logged in');
    return { accessToken, refreshToken, expiresIn: 900, user };
  }

  async register(email: string, password: string, name: string): Promise<AuthTokens & { user: UserProfile }> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: { email, name, passwordHash },
    });

    logger.info({ userId: user.id }, 'User registered');
    const userProfile = { id: user.id, email: user.email, name: user.name, role: user.role as never, createdAt: user.createdAt };
    return this.login(userProfile);
  }

  async logout(userId: string, tokenFamily: string): Promise<void> {
    await this.redis.del(REDIS_KEYS.refreshToken(userId, tokenFamily));
    logger.info({ userId }, 'User logged out');
  }
}
