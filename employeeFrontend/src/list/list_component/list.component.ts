import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
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
import { Common } from '../models/Common';
import { GoogleImage } from '../models/GoogleImage';
import { Observable, of } from 'rxjs';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit{
  list:ListItem[] = [];
  listToDb:ListToDB = new ListToDB;
  value:string;
  email:string;
  onScheduler:boolean=false;
  onList:boolean=true;
  onConfirm:boolean=false;
  brandedArray:Observable<Branded[]>;
  commonArray:Common[]=[];
  googleImageArray:any;
  previousImage:any;
  currentItem:string='';
  currentQuantity:string='';
  currentImage:string;
  currentDate:string="";
  isSearchClicked:boolean=false
  //public fullList$ = this.store.select()
  @ViewChild(MatTable) table: MatTable<ListItem>;
  quantityArray:[
    1,2,3,4,5,6,7,8,9,10
  ]

  takenUserDates:string[]=[];
  dateSelected:boolean=false;
  selectedHour:string="";
  customItem="";
  editClicked:boolean=false;
  

  constructor(private service:GroceryService, private userService:EnvironmentService, private listService:ListService, private dateService:DatepickerService, private elem:ElementRef, private renderer:Renderer2){
    this.previousImage = elem.nativeElement
  }
  ngOnInit(): void {
    
  }


  getItems(){
    this.service.getItems(this.customItem).subscribe(d => {
      this.brandedArray = of(d.branded)
    });

    
  }

  getImages(){
    this.service.getImages(this.currentItem).subscribe(d => {
      this.googleImageArray = of(d.items)
      
    })
  }

  setItemName(item){
    this.currentItem = item;
  }

  setQuantity(quantity){
    this.currentQuantity = quantity;
  }


  addToList(){
    this.listService.addListItem(new ListItem(this.currentItem,this.currentQuantity,this.currentImage)).subscribe(d=>console.log(d))
    //this.list.push(item)
    //this.table.renderRows();
  }


  isItemClicked(){
    if(this.currentItem == ''){
      return false;
    }else{
      return true;
    }
  }

  isEditClicked(){
    if(this.editClicked == false){
      this.editClicked = true;
    }else{
      this.editClicked = false;
    }
  }

  isImageClicked(image:HTMLDivElement){
    this.renderer.setStyle(image.parentElement, 'backgroundColor','#2A246A')
    this.renderer.setStyle(this.previousImage.parentElement, 'backgroundColor', 'transparent')
    this.previousImage = image;
    this.currentImage = image.getAttribute("src")
    console.log(this.currentImage)
  }

  searchClick(){
    if(this.isSearchClicked == false){
      this.isSearchClicked = true
    }
  }

  emptyGoogleImageArray(){
    this.googleImageArray = null;
    this.currentImage = null
  }
}
