import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, Injectable, Res, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiParam } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { GoogleAuthGuard } from '../auth/guards/google.guard';
import { CallbackUserData } from '../auth/decorator/auth.decorator';
import { AuthGuard } from '../auth/guards/checkAuth.guard';
import { ArticleDto } from './dto/article.dto';
import { NoticeDto } from './dto/notice.dto';
import { ExecutionContext } from '@nestjs/common';
import checkXSS from 'src/utils/checkXSS.util';
import { Response, Request } from 'express';
import { MatchGuard } from '../auth/guards/authMatch.guard';

@ApiTags("Article CRUD")
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({
    summary: "새로운 구인구직 게시글 작성",
    description: "새로운 구인 구칙 게시글을 등록합니다."
  })
  @ApiResponse({
    status: 200,
    description: "게시글 작성 성공",
    schema: {
      properties: {
        articleId: {
          type: 'number',
          description: "등록된 게시글 ID",
          example: 1234
        }
      }
    }
  })
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() newArticleData: ArticleDto) {
    const res = await this.articleService.create(newArticleData);
    return {
      articleId: res
    }
  }

  @ApiOperation({
    summary: "구인구직 게시글 수정",
    description: "이미 등록된 구인 구직 게시글을 수정합니다."
  })
  @ApiResponse({
    status: 200,
    description: "게시글 수정 성공",
    schema: {
      properties: {
        articleId: {
          type: 'number',
          description: "수정된 게시글 ID",
          example: 1234
        }
      }
    }
  })
  @ApiParam({
    name: "articleId",
    example: 1234,
    required: true
  })
  @UseGuards(AuthGuard)
  @Put(':articleId')
  async update(@Param('articleId') id: number, @Body() updateData: ArticleDto) {
    updateData.title = (await checkXSS(updateData.title)).toString();
    updateData.content = (await checkXSS(updateData.content)).toString();
    const res = await this.articleService.update(+id, updateData);
    return {
      articleId: res
    }
  }

  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "구인구직 게시글 삭제",
    description: "등록된 구인 구직 게시글을 삭제합니다."
  })
  @ApiResponse({
    status: 200,
    description: "게시글 삭제 성공",
    schema: {
      properties: {
        isDeleted: {
          type: 'Boolean',
          description: "게시글 삭제 여부",
          example: true
        }
      }
    }
  })
  @ApiParam({
    name: "articleId",
    example: 1234,
    required: true
  })
  @Delete(':articleId')
  async remove(@Param('articleId') id: number) {
    const res = await this.articleService.remove(+id);
    return {
      isDeleted: res
    }
  }

  @ApiOperation({
    summary: "구인 / 구직 마감",
    description: "진행중인 구인 / 구직을 마감 상태로 변경합니다."
  })
  @ApiResponse({
    status: 200,
    description: "구인구직 마감 성공",
    schema: {
      properties: {
        isEnded: {
          type: 'Boolean',
          description: "구인 구직 마감 여부",
          example: true
        }
      }
    }
  })
  @ApiParam({
    name: "articleId",
    example: 1234,
    required: true
  })
  @Post('end/:articleId')
  @UseGuards(MatchGuard)
  async end(
    @Param('articleId') aid: number
  ) {
    const res = await this.articleService.end(aid);
    return {
      isEnded: res
    }
  }

  @ApiOperation({
    summary: "구인 / 구직 재개",
    description: "마감된 구인 / 구직을 재개합니다."
  })
  @ApiResponse({
    status: 200,
    description: "구인구직 재개 성공",
    schema: {
      properties: {
        isResumed: {
          type: 'Boolean',
          description: "구인 구직 재개 여부",
          example: true
        }
      }
    }
  })
  @ApiParam({
    name: "articleId",
    example: 1234,
    required: true
  })
  @Post('resume/:articleId')
  @UseGuards(MatchGuard)
  async resume(
    @Param('articleId') aid: number
  ) {
    const res = await this.articleService.resume(aid);
    return {
      isResumed: res
    }
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
   */
  
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "게시글 데이터 받아오기",
    description: "게시글 Id로 게시글의 정보를 받아옵니다."
  })
  @ApiResponse({
    status: 200,
    description: "게시글 Data",
    schema: {
      properties: {
        article: {
          type: 'Object',
          description: "게시글 데이터 Object입니다.",
          example: {
            "writerId": 53837250,
            "articleId": 2,
            "title": "선린톤 우승은 누구의 것인가",
            "content": "볼 것도 없이 기생충연구부의 것입니다.",
            "likes": [],
            "views": [],
            "aType": "human",
            "category": "club",
            "createdAt": 1718037846863,
            "isEnded": false
          }
        }
      }
    }
  })
  @ApiParam({
    name: "articleId",
    example: 1234,
    required: true
  })
  @Get(':articleId')
  async findOne(
    @Param('articleId') aid: number,
    @Req() req
  ) {
    await this.articleService.applyView(aid, req.uid);
    const res = await this.articleService.getById(+aid);
    return {
      article: res
    };
  }

  @ApiOperation({
    summary: "각 페이지의 글을 가져옵니다.",
    description: ":page번째 페이지의 글 :count개를 가져옵니다."
  })
  @ApiResponse({
    status: 200,
    description: "정상적으로 반환됨",
    schema: {
      properties: {
        articles: {
          type: 'Array',
          description: "글 배열",
          example: [
            {
              "_id": "66672d7570d73abb0617608b",
              "writerId": 53837250,
              "articleId": 3,
              "title": "이주안은 1학년 때 연애를 할 수 있을 것인가",
              "content": "허황된 꿈",
              "likes": [],
              "views": [],
              "aType": "human",
              "category": "club",
              "createdAt": 1718037877945,
              "isEnded": false,
              "__v": 0
            },
            {
              "_id": "66672d5670d73abb06176088",
              "writerId": 53837250,
              "articleId": 2,
              "title": "선린톤 우승은 누구의 것인가",
              "content": "볼 것도 없이 기생충연구부의 것입니다.",
              "likes": [],
              "views": [],
              "aType": "human",
              "category": "club",
              "createdAt": 1718037846863,
              "isEnded": false,
              "__v": 0
            }
          ]
        }
      }
    }
  })
  @ApiParam({
    name: "articleType",
    example: 'team',
    required: true
  })
  @ApiParam({
    name: "page",
    example: 1,
    required: true
  })
  @ApiParam({
    name: "count",
    example: 20,
    required: true
  })
  @Get('lists/recent/:articleType/:page/:count')
  async getArticlesByCount(@Param('articleType') at: string, @Param('page') page: number, @Param('count') count?: number) {
    const res = await this.articleService.getArticlesByCount(at, page, count??20);
    return {
      articles: res
    }
  }

  @ApiOperation({
    summary: "구인구직 게시물을 가져옵니다.",
    description: "구인(human) / 구직(team) 중 선택된 분야의 게시글 :count개를 가져옵니다."
  })
  @ApiResponse({
    status: 200,
    description: "정상적으로 반환됨",
    schema: {
      properties: {
        articles: {
          type: 'Array',
          description: "글 배열",
          example: [
            {
              "_id": "66672d7570d73abb0617608b",
              "writerId": 53837250,
              "articleId": 3,
              "title": "이주안은 1학년 때 연애를 할 수 있을 것인가",
              "content": "허황된 꿈",
              "likes": [],
              "views": [],
              "aType": "human",
              "category": "club",
              "createdAt": 1718037877945,
              "isEnded": false,
              "__v": 0
            },
            {
              "_id": "66672d5670d73abb06176088",
              "writerId": 53837250,
              "articleId": 2,
              "title": "선린톤 우승은 누구의 것인가",
              "content": "볼 것도 없이 기생충연구부의 것입니다.",
              "likes": [],
              "views": [],
              "aType": "human",
              "category": "club",
              "createdAt": 1718037846863,
              "isEnded": false,
              "__v": 0
            }
          ]
        }
      }
    }
  })
  @ApiParam({
    name: "articleType",
    example: 'team',
    required: true
  })
  @ApiParam({
    name: "count",
    example: 20,
    required: true
  })
  // 메인 페이지에서 로드할 글
  @Get('lists/recent/:articleType/:count')
  async getRecent(@Param('articleType') at: string, @Param('count') cnt: number) {
    return await this.articleService.getTopArticles(at, cnt);
  }

  @ApiOperation({
    summary: "공지글을 가져옵니다.",
    description: "공지글 :count개를 가져옵니다."
  })
  @ApiResponse({
    status: 200,
    description: "정상적으로 반환됨",
    schema: {
      properties: {
        articles: {
          type: 'Array',
          description: "공지글 배열",
          example: [
            {
              "_id": "6669ba80d186bc44a2de080a",
              "writerId": 34726863,
              "articleId": "N3",
              "title": "[업데이트] 20240613 패치노트",
              "content": "글 수정 기능이 추가되고, 조금의 숙면이 추가되었습니다.",
              "likes": [],
              "views": [],
              "createdAt": 1718205056204,
              "__v": 0
            }
          ]
        }
      }
    }
  })
  @ApiParam({
    name: "count",
    example: 1,
    required: true
  })
  // 공지글만 따로 로드
  @Get('notice/:count')
  async getNotices(@Param('count') count: number) {
    const res = await this.articleService.getNoticesByCount(count);
    return {
      article: res
    }
  }

  @ApiOperation({
    summary: "공지글 작성",
    description: "새로운 공지글을 등록합니다."
  })
  @ApiResponse({
    status: 200,
    description: "공지 업로드 성공",
    schema: {
      properties: {
        articleId: {
          type: 'string',
          description: "등록된 공지글 ID",
          example: 'N1'
        }
      }
    }
  })
  @Post('notice')
  async createNotices(@Body() newNotice: NoticeDto) {
    return await this.articleService.writeNotice(newNotice);
  }

  @ApiOperation({
    summary: "공지글 수정",
    description: "등록된 공지글을 수정합니다."
  })
  @ApiResponse({
    status: 200,
    description: "공지 수정 성공",
    schema: {
      properties: {
        articleId: {
          type: 'string',
          description: "수정된 공지글 ID",
          example: 'N3'
        }
      }
    }
  })
  @ApiParam({
    name: "articleId",
    example: 'N3',
    required: true
  })
  @Put('notice/:articleId')
  async editNotice(@Param('articleId') aid: string, @Body() notice: NoticeDto) {
    const res = await this.articleService.editNotice(aid, notice);
    return {
      articleId: res
    }
  }
}