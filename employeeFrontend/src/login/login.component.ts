import { Component } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { JwtUserResponse } from 'src/models/JwtUserResponse';
import { TokenResponse } from 'src/models/TokenResponse';
import { RegisterService } from 'src/register/register.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showBadCred: boolean;
  constructor(private service: EnvironmentService, private registerService:RegisterService){}
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl()
  token:string;

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  checkToken(token:string){
    if(token === "Bad credentials"){
    }else{
      this.service.setEnvironment(token);
      this.service.setLogin();

      this.registerService.getUser(this.service.getEnvironment().token).subscribe( (d) => {
        this.service.setUser(d);
        this.registerService.setAdmin(d);
      });
    }

  }

  setEnvironment(email:string,password:string){
    
    this.registerService.authLogin(email,password).subscribe(d => this.checkToken(d.token));
    
    
  }
}
