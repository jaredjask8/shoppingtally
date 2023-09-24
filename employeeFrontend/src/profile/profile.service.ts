import { Injectable } from '@angular/core';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { ListService } from 'src/list/list_component/list.service';
import { RegisterService } from 'src/register/register.service';
import { PreviousListsFromDB } from './models/PreviousListsFromDB';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profile: PreviousListsFromDB[]=[];
  signOut$: Observable<any>;
  private signOutClicked: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  
  constructor(private registerService:RegisterService, private listService:ListService, private userService:EnvironmentService) { 
    this.signOut$ = this.signOutClicked.asObservable();
  }

  setSignOut(data:boolean){
    return this.signOutClicked.next(data);
  }




  setUserListData(){
    this.listService.getDates(this.userService.getEnvironment().token).subscribe(d=>this.profile = d);
  }

  getProfile(){
    return this.profile;
  }
}
