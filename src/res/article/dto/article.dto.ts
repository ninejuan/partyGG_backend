import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class ArticleDto {
    @ApiProperty({
        description: "게시글 작성자의 PartyGG Id입니다.",
        example: "53837250"
    })
    writerId!: number;

    @ApiProperty({
        description: "게시글의 제목입니다.",
        example: "2024 한국코드페어 함께 나가실 분들 구합니다."
    })
    title!: string;

    @ApiProperty({
        description: "게시글의 내용입니다.",
        example: "팀장 : 이 주 안 <br>제 주 분야는 백엔드이고, 프론트엔드 개발자들과 함께하고 싶습니다."
    })
    content!: string;

    @ApiProperty({
        description: "게시글의 종류입니다. human(구인), team(구직)",
        example: "human"
    })
    aType!: string;
}