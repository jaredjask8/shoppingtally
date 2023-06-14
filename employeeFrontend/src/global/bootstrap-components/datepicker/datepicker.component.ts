import { JsonPipe } from '@angular/common';
import { Component, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
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
export class DatepickerComponent implements AfterViewInit{
  @Output() newItemEvent = new EventEmitter<NgbDateStruct>();

  constructor(private calendar: NgbCalendar, private dateService:DatepickerService, private elem: ElementRef){
    
  }


  ngAfterViewInit(){
    this.test=this.elem.nativeElement.querySelectorAll('.ngb-dp-day');
    
  }


  model: NgbDateStruct;
	date: { year: number; month: number};
  displayMonths = 2;
	navigation = 'none';
	showWeekNumbers = false;
	outsideDays = 'visible';
  test:NodeListOf<Element>;

  selectToday() {
		this.model = this.calendar.getToday();
	}

  setCurrentDate(){
    this.dateService.setDate(this.model);
    this.newItemEvent.emit(this.model);
  }

  


}
