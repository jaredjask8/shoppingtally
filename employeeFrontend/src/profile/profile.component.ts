import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { PreviousListsFromDB } from './models/PreviousListsFromDB';
import { ListService } from 'src/list/list_component/list.service';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { ListItem } from 'src/list/models/ListItem';
import { PreviousListsToClient } from './models/PreviousListsToClient';
import { JwtUserResponse } from 'src/models/JwtUserResponse';
import { RegisterService } from 'src/register/register.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  user_name:string="";
  profile:PreviousListsFromDB[];
  clientList:PreviousListsToClient[]=[];
  userData:JwtUserResponse;
  _showUpdate: boolean=false;
  _showLists: boolean=false;

  
  
  constructor(private listService:ListService, private userService:EnvironmentService, private registerService:RegisterService, private profileService:ProfileService, private router:Router){}
  ngOnInit(): void {
    //retrieves list appointments and the user on page load
    this.listService.getDates(this.userService.getEnvironment().token).subscribe(d => {this.profile = d; this.sortPreviousList(d);});
    this.registerService.getUser(this.userService.getEnvironment().token).subscribe((d)=> {
      this.userData = d;
    
    });
  }

  //signout is clicked on profile component 
  // sets profile service subject to true / user is signed out
  // removes all session storage 
  // navigates user to home page 
  signOut(){
    this.profileService.setSignOut(true);
    this.userService.removeUser();
    this.router.navigate(['/','home']);
  }

  sortPreviousList(data:PreviousListsFromDB[]){
    const regex = /\+\d+/
    for(let i=0; i<data.length; i++){
      let itemArray:ListItem[]=[];
      let tempArray:string[];

      tempArray = this.profile[i].list.split("~");
      tempArray.forEach((d,index)=>itemArray.push(this.setItem(d, index)));
      
      this.clientList.push(new PreviousListsToClient(i, itemArray, data[i].date));
    }
  }

  setItem(data:string, index:number){
    let name:string;
    let quantity:string;

    quantity = data.substring(data.length-1)
    name = data.substring(0, data.indexOf("+"))

    return new ListItem(name, quantity);
  }

  showUpdate(){
    this._showUpdate = true;
    this._showLists = false;
  }

  showLists(){
    this._showUpdate = false;
    this._showLists = true;
  }

  getDates():string[]{
    return this.clientList.map(d => d.date);
  }

}
