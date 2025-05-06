import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseStudentProfileDto {
  @ApiPropertyOptional({
    description: 'Класс студента',
    example: 10,
    required: false,
  })
  @Expose()
  grade?: number;

  @ApiProperty({
    description: 'Уникальный идентификатор профиля студента',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;
}
