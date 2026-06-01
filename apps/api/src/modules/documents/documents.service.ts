import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { createLogger } from '@ai-platform/logger';

const logger = createLogger('api:documents-service');

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDocument(
    userId: string,
    name: string,
    mimeType: string,
    size: number,
    filePath: string,
    collection = 'default',
  ) {
    const doc = await this.prisma.document.create({
      data: { userId, name, mimeType, size, filePath, collection },
    });
    logger.info({ documentId: doc.id, userId }, 'document record created');
    return doc;
  }

  async listDocuments(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
