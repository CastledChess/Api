import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSettings } from './entities/user-settings.entity';
import { UsersService } from './users.service';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsController } from './user-settings.controller';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSettings])],
  providers: [UsersService, UserSettingsService],
  controllers: [UserSettingsController, UsersController],
  exports: [UsersService],
})
export class UsersModule {}
