import { Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewEncapsulation, inject } from '@angular/core';
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
import { CurrentOrderComponent } from 'src/admin/orders/current-order/current-order.component';
import { CurrentOrderUserClass } from '../models/CurrentOrderUserClass';
import { CurrentOrderUser } from '../models/CurrentOrderUser';
import { CurrentOrderUserClassWithUpdateMessage } from '../models/CurrentOrderUserClassWithUpdateMessage';
import {MatSnackBar} from '@angular/material/snack-bar';
import { NgbCollapseModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { AffiliateData } from 'src/admin/affiliate/models/AffiliateData';
import { AffiliateService } from 'src/admin/affiliate/affiliate.service';
import { environment } from '../../environments/environment';
import { UserOrderInfo } from '../models/UserOrderInfo';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  
})
export class ListComponent implements OnInit, OnDestroy {
  //socket
  //"http://localhost/test/our-websocket"
  //"https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/our-websocket"
  serverUrl = environment.socketUrl+"/our-websocket"
  title = 'WebSockets chat';
  stompClient;

  itemFormControl = new FormControl('')

  //cancel order
  private cancelOrderModal = inject(NgbModal);
  cancelFromItem:boolean=false
  cancelFromUser:boolean=false

  rippleColor:string="#f7f603"

  list: ListItem[] = [];
  listToDb: ListToDB = new ListToDB;
  value: string;
  email: string;
  onScheduler: boolean = false;
  onList: boolean = true;
  onConfirm: boolean = false;
  brandedArray: Observable<Branded[]>;
  commonArray: Common[] = [];
  googleImageArray: any;
  previousImage: any;
  currentItem: string = '';
  currentQuantity: string = '';
  currentImage: string = "";
  currentDate: string = "";
  isSearchClicked: boolean = false
  currentOrderDate: string;
  //public fullList$ = this.store.select()
  @ViewChild(MatTable) table: MatTable<ListItem>;
  quantityArray: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ]

  takenUserDates: string[] = [];
  dateSelected: boolean = false;
  selectedHour: string = "";
  customItem = "";
  editClicked: boolean = false;
  isActiveOrder: boolean
  hasCurrentOrder: boolean
  currentOrderList: ListItemInterface[]
  cart:ListItemInterface[]
  //lists
  todo: ListItemInterface[]
  breakfast: ListItemInterface[]
  bread: ListItemInterface[]
  pet: ListItemInterface[]
  produce: ListItemInterface[]
  beverages: ListItemInterface[]
  international: ListItemInterface[]
  baking: ListItemInterface[]
  grains: ListItemInterface[]
  snacks: ListItemInterface[]
  deli: ListItemInterface[]
  bakery: ListItemInterface[]
  meat: ListItemInterface[]
  household: ListItemInterface[]
  health: ListItemInterface[]
  frozen: ListItemInterface[]
  dairy: ListItemInterface[]
  completed: ListItemInterface[]

  stringArray: any[] = []
  componentInstance = this;
  isItemValid:boolean = false;
  

  affiliateDataArray:AffiliateData[] = []
  fullAffiliateDataArray:AffiliateData[]=[]

  constructor(private service: GroceryService, private userService: EnvironmentService, private listService: ListService, private dateService: DatepickerService, private elem: ElementRef, private renderer: Renderer2, private navService: NavService,private snackBar: MatSnackBar, private affiliateService :AffiliateService) {
    this.previousImage = elem.nativeElement
    this.initializeWebSocketConnection();
  }
  ngOnInit(): void {

    let that = this
    //oninit call get order status
    this.listService.getUserHasOrder().subscribe(d => {
      this.navService.cartVisibility.next(new UserOrderInfo(d.hasActive,d.hasCurrentOrder))
    })
    this.listService.updateOrderScreen$.subscribe(d=>{
      if(d){
        // this.affiliateService.getAffiliateData().subscribe(j=>{
        //   if(j.length){
        //     that.fullAffiliateDataArray = that.affiliateDataArray.concat(j)
        //   }
        // })
        this.listService.getUserList().subscribe(e=>{
          this.currentOrderList = e.list
          this.currentOrderDate = e.date
          // if(e.affiliateData.length){
          //   that.fullAffiliateDataArray = that.affiliateDataArray.concat(e.affiliateData)
          //   console.log("in")
          // }
          
        })
      }
    })

    this.navService.cartVisibility$.subscribe(d => {
      this.hasCurrentOrder = d.hasCurrentOrder;
    })

    this.navService.cartVisibility$.subscribe(d => {
      this.isActiveOrder = d.hasActive
      if(!d.hasActive && !d.hasCurrentOrder){
        //get cart
        this.listService.getCurrentList().subscribe(e=>{
          this.cart = e.list
        })
      }else if(d.hasCurrentOrder && !d.hasActive){
        
        //get current order
        //when page loads check for order status
        this.listService.getUserList().subscribe(e => {
          this.currentOrderList = e.list
          this.currentOrderDate = e.date;
          if(e.affiliateData.length){
            this.affiliateDataArray = e.affiliateData
          }
          this.affiliateService.getAffiliateData().subscribe(j=>{
            if(j.length){
              this.fullAffiliateDataArray = this.affiliateDataArray.concat(j)
            }
            
          })
        })
      }else{
        //get active order
        this.listService.getActiveOrder().subscribe(e => {
          this.todo = e.todo
          this.deli = e.deli
          this.health = e.health
          this.dairy = e.dairy
          this.breakfast = e.breakfast
          this.international = e.international
          this.baking = e.baking;
          this.grains = e.grains
          this.snacks = e.snacks
          this.pet = e.pet
          this.household = e.household
          this.beverages = e.beverages
          this.bread = e.bread
          this.frozen = e.frozen
          this.meat = e.meat
          this.produce = e.produce
          this.bakery = e.bakery
          this.completed = e.completed
          this.currentOrderDate = e.date
        })
        this.navService.cartCount.next("0");
      }
    })
    //this.listService.getUserHasOrder().subscribe(d=>console.log(d))

    //this.listService.getUserList().subscribe(d=>this.currentOrderList = d.list)
    
  }

  ngOnDestroy() {
    this.stompClient.disconnect(function () {
      
    });
  }

  initializeWebSocketConnection() {

    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    //this.stompClient.debug = null;
    this.stompClient.connect({ token: this.userService.getEnvironment().token }, function (frame) {
      that.stompClient.subscribe("/user/topic/messages", function (message) {
        if (message.body == "true") {
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
        } else if (message.body == "false") {
          that.isActiveOrder = false;
          that.hasCurrentOrder = false;
          that.navService.cartVisibility.next({ hasActive: false, hasCurrentOrder: false })
          that.listService.getUserList().subscribe(d => that.currentOrderList = d.list)
        }


      });

      that.stompClient.subscribe("/user/topic/activeOrder", function (message) {
        let activeOrderUpdate: CurrentOrderUser = JSON.parse(message.body)
        that.todo = activeOrderUpdate.todo
        that.deli = activeOrderUpdate.deli
        that.health = activeOrderUpdate.health
        that.dairy = activeOrderUpdate.dairy
        that.breakfast = activeOrderUpdate.breakfast
        that.international = activeOrderUpdate.international
        that.baking = activeOrderUpdate.baking
        that.grains = activeOrderUpdate.grains
        that.snacks = activeOrderUpdate.snacks
        that.pet = activeOrderUpdate.pet
        that.household = activeOrderUpdate.household
        that.beverages = activeOrderUpdate.beverages
        that.bread = activeOrderUpdate.bread
        that.frozen = activeOrderUpdate.frozen
        that.meat = activeOrderUpdate.meat
        that.produce = activeOrderUpdate.produce
        that.bakery = activeOrderUpdate.bakery
        that.completed = activeOrderUpdate.completed
      })
      that.stompClient.subscribe("/user/topic/affiliate", function (message) {
        that.fullAffiliateDataArray = that.affiliateDataArray.concat(JSON.parse(message.body))
      })


    }, function(message){
      console.log(message)
    });

    
  }

  sendActiveOrderMessage(updateMessage:string) {
    this.stompClient.send('/ws/test', {}, JSON.stringify(new CurrentOrderUserClassWithUpdateMessage(
      this.userService.getEnvironment().token,
      this.currentOrderDate,
      updateMessage,
      this.todo,
      this.breakfast,
      this.bread,
      this.pet,
      this.produce,
      this.beverages,
      this.international,
      this.baking,
      this.grains,
      this.snacks,
      this.deli,
      this.bakery,
      this.meat,
      this.household,
      this.health,
      this.frozen,
      this.dairy,
      this.completed
    )))
  }
  

  cancelProcess(content: TemplateRef<any>,choice:string){
    this.cancelOrderModal.open(content).result.then(
      (result) => {
        if(result == "cancel"){
          //if modal returns exit
          //then delete the order
          this.listService.cancelCurrentOrder().subscribe(d => {
            this.navService.cartVisibility.next(d)
            this.navService.getCartCount().subscribe(d=>{
              this.navService.cartCount.next(d)
            })
          })
        }else{
          if(choice == "user"){
            this.cancelFromUser = false
          }else{
            this.cancelFromItem = false
          }
        }
      })
  }

  cancelOrder(content: TemplateRef<any>){
    this.cancelFromUser = true
    this.cancelProcess(content,"user")
  }

  deleteCurrentOrderItem(item: ListItem, content: TemplateRef<any>) {
    //check if last item in order before deleting
    //if last prompt shown to cancel order
    //else continue
    if(this.currentOrderList.length == 1){
      this.cancelFromItem = true
      //modal for prompt to cancel order
      this.cancelProcess(content,"item")
    }else{
      this.listService.deleteCurrentOrderItem(item).subscribe(d => this.currentOrderList = d)
    }
    
  }

  getImages(item:string) {
    this.service.getImages(item).subscribe(d => {
      this.googleImageArray = of(d.items)

    })
  }

  setItemName(item:string) {
      if(this.checkItemValidity(item)){
        this.isItemValid = true;
        this.currentItem = item;
      }else{
        //hide button and display message
        
        this.isItemValid = false;
        this.snackBar.open("Item already in current order","",{duration:1000})
      }
  }

  setQuantity(quantity) {
    this.currentQuantity = quantity;
  }


  addToList() {
    this.listService.addListItem(new ListItem(this.currentItem, this.currentQuantity, this.currentImage)).subscribe(d => {
      this.cart = d.list
      let count = d.itemCount.toString()
      this.navService.cartCount.next(count);
    })
    
    this.snackBar.open("Item added","",{duration:1000})
    //this.list.push(item)
    //this.table.renderRows();
    this.resetItem()
  }

  resetItem(){
    this.currentItem = "";
    //this.currentQuantity = "";
    this.googleImageArray = null;
    this.isItemValid = false;
    this.itemFormControl.reset()
  }


  isItemClicked() {
    if (this.currentItem == '') {
      return false;
    } else {
      return true;
    }
  }

  isEditClicked() {
    if (this.editClicked == false) {
      this.editClicked = true;
    } else {
      this.editClicked = false;
    }
  }

  isImageClicked(image: HTMLDivElement) {
    this.renderer.setStyle(image.parentElement, 'backgroundColor', '#2A246A')
    this.renderer.setStyle(this.previousImage.parentElement, 'backgroundColor', 'transparent')
    this.previousImage = image;
    this.currentImage = image.getAttribute("src")
    console.log(this.currentImage)
  }

  

  addToOrder() {
    if (this.isActiveOrder) {
      //send to activeOrder order
      this.listService.addItemToActiveOrder(new ListItem(this.currentItem, this.currentQuantity, this.currentImage)).subscribe(d => {
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

      let newItem:ListItem = new ListItem(this.currentItem,this.currentQuantity,this.currentImage);
      this.updateActiveOrderFrontend('todo',newItem,'added');
      this.snackBar.open("Item added","",{panelClass:"light-blue-backdrop",duration:2000})
    } else {
      //send to currentOrder
      this.listService.addItemToCurrentOrder(new ListItem(this.currentItem, this.currentQuantity, this.currentImage)).subscribe(d => {
        this.currentOrderList = d
      })
      this.snackBar.open("Item added","",{panelClass:"light-blue-backdrop",duration:2000})
    }

    this.resetItem()
  }

  updateQuantity(update:boolean, listType:string, item:ListItemInterface, category?:string){
    console.log(update + "   " + listType)
    if(listType == "current"){
      update ? this.increaseCurrentOrderQuantity(item) : this.decreaseCurrentOrderQuantity(item)
    }else{
      update ? this.increaseActiveOrderQuantity(item,category,'increased') : this.decreaseActiveOrderQuantity(item,category,'decreased')
    }

  }

  increaseCurrentOrderQuantity(item: ListItem) {
    this.listService.increaseCurrentOrderQuantity(item).subscribe(d => this.currentOrderList = d)
  }

  decreaseCurrentOrderQuantity(item: ListItem) {

    if (parseInt(item.quantity) > 1) {
      this.listService.decreaseCurrentOrderQuantity(item).subscribe(d => this.currentOrderList = d)
    }

  }

  increaseActiveOrderQuantity(item: ListItem, category: string, choice: string) {
    this.listService.increaseActiveOrderQuantity(item, category).subscribe(d => {
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

    

    this.updateActiveOrderFrontend(category, item, choice)



  }

  decreaseActiveOrderQuantity(item: ListItem, category: string, choice: string) {
    console.log(item.name + "   " + category + "    " + choice  )
    if (parseInt(item.quantity) > 1) {
      this.listService.decreaseActiveOrderQuantity(item, category).subscribe(d => {
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

      this.updateActiveOrderFrontend(category, item, choice)
    }

    
  }

  deleteActiveOrderItem(item: ListItem, category: string, choice: string) {
    console.log(item.name + "   " + category + "    " + choice  )
    this.listService.deleteActiveOrderItem(item, category).subscribe(d=>{
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
    });
    this.updateActiveOrderFrontend(category,item,choice);
  }

  updateActiveOrderFrontend(category: string, item: ListItem, choice: string) {
    let updateMessage = "";
    let newQuantity = 0;
    switch (choice) {
      case 'increased':
        switch (category) {
          case 'todo':
            this.todo.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.todo[index].quantity)
                newQuantity = ++initialQuantity;
                this.todo[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'health':
            this.health.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.health[index].quantity)
                newQuantity = ++initialQuantity;
                this.health[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'dairy':
            this.dairy.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.dairy[index].quantity)
                newQuantity = ++initialQuantity;
                this.dairy[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'breakfast':
            this.breakfast.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.breakfast[index].quantity)
                newQuantity = ++initialQuantity;
                this.breakfast[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'international':
            this.international.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.international[index].quantity)
                newQuantity = ++initialQuantity;
                this.international[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'baking':
            this.baking.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.baking[index].quantity)
                newQuantity = ++initialQuantity;
                this.baking[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'grains':
            this.grains.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.grains[index].quantity)
                newQuantity = ++initialQuantity;
                this.grains[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'snacks':
            this.snacks.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.snacks[index].quantity)
                newQuantity = ++initialQuantity;
                this.snacks[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'pet':
            this.pet.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.pet[index].quantity)
                newQuantity = ++initialQuantity;
                this.pet[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'household':
            this.household.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.household[index].quantity)
                newQuantity = ++initialQuantity;
                this.household[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'beverages':
            this.beverages.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.beverages[index].quantity)
                newQuantity = ++initialQuantity;
                this.beverages[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'bread':
            this.bread.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.bread[index].quantity)
                newQuantity = ++initialQuantity;
                this.bread[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'frozen':
            this.frozen.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.frozen[index].quantity)
                newQuantity = ++initialQuantity;
                this.frozen[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'meat':
            this.meat.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.meat[index].quantity)
                newQuantity = ++initialQuantity;
                this.meat[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'produce':
            this.produce.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.produce[index].quantity)
                newQuantity = ++initialQuantity;
                this.produce[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'bakery':
            this.bakery.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.bakery[index].quantity)
                newQuantity = ++initialQuantity;
                this.bakery[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'deli':
            this.deli.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.deli[index].quantity)
                newQuantity = ++initialQuantity;
                this.deli[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'completed':
            this.completed.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.completed[index].quantity)
                newQuantity = ++initialQuantity;
                this.completed[index].quantity = newQuantity.toString()
              }
            })
            break;

        }
        break
      case 'decreased':
        switch (category) {
          case 'todo':
            this.todo.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.todo[index].quantity)
                newQuantity = --initialQuantity;
                this.todo[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'health':
            this.health.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.health[index].quantity)
                newQuantity = --initialQuantity;
                this.health[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'dairy':
            this.dairy.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.dairy[index].quantity)
                newQuantity = --initialQuantity;
                this.dairy[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'breakfast':
            this.breakfast.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.breakfast[index].quantity)
                newQuantity = --initialQuantity;
                this.breakfast[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'international':
            this.international.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.international[index].quantity)
                newQuantity = --initialQuantity;
                this.international[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'baking':
            this.baking.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.baking[index].quantity)
                newQuantity = --initialQuantity;
                this.baking[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'grains':
            this.grains.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.grains[index].quantity)
                newQuantity = --initialQuantity;
                this.grains[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'snacks':
            this.snacks.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.snacks[index].quantity)
                newQuantity = --initialQuantity;
                this.snacks[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'pet':
            this.pet.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.pet[index].quantity)
                newQuantity = --initialQuantity;
                this.pet[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'household':
            this.household.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.household[index].quantity)
                newQuantity = --initialQuantity;
                this.household[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'beverages':
            this.beverages.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.beverages[index].quantity)
                newQuantity = --initialQuantity;
                this.beverages[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'bread':
            this.bread.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.bread[index].quantity)
                newQuantity = --initialQuantity;
                this.bread[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'frozen':
            this.frozen.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.frozen[index].quantity)
                newQuantity = --initialQuantity;
                this.frozen[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'meat':
            this.meat.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.meat[index].quantity)
                newQuantity = --initialQuantity;
                this.meat[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'produce':
            this.produce.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.produce[index].quantity)
                newQuantity = --initialQuantity;
                this.produce[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'bakery':
            this.bakery.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.bakery[index].quantity)
                newQuantity = --initialQuantity;
                this.bakery[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'deli':
            this.deli.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.deli[index].quantity)
                newQuantity = --initialQuantity;
                this.deli[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'completed':
            this.completed.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.completed[index].quantity)
                newQuantity = --initialQuantity;
                this.completed[index].quantity = newQuantity.toString()
              }
            })
            break;

        }
        break
      case 'deleted':
        switch (category) {
          case 'todo':
            this.todo.forEach((d, index) => {
              if (item.name == d.name) {
                this.todo.splice(index, 1)
              }
            })
            break;
            case 'health':
              this.health.forEach((d, index) => {
                if (item.name == d.name) {
                  this.health.splice(index, 1)
                }
              })
              break;
              case 'dairy':
                this.dairy.forEach((d, index) => {
                  if (item.name == d.name) {
                    this.dairy.splice(index, 1)
                  }
                })
                break;
                case 'breakfast':
            this.breakfast.forEach((d, index) => {
              if (item.name == d.name) {
                this.breakfast.splice(index, 1)
              }
            })
            break;
            case 'international':
            this.international.forEach((d, index) => {
              if (item.name == d.name) {
                this.international.splice(index, 1)
              }
            })
            break;
            case 'grains':
            this.grains.forEach((d, index) => {
              if (item.name == d.name) {
                this.grains.splice(index, 1)
              }
            })
            break;
            case 'snacks':
            this.snacks.forEach((d, index) => {
              if (item.name == d.name) {
                this.snacks.splice(index, 1)
              }
            })
            break;
            case 'pet':
            this.pet.forEach((d, index) => {
              if (item.name == d.name) {
                this.pet.splice(index, 1)
              }
            })
            break;
            case 'household':
            this.household.forEach((d, index) => {
              if (item.name == d.name) {
                this.household.splice(index, 1)
              }
            })
            break;
            case 'beverages':
            this.beverages.forEach((d, index) => {
              if (item.name == d.name) {
                this.beverages.splice(index, 1)
              }
            })
            break;
            case 'bread':
            this.bread.forEach((d, index) => {
              if (item.name == d.name) {
                this.bread.splice(index, 1)
              }
            })
            break;
            case 'frozen':
            this.frozen.forEach((d, index) => {
              if (item.name == d.name) {
                this.frozen.splice(index, 1)
              }
            })
            break;
            case 'meat':
            this.meat.forEach((d, index) => {
              if (item.name == d.name) {
                this.meat.splice(index, 1)
              }
            })
            break;
            case 'produce':
            this.produce.forEach((d, index) => {
              if (item.name == d.name) {
                this.produce.splice(index, 1)
              }
            })
            break;
            case 'bakery':
            this.bakery.forEach((d, index) => {
              if (item.name == d.name) {
                this.bakery.splice(index, 1)
              }
            })
            break;
            case 'deli':
              
            this.deli.forEach((d, index) => {
              if (item.name == d.name) {
                this.deli.splice(index, 1)
                console.log("weeeeeeeeeeeee")
              }
            })
            break;
            case 'completed':
            this.completed.forEach((d, index) => {
              if (item.name == d.name) {
                this.completed.splice(index, 1)
              }
            })
            break;
        }
        break
      case 'added':
        this.todo.unshift(item);
        console.log("SWEEEET")
        break;
    }

    if(choice === 'decreased' || choice === 'increased'){
      updateMessage = "" + item.name +" has been " + choice + " to a total of "+newQuantity
    }else{
      updateMessage = "" + item.name +" has been " + choice
    }

    

    this.sendActiveOrderMessage(updateMessage)
  }

  checkItemValidity(item:string):boolean{
    let tempArray:ListItemInterface[] = [];
    let activeListArray:ListItemInterface[] = tempArray.concat(
      this.todo,
      this.deli,
      this.health,
      this.dairy,
      this.breakfast,
      this.international,
      this.baking,
      this.grains,
      this.snacks,
      this.pet,
      this.household,
      this.beverages,
      this.bread,
      this.frozen,
      this.meat,
      this.produce,
      this.bakery,
      this.completed  
    )
    var itemFound:boolean=true;
    
    if(!this.hasCurrentOrder && !this.isActiveOrder){
      //cart state
      this.cart.forEach(d=>{
        if(d.name === item){
          itemFound = false;
        }

        console.log(item + "   " + d.name)
      })
    }else if(this.hasCurrentOrder && !this.isActiveOrder){
      //current order state
      this.currentOrderList.forEach(d=>{
        if(d.name === item){
          itemFound = false;
          
        }
        
      })
    }else{
      //active order state
      activeListArray.forEach(d=>{
        //console.log(d.name)
        if(d.name === item){
          itemFound = false;
        }
      })
    }

    return itemFound;
    
  }
}
