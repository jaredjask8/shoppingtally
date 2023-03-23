import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Employee } from './employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) {}
  
  getEmployeeList():Observable<Employee[]>{
	  return this.http.get<Employee[]>("http://shoppingtally-env-1.eba-52c26abg.us-east-1.elasticbeanstalk.com/employee/all");
  }
}
