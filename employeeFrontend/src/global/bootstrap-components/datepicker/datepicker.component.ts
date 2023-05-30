import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerService } from './datepicker.service';

@Component({
  selector: 'app-datepicker',
  standalone:true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent {
  constructor(private calendar: NgbCalendar, private dateService:DatepickerService){}


  model: NgbDateStruct;
	date: { year: number; month: number};
  displayMonths = 2;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';

  selectToday() {
		this.model = this.calendar.getToday();
	}

  setCurrentDate(){
    this.dateService.setDate(this.model)
  }

  isDisabled(date: NgbDateStruct) {
    return date.day==13  && date.month == 1 || date.day==12 && date.month == 1;
  }
}
