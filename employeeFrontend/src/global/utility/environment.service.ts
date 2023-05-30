import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class EnvironmentService{
    email:string;
    
    setEnvironment(token:string){
        sessionStorage.setItem("token",token);
    }

    getEnvironment():string{
        return sessionStorage.getItem("token")
    }
  }