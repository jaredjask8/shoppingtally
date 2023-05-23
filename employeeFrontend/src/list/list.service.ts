import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/User';
import { Date } from './models/Date';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private http:HttpClient) { }

  postDates(date:Date):Observable<Date>{
    return this.http.post<Date>("http://localhost:8080/api/dates/add", date)
  }

  getDates(user:User):Observable<Date[]>{
    return this.http.post<Date[]>("http://localhost:8080/api/dates/all", user)
  }
}
