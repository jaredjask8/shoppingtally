import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListToDB } from '../models/ListToDB';
import { PreviousListsFromDB } from 'src/profile/models/PreviousListsFromDB';
import { PreviousListsToClient } from 'src/profile/models/PreviousListsToClient';
import { Behavior } from 'popper.js';
import { ListItem } from '../models/ListItem';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  previousLists:PreviousListsToClient[]=[];
  list:BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>([])
  list$:Observable<ListItem[]>
  cartHasItems:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  cartHasItems$:Observable<boolean>



  constructor(private http:HttpClient) { 
    this.list$ = this.list.asObservable();
    this.cartHasItems$ = this.cartHasItems.asObservable();
  }

  //http://localhost:8080

  postList(list:ListToDB):Observable<ListToDB>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + list.token);
    return this.http.post<ListToDB>("http://localhost:8080/api/v1/list", list, {headers:headers})
  }

  getDates(token:string):Observable<PreviousListsFromDB[]>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<PreviousListsFromDB[]>("http://localhost:8080/api/v1/list/user", {token:token},{headers:headers})
  }

  getAllDates(token:string):Observable<string[]>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<string[]>("http://localhost:8080/api/v1/list/dates",null,{headers:headers})
  }


  addListItem(item:ListItem){
    const currentValue = this.list.value;
    const updatedValue = [...currentValue, item]
    this.list.next(updatedValue);
    this.cartHasItems.next(true);
  }

  removeListItem(deleteName:string){
    let tempList = this.list.getValue()

    tempList.forEach((item,index) => {
      if(item.name == deleteName){
        tempList.splice(index,1)
      }
    })

    if(tempList.length == 0){
      this.cartHasItems.next(false)
    }

    this.list.next(tempList)
  }

  resetStepper(){
    this.list.next([])
    this.cartHasItems.next(false)
  }


  
}
