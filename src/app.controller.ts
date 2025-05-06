import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @ApiOperation({
    description: 'Returns server status and basic information',
    summary: 'Check server health',
  })
  @ApiResponse({
    content: {
      'application/json': {
        example: {
          status: 'ok',
          timestamp: '2024-05-04T12:00:00.000Z',
          uptime: 12345,
          version: '1.0.0',
        },
      },
    },
    description: 'Server is running',
    status: 200,
  })
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}
