import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { User } from '../src/auth/entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  const user = userRepository.create({
    name: 'Admin',
    email: 'admin@outback.com',
    password: await bcrypt.hash('Admin@2026', 10),
    role: 'admin',
  });

  await userRepository.save(user);
  await app.close();
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
