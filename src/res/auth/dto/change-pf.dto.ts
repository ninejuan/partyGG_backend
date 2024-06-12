import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class PortfolioDto {
    @ApiProperty({
        description: "사용자의 새로운 포트폴리오 소개입니다.",
        example: "1 Mailog 개발<br>2. 프로젝트 306 개발<br>3. 슬로그, 팟지지 백엔드 개발<br>4. 홈서버 구축<br>5. 비제네르 암호 암복호화 구현"
    })
    newPf!: string;
}