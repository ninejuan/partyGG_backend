import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

async function getPggTkn(headers) {
  let cIndex = headers.indexOf('Cookie');
  if (cIndex !== -1) {
    let cookie = headers[cIndex + 1];
    const match = cookie.match(/pggtkn=([^;]+)/);
    if (match) {
      return cookie;
    }
  }
  return null;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    let pggTkn = getPggTkn(request.rawHeaders)
    if (!pggTkn) {
      response.redirect('/auth/google/cb');
      return false;
    }
    return true;
  }
}