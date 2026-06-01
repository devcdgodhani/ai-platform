import { Module } from '@nestjs/common';

/** Jobs module — BullMQ queues are already provided globally by BullMQModule */
@Module({})
export class JobsModule {}
