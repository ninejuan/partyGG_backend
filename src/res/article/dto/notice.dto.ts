import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class NoticeDto {
    @ApiProperty({
        description: "관리자의 PartyGG Id입니다.",
        example: "34726863"
    })
    writerId!: number;

    @ApiProperty({
        description: "게시글의 제목입니다.",
        example: "오늘 PartyGG가 정식으로 출시했습니다!"
    })
    title!: string;

    @ApiProperty({
        description: "게시글의 내용입니다.",
        example: "오늘 팀원 구인구직 플랫폼 팟지지가 정식으로 출시했습니다!<br>드디어 출시했습니다!"
    })
    content!: string;
}