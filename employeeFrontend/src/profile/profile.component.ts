import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { PreviousListsFromDB } from '../previousLists/models/PreviousListsFromDB';
import { ListService } from 'src/list/list_component/list.service';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { ListItem } from 'src/list/models/ListItem';
import { PreviousListsToClient } from '../previousLists/models/PreviousListsToClient';
import { JwtUserResponse } from 'src/models/JwtUserResponse';
import { RegisterService } from 'src/register/register.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NavService } from 'src/global/nav/nav.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  user_name:string="";
  profile:PreviousListsFromDB[];
  clientList:ListItem[]=[];
  dateArray:string[]=[];
  fullList:PreviousListsFromDB[]=[]
  userData:JwtUserResponse;
  _showUpdate: boolean=false;
  _showLists: boolean=false;

  
  
  constructor(private listService:ListService, private userService:EnvironmentService, private registerService:RegisterService, private profileService:ProfileService, private router:Router, private navService:NavService){}
  ngOnInit(): void {

  }

  //signout is clicked on profile component 
  // sets profile service subject to true / user is signed out
  // removes all session storage 
  // navigates user to home page 
  signOut(){
    this.profileService.setSignOut(true);
    this.userService.removeUser();
    this.navService.cartCount.next("");
    this.router.navigate(['/','home']);
  }


  showUpdate(){
    this._showUpdate = true;
  }



}
