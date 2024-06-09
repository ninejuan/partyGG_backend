import { Injectable } from '@nestjs/common';
import Like from 'src/interface/like.interface';
import articleSchema from 'src/models/article/article.schema';

@Injectable()
export class LikeService {
  async add(newLike: Like) {
    const article = await articleSchema.findOne({
      articleId: newLike.articleId
    });
    if (article.likes.indexOf(newLike.likerId) >= 0) {
      return false;
    } else {
      article.likes[article.likes.length] = newLike.likerId;
      await article.save().then(() => {
        return true;
      }).catch((e) => {
        console.error(e);
        return false;
      });
    }
  }

  async remove(newLike: Like) {
    const article = await articleSchema.findOne({
      articleId: newLike.articleId
    });
    if (article.likes.indexOf(newLike.likerId) == -1) {
      return false;
    } else {
      let i = article.likes.indexOf(newLike.likerId);
      article.likes.splice(i, 1);
      await article.save().then(() => {
        return true;
      }).catch((e) => {
        console.error(e);
        return false;
      });
    }
  }
}
