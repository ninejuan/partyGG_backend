import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import tokendataSchema from 'src/models/tokendata.schema';

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
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    let pggTkn = await getPggTkn(request.rawHeaders)
    if (!pggTkn) {
      response.redirect('/auth/google/cb');
      return false;
    }
    const tknData = await tokendataSchema.findOne({
      token: pggTkn
    });
    request.uid = tknData.pggId;
    return true;
  }
}