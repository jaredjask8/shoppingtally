import { Component } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { EnvironmentService } from 'src/global/utility/environment.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private service: EnvironmentService){}
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  setEnvironment(email:string){
    this.service.setEnvironment(email);
  }
}
