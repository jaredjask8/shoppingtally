import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtUserResponse } from 'src/models/JwtUserResponse';
import { TokenResponse } from 'src/models/TokenResponse';
import { User } from 'src/models/User';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
 
  showBadCredentials: boolean=false;

  constructor(private http:HttpClient) { }
  //const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token).set('Access-Control-Allow-Origin', '*');


  getUser(token:string):Observable<JwtUserResponse>{
    return this.http.post<JwtUserResponse>("https://shoppingtally.click/api/v1/auth/user", {token:token});
  }

  authLogin(email:string, password:string):Observable<TokenResponse>{
    return this.http.post<TokenResponse>("https://shoppingtally.click/api/v1/auth/authenticate", {email:email,password:password})
  }


  getUsers():Observable<JwtUserResponse>{
    return this.http.get<JwtUserResponse>("https://shoppingtally.click/api/user/all");
  }

  registerUser(user: User){
    return this.http.post("https://shoppingtally.click/api/v1/auth/register", user);
  }


}
