export class Date{
    email:string
    month:number;
    year:number;
    day:number;


    constructor(email:string,month:number,year:number,day:number){
        this.email = email;
        this.day = day;
        this.month = month;
        this.year = year;
    }
}