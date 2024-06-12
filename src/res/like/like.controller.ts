import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/checkAuth.guard';

@ApiTags("Like")
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':userId/:articleId')
  @UseGuards(AuthGuard)
  async add(@Param('userId') uid: number, @Param('articleId') aid: number) {
    return this.likeService.add(uid, aid);
  }

  @Delete(':userId/:articleId')
  @UseGuards(AuthGuard)
  async remove(@Param('userId') uid: number, @Param('articleId') aid: number) {
    return this.likeService.remove(uid, aid);
  }
}
