import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

import { ResponseStudentProfileDto } from './response-student-profile.dto';
import { ResponseTutorProfileDto } from './response-tutor-profile.dto';

@Exclude()
export class ResponseUserDto {
  @ApiProperty({
    description: 'Дата создания пользователя',
    example: '2024-05-04T12:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
  })
  @Expose()
  lastName: string;

  @Exclude()
  password: string;

  @ApiPropertyOptional({
    description: 'Отчество пользователя',
    example: 'Иванович',
    required: false,
  })
  @Expose()
  patronymic?: string;

  @Exclude()
  refreshToken: string;

  @ApiProperty({
    description: 'Роль пользователя',
    enum: Role,
    example: Role.TUTOR,
  })
  @Expose()
  role: Role;

  @ApiPropertyOptional({
    description: 'Профиль студента',
    required: false,
    type: () => ResponseStudentProfileDto,
  })
  @Expose()
  @Type(() => ResponseStudentProfileDto)
  student?: ResponseStudentProfileDto;

  @ApiPropertyOptional({
    description: 'Профиль репетитора',
    required: false,
    type: () => ResponseTutorProfileDto,
  })
  @Expose()
  @Type(() => ResponseTutorProfileDto)
  tutor?: ResponseTutorProfileDto;

  @ApiProperty({
    description: 'Дата последнего обновления пользователя',
    example: '2024-05-04T12:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
