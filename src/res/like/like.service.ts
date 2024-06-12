import { Injectable } from '@nestjs/common';
import articleSchema from 'src/models/article/article.schema';

@Injectable()
export class LikeService {
  async add(userId: number, articleId: number) {
    const article = await articleSchema.findOne({
      articleId: articleId
    });
    if (article.likes.indexOf(userId) >= 0) {
      return false;
    } else {
      article.likes[article.likes.length] = userId;
      await article.save().then(() => {
        return true;
      }).catch((e) => {
        console.error(e);
        return false;
      });
    }
    return true;
  }

  async remove(userId: number, articleId: number) {
    const article = await articleSchema.findOne({
      articleId: articleId
    });
    if (article.likes.indexOf(userId) == -1) {
      return false;
    } else {
      let i = article.likes.indexOf(userId);
      article.likes.splice(i, 1);
      await article.save().then(() => {
        return true;
      }).catch((e) => {
        console.error(e);
        return false;
      });
    }
    return true;
  }
}
