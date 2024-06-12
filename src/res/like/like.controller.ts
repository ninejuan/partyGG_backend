import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from '../auth/guards/checkAuth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiParam } from '@nestjs/swagger';

@ApiTags("Like")
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiOperation({
    summary: "좋아요 추가",
    description: "게시글에 좋아요를 추가합니다."
  })
  @ApiResponse({
    status: 200,
    description: "좋아요 추가 성공",
    schema: {
      properties: {
        result: {
          type: 'Boolean',
          description: "성공 여부",
          example: true
        }
      }
    }
  })
  @ApiParam({
    name: "userId",
    example: 53837250,
    required: true
  })
  @ApiParam({
    name: "articleId",
    example: 1234,
    required: true
  })
  @Post(':userId/:articleId')
  @UseGuards(AuthGuard)
  async add(@Param('userId') uid: number, @Param('articleId') aid: number) {
    return {
      result: await this.likeService.add(uid, aid)
    };
  }

  @ApiOperation({
    summary: "좋아요 삭제",
    description: "게시글에 좋아요를 삭제합니다."
  })
  @ApiResponse({
    status: 200,
    description: "좋아요 삭제 성공",
    schema: {
      properties: {
        result: {
          type: 'Boolean',
          description: "성공 여부",
          example: true
        }
      }
    }
  })
  @ApiParam({
    name: "userId",
    example: 53837250,
    required: true
  })
  @ApiParam({
    name: "articleId",
    example: 1234,
    required: true
  })
  @Delete(':userId/:articleId')
  @UseGuards(AuthGuard)
  async remove(@Param('userId') uid: number, @Param('articleId') aid: number) {
    return {
      result: await this.likeService.remove(uid, aid)
    }
  }
}
