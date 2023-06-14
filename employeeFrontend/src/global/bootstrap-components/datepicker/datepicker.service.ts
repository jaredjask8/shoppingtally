import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DatepickerService {
  private currentDate:NgbDateStruct;
  private currentHour:string;
  constructor() { }

  setDate(date:NgbDateStruct){
    this.currentDate = date;
  }

  getDateToDb():string{
    let year=this.currentDate.year;
    let month="";
    let day="";

    if(this.currentDate.month <= 9){
      month="0"+this.currentDate.month;
    }else{
      month=this.currentDate.month+"";
    }

    if(this.currentDate.day <= 9){
      day="0"+this.currentDate.day;
    }else{
      day=this.currentDate.day+"";
    }


    return year+"-"+month+"-"+day+"T"+this.currentHour;
  }

  getDateToObject(){
    return this.currentDate;
  }

  setHour(hour:number){
    this.currentHour = hour + ""
  }

}
