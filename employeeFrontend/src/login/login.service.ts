import { HttpClient } from '@angular/common/http';
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

  getUsers():Observable<User[]>{
    return this.http.get<User[]>("http://shoppingtally.click")
  }

  authenticateUser(user: User):Observable<User>{
    return this.http.post<User>("http://shoppingtally.click", user)
  }
}
