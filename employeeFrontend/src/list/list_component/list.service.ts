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
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  previousLists:PreviousListsToClient[]=[];
  list:BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>([])
  list$:Observable<ListItem[]>
  cartHasItems:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  cartHasItems$:Observable<boolean>
  updateOrderScreen:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  updateOrderScreen$:Observable<boolean>

  modalAfterOrderCreated:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  modalAfterOrderCreated$:Observable<boolean>

  currentList:string='';



  constructor(private http:HttpClient,private userService:EnvironmentService) { 
    this.list$ = this.list.asObservable();
    this.cartHasItems$ = this.cartHasItems.asObservable();
    this.modalAfterOrderCreated$ = this.modalAfterOrderCreated.asObservable()
    this.updateOrderScreen$ = this.updateOrderScreen.asObservable()
  }


  postList(list:ListToDB):Observable<List>{
    return this.http.post<List>(environment.apiUrl + "/api/v1/list", list)
  }

  getDates(token:string):Observable<PreviousListsFromDB[]>{
    return this.http.post<PreviousListsFromDB[]>(environment.apiUrl+"/api/v1/list/user", {token:token})
  }

  getShopperDates(token:string,shopperId:number):Observable<string[]>{
    return this.http.post<string[]>(environment.apiUrl+"/api/v1/list/dates",{token:token,shopperId:shopperId})
  }

  getShopperOrders():Observable<ShopperOrder[]>{
    return this.http.post<ShopperOrder[]>(environment.apiUrl+"/api/v1/list/getOrders",null)
  }

  startOrder(email,date):Observable<ActiveShopperOrder>{
    return this.http.post<ActiveShopperOrder>(environment.apiUrl+"/api/v1/list/startOrder",{email:email,date:date})
  }

  getCurrentOrder():Observable<CurrentOrderShopper>{
    return this.http.post<CurrentOrderShopper>(environment.apiUrl+"/api/v1/list/getCurrentOrder",null)
  }

  endCurrentOrder(email:string, date:string){
    return this.http.post(environment.apiUrl+"/api/v1/list/endCurrentOrder",{email:email,date:date})
  }

  cancelCurrentOrder():Observable<UserOrderInfo>{
    return this.http.get<UserOrderInfo>(environment.apiUrl+"/api/v1/list/cancelCurrentOrder")
  }

  updateCategory(toCategory:string,currentCategoryList:ListItemInterface[],fromCategory:string,previousCategoryList:ListItemInterface[]):Observable<CategoryUpdates>{
    return this.http.post<CategoryUpdates>(environment.apiUrl+"/api/v1/list/updateCategories",new CategoryUpdates(toCategory,currentCategoryList,fromCategory,previousCategoryList))
  }

  completeItem(updateCategory:string,itemName:string):Observable<CompleteItemResponse>{
    return this.http.post<CompleteItemResponse>(environment.apiUrl+"/api/v1/list/completeItem",{updateCategory:updateCategory,itemName:itemName})
  }

  getActiveOrder():Observable<CurrentOrderUser>{
    return this.http.post<CurrentOrderUser>(environment.apiUrl+"/api/v1/list/getActiveOrder",null)
  }

  getUserHasOrder(token?:string):Observable<UserOrderInfo>{
    return this.http.post<UserOrderInfo>(environment.apiUrl+"/api/v1/list/hasCurrentOrder",null)
  }

  deleteCurrentOrderItem(item:ListItem):Observable<ListItemInterface[]>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<ListItemInterface[]>(environment.apiUrl+"/api/v1/list/deleteCurrentOrderItem",item,{headers:headers})
  }


  addListItem(item:ListItem):Observable<List>{
    
    // const currentValue = this.list.value;
    // const updatedValue = [...currentValue, item]
    // this.list.next(updatedValue);

    //update list and send to server everytime
    let currentItem = item.image+"+"+item.name+"+"+item.quantity+"~";
    return this.http.post<List>(environment.apiUrl+"/api/v1/auth/addToList",{currentItem:currentItem})
  }

  addItemToActiveOrder(item:ListItem):Observable<CurrentOrderUser>{
    return this.http.post<CurrentOrderUser>(environment.apiUrl+"/api/v1/list/addItemToActiveOrder",item)
  }

  addItemToCurrentOrder(item:ListItem):Observable<ListItemInterface[]>{
    return this.http.post<ListItemInterface[]>(environment.apiUrl+"/api/v1/list/addItemToCurrentOrder",item)
  }

  addFullList(list:ListItem[]):Observable<List>{
    return this.http.post<List>(environment.apiUrl+"/api/v1/auth/addFullList",list)
  }

  addFullListToCurrentOrder(list:ListItemInterface[]):Observable<ListItemInterface[]>{
    return this.http.post<ListItemInterface[]>(environment.apiUrl+"/api/v1/list/addListToCurrentOrder",list)
  }

  addFullListToActiveOrder(list:ListItemInterface[]):Observable<CurrentOrderUser>{
    return this.http.post<CurrentOrderUser>(environment.apiUrl+"/api/v1/list/addListToActiveOrder",list)
  }

  getCurrentList():Observable<List>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<List>(environment.apiUrl+"/api/v1/auth/getUserList",token,{headers:headers})
  }

  getUserList():Observable<List>{
    return this.http.post<List>(environment.apiUrl+"/api/v1/list/getUserList",null)
  }

  removeListItem(list:string):Observable<List>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<List>(environment.apiUrl+"/api/v1/auth/deleteListItem",new ListItemToDb(token,list),{headers:headers})
  }

  resetStepper(){
    this.list.next([])
    this.cartHasItems.next(false)
  }

  decreaseQuantity(currentList:ListItem[],itemName:string):Observable<List>{
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
    return this.http.post<List>(environment.apiUrl+"/api/v1/auth/updateQuantity",tempList)
  }

  increaseQuantity(currentList:ListItem[],itemName:string):Observable<List>{
    //take current list 
    //find item we are changing 
    //change string to update quantity
    //post updated string to api
    let tempList = currentList;

    tempList.forEach(d => {
      if(d.name == itemName){
        let currentQuantity:number = Number(d.quantity);
        let updatedQuantity:string = ++currentQuantity+"";
        d.quantity = updatedQuantity;
      }
    })
    return this.http.post<List>(environment.apiUrl+"/api/v1/auth/updateQuantity",tempList)
  }

  increaseCurrentOrderQuantity(item:ListItem):Observable<ListItemInterface[]>{
    return this.http.post<ListItemInterface[]>(environment.apiUrl+"/api/v1/list/increaseCurrentOrderQuantity",item)
  }

  decreaseCurrentOrderQuantity(item:ListItem):Observable<ListItemInterface[]>{
    return this.http.post<ListItemInterface[]>(environment.apiUrl+"/api/v1/list/decreaseCurrentOrderQuantity",item)
  }

  increaseActiveOrderQuantity(item, category):Observable<CurrentOrderUser>{
    return this.http.post<CurrentOrderUser>(environment.apiUrl+"/api/v1/list/increaseActiveOrderQuantity",{item,category})
  }

  decreaseActiveOrderQuantity(item, category):Observable<CurrentOrderUser>{
    return this.http.post<CurrentOrderUser>(environment.apiUrl+"/api/v1/list/decreaseActiveOrderQuantity",{item,category})
  }

  deleteActiveOrderItem(item, category):Observable<CurrentOrderUser>{
    return this.http.post<CurrentOrderUser>(environment.apiUrl+"/api/v1/list/deleteActiveOrderItem",{item,category})
  }


  
}
