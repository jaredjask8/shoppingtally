import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/employee/Employee';
import { EmployeeService } from 'src/employee/employee.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  myForm: FormGroup; 
  employee: Employee
constructor(private fb: FormBuilder, private service:EmployeeService) { }

ngOnInit() {
  this.myForm = this.fb.group({
    name:'',
    email:'',
    jobTitle:'',
    phone:'',
    imgUrl:''
  })
}

async submit(name:string, email:string, job:string, phone:string, img:string){
  this.service.getEmployees().subscribe(x => console.log(x));
  await this.service.postEmployees(new Employee(name, email,job,phone,img))
}

}
