export class Employee {
	id:number;
	name:string;
	email:string;
	jobTitle:string;
	phone:string;
	imgUrl:string;
	employeeCode:string;


	constructor(name,email,job,phone,img){
		this.name = name;
		this.email = email;
		this.jobTitle = job;
		this.phone = phone;
		this.imgUrl = img;
	}
}
