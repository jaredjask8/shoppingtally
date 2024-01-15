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

    constructor(private http:HttpClient, private navService:NavService, private profileService:ProfileService, private router:Router){
      this.userLoggedIn$ = this.userLoggedIn.asObservable();
      this.signOutSnackbar$ = this.signOutSnackbar.asObservable();
    }

    setLogin(){
      sessionStorage.setItem("log", "1");
    }

    getLogin(){
      return sessionStorage.getItem("log");
    }

    signOut():Observable<TokenResponse>{
      let token = this.getEnvironment().token
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
      return this.http.get<TokenResponse>(this.serverUrl + "/api/v1/auth/signOut",{headers:headers});
    }

    refreshLogin():Observable<TokenResponse>{
      return this.http.get<TokenResponse>(this.serverUrl + "/api/v1/auth/refresh")
    }

    setToken(token:string){
      sessionStorage.setItem("token",token);
    }
    
    setEnvironment(token:string){
        sessionStorage.setItem("token",token);
        sessionStorage.setItem("log", "1");
        window.location.reload()
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

    getUser(){
      return this.user;
    }

    removeUser(){
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("log");
    }

    startLoginTimer(){
      this.loginTimer = setInterval(()=>{
        this.refreshLogin().subscribe(d=>this.setEnvironment(d.token))
        console.log(this.getEnvironment().token)
        this.stopLogoutTimer()
      },15000) //900000
    }

    startLogoutTimer(){
      this.logoutTimer = setTimeout(()=>{
        //if the timer hits sign them out
        this.signOut().subscribe({
          complete:()=>{
            this.navService.cartVisibilityFromUser.next(false)
            this.profileService.setSignOut(true);
            this.removeUser();
            this.navService.cartCount.next("");
            this.userLoggedIn.next(false)
            this.stopLoginTimer()
            this.router.navigate(['/','home']);
            this.signOutSnackbar.next(true)
          }
        })
      },10000) //700000
    }

    stopLogoutTimer(){
      clearTimeout(this.logoutTimer)
    }

    stopLoginTimer(){
      clearInterval(this.loginTimer)
    }

    updateUserData(userData:string,choice:string):Observable<JwtUserResponse>{
      return this.http.post<JwtUserResponse>(this.serverUrl + "/api/v1/auth/updateUser", {userUpdate:userData,choice:choice})
    }
  }