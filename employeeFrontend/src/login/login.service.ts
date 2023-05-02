import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  addUser(){

  }

  loginUser(email:string, password:string):Observable<User[]>{
    const headers = new HttpHeaders({Authorization: 'Basic ' + email + ":" + password})
    return this.http.get<User[]>("http://localhost:8080/api/user/all", {headers})
  }

  getUsers():Observable<User[]>{
    return this.http.get<User[]>("http://shoppingtally.click/api/user/all");
  }

  registerUser(user: User):Observable<User>{
    return this.http.post<User>("http://shoppingtally.click/register", user);
  }
}
