import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Environment } from "./Environment";
import { JwtUserResponse } from "src/models/JwtUserResponse";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
  })
  export class EnvironmentService{
    email:string;
    user:JwtUserResponse;

    constructor(private http:HttpClient){

    }

    setLogin(){
      sessionStorage.setItem("log", "1");
    }

    getLogin(){
      return sessionStorage.getItem("log");
    }

    
    
    setEnvironment(token:string){
        sessionStorage.setItem("token",token);
        sessionStorage.setItem("log", "1");
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

    
  }