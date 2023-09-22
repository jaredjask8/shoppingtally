import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListToDB } from '../models/ListToDB';
import { PreviousListsFromDB } from 'src/profile/models/PreviousListsFromDB';
import { PreviousListsToClient } from 'src/profile/models/PreviousListsToClient';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  previousLists:PreviousListsToClient[]=[];
  constructor(private http:HttpClient) { }

  postList(list:ListToDB):Observable<ListToDB>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + list.token).set('Access-Control-Allow-Origin', '*');
    return this.http.post<ListToDB>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list", list, {headers:headers})
  }

  getDates(token:string):Observable<PreviousListsFromDB[]>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token).set('Access-Control-Allow-Origin', '*');
    return this.http.post<PreviousListsFromDB[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/user", {token:token},{headers:headers})
  }

  getAllDates(token:string):Observable<string[]>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<string[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/dates",null,{headers:headers})
  }


  
}
