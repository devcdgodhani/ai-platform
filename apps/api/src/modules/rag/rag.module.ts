import { Module } from '@nestjs/common';
import { RAGService } from './rag.service';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [AIModule],
  providers: [RAGService],
  exports: [RAGService],
})
export class RAGModule {}
