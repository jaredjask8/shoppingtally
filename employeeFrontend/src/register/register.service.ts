import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/User';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http:HttpClient) { }

  addUser(){

  }

  loginUser(){
    var token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYXlAZ21haWwuY29tIiwiaWF0IjoxNjg0ODI2MzYyLCJleHAiOjE2ODQ4Mjc4MDJ9._xms6WoPFyqcJiGphxiI2Ji0dWNxbcf6CqHkOVBPHPQ"
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token).set('Access-Control-Allow-Origin', '*');
    return this.http.get("http://localhost:8080/api/v1/demo-controller", {headers:headers});
  }

  getUsers():Observable<User[]>{
    return this.http.get<User[]>("http://shoppingtally.click/api/user/all");
  }

  registerUser(user: User):Observable<User>{
    return this.http.post<User>("http://localhost:8080/register", user);
  }
}
