import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ApiDescriptions } from '../common/constants/messages';
import { TransformDataInterceptor } from '../common/interceptors/transform-data.interceptor';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { SignInDto } from './dto/signin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description: ApiDescriptions.REGISTER,
    summary: 'Sign up',
  })
  @ApiResponse({
    description: 'User successfully registered',
    status: 201,
    type: ResponseUserDto,
  })
  @ApiResponse({
    description: 'User with this email already exists',
    status: 409,
  })
  @ApiResponse({
    description: 'Invalid registration data',
    status: 400,
  })
  @Post('sign-up')
  @Public()
  @UseInterceptors(new TransformDataInterceptor(ResponseUserDto))
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    description: ApiDescriptions.SIGN_IN,
    summary: 'Sign in',
  })
  @ApiResponse({
    description: 'Successfully authenticated',
    status: 200,
    type: ResponseUserDto,
  })
  @ApiResponse({
    description: 'Invalid email or password',
    status: 401,
  })
  @Post('sign-in')
  @Public()
  @UseInterceptors(new TransformDataInterceptor(ResponseUserDto))
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(signInDto, response);
  }

  @ApiOperation({
    description: ApiDescriptions.SIGN_OUT,
    summary: 'Sign out',
  })
  @Get('sign-out')
  signOut(
    @Query('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(id, response);
  }
}
