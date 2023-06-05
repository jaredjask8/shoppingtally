import { Injectable } from '@angular/core';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { ListService } from 'src/list/list_component/list.service';
import { RegisterService } from 'src/register/register.service';
import { PreviousListsFromDB } from './models/PreviousListsFromDB';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profile: PreviousListsFromDB[]=[];
  
  constructor(private registerService:RegisterService, private listService:ListService, private userService:EnvironmentService) { }

  setUserListData(){
    this.registerService.getUser(this.userService.getEnvironment().token).subscribe(d => console.log(d));
    this.listService.getDates(this.userService.getEnvironment().token).subscribe(d=>this.profile = d);
  }

  getProfile(){
    return this.profile;
  }
}
