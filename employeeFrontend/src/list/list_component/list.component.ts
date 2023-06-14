import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { GroceryService } from 'src/global/grocery_items/grocery.service';
import { Branded } from '../models/Branded';
import { ListItem } from '../models/ListItem';
import { MatTable } from '@angular/material/table';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { ListService } from './list.service';
import { DatepickerService } from 'src/global/bootstrap-components/datepicker/datepicker.service';
import { ListToDB } from '../models/ListToDB';
import { addItem} from '../state/list/list.actions';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit{
  list:ListItem[] = [];
  listToDb:ListToDB = new ListToDB;
  value:string;
  email:string;
  onScheduler:boolean=false;
  onList:boolean=true;
  onConfirm:boolean=false;
  brandedArray:Branded[]=[];
  currentItem:string;
  currentQuantity:string;
  currentDate:string="";
  //public fullList$ = this.store.select()
  @ViewChild(MatTable) table: MatTable<ListItem>;
  quantityArray:[
    1,2,3,4,5,6,7,8,9,10
  ]

  takenUserDates:string[]=[];
  dateSelected:boolean=false;
  selectedHour:string="";
  customItem="";
  

  constructor(private service:GroceryService, private userService:EnvironmentService, private listService:ListService, private dateService:DatepickerService, private elem:ElementRef, private elemBtn:ElementRef){}
  ngOnInit(): void {
    
  }

  
  getAllDates(){
    this.listService.getAllDates(this.userService.getEnvironment().token).subscribe(d => this.takenUserDates = d)
  }


  getItems(event){
    this.service.getItems(event.target.value).subscribe(d => this.brandedArray = d.branded);
  }

  setItemName(item){
    this.currentItem = item;
  }

  setQuantity(quantity){
    this.currentQuantity = quantity;
  }


  changeToScheduler(){
    this.onList =false
    this.onScheduler = true;
    console.log(this.userService.getEnvironment());
  }

  changeToConfirm(){
    this.onList =false
    this.onScheduler = false;
    this.onConfirm = true;
  }


  sendList(){
    this.listToDb.token = this.userService.getEnvironment().token;
    this.listService.postList(this.listToDb).subscribe(d=>console.log(d));
  }

  toDbList(item,index,length){
    if(length == index){
      this.listToDb.list+=item.name+"+"+item.quantity;
    }else{
      this.listToDb.list+=item.name+"+"+item.quantity+"~";
    }
  }

  addList(){
    let length = this.list.length-1;
    this.list.forEach((d,index) => this.toDbList(d,index,length))
    
  }

  addDate(){
    this.listToDb.date = this.dateService.getDateToDb();
    console.log(this.listToDb.date)
  }

  getDate(date:NgbDateStruct){
    this.currentDate = date.year + "-" + date.month + "-" + date.day;
    
    //console.log(this.takenUserDates)
    //get all hour elements and set them to init
    let hourArray:NodeList = this.elem.nativeElement.querySelectorAll('.hours');
    let unavailableHours:string[]=[];

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

  setHour(hour:number){
    this.dateSelected = true;
    this.selectedHour = hour >= 10 && hour <= 11 ? hour + "am" : hour + "pm";
    this.dateService.setHour(hour);
  }









  addToList(){
    var item = new ListItem(this.currentItem,this.currentQuantity)
    this.list.push(item)
    this.table.renderRows();
  }

  removeItem(name){
    this.list.forEach((element,index)=>{
      if(element.name == name) this.list.splice(index,1);
   });

   this.table.renderRows();
  }


}
