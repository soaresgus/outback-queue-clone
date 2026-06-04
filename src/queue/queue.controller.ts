import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { QueueService } from './queue.service';
import { WaitlistEntry } from './entities/waitlist-entry.entity';
import { AddToWaitlistDto } from './dto/add-to-waitlist.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

@Controller('queue')
export class QueueController {
  constructor(private readonly service: QueueService) {}

  @Post()
  async addToWaitlist(@Body() body: AddToWaitlistDto): Promise<WaitlistEntry> {
    return this.service.addToWaitlist(
      body.name,
      body.phoneNumber,
      body.partySize,
    );
  }

  @Get()
  async getWaitlist(): Promise<WaitlistEntry[]> {
    return this.service.getWaitlist();
  }

  @Get(':phoneNumber')
  async getWaitlistPosition(
    @Param('phoneNumber') phoneNumber: string,
  ): Promise<{ position: number }> {
    const position = await this.service.getWaitlistPosition(phoneNumber);
    return { position };
  }

  @Patch(':phoneNumber/status')
  async changeStatus(
    @Param('phoneNumber') phoneNumber: string,
    @Body() body: ChangeStatusDto,
  ): Promise<{ message: string }> {
    await this.service.changeStatus(phoneNumber, body.status);
    return { message: 'Status changed successfully' };
  }
}
