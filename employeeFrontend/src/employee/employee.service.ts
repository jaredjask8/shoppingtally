import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Employee} from './Employee';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }
  
  getEmployees():Observable<Employee[]>{
	  return this.http.get<Employee[]>(environment.apiUrl+"/api/employee/all");
  }

  postEmployees(employee:Employee):Observable<Employee>{
	  return this.http.post<Employee>(environment.apiUrl+"/api/employee/add", employee);
  }
}
