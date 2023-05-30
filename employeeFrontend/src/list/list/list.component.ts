import { Component, ViewChild } from '@angular/core';
import { GroceryService } from 'src/global/grocery_items/grocery.service';
import { Branded } from '../models/Branded';
import { ListItem } from '../models/ListItem';
import { MatTable } from '@angular/material/table';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { ListService } from './list.service';
import { DatepickerService } from 'src/global/bootstrap-components/datepicker/datepicker.service';
import { ListToDB } from '../models/ListToDB';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
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
  @ViewChild(MatTable) table: MatTable<ListItem>;
  quantityArray:[
    1,2,3,4,5,6,7,8,9,10
  ]

  constructor(private service:GroceryService, private userService:EnvironmentService, private listService:ListService, private dateService:DatepickerService){}


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
    this.listToDb.token = this.userService.getEnvironment();
    this.listService.postList(this.listToDb).subscribe(d=>console.log(d));
  }

  toDbList(item,index,length){
    console.log(length + "  " + index)
    if(length == index){
      this.listToDb.list+=item.name+"+"+item.quantity
    }else{
      this.listToDb.list+=item.name+"+"+item.quantity+",";
    }
  }

  addList(){
    let length = this.list.length-1;
    this.list.forEach((d,index) => this.toDbList(d,index,length))
    
  }

  addDate(){
    this.listToDb.date = this.dateService.getDateToDb();
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
