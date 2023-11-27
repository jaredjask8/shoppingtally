import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserOrderInfo } from 'src/list/models/UserOrderInfo';
import { EnvironmentService } from '../utility/environment.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NavService implements OnInit{
  loginClicked:BehaviorSubject<boolean>=new BehaviorSubject(false);
  loginClicked$:Observable<boolean>
  registerClicked:BehaviorSubject<boolean>=new BehaviorSubject(false);
  registerClicked$:Observable<boolean>
  cartClicked:BehaviorSubject<boolean>=new BehaviorSubject(false);
  cartClicked$:Observable<boolean>
  cartVisibility:BehaviorSubject<UserOrderInfo> = new BehaviorSubject<UserOrderInfo>({hasActive:false,hasCurrentOrder:false})
  cartVisibility$:Observable<UserOrderInfo>
  cartCount:BehaviorSubject<string> = new BehaviorSubject<string>("")
  cartCount$:Observable<string>

  constructor(private userService:EnvironmentService, private http:HttpClient) { 

    this.loginClicked$ = this.loginClicked.asObservable();
    this.registerClicked$ = this.registerClicked.asObservable();
    this.cartClicked$ = this.cartClicked.asObservable();
    this.cartVisibility$ = this.cartVisibility.asObservable()
    this.cartCount$ = this.cartCount.asObservable()
  }

  ngOnInit(): void {
    
    
  }

  getCartCount():Observable<string>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<string>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/auth/getCartCount",null,{headers:headers})
  }


}
