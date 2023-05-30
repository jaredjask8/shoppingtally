import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenResponse } from 'src/models/TokenResponse';
import { User } from 'src/models/User';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
 
  showBadCredentials: boolean=false;
  private credentialCheck = new BehaviorSubject(false);
  private loginCheck = new BehaviorSubject(true);
  private profileCheck = new BehaviorSubject(false);

  currentProfileCheck = this.profileCheck.asObservable();
  currentCredCheck = this.credentialCheck.asObservable();
  currentLoginCheck = this.loginCheck.asObservable();

  constructor(private http:HttpClient) { }



  loginUser(token:string){
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token).set('Access-Control-Allow-Origin', '*');
    return this.http.get("http://localhost:8080/api/v1/demo-controller", {headers:headers});
  }

  authLogin(email:string, password:string):Observable<TokenResponse>{
    return this.http.post<TokenResponse>("http://localhost:8080/api/v1/auth/authenticate", {email:email,password:password})
  }

  getUsers():Observable<User[]>{
    return this.http.get<User[]>("http://shoppingtally.click/api/user/all");
  }

  registerUser(user: User){
    return this.http.post("http://localhost:8080/api/v1/auth/register", user);
  }

  changeCredCheck(check:boolean){
    this.credentialCheck.next(check);
  }

  changeLoginCheck(check:boolean){
    this.loginCheck.next(check);
  }

  changeProfileCheck(check:boolean){
    this.profileCheck.next(check)
  }

}
