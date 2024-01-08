import { Injectable } from '@angular/core';
import { PreviousListsFromDB } from '../previousLists/models/PreviousListsFromDB';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profile: PreviousListsFromDB[]=[];
  signOut$: Observable<any>;
  private signOutClicked: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  
  constructor() { 
    this.signOut$ = this.signOutClicked.asObservable();
  }

  setSignOut(data:boolean){
    return this.signOutClicked.next(data);
  }




  // setUserListData(){
  //   this.listService.getDates(this.userService.getEnvironment().token).subscribe(d=>this.profile = d);
  // }

  getProfile(){
    return this.profile;
  }
}
