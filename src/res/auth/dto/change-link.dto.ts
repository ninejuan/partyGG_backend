import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class LinkDto {
    @ApiProperty({
        description: "사용자의 새로운 대표 링크입니다.",
        example: "https://esxi.juany.kr"
    })
    link!: string;
}