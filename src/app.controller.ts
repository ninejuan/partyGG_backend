import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiParam, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
		summary: "Hello World!",
		description: "세상에게 인사합니다."
	})
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
