import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService implements OnInit{
  loginClicked:BehaviorSubject<boolean>=new BehaviorSubject(false);
  loginClicked$:Observable<boolean>

  constructor() { 

    this.loginClicked$ = this.loginClicked.asObservable();
  }

  ngOnInit(): void {
    
    
  }


}
