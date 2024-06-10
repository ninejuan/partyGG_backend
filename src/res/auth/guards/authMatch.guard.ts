import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import articleSchema from 'src/models/article/article.schema';
import tokenSchema from 'src/models/token.schema';
import tokenDataSchema from 'src/models/tokendata.schema';

async function getPggTkn(headers) {
  let cIndex = headers.indexOf('Cookie');
  if (cIndex !== -1) {
    let cookie = headers[cIndex + 1];
    const match = cookie.match(/pggtkn=([^;]+)/);
    if (match) {
      return `${cookie}`.slice(7);
    }
  }
  return null;
}

@Injectable()
export class MatchGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    let pggTkn = await getPggTkn(request.rawHeaders);
    if (!pggTkn) {
      response.redirect('/auth/google/cb');
      return false;
    }
    const article = await articleSchema.findOne({
      articleId: request.params.articleId
    });
    const token = await tokenDataSchema.findOne({
      token: pggTkn
    });
    if (article.writerId !== token.pggId) {
      alert("글쓴이만 이 공고를 마감할 수 있습니다.");
      return false;
    } 
    return true;
  }
}