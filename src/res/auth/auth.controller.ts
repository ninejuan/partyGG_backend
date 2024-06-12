import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiParam, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch, Redirect, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { CallbackUserData } from './decorator/auth.decorator';
import Auth from 'src/interface/auth.interface';
import Token from 'src/interface/token.interface';
import { AuthGuard } from './guards/checkAuth.guard';
import { config } from 'dotenv';
import { DescriptionDto } from './dto/change-desc.dto';
import { LinkDto } from './dto/change-link.dto';
import { PortfolioDto } from './dto/change-pf.dto';
config();

let env = process.env;

interface ChangeDesc {
	pggId: Number;
	newDesc: string;
};

interface Portfolio { newPf: string; };

interface MyLink { // 사용자의 대표 웹사이트 설정
	link: string;
};

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@ApiExcludeEndpoint()
	@Get('google/cb')
	@UseGuards(GoogleAuthGuard)
	async GoogleCallback(
		@CallbackUserData() userData: any,
		@Res() res: Response,
	) {
		res.cookie('pggtkn', userData.token, {
			// domain: `.${env.ROOT_DOMAIN}`,
			expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
			sameSite: 'none',
			httpOnly: true
		});
		res.redirect('/');
	}

	@ApiExcludeEndpoint()
	@Get('user/:pggId')
	async getUserData(@Param('pggId') uid: number) {
		return await this.authService.getUserData(uid);
	}

	@ApiOperation({
		summary: "닉네임 변경",
		description: "사용자의 팟지지 닉네임을 변경합니다."
	})
	@ApiResponse({
		status: 200,
		description: "닉네임 변경 성공",
		schema: {
			properties: {
				newNick: {
					type: 'string',
					description: "사용자의 변경된 닉네임입니다.",
					example: '2025파라부장'
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
		name: "newNick",
		example: "2025파라부장",
		required: true
	})
	@UseGuards(AuthGuard)
	@Patch('change/nick/:userId/:newNick')
	async changeNick(@Param('userId') userId: string, @Param('newNick') newNick: string) {
		return {
			newNick: await this.authService.changeNick(userId, newNick)
		};
	}

	@ApiOperation({
		summary: "소개글 수정",
		description: "사용자의 팟지지 소개글을 수정합니다."
	})
	@ApiResponse({
		status: 200,
		description: "소개글 수정 성공",
		schema: {
			properties: {
				newNick: {
					type: 'string',
					description: "사용자의 수정된 소개글입니다.",
					example: '안녕하세요, 선린인터넷고등학교 119기 정보보호과 이주안입니다.'
				}
			}
		}
	})
	@UseGuards(AuthGuard)
	@Patch('change/desc')
	async changeDescription(@Body() newDesc: DescriptionDto) {
		return this.authService.changeDesc(newDesc.pggId, newDesc.newDesc);
	}

	/**
	 * Auth Controller에서 만들어야 하는 기능
	 * 	- User Portfolio (근무 경력, 수상 경력, 재학 학교 등)
	 * 	- 유저 깃허브, 포트폴리오 홈페이지 등 url 연결
	 */
	@ApiOperation({
		summary: "포트폴리오 수정",
		description: "사용자의 팟지지 포트폴리오를 수정합니다."
	})
	@ApiResponse({
		status: 200,
		description: "포트폴리오 수정 성공",
		schema: {
			properties: {
				newNick: {
					type: 'string',
					description: "사용자의 수정된 포트폴리오입니다.",
					example: '1 Mailog 개발<br>2. 프로젝트 306 개발<br>3. 슬로그, 팟지지 백엔드 개발<br>4. 홈서버 구축<br>5. 비제네르 암호 암복호화 구현'
				}
			}
		}
	})
	@ApiParam({
		name: "userId",
		example: 53837250,
		required: true
	})
	@Patch('pf/did/:userId')
	@UseGuards(AuthGuard)
	async changePortfolio(@Body() bd: PortfolioDto, @Param('userId') uid: number) {
		return await this.authService.updatePortfolio(uid, bd.newPf);
	}

	@ApiOperation({
		summary: "대표 링크 수정",
		description: "사용자의 팟지지 대표 링크를 변경합니다."
	})
	@ApiResponse({
		status: 200,
		description: "링크 변경 성공",
		schema: {
			properties: {
				newNick: {
					type: 'string',
					description: "사용자의 수정된 대표 링크입니다.",
					example: 'https://esxi.juany.kr'
				}
			}
		}
	})
	@ApiParam({
		name: "userId",
		example: 53837250,
		required: true
	})
	@Patch('pf/editlink/:userId')
	@UseGuards(AuthGuard)
	async editLink(@Body() bd: LinkDto, @Param('userId') uid: number) {
		return await this.authService.changeLink(uid, bd.link);
	}
}

/**
 * Authentication API METHOD
 * GET : LogIn
 * POST : LogOut
 * DELETE : Rm ACC
 * PATCH METHOD에서 진행할 작업을 strategy에서 진행하는 관계로 패치 메서드는 작성하지 않음.
 */