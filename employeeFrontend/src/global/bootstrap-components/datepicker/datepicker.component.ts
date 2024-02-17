import { JsonPipe } from '@angular/common';
import { Component, AfterViewInit, ElementRef, Output, EventEmitter, OnInit, ViewChild, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct, NgbCalendar, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DatepickerService } from './datepicker.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateComparison } from './DateComparison';

@Component({
  selector: 'app-datepicker',
  standalone:true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements AfterViewInit, OnInit{
  @Output() newItemEvent = new EventEmitter<DateComparison>();
  model: NgbDateStruct | any;
	date: { year: number; month: number};
  displayMonths;
	navigation = 'none';
	showWeekNumbers = false;
	outsideDays = 'visible';
  test:NodeListOf<Element>;
  mobileResolution:boolean;
  @ViewChild('test')yes:NgbDatepicker
  startDate:NgbDate

  constructor(private calendar: NgbCalendar, private dateService:DatepickerService, private elem: ElementRef, private dateNotification:MatSnackBar){
    this.startDate = this.calendar.getToday()
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


  setCurrentDate(){
    let selectedDate:NgbDate = this.model
    this.dateService.setDate(this.model);
    this.newItemEvent.emit(new DateComparison(selectedDate,this.startDate));
    
    
  }

  onResize(event){
    if(event.target.innerWidth <= 500){
      this.displayMonths = 1;
    }else{
      this.displayMonths = 2;
    }
  }

  
}
