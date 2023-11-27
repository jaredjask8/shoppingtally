import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
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


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, OnDestroy {
  serverUrl = "https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/our-websocket"
  title = 'WebSockets chat';
  stompClient;


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
  currentImage: string;
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

  constructor(private service: GroceryService, private userService: EnvironmentService, private listService: ListService, private dateService: DatepickerService, private elem: ElementRef, private renderer: Renderer2, private navService: NavService) {
    this.previousImage = elem.nativeElement
    this.initializeWebSocketConnection();
  }
  ngOnInit(): void {


    this.navService.cartVisibility$.subscribe(d => {
      this.hasCurrentOrder = d.hasCurrentOrder;
    })

    this.navService.cartVisibility$.subscribe(d => {
      console.log(d)
      this.isActiveOrder = d.hasActive
      if (d.hasActive) {
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
          this.currentOrderDate = d.date
        })
        this.navService.cartCount.next("0");
      } else {
        this.listService.getUserList().subscribe(d => {
          this.currentOrderList = d.list
          this.currentOrderDate = d.date;
        })


      }
    })
    //this.listService.getUserHasOrder().subscribe(d=>console.log(d))

    //this.listService.getUserList().subscribe(d=>this.currentOrderList = d.list)
  }

  ngOnDestroy() {
    this.stompClient.disconnect(function () {
      alert("See you next time!");
    });
  }

  initializeWebSocketConnection() {

    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    //this.stompClient.debug = null;
    this.stompClient.connect({ token: this.userService.getEnvironment().token }, function (frame) {
      //console.log(frame)
      that.stompClient.subscribe("/user/topic/messages", function (message) {


        console.log(that.hasCurrentOrder + "      " + that.isActiveOrder)
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

        console.log(that.produce)
      })


    }, function(message){
      console.log(message)
    });
  }

  sendActiveOrderMessage() {
    this.stompClient.send('/ws/test', {}, JSON.stringify(new CurrentOrderUserClass(
      "",
      "",
      "",
      this.currentOrderDate,
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

  deleteCurrentOrderItem(item: ListItem) {
    this.listService.deleteCurrentOrderItem(item).subscribe(d => this.currentOrderList = d)
  }



  getItems() {
    this.service.getItems(this.customItem).subscribe(d => {
      this.brandedArray = of(d.branded)
    });


  }

  getImages() {
    this.service.getImages(this.currentItem).subscribe(d => {
      this.googleImageArray = of(d.items)

    })
  }

  setItemName(item) {
    this.currentItem = item;
  }

  setQuantity(quantity) {
    this.currentQuantity = quantity;
  }


  addToList() {
    this.listService.addListItem(new ListItem(this.currentItem, this.currentQuantity, this.currentImage)).subscribe(d => {
      console.log(d)
      this.navService.cartCount.next(d);
    })
    //this.list.push(item)
    //this.table.renderRows();
    this.resetItem()
  }

  resetItem(){
    this.currentItem = "";
    this.currentQuantity = "";
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

  searchClick() {
    if (this.isSearchClicked == false) {
      this.isSearchClicked = true
    }
  }

  emptyGoogleImageArray() {
    this.googleImageArray = null;
    this.currentImage = null
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
      this.updateActiveOrderFrontend('todo',newItem,'add');
    } else {
      //send to currentOrder
      this.listService.addItemToCurrentOrder(new ListItem(this.currentItem, this.currentQuantity, this.currentImage)).subscribe(d => {
        this.currentOrderList = d
      })
    }

    this.resetItem()
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
    this.listService.deleteActiveOrderItem(item, category).subscribe(d=>console.log(d));
    this.updateActiveOrderFrontend(category,item,choice);
  }

  updateActiveOrderFrontend(category: string, item: ListItem, choice: string) {
    switch (choice) {
      case 'increase':
        switch (category) {
          case 'todo':
            this.todo.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.todo[index].quantity)
                let newQuantity = ++initialQuantity;
                this.todo[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'health':
            this.health.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.health[index].quantity)
                let newQuantity = ++initialQuantity;
                this.health[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'dairy':
            this.dairy.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.dairy[index].quantity)
                let newQuantity = ++initialQuantity;
                this.dairy[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'breakfast':
            this.breakfast.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.breakfast[index].quantity)
                let newQuantity = ++initialQuantity;
                this.breakfast[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'international':
            this.international.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.international[index].quantity)
                let newQuantity = ++initialQuantity;
                this.international[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'baking':
            this.baking.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.baking[index].quantity)
                let newQuantity = ++initialQuantity;
                this.baking[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'grains':
            this.grains.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.grains[index].quantity)
                let newQuantity = ++initialQuantity;
                this.grains[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'snacks':
            this.snacks.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.snacks[index].quantity)
                let newQuantity = ++initialQuantity;
                this.snacks[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'pet':
            this.pet.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.pet[index].quantity)
                let newQuantity = ++initialQuantity;
                this.pet[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'household':
            this.household.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.household[index].quantity)
                let newQuantity = ++initialQuantity;
                this.household[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'beverages':
            this.beverages.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.beverages[index].quantity)
                let newQuantity = ++initialQuantity;
                this.beverages[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'bread':
            this.bread.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.bread[index].quantity)
                let newQuantity = ++initialQuantity;
                this.bread[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'frozen':
            this.frozen.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.frozen[index].quantity)
                let newQuantity = ++initialQuantity;
                this.frozen[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'meat':
            this.meat.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.meat[index].quantity)
                let newQuantity = ++initialQuantity;
                this.meat[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'produce':
            this.produce.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.produce[index].quantity)
                let newQuantity = ++initialQuantity;
                this.produce[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'bakery':
            this.bakery.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.bakery[index].quantity)
                let newQuantity = ++initialQuantity;
                this.bakery[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'deli':
            this.deli.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.deli[index].quantity)
                let newQuantity = ++initialQuantity;
                this.deli[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'completed':
            this.completed.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.completed[index].quantity)
                let newQuantity = ++initialQuantity;
                this.completed[index].quantity = newQuantity.toString()
              }
            })
            break;

        }

        break
      case 'decrease':
        switch (category) {
          case 'todo':
            this.todo.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.todo[index].quantity)
                let newQuantity = --initialQuantity;
                this.todo[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'health':
            this.health.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.health[index].quantity)
                let newQuantity = --initialQuantity;
                this.health[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'dairy':
            this.dairy.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.dairy[index].quantity)
                let newQuantity = --initialQuantity;
                this.dairy[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'breakfast':
            this.breakfast.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.breakfast[index].quantity)
                let newQuantity = --initialQuantity;
                this.breakfast[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'international':
            this.international.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.international[index].quantity)
                let newQuantity = --initialQuantity;
                this.international[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'baking':
            this.baking.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.baking[index].quantity)
                let newQuantity = --initialQuantity;
                this.baking[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'grains':
            this.grains.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.grains[index].quantity)
                let newQuantity = --initialQuantity;
                this.grains[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'snacks':
            this.snacks.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.snacks[index].quantity)
                let newQuantity = --initialQuantity;
                this.snacks[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'pet':
            this.pet.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.pet[index].quantity)
                let newQuantity = --initialQuantity;
                this.pet[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'household':
            this.household.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.household[index].quantity)
                let newQuantity = --initialQuantity;
                this.household[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'beverages':
            this.beverages.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.beverages[index].quantity)
                let newQuantity = --initialQuantity;
                this.beverages[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'bread':
            this.bread.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.bread[index].quantity)
                let newQuantity = --initialQuantity;
                this.bread[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'frozen':
            this.frozen.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.frozen[index].quantity)
                let newQuantity = --initialQuantity;
                this.frozen[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'meat':
            this.meat.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.meat[index].quantity)
                let newQuantity = --initialQuantity;
                this.meat[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'produce':
            this.produce.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.produce[index].quantity)
                let newQuantity = --initialQuantity;
                this.produce[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'bakery':
            this.bakery.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.bakery[index].quantity)
                let newQuantity = --initialQuantity;
                this.bakery[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'deli':
            this.deli.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.deli[index].quantity)
                let newQuantity = --initialQuantity;
                this.deli[index].quantity = newQuantity.toString()
              }
            })
            break;
          case 'completed':
            this.completed.forEach((d, index) => {
              if (item.name == d.name) {
                let initialQuantity = parseInt(this.completed[index].quantity)
                let newQuantity = --initialQuantity;
                this.completed[index].quantity = newQuantity.toString()
              }
            })
            break;

        }
        break
      case 'delete':
        switch (category) {
          case 'todo':
            this.todo.forEach((d, index) => {
              if (item.name == d.name) {
                this.todo.splice(index, 1)
                console.log("yes")
              }
            })
            break;
        }
        break
      case 'add':
        this.todo.unshift(item);
        console.log("SWEEEET")
        break;
    }

    this.sendActiveOrderMessage()
  }
}
