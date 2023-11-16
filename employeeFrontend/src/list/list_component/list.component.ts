import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import { GroceryService } from 'src/global/grocery_items/grocery.service';
import { Branded } from '../models/Branded';
import { ListItem } from '../models/ListItem';
import { MatTable } from '@angular/material/table';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { ListService } from './list.service';
import { DatepickerService } from 'src/global/bootstrap-components/datepicker/datepicker.service';
import { ListToDB } from '../models/ListToDB';
import { Common } from '../models/Common';
import { Observable, of } from 'rxjs';
import { NavService } from 'src/global/nav/nav.service';
import { ListItemInterface } from '../models/ListItemInterface';


import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit{
  serverUrl = 'https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/our-websocket'
  title = 'WebSockets chat';
  stompClient;


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
  isActiveOrder:boolean
  hasCurrentOrder:boolean
  currentOrderList:ListItemInterface[]

  //lists
  todo:ListItemInterface[]
  breakfast:ListItemInterface[]
  bread:ListItemInterface[]
  pet:ListItemInterface[]
  produce:ListItemInterface[]
  beverages:ListItemInterface[]
  international:ListItemInterface[]
  baking:ListItemInterface[]
  grains:ListItemInterface[]
  snacks:ListItemInterface[]
  deli:ListItemInterface[]
  bakery:ListItemInterface[]
  meat:ListItemInterface[]
  household:ListItemInterface[]
  health:ListItemInterface[]
  frozen:ListItemInterface[]
  dairy:ListItemInterface[]
  completed:ListItemInterface[]

  stringArray:any[]=[]
  componentInstance = this;

  constructor(private service:GroceryService, private userService:EnvironmentService, private listService:ListService, private dateService:DatepickerService, private elem:ElementRef, private renderer:Renderer2, private navService:NavService){
    this.previousImage = elem.nativeElement
    this.initializeWebSocketConnection();
  }
  ngOnInit(): void {


    this.navService.cartVisibility$.subscribe(d=>{
      this.hasCurrentOrder = d.hasCurrentOrder;
    })

    this.navService.cartVisibility$.subscribe(d => {
      console.log(d)
      this.isActiveOrder = d.hasActive
      if(d.hasActive){
        this.listService.getActiveOrder().subscribe(d => {
          this.todo = d.todo
          this.deli = d.deli
          this.health = d.health
          this.dairy = d.dairy
          this.breakfast = d.breakfast
          this.international = d.international
          this.baking = d.baking;
          this.grains = d.grains
          this.snacks = d.snacks
          this.pet = d.pet
          this.household = d.household
          this.beverages = d.beverages
          this.bread = d.bread
          this.frozen = d.frozen
          this.meat = d.meat
          this.produce = d.produce
          this.bakery = d.bakery
          this.completed = d.completed
        })
      }else{
        this.listService.getUserList().subscribe(d=>this.currentOrderList = d.list)
      }
    })
    //this.listService.getUserHasOrder().subscribe(d=>console.log(d))

    //this.listService.getUserList().subscribe(d=>this.currentOrderList = d.list)
  }

  initializeWebSocketConnection(){

    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({token:this.userService.getEnvironment().token}, function(frame) {
  
      that.stompClient.subscribe("/user/topic/messages", function (message) {
        
        
        console.log(that.hasCurrentOrder + "      " + that.isActiveOrder)
        if(message.body == "true"){
          that.isActiveOrder = true;
              that.listService.getActiveOrder().subscribe(d => {
                that.todo = d.todo
                that.deli = d.deli
                that.health = d.health
                that.dairy = d.dairy
                that.breakfast = d.breakfast
                that.international = d.international
                that.baking = d.baking;
                that.grains = d.grains
                that.snacks = d.snacks
                that.pet = d.pet
                that.household = d.household
                that.beverages = d.beverages
                that.bread = d.bread
                that.frozen = d.frozen
                that.meat = d.meat
                that.produce = d.produce
                that.bakery = d.bakery
                that.completed = d.completed
              })
        }else if(message.body == "false"){
          that.isActiveOrder = false;
          that.hasCurrentOrder = false;
          that.navService.cartVisibility.next({hasActive:false,hasCurrentOrder:false})
          that.listService.getUserList().subscribe(d=>that.currentOrderList = d.list)
        }
    });
    });
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

  addToOrder(){
    if(this.isActiveOrder){
      //send to activeOrder order
      this.listService.addItemToActiveOrder(new ListItem(this.currentItem,this.currentQuantity,this.currentImage)).subscribe(d=>console.log(d))
    }else{
      //send to currentOrder
      this.listService.addItemToCurrentOrder(new ListItem(this.currentItem,this.currentQuantity,this.currentImage)).subscribe(d=>{
        this.currentOrderList = d
      })
    }
  }
}
