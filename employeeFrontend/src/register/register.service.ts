import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { JwtUserResponse } from 'src/models/JwtUserResponse';
import { TokenResponse } from 'src/models/TokenResponse';
import { User } from 'src/models/User';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  //"http://localhost:8080"
  //"https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT"
  serverUrl = "https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT"

  showBadCredentials: boolean=false;
  userCredentials$:BehaviorSubject<boolean> = new BehaviorSubject(false);
  checkAdmin$: Observable<boolean>;
  isAdmin:boolean=false;


  constructor(private http:HttpClient) { 
    this.checkAdmin$ = this.userCredentials$.asObservable();

  }
  //const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token).set('Access-Control-Allow-Origin', '*');
  
  setAdmin(user:JwtUserResponse){
    console.log(user.role)
    if(user.role === "ADMIN"){
      this.isAdmin = true;
      this.userCredentials$.next(true);
    }else{
      this.isAdmin = false;
      this.userCredentials$.next(false);
    }
    
  }

  

  getUser(token:string):Observable<JwtUserResponse>{
    return this.http.post<JwtUserResponse>(this.serverUrl + "/api/v1/auth/user", {token:token});
  }

  authLogin(email:string, password:string):Observable<TokenResponse>{
    return this.http.post<TokenResponse>(this.serverUrl + "/api/v1/auth/authenticate", {email:email,password:password})
  }

  


  getUsers():Observable<JwtUserResponse>{
    return this.http.get<JwtUserResponse>(this.serverUrl + "/api/user/all");
  }

  registerUser(user: User):Observable<User>{
    return this.http.post<User>(this.serverUrl + "/api/v1/auth/register", user);
  }

  


}
