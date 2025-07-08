import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { and, eq, isNull } from 'drizzle-orm';

import { db } from 'src/db';
import { users } from 'src/db/schema/user';
import { User } from 'src/db/schema/user';

import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return db.query.users.findFirst({
      where: and(eq(users.email, email), isNull(users.deletedAt)),
    });
  }

  async findOneById(userId: string): Promise<User> {
    const user = await db.query.users.findFirst({
      where: and(eq(users.id, userId), isNull(users.deletedAt)),
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(user: CreateUserDto): Promise<User> {
    const [createdUser] = await db
      .insert(users)
      .values({
        email: user.email,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
      })
      .returning();

    this.eventEmitter.emit('user.created', createdUser);

    return createdUser;
  }
}
