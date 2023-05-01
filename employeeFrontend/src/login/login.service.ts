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
    return this.http.get<User[]>("http://localhost:8080/api/user/all");
  }

  authenticateUser(user: User):Observable<User>{
    return this.http.post<User>("http://localhost:8080/api/user/authenticate", user);
  }
}
