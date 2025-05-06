import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseTutorProfileDto {
  @ApiPropertyOptional({
    description: 'Описание репетитора',
    example: 'Опытный репетитор по математике',
    required: false,
  })
  @Expose()
  description?: string;

  @ApiPropertyOptional({
    description: 'Опыт работы в годах',
    example: 5,
    required: false,
  })
  @Expose()
  experience?: number;

  @ApiPropertyOptional({
    description: 'Почасовая ставка',
    example: 1000,
    required: false,
  })
  @Expose()
  hourlyRate?: number;

  @ApiProperty({
    description: 'Уникальный идентификатор профиля репетитора',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiPropertyOptional({
    description: 'Рейтинг репетитора',
    example: 4.8,
    required: false,
  })
  @Expose()
  rating?: number;

  @ApiProperty({
    description: 'Предметы, которые преподает репетитор',
    example: ['Математика', 'Физика'],
  })
  @Expose()
  subjects: string[];
}
