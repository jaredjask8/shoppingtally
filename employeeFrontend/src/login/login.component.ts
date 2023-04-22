import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/employee/Employee';
import { EmployeeService } from 'src/employee/employee.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  myForm: FormGroup; 
  employee: Employee
constructor(private fb: FormBuilder, private service:LoginService) { }

ngOnInit() {
  this.myForm = this.fb.group({
    email:'',
    password:''
  })
}

submit(email:string, password:string){
  this.service.getUsers().subscribe(x => console.log(x));
  //this.service.postEmployees(new User(email,password)).subscribe(x => console.log(x))
}

}
