import {AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {MatButton, MatButtonModule} from '@angular/material/button';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { NavService } from 'src/global/nav/nav.service';
import { NgbDateStruct, NgbDatepicker, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import * as confetti from 'canvas-confetti';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { EditListComponent } from 'src/global/bootstrap-components/edit-list/edit-list.component';
import { List } from 'src/list/models/List';
import { Router } from '@angular/router';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { UserOrderInfo } from 'src/list/models/UserOrderInfo';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatRippleModule,
    MatBottomSheetModule,
    EditListComponent,
    MatButtonToggleModule,
    CdkDropList,
    CdkDrag,
    MatSnackBarModule
  ],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class StepperComponent implements OnInit, AfterViewInit{

  @ViewChild("content") content;
  @ViewChild('hourContainer')hoursContainer:ElementRef;
  list$:Observable<ListItem[]>;
  yes:ListItem[];
  dataSource = new MatTableDataSource<ListItem>(this.listService.list.value);
  listToDb:ListToDB = new ListToDB;
  listArray:ListItem[];
  newList:string='';


  //STEPPER STATE
  cartHasItems:Observable<boolean>
  showStepper:boolean=true
  canvas = this.renderer2.createElement('canvas');
  _itemIsClicked=false;


  //STEPPER 2
  previousShopper:string=''


  //STEPPER 3
  currentDate:string="";
  takenUserDates:string[]=[];
  dateSelected:boolean=false;
  selectedHour:string="";
  previousHourSelected:any;
  isShopperPicked:boolean=false;
  currentShopper:string="";
  datePickedFromCalendar:boolean=false
  hourInstance;

  stepCounter:number=0
  resetDatePicker:boolean=false
  currentSelectedDate:NgbDateStruct


  @ViewChild('we')we:ElementRef


  constructor(private listService:ListService, private elem:ElementRef, private dateService:DatepickerService, private userService:EnvironmentService, private renderer2: Renderer2, private router:Router, private datePickerComponent:ViewContainerRef, private navService:NavService, private dateNotification: MatSnackBar){
    
  }
  ngAfterViewInit(): void {
    this.previousHourSelected = this.we.nativeElement;
  }

  
  
  ngOnInit(): void {
    this.cartHasItems = this.listService.cartHasItems$;
    // this.list$ = this.listService.list$;
    // this.list$.subscribe(d => {
    //   this.listArray = d
    // })

    this.listService.getCurrentList().subscribe(d => {
      this.yes = d.list
      this.doesListHaveItems(d.itemCount);
    });
    
    this.stepCounter = 1;

    console.log(this.router.url)
  }


  increaseStepCounter(){
    this.stepCounter++;
  }

  decreaseStepCounter(){
    this.stepCounter--;
    console.log(this.stepCounter)
  }

  resetStepCounter(){
    this.stepCounter = 1;
    console.log(this.stepCounter)
  }

  doesListHaveItems(itemCount:number){
    itemCount == 0 ? this.listService.cartHasItems.next(false) : this.listService.cartHasItems.next(true);
  }

  //STEPPER 1
  addList(){
    this.yes.forEach((item)=>{
      this.listToDb.list+=item.image+"+"+item.name+"+"+item.quantity+"~";

    }) 

  }

  removeItem(itemName:string){
    var tempArray = this.yes.filter(d=>d.name != itemName);
    var tempList:string='';
    for(var i = 0; i<tempArray.length;i++){
      tempList+=tempArray[i].image+"+"+tempArray[i].name+"+"+tempArray[i].quantity+"~";
    }


    
    this.listService.removeListItem(tempList).subscribe(d=>{
      this.yes = d.list
      this.doesListHaveItems(d.itemCount);
      this.navService.cartCount.next(d.itemCount.toString())
    });
  }

  decreaseQuantity(itemName,itemQuantity){
    if(itemQuantity != 1){
      this.listService.decreaseQuantity(this.yes,itemName).subscribe(d=>{
        this.yes = d.list
      })
    }

    
  }

  increaseQuantity(itemName){
    //take current list 
    //find item we are changing 
    //change string to update quantity
    //post updated string to api
    console.log(this.yes)
    this.listService.increaseQuantity(this.yes,itemName).subscribe(d=>{
      this.yes = d.list
      console.log(this.yes)   
  })


    //this.listService.increaseQuantity(itemName)
  }



  //STEPPER 2
  getDate(date:NgbDateStruct){
    this.previousHourSelected = this.we.nativeElement;
    this.dateSelected = false
    this.datePickedFromCalendar = true;
    this.currentSelectedDate = date
    this.currentDate = date.year + "-" + date.month + "-" + date.day;
    //means date is clicked
    //unhide hours
    this.renderer2.removeClass(this.hoursContainer.nativeElement,'container')
    //get all hour elements and set them to init
    let hourArray:NodeList = this.elem.nativeElement.querySelectorAll('.hours');
    let unavailableHours:string[]=[];
    //console.log(hourArray)
    for(let i = 0; i < hourArray.length;i++){
      hourArray[i].firstChild.parentElement.style.opacity="1"
      hourArray[i].firstChild.parentElement.style.pointerEvents="auto"
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
    

    //loop through the elements and the unavailable hours
    //if the elements text matches to an unavailable hour disable the element and set low opacity
    for(let i = 0; i < hourArray.length;i++){
      for(let k = 0; k < unavailableHours.length;k++){
        if(hourArray[i].firstChild.textContent.substring(0,hourArray[i].firstChild.textContent.indexOf('p')) == unavailableHours[k]){
          hourArray[i].firstChild.parentElement.style.opacity=".3"
          hourArray[i].firstChild.parentElement.style.pointerEvents="none"
        }else if((hourArray[i].firstChild.textContent.substring(0,hourArray[i].firstChild.textContent.indexOf('a')) == unavailableHours[k])){
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
    if(hourInstance != this.previousHourSelected){
      this.renderer2.setStyle(hourInstance,'opacity','.5')
      this.renderer2.setStyle(this.previousHourSelected,'opacity','1')
      this.previousHourSelected = hourInstance
    }
    
    
    this.dateSelected = true;
    this.selectedHour = hour >= 10 && hour <= 11 ? hour + "am" : hour + "pm";
    this.dateService.setHour(hour);
    
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.yes, event.previousIndex, event.currentIndex);
  }

  addDate(stepper:MatStepper){
    //called when moving into finalize state of form
    //~steps~
    //call to get all shopper dates before setting data
    if(this.currentShopper == "Jay"){
      this.listService.getShopperDates(this.userService.getEnvironment().token, 1).subscribe(d => {
        if(d.find(dates=>dates==this.dateService.getDateToDb())){
          this.takenUserDates = d
          this.getDate(this.currentSelectedDate)
          this.dateNotification.open("Date has been taken, retry", "X", {"duration": 2000,panelClass: 'date-snackbar'})
          stepper.previous()
        }else{
          this.listToDb.date = this.dateService.getDateToDb();
          stepper.next()
        }
      })
      
    }else{
      this.listService.getShopperDates(this.userService.getEnvironment().token, 2).subscribe(d => {
        if(d.find(dates=>dates==this.dateService.getDateToDb())){
          this.takenUserDates = d
          this.getDate(this.currentSelectedDate)
          this.dateNotification.open("Date has been taken, retry", "X", {"duration": 2000,panelClass: 'date-snackbar'})
          stepper.previous()
        }else{
          this.listToDb.date = this.dateService.getDateToDb();
          stepper.next()
        }
      })
    }
    //console.log(this.listToDb.date)
    //console.log(this.listToDb)
  }

  getShopperDates(shopperId){
    this.listService.getShopperDates(this.userService.getEnvironment().token, shopperId).subscribe(d => {
      this.takenUserDates = d;
    })
  }

  dateIsSelected(){
    console.log(this.yes)
    if(this.selectedHour == ""){
      return true;
    }else{
      return false;
    }
    
  }

  //if shopper is different from previous and clicked reset the date with this.model

  shopperPicked(index){
    if(index == 1){
      this.currentShopper = "Jay"
      this.listToDb.shopperId = 1
    }else{
      this.currentShopper = "Josh"
      this.listToDb.shopperId = 2
    }

    this.isShopperPicked = true;
    
    
  }

  resetHours(){
    let hourArray:NodeList = this.elem.nativeElement.querySelectorAll('.hours');
    hourArray.forEach(d => {
      d.firstChild.parentElement.style.opacity="1"
      d.firstChild.parentElement.style.pointerEvents="none"
    })

    this.isShopperPicked = false
    this.currentDate = ''
    this.selectedHour = ''
    this.dateSelected=false
    this.renderer2.addClass(this.hoursContainer.nativeElement,'container')
  }


  //STEPPER 3
  sendList(){
    this.listToDb.token = this.userService.getEnvironment().token;
    this.listService.postList(this.listToDb).subscribe(d=>this.yes = d.list);
  }


  test(){
    this.navService.cartVisibility.next(new UserOrderInfo(false,true))

    this.renderer2.setStyle(this.we.nativeElement,'display','initial')
    this.renderer2.setStyle(this.canvas,'width','100%')
    this.renderer2.setStyle(this.canvas,'height','500px')
    let container = this.renderer2.createElement('div')
    let title = this.renderer2.createElement('h1')
    let statement = this.renderer2.createElement('h3')

    this.renderer2.setProperty(title,'innerHTML', 'Woo-hoo!')
    this.renderer2.setProperty(statement,'innerHTML','Your order has been placed!')
    
    this.renderer2.addClass(title, 'confettiTitle')
    this.renderer2.addClass(container,'confettiTextContainer')

    this.renderer2.appendChild(container,title)
    this.renderer2.appendChild(container,statement)

    this.renderer2.appendChild(this.we.nativeElement, this.canvas);
    this.renderer2.appendChild(this.we.nativeElement, container)
    
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
      this.router.navigateByUrl("/home")
      this.listService.modalAfterOrderCreated.next(true)
      // if(this.router.url == "/list"){
      //   //send observable
      //   this.listService.updateOrderScreen.next(true)
      // }
    },4000)


 
    
 
  }

  itemIsClicked(image,name,quantity){
    if(this._itemIsClicked == false){
      this._itemIsClicked = true;
    }else{
      this._itemIsClicked = false;
    }

    console.log(image)
  }

 
}
