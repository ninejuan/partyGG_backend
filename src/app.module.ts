import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './res/auth/auth.module';
import { ArticleModule } from './res/article/article.module';
import { LikeModule } from './res/like/like.module';

@Module({
  imports: [AuthModule, ArticleModule, LikeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
