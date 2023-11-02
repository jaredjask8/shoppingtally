export class User{
    private email:string;
    private password:string;
    private firstname:string;
    private lastname:string;
    private role:string;
    private currentCart:string;
    private phone:string;
    private address:string;

    constructor(email:string, firstname?:string,lastname?:string,password?:string,phone?:string,address?:string){
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
        this.address = address;
        this.phone = phone;
    }


    

}