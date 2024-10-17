import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthenticationService {
  constructor(private usersService: UsersService) {}

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.usersService.findOne(loginDto.email);
    if (user && user.password === loginDto.password) {
      return user;
    }
    return null;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
