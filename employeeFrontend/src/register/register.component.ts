import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/employee/Employee';
import { EmployeeService } from 'src/employee/employee.service';
import { RegisterService } from './register.service';
import { User } from 'src/models/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  myForm: FormGroup; 
  employee: Employee
  loginActive:boolean = false;
  registerActive:boolean = false;
constructor(private fb: FormBuilder, private service:RegisterService) { }

ngOnInit() {
  
}

submit(email:string, firstname:string, lastname:string,  password:string){
  //this.service.testLogin("rocky@gmail.com", "test").subscribe(x => console.log(x));
  //this.service.loginUser().subscribe(x => console.log(x));
  this.service.registerUser(new User(email,firstname,lastname,password)).subscribe(x => console.log(x))
}

}
