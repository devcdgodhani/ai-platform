import { Controller, Get, Post, UseGuards, Version } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DocumentsService } from './documents.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { UserProfile } from '@ai-platform/shared-types';

@Controller('documents')
@UseGuards(AuthGuard('jwt'))
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @Version('1')
  list(@CurrentUser() user: UserProfile) {
    return this.documentsService.listDocuments(user.id);
  }
}
