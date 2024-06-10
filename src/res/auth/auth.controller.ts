import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch, Redirect, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google.guard';
import { CallbackUserData } from './decorator/auth.decorator';
import Auth from 'src/interface/auth.interface';
import Token from 'src/interface/token.interface';
import { AuthGuard } from './guards/checkAuth.guard';
import { config } from 'dotenv';
config();

let env = process.env;

interface ChangeDesc {
	pggId: Number;
	newDesc: string;
};

interface Portfolio {
	userId: number;
	newPf: string;
}

interface MyLink { // 사용자의 대표 웹사이트 설정
	userId: number;
	link: string;
}

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
			sameSite: 'strict',
			httpOnly: true
		});
		res.redirect('/');
	}

	@ApiExcludeEndpoint()
	@UseGuards(AuthGuard)
	@Patch('change/nick/:pggId/:newNick')
	async changeNick(@Param('pggId') oldId: string, @Param('newNick') newId: string) {
		return this.authService.changeNick(oldId, newId);
	}

	@ApiExcludeEndpoint()
	@UseGuards(AuthGuard)
	@Patch()
	async changeDescription(@Body() newDesc: ChangeDesc) {
		return this.authService.changeDesc(newDesc.pggId, newDesc.newDesc);
	}

	/**
	 * Auth Controller에서 만들어야 하는 기능
	 * 	- User Portfolio (근무 경력, 수상 경력, 재학 학교 등)
	 * 	- 유저 깃허브, 포트폴리오 홈페이지 등 url 연결
	 */

	@Patch('pf/did/:userId')
	@UseGuards(AuthGuard)
	async changePortfolio(@Body() bd: Portfolio) {
		return await this.authService.updatePortfolio(bd.userId, bd.newPf);
	}

	@Patch('pf/editlink/:userId')
	@UseGuards(AuthGuard)
	async editLink(@Body() bd: MyLink) {
		return await this.authService.changeLink(bd.userId, bd.link);
	}
}

/**
 * Authentication API METHOD
 * GET : LogIn
 * POST : LogOut
 * DELETE : Rm ACC
 * PATCH METHOD에서 진행할 작업을 strategy에서 진행하는 관계로 패치 메서드는 작성하지 않음.
 */