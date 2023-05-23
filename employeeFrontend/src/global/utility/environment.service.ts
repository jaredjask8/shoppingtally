import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class EnvironmentService{
    email:string;
    
    setEnvironment(email:string){
        sessionStorage.setItem("email",email);
    }

    getEnvironment():string{
        return sessionStorage.getItem("email")
    }
  }