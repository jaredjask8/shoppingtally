import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/User';
import { Date } from '../models/Date';
import { ListToDB } from '../models/ListToDB';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private http:HttpClient) { }

  postList(list:ListToDB):Observable<ListToDB>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + list.token).set('Access-Control-Allow-Origin', '*');
    return this.http.post<ListToDB>("http://localhost:8080/api/v1/list", list, {headers:headers})
  }

  getDates(user:User):Observable<Date[]>{
    return this.http.post<Date[]>("http://localhost:8080/api/dates/all", user)
  }
}
