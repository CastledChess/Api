import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../authentication/dto/request/create-user.dto';
import { I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Crée un nouvel utilisateur.
   *
   * @param createUserDto - Les informations du nouvel utilisateur.
   * @returns L'utilisateur créé.
   * @throws ConflictException si l'utilisateur existe déjà.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug(`Tentative de création de l'utilisateur avec l'email: ${createUserDto.email}`);
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      this.logger.warn(`Utilisateur existant avec l'email: ${createUserDto.email}`);
      throw new ConflictException(this.i18n.translate('user.errors.alreadyExists'));
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      settings: {},
    });
    const savedUser = await this.usersRepository.save(user);
    this.logger.log(`Utilisateur créé avec l'ID: ${savedUser.id}`);
    return savedUser;
  }

  /**
   * Recherche un utilisateur par email.
   *
   * @param email - L'email de l'utilisateur.
   * @returns L'utilisateur correspondant.
   * @throws BadRequestException si l'email n'est pas fourni.
   */
  async findOneByEmail(email: string): Promise<User> {
    if (!email) {
      this.logger.error("Email requis pour la recherche de l'utilisateur.");
      throw new BadRequestException("L'email est requis pour la recherche de l'utilisateur.");
    }
    this.logger.debug(`Recherche de l'utilisateur avec l'email ${email}`);
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`Aucun utilisateur trouvé avec l'email ${email}`);
      throw new NotFoundException('Aucun utilisateur trouvé avec cet email.');
    }
    this.logger.debug(`Utilisateur trouvé avec l'email ${email}`);

    return user;
  }

  /**
   * Recherche un utilisateur par ID.
   *
   * @param id - L'ID de l'utilisateur.
   * @returns L'utilisateur correspondant.
   */
  async findOneById(id: string): Promise<User> {
    this.logger.debug(`Recherche de l'utilisateur avec l'ID ${id}`);
    const user = this.usersRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`Aucun utilisateur trouvé avec l'ID ${id}`);
      throw new NotFoundException('Aucun utilisateur trouvé avec cet ID.');
    }
    this.logger.debug(`Utilisateur trouvé avec l'ID ${id}`);
    return user;
  }

  async findOneByIdWithSettings(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        settings: true,
      },
    });

    if (!user) {
      this.logger.warn(`Aucun utilisateur trouvé avec l'ID ${id}`);
      throw new NotFoundException('Aucun utilisateur non trouvé');
    }

    return user;
  }
}
