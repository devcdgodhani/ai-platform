import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { StreamingGateway } from './streaming.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [AIService, StreamingGateway],
  exports: [AIService],
})
export class AIModule {}
