import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../authentication/dto/request/create-user.dto';
import { I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UpdateUserPasswordDto } from './dto/request/update-user-password.dto';
import { UserDto } from '../common/dto/user.dto';
import { UserTypeEnum } from './entities/user-type.enum';

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
  async create(createUserDto: CreateUserDto, accountType: UserTypeEnum = UserTypeEnum.CLASSIC): Promise<User> {
    this.logger.debug(`Tentative de création de l'utilisateur avec l'email: ${createUserDto.email}`);
    const existingUser: User = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      this.logger.warn(`Utilisateur existant avec l'email: ${createUserDto.email}`);
      throw new ConflictException(this.i18n.translate('user.errors.alreadyExists'));
    }

    const hashedPassword: string = await this.hashPassword(createUserDto.password);
    const user: User = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      accountType: accountType,
      settings: {},
    });
    const savedUser: User = await this.usersRepository.save(user);
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
  async findOneByEmail(email: string): Promise<User | null> {
    if (!email) {
      this.logger.error("Email requis pour la recherche de l'utilisateur.");
      throw new BadRequestException("L'email est requis pour la recherche de l'utilisateur.");
    }
    this.logger.debug(`Recherche de l'utilisateur avec l'email ${email}`);
    const user: User = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      this.logger.warn(`Aucun utilisateur trouvé avec l'email ${email}`);
      return null;
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
    const user: User = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`Aucun utilisateur trouvé avec l'ID ${id}`);
      throw new NotFoundException('Aucun utilisateur trouvé avec cet ID.');
    }
    this.logger.debug(`Utilisateur trouvé avec l'ID ${id}`);
    return user;
  }

  /**
   * Recherche un utilisateur par ID avec ses paramètres.
   *
   * @param id - L'ID de l'utilisateur.
   * @returns L'utilisateur correspondant.
   */
  async findOneByIdWithSettings(id: string): Promise<User> {
    const user: User = await this.usersRepository.findOne({
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

  /**
   * Met à jour les informations d'un utilisateur.
   *
   * @param id - L'ID de l'utilisateur à mettre à jour.
   * @param newUserInfo - Les nouvelles informations de l'utilisateur.
   * @returns L'utilisateur mis à jour.
   * @throws NotFoundException si l'utilisateur n'est pas trouvé.
   */
  async update(id: string, newUserInfo: UpdateUserDto): Promise<User> {
    // if any parameter is the same as before then throw error
    const user: UserDto = new UserDto(await this.findOneById(id));
    if (!user) {
      this.throwUserNotFoundException(id);
    }

    if (user.email === newUserInfo.email) {
      throw new ConflictException("L'email est identique à l'ancien");
    }

    // Vérifier si l'email n'est pas déjà utilisé.
    if (user.email !== newUserInfo.email) {
      const existingUser: User = await this.findOneByEmail(newUserInfo.email);
      if (existingUser) {
        this.logger.warn(`Utilisateur existant avec l'email: ${newUserInfo.email}`);
        throw new ConflictException(this.i18n.translate('user.errors.alreadyExists'));
      }
      this.logger.debug(`Email de l'utilisateur mis à jour avec l'ID: ${user.id}`);
    }

    if (newUserInfo.username === user.username) {
      throw new ConflictException("Le nom d'utilisateur est identique à l'ancien");
    }

    Object.assign(user, newUserInfo);
    const updatedUser: User = await this.usersRepository.save(user);
    this.logger.log(`Utilisateur mis à jour avec l'ID: ${updatedUser.id}`);
    return updatedUser;
  }

  /**
   * Met à jour le mot de passe de l'utilisateur.
   * N'autorise pas la modification si le nouveau mot de passe est identique à l'ancien.
   * @param id
   * @param updateUserPasswordDto
   */
  async updatePassword(id: string, updateUserPasswordDto: UpdateUserPasswordDto): Promise<User> {
    if (updateUserPasswordDto.password !== updateUserPasswordDto.confirmPassword) {
      this.logger.warn('Les mots de passe ne correspondent pas.');
      throw new BadRequestException('Les mots de passe ne correspondent pas.');
    }

    // On ne veut pas que le nouveau mot de passe soit identique à l'ancien.
    if (updateUserPasswordDto.currentPassword === updateUserPasswordDto.password) {
      this.logger.warn("Le nouveau mot de passe ne doit pas être identique à l'ancien");
      throw new ConflictException("Le nouveau mot de passe ne dot pas être identique à l'ancien");
    }

    this.logger.debug(`Mise à jour du mot de passe de l'utilisateur avec l'ID: ${id}`);

    const user: User = await this.findOneById(id);

    if (!user) {
      this.throwUserNotFoundException(user.id);
    }

    user.password = await this.hashPassword(updateUserPasswordDto.password);
    const updatedUser: User = await this.usersRepository.save(user);
    this.logger.log(`Mot de passe de l'utilisateur mis à jour avec l'ID: ${updatedUser.id}`);
    return updatedUser;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private throwUserNotFoundException(id: string): void {
    this.logger.warn(`Aucun utilisateur trouvé avec l'ID: ${id}`);
    throw new NotFoundException('Aucun utilisateur trouvé avec cet ID.');
  }
}
