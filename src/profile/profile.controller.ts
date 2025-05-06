import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  @ApiOperation({
    description: 'Получение профиля текущего пользователя',
    summary: 'Получение профиля',
  })
  @ApiResponse({
    description: 'Профиль пользователя успешно получен',
    status: 200,
  })
  @Get()
  getProfile() {
    return 'user';
  }
}
