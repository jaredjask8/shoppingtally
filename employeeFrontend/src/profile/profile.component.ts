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
import { UserOrderInfo } from 'src/list/models/UserOrderInfo';
import { select } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  //phone number construction
  phoneFieldShown:boolean=false
  areaCode:string
  middleOfNumber:string
  endOfNumber:string
  rippleColor:string="#f7f603"
  ripplePlacement:boolean=true
  rippleBound:boolean=false

  currentData:string
  currentUpdateTitle:string
  
  
  constructor(private userService:EnvironmentService, private registerService:RegisterService, private profileService:ProfileService, private router:Router, private navService:NavService, private emailFoundNotification:MatSnackBar){}
  ngOnInit(): void {
    this.registerService.getUser().subscribe(d=>this.userData = d)
  }

  //signout is clicked on profile component 
  // sets profile service subject to true / user is signed out
  // removes all session storage 
  // navigates user to home page 
  signOut(){
    // this.userService.signOut().subscribe({
    //   complete:()=>{
        
    //   }
        
      
    // })

    this.navService.cartVisibilityFromUser.next(false)
        this.profileService.setSignOut(true);
        this.userService.removeUser();
        this.navService.cartCount.next("");
        this.userService.userLoggedIn.next(false)
        this.userService.stopLoginTimer()
        this.userService.stopLogoutTimer()
        this.router.navigate(['/','home']);
  }


  showUpdate(){
    
  }

  updateUserDataUI(choice:string,data:string){
    this._showUpdate = true;
    this.currentUpdateTitle = choice
    this.currentData = data
    if(choice == "phone"){
      this.phoneFieldShown = true
      this.areaCode= data.substring(0,3)
      this.middleOfNumber = data.substring(3,6)
      this.endOfNumber = data.substring(6)
      
    }
    
  }

  updateUserData(data:string){
    if(this.currentUpdateTitle == "email"){
      if(data != this.userData.email){
        this.registerService.checkUser(data).subscribe(d=>{
          if(!d.found){
            this.userService.updateUserData(data,this.currentUpdateTitle).subscribe(
              {
                next: d => this.userData = d,
                complete: () => {
                  this.registerService.authLogin(data,"t").subscribe({
                    next: d=>{
                      this.userService.setToken(d.token)
                    },
                    complete:()=>{
                      this.router.navigateByUrl("home")
                    }
                  })
                }
              }
            )
          }else{
            this.emailFoundNotification.open("Email already in use, please try another email.","",{duration:2000})
          }
        })
      }
    }else{
      this.userService.updateUserData(data,this.currentUpdateTitle).subscribe(d=>{
        this.userData = d
      })
    }
    
    this._showUpdate = false;
    this.phoneFieldShown = false
  }



}
