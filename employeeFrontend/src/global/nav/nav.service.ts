import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserOrderInfo } from 'src/list/models/UserOrderInfo';

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

  constructor() { 

    this.loginClicked$ = this.loginClicked.asObservable();
    this.registerClicked$ = this.registerClicked.asObservable();
    this.cartClicked$ = this.cartClicked.asObservable();
    this.cartVisibility$ = this.cartVisibility.asObservable()
  }

  ngOnInit(): void {
    
    
  }


}
