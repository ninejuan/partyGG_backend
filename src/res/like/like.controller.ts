import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import Like from 'src/interface/like.interface';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/checkAuth.guard';

@ApiTags("Like")
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @UseGuards(AuthGuard)
  async add(@Body() newLike: Like) {
    return this.likeService.add(newLike);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async remove(@Body() newLike: Like) {
    return this.likeService.remove(newLike);
  }
}
