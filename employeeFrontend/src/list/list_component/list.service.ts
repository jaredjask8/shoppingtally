import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListToDB } from '../models/ListToDB';
import { PreviousListsFromDB } from 'src/profile/models/PreviousListsFromDB';
import { PreviousListsToClient } from 'src/profile/models/PreviousListsToClient';
import { Behavior } from 'popper.js';
import { ListItem } from '../models/ListItem';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { List } from '../models/List';
import { ListItemToDb } from '../models/ListItemToDb';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  previousLists:PreviousListsToClient[]=[];
  list:BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>([])
  list$:Observable<ListItem[]>
  cartHasItems:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  cartHasItems$:Observable<boolean>

  currentList:string='';



  constructor(private http:HttpClient,private userService:EnvironmentService) { 
    this.list$ = this.list.asObservable();
    this.cartHasItems$ = this.cartHasItems.asObservable();
  }

  //http://localhost:8080

  postList(list:ListToDB):Observable<ListToDB>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + list.token);
    return this.http.post<ListToDB>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list", list, {headers:headers})
  }

  getDates(token:string):Observable<PreviousListsFromDB[]>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<PreviousListsFromDB[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/user", {token:token},{headers:headers})
  }

  getAllDates(token:string):Observable<string[]>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<string[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/dates",null,{headers:headers})
  }


  addListItem(item:ListItem){
    
    // const currentValue = this.list.value;
    // const updatedValue = [...currentValue, item]
    // this.list.next(updatedValue);

    //update list and send to server everytime
    let currentItem = item.image+"+"+item.name+"+"+item.quantity+"~";
    //update currentCart with observable
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<string>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/auth/addToList",{token:token, currentItem:currentItem},{headers:headers})
  }

  getCurrentList():Observable<List>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<List>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/auth/getUserList",token,{headers:headers})
  }

  removeListItem(list:string):Observable<List>{
    // let tempList = this.list.getValue()

    // tempList.forEach((item,index) => {
    //   if(item.name == deleteName){
    //     tempList.splice(index,1)
    //   }
    // })

    // if(tempList.length == 0){
    //   this.cartHasItems.next(false)
    // }

    // this.list.next(tempList)

    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<List>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/auth/deleteListItem",new ListItemToDb(token,list),{headers:headers})
  }

  resetStepper(){
    this.list.next([])
    this.cartHasItems.next(false)
  }

  decreaseQuantity(itemName){
    let tempList = this.list.getValue()
    let originalQuantity:number=0
    let newQuantity:number=0
    console.log("in decrease")

    tempList.forEach((item,index) => {
      if(item.name == itemName){
       originalQuantity = parseInt(tempList[index].quantity)
       newQuantity = --originalQuantity;
       tempList[index].quantity = newQuantity.toString()
       console.log(tempList[index].quantity)
      }
    })

    this.list.next(tempList)
  }

  increaseQuantity(itemName){
    let tempList = this.list.getValue()
    let originalQuantity:number=0
    let newQuantity:number=0
    console.log("in decrease")

    tempList.forEach((item,index) => {
      if(item.name == itemName){
       originalQuantity = parseInt(tempList[index].quantity)
       newQuantity = ++originalQuantity;
       tempList[index].quantity = newQuantity.toString()
       console.log(tempList[index].quantity)
      }
    })

    this.list.next(tempList)
  }


  
}
