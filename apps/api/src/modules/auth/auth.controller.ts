import { Controller, Post, Body, UseGuards, Version } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { UserProfile } from '@ai-platform/shared-types';

class RegisterDto {
  email!: string;
  password!: string;
  name!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Version('1')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  @Version('1')
  @UseGuards(AuthGuard('local'))
  async login(@CurrentUser() user: UserProfile) {
    return this.authService.login(user);
  }
}
