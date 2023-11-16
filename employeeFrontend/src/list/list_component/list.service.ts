import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListToDB } from '../models/ListToDB';
import { PreviousListsFromDB } from 'src/previousLists/models/PreviousListsFromDB';
import { PreviousListsToClient } from 'src/previousLists/models/PreviousListsToClient';
import { Behavior } from 'popper.js';
import { ListItem } from '../models/ListItem';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { List } from '../models/List';
import { ListItemToDb } from '../models/ListItemToDb';
import { ShopperOrder } from '../models/ShopperOrder';
import { ActiveShopperOrder } from '../models/ActiveShopperOrder';
import { CurrentOrderShopper } from '../models/CurrentOrderShopper';
import { ListItemInterface } from '../models/ListItemInterface';
import { CategoryUpdates } from '../models/CategoryUpdates';
import { CompleteItemResponse } from '../models/CompleteItemResponse';
import { CurrentOrderUser } from '../models/CurrentOrderUser';
import { UserOrderInfo } from '../models/UserOrderInfo';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  previousLists:PreviousListsToClient[]=[];
  list:BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>([])
  list$:Observable<ListItem[]>
  cartHasItems:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  cartHasItems$:Observable<boolean>

  modalAfterOrderCreated:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  modalAfterOrderCreated$:Observable<boolean>

  currentList:string='';



  constructor(private http:HttpClient,private userService:EnvironmentService) { 
    this.list$ = this.list.asObservable();
    this.cartHasItems$ = this.cartHasItems.asObservable();
    this.modalAfterOrderCreated$ = this.modalAfterOrderCreated.asObservable()
  }

  //http://localhost:8080

  postList(list:ListToDB):Observable<List>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + list.token);
    return this.http.post<List>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list", list, {headers:headers})
  }

  getDates(token:string):Observable<PreviousListsFromDB[]>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<PreviousListsFromDB[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/user", {token:token},{headers:headers})
  }

  getShopperDates(token:string,shopperId:number):Observable<string[]>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<string[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/dates",{token:token,shopperId:shopperId},{headers:headers})
  }

  getShopperOrders():Observable<ShopperOrder[]>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<ShopperOrder[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/getOrders",null,{headers:headers})
  }

  startOrder(email,date):Observable<ActiveShopperOrder>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<ActiveShopperOrder>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/startOrder",{email:email,date:date},{headers:headers})
  }

  getCurrentOrder():Observable<CurrentOrderShopper>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<CurrentOrderShopper>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/getCurrentOrder",null,{headers:headers})
  }

  endCurrentOrder(email:string, date:string){
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/endCurrentOrder",{email:email,date:date},{headers:headers})
  }

  updateCategory(toCategory:string,currentCategoryList:ListItemInterface[],fromCategory:string,previousCategoryList:ListItemInterface[]):Observable<CategoryUpdates>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<CategoryUpdates>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/updateCategories",new CategoryUpdates(toCategory,currentCategoryList,fromCategory,previousCategoryList),{headers:headers})
  }

  completeItem(updateCategory:string,itemName:string):Observable<CompleteItemResponse>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<CompleteItemResponse>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/completeItem",{updateCategory:updateCategory,itemName:itemName},{headers:headers})
  }

  getActiveOrder():Observable<CurrentOrderUser>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<CurrentOrderUser>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/getActiveOrder",null,{headers:headers})
  }

  getUserHasOrder(token?:string):Observable<UserOrderInfo>{
    let tokenFromEnvironment = token || this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + tokenFromEnvironment);
    return this.http.post<UserOrderInfo>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/hasCurrentOrder",null,{headers:headers})
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

  addItemToActiveOrder(item:ListItem):Observable<ListItemInterface[]>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<ListItemInterface[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/addItemToActiveOrder",item,{headers:headers})
  }

  addItemToCurrentOrder(item:ListItem):Observable<ListItemInterface[]>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<ListItemInterface[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/addItemToCurrentOrder",item,{headers:headers})
  }

  addFullList(list:ListItem[]):Observable<string>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<string>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/auth/addFullList",{token:token, list:list},{headers:headers})
  }

  getCurrentList():Observable<List>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<List>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/auth/getUserList",token,{headers:headers})
  }

  getUserList():Observable<List>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<List>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/list/getUserList",token,{headers:headers})
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

  decreaseQuantity(currentList:ListItem[],itemName:string):Observable<List>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    console.log(token)
    
    //take current list 
    //find item we are changing 
    //change string to update quantity
    //post updated string to api
    let tempList = currentList;

    tempList.forEach(d => {
      if(d.name == itemName){
        let currentQuantity:number = Number(d.quantity);
        let updatedQuantity:string = --currentQuantity+"";
        d.quantity = updatedQuantity
      }
    })
    return this.http.post<List>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/auth/updateQuantity",{token:token, list:tempList},{headers:headers})
  }

  increaseQuantity(currentList:ListItem[],itemName:string):Observable<List>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    console.log(token)
    
    //take current list 
    //find item we are changing 
    //change string to update quantity
    //post updated string to api
    let tempList = currentList;

    tempList.forEach(d => {
      if(d.name == itemName){
        let currentQuantity:number = Number(d.quantity);
        let updatedQuantity:string = ++currentQuantity+"";
        d.quantity = updatedQuantity
      }
    })
    return this.http.post<List>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/auth/updateQuantity",{token:token, list:tempList},{headers:headers})
  }


  
}
