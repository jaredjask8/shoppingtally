import {AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { NavService } from 'src/global/nav/nav.service';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from 'src/list/list_component/list.service';
import { DatepickerService } from 'src/global/bootstrap-components/datepicker/datepicker.service';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { MatPaginator } from '@angular/material/paginator';
import { ListToDB } from 'src/list/models/ListToDB';
import { ListItem } from 'src/list/models/ListItem';
import { Observable } from 'rxjs';
import { DatepickerComponent } from 'src/global/bootstrap-components/datepicker/datepicker.component';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import * as confetti from 'canvas-confetti';
import { MatRippleModule } from '@angular/material/core';

/**
 * @title Stepper overview
 */
@Component({
  selector: 'stepper-component',
  templateUrl: 'stepper.component.html',
  styleUrls: ['stepper.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDividerModule,
    DatepickerComponent,
    CommonModule,
    MatIconModule,
    MatRippleModule
  ],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class StepperComponent implements OnInit, AfterViewInit{

  @ViewChild("content") content;
  list:Observable<ListItem[]>;
  dataSource = new MatTableDataSource<ListItem>(this.listService.list.value);
  listToDb:ListToDB = new ListToDB;
  


  //STEPPER STATE
  cartHasItems:Observable<boolean>
  showStepper:boolean=true
  canvas = this.renderer2.createElement('canvas');
  


  //STEPPER 2
  currentDate:string="";
  takenUserDates:string[]=[];
  dateSelected:boolean=false;
  selectedHour:string="";
  previousHourSelected:any;

  @ViewChild('we')we:ElementRef


  constructor(private listService:ListService, private elem:ElementRef, private dateService:DatepickerService, private userService:EnvironmentService, private renderer2: Renderer2){
    
  }
  ngAfterViewInit(): void {
    console.log(this.we)
    this.previousHourSelected = this.we.nativeElement;
  }
  
  
  ngOnInit(): void {
    this.cartHasItems = this.listService.cartHasItems$;
    this.list = this.listService.list$;
    this.list.subscribe(d => {
      console.log(d)
    })
    
  }

  //STEPPER 1
  addList(){
    //let length = this.list.length-1;
    this.list.subscribe((d) => {
      let length = d.length - 1

      d.forEach((item,index) => {
        if(length == index){
          this.listToDb.list+=item.name+"+"+item.quantity;
        }else{
          this.listToDb.list+=item.name+"+"+item.quantity+"~";
        }
      })
    }) 
    
  }

  removeItem(name){
    this.listService.removeListItem(name);
  }



  //STEPPER 2
  getDate(date:NgbDateStruct){
    this.currentDate = date.year + "-" + date.month + "-" + date.day;
    
    //console.log(this.takenUserDates)
    //get all hour elements and set them to init
    let hourArray:NodeList = this.elem.nativeElement.querySelectorAll('.hours');
    let unavailableHours:string[]=[];
    console.log(hourArray)
    for(let i = 0; i < hourArray.length;i++){
      hourArray[i].firstChild.parentElement.style.opacity="1"
      hourArray[i].firstChild.parentElement.style.pointerEvents="auto"
      //hourArray[i].parentElement.setAttribute("disabled","false")
      //hourArray[i].parentElement.style.opacity="1"
    }
    
    //format the date to string to match the substring of the hour in the dates
    let dateForDbFormat = this.dateService.getDateToDb();
    this.takenUserDates.forEach(d => {
      if(d.substring(0,10) == dateForDbFormat.substring(0,10)){
        //matched hours to selected date
        //push to matched hours to new array
        unavailableHours.push(d.substring(d.indexOf('T')+1))
      }
    })
    //console.log(unavailableHours)
    //console.log(hourArray)
    console.log(unavailableHours)
    //loop through the elements and the unavailable hours
    //if the elements text matches to an unavailable hour disable the element and set low opacity
    for(let i = 0; i < hourArray.length;i++){
      for(let k = 0; k < unavailableHours.length;k++){
        if(hourArray[i].firstChild.textContent.includes(unavailableHours[k])){
          //hourArray[i].parentElement.setAttribute("disabled","true");
          //hourArray[i].parentElement.style.opacity=".3"
          hourArray[i].firstChild.parentElement.style.opacity=".3"
          hourArray[i].firstChild.parentElement.style.pointerEvents="none"
        }
      }
    
    }
  }

  isDatePicked(){
    if(this.currentDate.length > 0){
      return true;
    }else{
      return false;
    }
  }

  setHour(hour:number,hourInstance:any){
    this.renderer2.setStyle(hourInstance,'opacity','.5')
    this.renderer2.setStyle(this.previousHourSelected,'opacity','1')
    this.previousHourSelected = hourInstance
    
    
    
    
    this.dateSelected = true;
    this.selectedHour = hour >= 10 && hour <= 11 ? hour + "am" : hour + "pm";
    this.dateService.setHour(hour);
    
  }

  addDate(){
    this.listToDb.date = this.dateService.getDateToDb();
    console.log(this.listToDb.date)
    console.log(this.listToDb)
  }

  getAllDates(){
    this.listService.getAllDates(this.userService.getEnvironment().token).subscribe(d => {
      this.takenUserDates = d;
      console.log(d)
    })
  }

  dateIsSelected(){
    if(this.selectedHour == ""){
      return true;
    }else{
      return false;
    }
  }


  //STEPPER 3
  sendList(){
    this.listToDb.token = this.userService.getEnvironment().token;
    this.listService.postList(this.listToDb).subscribe(d=>console.log(d));
  }


  test(){
    this.renderer2.setStyle(this.we.nativeElement,'display','initial')
    this.renderer2.setStyle(this.canvas,'width','100%')
    this.renderer2.setStyle(this.canvas,'height','500px')

    this.renderer2.appendChild(this.we.nativeElement, this.canvas);
 
    const myConfetti = confetti.create(this.canvas, {
      resize: true // will fit all screen sizes
    });

    this.showStepper = false
    setTimeout(() => {
      myConfetti();
    },500)

    setTimeout(() => {
      this.showStepper = true
      this.renderer2.setStyle(this.we.nativeElement,'display','none')
      this.listService.resetStepper()
    },4000)


 
    
 
  }
 
}
