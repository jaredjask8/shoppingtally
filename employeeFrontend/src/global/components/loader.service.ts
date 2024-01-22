import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoading:BehaviorSubject<boolean>=new BehaviorSubject(false)
  isLoading$:Observable<boolean>

  constructor(){
    this.isLoading$ = this.isLoading.asObservable()
  }
  
}
