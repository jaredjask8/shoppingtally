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
	  return this.http.get<Employee[]>("http://192.168.1.49:8080/shoppingtally-0.0.1-SNAPSHOT/employee/all");
  }
}
