export class User{
    private email:string;
    private password:string;
    private firstname:string;
    private lastname:string;
    private role:string;
    private currentCart:string;

    constructor(email:string, firstname?:string,lastname?:string,password?:string){
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
    }


    

}