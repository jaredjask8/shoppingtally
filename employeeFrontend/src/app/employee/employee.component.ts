import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import { Employee } from './employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent{
	employees:Employee[];
	
	constructor(private employeeList:EmployeeService){}
	
	ngAfterViewInit(){
		this.employeeList.getEmployeeList().subscribe(x => console.log(x))
	}
}
