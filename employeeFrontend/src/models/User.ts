export class User{
    email:string;
    password:string;
    firstname:string;
    lastname:string;
    role:string;

    constructor(firstname:string,lastname:string,email:string,password:string,role:string){
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.role = role;
    }
}