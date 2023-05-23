import { Component, ViewChild } from '@angular/core';
import { GroceryService } from 'src/global/grocery_items/grocery.service';
import { Branded } from './models/Branded';
import { ListItem } from './models/ListItem';
import { MatTable } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { ListService } from './list.service';
import { User } from 'src/models/User';
import { DatepickerService } from 'src/global/bootstrap-components/datepicker/datepicker.service';
import { Date } from './models/Date';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  list:ListItem[] = [];
  value:string;
  email:string;
  onScheduler:boolean=false;
  onList:boolean=true;
  onConfirm:boolean=false;
  brandedArray:Branded[]=[];
  currentItem:string;
  currentQuantity:string;
  @ViewChild(MatTable) table: MatTable<ListItem>;
  quantityArray:[
    1,2,3,4,5,6,7,8,9,10
  ]

  constructor(private service:GroceryService, private userService:EnvironmentService, private listService:ListService, private dateService:DatepickerService){
    
  }


  getItems(event){
    this.service.getItems(event.target.value).subscribe(d => this.brandedArray = d.branded)
    console.log(this.brandedArray)
  }

  setItemName(item){
    this.currentItem = item;
  }

  setQuantity(quantity){
    this.currentQuantity = quantity;
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

  sendDate(){
    var email = this.userService.getEnvironment();
    var date = this.dateService.getDate();
    this.listService.postDates(new Date(email, date.month, date.year, date.day)).subscribe(d => console.log(d))
    console.log("date sent")
  }

  getDates(){
    var email = this.userService.getEnvironment();
    this.listService.getDates(new User(email)).subscribe(d => console.log(d))
  }

  sendList(){
    console.log("list sent")
  }

}
