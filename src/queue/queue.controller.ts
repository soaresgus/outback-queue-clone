import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { WaitlistEntry } from './entities/waitlist-entry.entity';
import { AddToWaitlistDto } from './dto/add-to-waitlist.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('queue')
export class QueueController {
  constructor(private readonly service: QueueService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('staff', 'admin')
  async addToWaitlist(@Body() body: AddToWaitlistDto): Promise<WaitlistEntry> {
    return this.service.addToWaitlist(
      body.name,
      body.phoneNumber,
      body.partySize,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('staff', 'admin')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('staff', 'admin')
  async changeStatus(
    @Param('phoneNumber') phoneNumber: string,
    @Body() body: ChangeStatusDto,
  ): Promise<{ message: string }> {
    await this.service.changeStatus(phoneNumber, body.status);
    return { message: 'Status changed successfully' };
  }
}
