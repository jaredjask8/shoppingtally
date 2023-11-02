import { JsonPipe } from '@angular/common';
import { Component, AfterViewInit, ElementRef, Output, EventEmitter, OnInit, ViewChild, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct, NgbCalendar, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerService } from './datepicker.service';

@Component({
  selector: 'app-datepicker',
  standalone:true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements AfterViewInit, OnInit{
  @Output() newItemEvent = new EventEmitter<NgbDateStruct>();
  model: NgbDateStruct | any;
	date: { year: number; month: number};
  displayMonths;
	navigation = 'true';
	showWeekNumbers = false;
	outsideDays = 'visible';
  test:NodeListOf<Element>;
  mobileResolution:boolean;

  

  constructor(private calendar: NgbCalendar, private dateService:DatepickerService, private elem: ElementRef){
    
  }
  ngOnInit(): void {
    if(window.innerWidth <= 500){
      this.displayMonths = 1;
    }else{
      this.displayMonths = 2;
    }
    
  }


  ngAfterViewInit(){
    this.test=this.elem.nativeElement.querySelectorAll('.ngb-dp-day');
  }

  selectToday() {
		this.model = this.calendar.getToday();
	}

  setCurrentDate(){
    this.dateService.setDate(this.model);
    this.newItemEvent.emit(this.model);
  }

  onResize(event){
    if(event.target.innerWidth <= 500){
      this.displayMonths = 1;
    }else{
      this.displayMonths = 2;
    }
  }

  
}
