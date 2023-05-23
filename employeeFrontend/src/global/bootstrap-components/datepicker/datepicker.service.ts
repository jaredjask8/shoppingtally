import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DatepickerService {
  private currentDate:NgbDateStruct;
  constructor() { }

  setDate(date:NgbDateStruct){
    this.currentDate = date;
  }

  getDate(){
    return this.currentDate;
  }

}
