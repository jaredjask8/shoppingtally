import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Employee} from './Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }
  
  getEmployees():Observable<Employee[]>{
	  return this.http.get<Employee[]>("http://shoppingtally.click/api/employee/all");
  }

  postEmployees(employee:Employee):Observable<Employee>{
	  return this.http.post<Employee>("http://shoppingtally.click/api/employee/add", employee);
  }
}
