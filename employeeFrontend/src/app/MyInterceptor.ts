import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { re } from "mathjs";
import { Observable } from "rxjs";
import { EnvironmentService } from "src/global/utility/environment.service";

@Injectable()
export class MyInterceptor implements HttpInterceptor {
    constructor(private envService:EnvironmentService){}
    intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
        if(this.envService.getEnvironment().token && !req.url.includes("https://www.googleapis.com")){
            const authReq = req.clone({
                headers: new HttpHeaders({
                  'Content-Type':  'application/json',
                  'Authorization': 'Bearer ' + this.envService.getEnvironment().token
                })
              });
            return next.handle(authReq);
        }else{
            return next.handle(req);
        }
        
  }
}