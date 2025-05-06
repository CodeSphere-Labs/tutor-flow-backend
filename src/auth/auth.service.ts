import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { ErrorMessages } from '../common/constants/messages';
import { PrismaService } from '../database/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signin.dto';
import { TokenPayload } from './interfaces/token-payload.interface';
import { Tokens } from './interfaces/tokens.interface';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn = '15m';
  private readonly refreshTokenExpiresIn = '30d';
  private readonly saltRounds = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async logout(userId: string, response: Response) {
    await this.prisma.user.update({
      data: { refreshToken: null },
      where: { id: userId },
    });

    response.clearCookie('refreshToken');
    response.clearCookie('accessToken');
  }

  async refreshTokens(refreshToken: string) {
    const payload = await this.validateRefreshToken(refreshToken);
    const user = await this.validateUserRefreshToken(payload.sub, refreshToken);

    return this.generateAndStoreTokens(user.id, user.email, user.role);
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await this.hashPassword(registerDto.password);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        password: hashedPassword,
        patronymic: registerDto.patronymic,
        role: registerDto.role,
      },
    });

    if (registerDto.role === 'TUTOR') {
      const tutor = await this.prisma.tutor.create({
        data: {
          userId: user.id,
        },
      });

      await this.subscriptionService.createTrialSubscription(tutor.id);
    } else {
      await this.prisma.student.create({
        data: {
          userId: user.id,
        },
      });
    }

    return user;
  }

  public setTokensInCookies(response: Response, tokens: Tokens) {
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: this.configService.get<boolean>('cookie.secure'),
    };

    response.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    response.cookie('accessToken', tokens.accessToken, cookieOptions);
  }

  async signIn(signInDto: SignInDto, response: Response) {
    const user = await this.validateUser(signInDto.email, signInDto.password);
    const tokens = await this.generateAndStoreTokens(
      user.id,
      user.email,
      user.role,
    );

    this.setTokensInCookies(response, tokens);

    return user;
  }

  async validateToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.access'),
      });
    } catch {
      throw new UnauthorizedException(ErrorMessages.INVALID_TOKEN);
    }
  }

  private async generateAndStoreTokens(
    userId: string,
    email: string,
    role: string,
  ) {
    const tokens = await this.generateTokens(userId, email, role);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { email, role, sub: userId },
        {
          expiresIn: this.accessTokenExpiresIn,
          secret: this.configService.get<string>('jwt.access'),
        },
      ),
      this.jwtService.signAsync(
        { email, sub: userId },
        {
          expiresIn: this.refreshTokenExpiresIn,
          secret: this.configService.get<string>('jwt.refresh'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, this.saltRounds);
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashPassword(refreshToken);
    await this.prisma.user.update({
      data: { refreshToken: hashedRefreshToken },
      where: { id: userId },
    });
  }

  private async validateRefreshToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.refresh'),
      });
    } catch {
      throw new ForbiddenException(ErrorMessages.INVALID_REFRESH_TOKEN);
    }
  }

  private async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      include: {
        student: true,
        tutor: true,
      },
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(ErrorMessages.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessages.INVALID_CREDENTIALS);
    }

    return user;
  }

  private async validateUserRefreshToken(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException(ErrorMessages.ACCESS_DENIED);
    }

    const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isTokenValid) {
      throw new ForbiddenException(ErrorMessages.ACCESS_DENIED);
    }

    return user;
  }
}
