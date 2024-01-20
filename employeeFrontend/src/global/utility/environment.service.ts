import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Environment } from "./Environment";
import { JwtUserResponse } from "src/models/JwtUserResponse";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { RegisterService } from "src/register/register.service";
import { TokenResponse } from "src/models/TokenResponse";
import { NavService } from "../nav/nav.service";
import { ProfileService } from "src/profile/profile.service";
import { Router } from "@angular/router";


@Injectable({
    providedIn: 'root'
  })
  export class EnvironmentService{
    email:string;
    user:JwtUserResponse;
    hasToken:boolean = false
    loginTimer:any
    logoutTimer:any
    userLoggedIn:BehaviorSubject<boolean>=new BehaviorSubject(false);
    userLoggedIn$:Observable<boolean>
    signOutSnackbar:BehaviorSubject<boolean>=new BehaviorSubject(false);
    signOutSnackbar$:Observable<boolean>
    //"http://localhost:8080"
    //"https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT"
    serverUrl = "https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT"

    constructor(private http:HttpClient, private navService:NavService, private profileService:ProfileService, private router:Router, private registerService:RegisterService){
      this.userLoggedIn$ = this.userLoggedIn.asObservable();
      this.signOutSnackbar$ = this.signOutSnackbar.asObservable();
    }

    getLogin(){
      return sessionStorage.getItem("log");
    }

    signOut(){
      this.navService.cartVisibilityFromUser.next(false)
      this.profileService.setSignOut(true);
      this.removeUser();
      this.navService.cartCount.next("");
      this.userLoggedIn.next(false)
      this.stopLoginTimer()
      this.stopLogoutTimer()
      this.router.navigate(['/','home']);
      this.signOutSnackbar.next(true)
    }

    refreshLogin():Observable<TokenResponse>{
      return this.http.get<TokenResponse>(this.serverUrl + "/api/v1/auth/refresh")
    }

    setToken(token:string){
      sessionStorage.setItem("token",token);
      //resets timers after setToken call
      //window.location.reload()
    }
    
    setEnvironment(token:string){
        sessionStorage.setItem("token",token);
        sessionStorage.setItem("log", "1");
        this.registerService.getUser().subscribe( (d) => {
          console.log(d)
          this.registerService.setAdmin(d);
          
      });
        
    }

    getEnvironment():Environment{
        return {
          token:sessionStorage.getItem("token"),
          log:sessionStorage.getItem("log")
        }
      }

    setUser(response:JwtUserResponse){
      this.user = response;
    }

    removeUser(){
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("log");
      sessionStorage.removeItem("admin")
    }

    startLoginTimer(){
      console.log("in login")
      this.loginTimer = setInterval(()=>{
        //get new token
        //stop logout timer
        //after 15 min
        //logout timer starts when refresh happens
        this.refreshLogin().subscribe(d=>{
          if(d.token == "expired"){
            this.signOut()
          }else{
            this.setToken(d.token)
          }
        })
      },3 * 60 * 1000) //900000 //2 * 60 * 1000
    }

    startLogoutTimer(){
      console.log("in logout")
      this.logoutTimer = setTimeout(()=>{
        //if the timer hits sign them out
        this.signOut()
      },2 * 60 * 1000)
    }

    stopLogoutTimer(){
      console.log("stopped logout")
      clearTimeout(this.logoutTimer)
    }

    stopLoginTimer(){
      console.log("stopped login")
      clearInterval(this.loginTimer)
    }

    updateUserData(userData:string,choice:string):Observable<JwtUserResponse>{
      return this.http.post<JwtUserResponse>(this.serverUrl + "/api/v1/auth/updateUser", {userUpdate:userData,choice:choice})
    }
  }