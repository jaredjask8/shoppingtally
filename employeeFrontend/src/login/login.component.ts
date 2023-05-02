import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/employee/Employee';
import { EmployeeService } from 'src/employee/employee.service';
import { LoginService } from './login.service';
import { User } from 'src/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  myForm: FormGroup; 
  employee: Employee
  loginActive:boolean = false;
  registerActive:boolean = false;
constructor(private fb: FormBuilder, private service:LoginService) { }

ngOnInit() {
  this.myForm = this.fb.group({
    email:'',
    password:'',
    firstname:'',
    lastname:'',
    role:''
  })
}

submit(firstname:string, lastname:string, email:string, password:string, role:string){
  //this.service.getUsers().subscribe(x => console.log(x));
  this.service.loginUser("bruce@gmail.com", "$2a$10$UZ714NywTiPGwFtu66B6T..Yc7q3fJY0HRreRCi0X96OwPAzS75S.").subscribe(x => console.log(x));
  //this.service.registerUser(new User(firstname,lastname,email,password,role)).subscribe(x => console.log(x))
}

}
