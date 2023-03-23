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
	  return this.http.get<Employee[]>("http://3.230.185.164/employee/all");
  }
}
