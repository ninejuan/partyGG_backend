import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class DescriptionDto {
    @ApiProperty({
        description: "게시글 작성자의 PartyGG Id입니다.",
        example: "53837250"
    })
    pggId!: number;

    @ApiProperty({
        description: "사용자의 새로운 소개입니다.",
        example: "안녕하세요, 선린인터넷고등학교 119기 정보보호과 이주안입니다."
    })
    newDesc!: string;
}