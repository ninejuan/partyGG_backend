import { Injectable } from '@nestjs/common';
import articleSchema from '../../models/article/article.schema';
import Article from '../../interface/article.interface';
import genAIdUtil from 'src/utils/genArticleId.util';
import checkXSSUtil from 'src/utils/checkXSS.util';
import * as crypto from 'crypto';

@Injectable()
export class ArticleService {
  async create(newArticleData: Article) {
    let arid = await genAIdUtil();
    await new articleSchema({
      writerId: newArticleData.writerId,
      articleId: arid,
      title: await checkXSSUtil(newArticleData.title),
      content: await checkXSSUtil(newArticleData.content),
      likes: [],
      aType: await checkXSSUtil(newArticleData.aType),
      category: await checkXSSUtil(newArticleData.category),
      createdAt: Date.now(),
      editData: {
        isEdited: false
      }
    }).save();
    return arid;
  }

  async update(id: number, updateData: Article) {
    const update = await articleSchema.findOneAndUpdate({
      articleId: id
    }, updateData).then(() => {
      return id;
    }).catch((e) => {
      console.error(e);
      return false;
    })
  }

  async remove(id: number) {
    await articleSchema.findOneAndDelete({
      articleId: id
    }).then(() => {
      return true;
    }).catch((e) => {
      console.error(e);
      return false;
    });
  }

  async end(articleId: number) { // 구인이나 구직을 마감함.
    const article = await articleSchema.findOne({
      articleId: articleId
    });
    if (article.isEnded) return false;
    else {
      article.isEnded = true;
      await article.save();
      return true;
    }
  }

  async resume(articleId: number) {
    const article = await articleSchema.findOne({
      articleId: articleId
    });
    if (!article.isEnded) return false;
    else {
      article.isEnded = false;
      await article.save();
      return true;
    }
  }

  async getById(id: number) {
    if (isNaN(id)) return false;
    const res = await articleSchema.findOne({
      articleId: id
    });
    return res;
  }
  
  async getIdsByCount(category: string, page: number, count: number) {
    const get = await articleSchema.find({
      aType: category
    }).sort({ createdAt: -1 }).skip((page-1)*count).limit(count);
    return get;
  }


  async getTopArticles(category: string, count: number) {
    const get = await articleSchema.find({
      aType: category
    }).sort({ createdAt: -1 }).limit(count);
    return get;
  }

  async applyView(articleId: number, userid: number) {
    const article = await articleSchema.findOne({
      articleId: articleId
    });
    const index = article.views.indexOf(userid);
    if (index) return null;
    else {
      article.views.unshift(userid);
      await article.save();
    }
    return userid;
  }
}
