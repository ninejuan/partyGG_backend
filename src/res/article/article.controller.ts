import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, Injectable, Res, Req } from '@nestjs/common';
import { ArticleService } from './article.service';
import { GoogleAuthGuard } from '../auth/guards/google.guard';
import { CallbackUserData } from '../auth/decorator/auth.decorator';
import { AuthGuard } from '../auth/guards/checkAuth.guard';
import Article from '../../interface/article.interface';
import { ExecutionContext } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import checkXSS from 'src/utils/checkXSS.util';
import { Response, Request } from 'express';
import { MatchGuard } from '../auth/guards/authMatch.guard';

@ApiTags("Article CRUD")
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() newArticleData: Article) {
    return this.articleService.create(newArticleData);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateData: Article) {
    updateData.title = (await checkXSS(updateData.title)).toString() ?? null;
    updateData.content = (await checkXSS(updateData.content)).toString();
    updateData.category = (await checkXSS(updateData.category)).toString();
    return this.articleService.update(+id, updateData);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.articleService.remove(+id);
  }

  @Post('end/:articleId')
  @UseGuards(MatchGuard)
  async end(
    @Param('articleId') aid: number
  ) {
    return await this.articleService.end(aid);
    // console.log(req);
  }

  @Post('resume/:articleId')
  @UseGuards(MatchGuard)
  async resume(
    @Param('articleId') aid: number
  ) {
    return await this.articleService.resume(aid);
  }

  // 게시판 기본 로드 게시물 수는 20개로 제한.
  // 공지는 모든 페이지에서 보이게 (관리자 대시보드 필요)
  /**
   * 
   * 게시물 리스트는 기본적으로 로그인 없이도 볼 수 있지만,
   * 게시물 내용은 로그인해야 확인할 수 있게 만들기.
   * (공지 제외)
   * 만들어야 하는 controller
   * - View List(reqprm: page, category)
   * - View Article(reqprm: articleid, reqvalidate: auth)
   * - 
   */
  
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.articleService.getById(+id);
  }

  @Get('lists/recent/:category/:page/:count')
  async getIdsByCount(@Param('category') ct: string, @Param('page') page: number, @Param('count') count?: number) {
    return await this.articleService.getIdsByCount(ct, page, count??20);
  }

  // 메인 페이지에서 로드할 글
  @Get('lists/recent/:category/:number')
  async getRecent(@Param('category') ct: string, @Param('number') num: number) {
    return await this.articleService.getTopArticles(ct, num);
  }
}
