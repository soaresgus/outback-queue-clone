import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WaitlistEntry } from './entities/waitlist-entry.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(WaitlistEntry)
    private readonly repository: Repository<WaitlistEntry>,
  ) {}

  private async checkIfEntryExists(phoneNumber: string): Promise<boolean> {
    const entry = await this.repository.findOne({
      where: {
        phoneNumber,
      },
    });

    if (entry) {
      return true;
    }

    return false;
  }

  async addToWaitlist(
    name: string,
    phoneNumber: string,
    partySize: number,
  ): Promise<WaitlistEntry> {
    const entry = this.repository.create({
      name,
      phoneNumber,
      partySize,
    });

    if (await this.checkIfEntryExists(phoneNumber)) {
      throw new BadRequestException(
        `Entry with phone number ${phoneNumber} already exists`,
      );
    }

    return this.repository.save(entry);
  }

  async getWaitlist(): Promise<WaitlistEntry[]> {
    return this.repository.find({
      where: {
        status: 'waiting',
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async getWaitlistPosition(phoneNumber: string): Promise<number> {
    const entries = await this.getWaitlist();

    if (!(await this.checkIfEntryExists(phoneNumber))) {
      throw new BadRequestException(
        `Entry with phone number ${phoneNumber} not found`,
      );
    }

    const position = entries.findIndex(
      (entry) => entry.phoneNumber === phoneNumber,
    );

    return position + 1;
  }

  private async removeFromWaitlist(phoneNumber: string): Promise<void> {
    const result = await this.repository.delete({ phoneNumber });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Entry with phone number ${phoneNumber} not found`,
      );
    }
  }

  async changeStatus(
    phoneNumber: string,
    status: 'seated' | 'no_show',
  ): Promise<void> {
    const entry = await this.repository.findOne({
      where: {
        phoneNumber,
      },
    });

    if (!entry) {
      throw new NotFoundException(
        `Entry with phone number ${phoneNumber} not found`,
      );
    }

    entry.status = status;
    await this.removeFromWaitlist(phoneNumber);
  }
}
