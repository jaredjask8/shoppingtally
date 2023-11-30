import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { ListService } from 'src/list/list_component/list.service';
import { CurrentOrderShopper } from 'src/list/models/CurrentOrderShopper';
import { ListItemInterface } from 'src/list/models/ListItemInterface';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { CurrentOrderUser } from 'src/list/models/CurrentOrderUser';
import { CurrentOrderUserClassWithUpdateMessage } from 'src/list/models/CurrentOrderUserClassWithUpdateMessage';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.component.html',
  styleUrls: ['./current-order.component.css'],
  standalone:true,
  imports:[
    CommonModule,
    CdkDropList,
    CdkDrag,
    CdkScrollableModule,
    MatButtonModule
  ]
})
export class CurrentOrderComponent implements OnInit,OnDestroy{
  currentOrder:CurrentOrderShopper;
  //'http://localhost/test/our-websocket'
  //"https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/our-websocket"
  serverUrl = "https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/our-websocket"
  title = 'WebSockets chat';
  stompClient;
  updateLog:string[]=[]
  
  

  constructor(private listService:ListService, private router:Router, private userService:EnvironmentService){}

  ngOnInit(): void {
    //get current order list
    this.listService.getCurrentOrder().subscribe(d=>{
      
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
      this.currentOrder = d;
    })

    this.initializeWebSocketConnection();
  }

  ngOnDestroy(){
    this.stompClient.disconnect(function() {
      alert("See you next time!");
    });
  }

  endCurrentOrder(){
    this.listService.endCurrentOrder(this.currentOrder.customer_email, this.currentOrder.date).subscribe(d=>console.log(d));
    let that = this;
    setTimeout(() => {
      that.router.navigate(["/admin/orders"])
    },1000)
    
  }

  
  todo:ListItemInterface[]=[]
  deli:ListItemInterface[] = [];
  bakery:ListItemInterface[] = [];
  meat:ListItemInterface[] = [];
  produce:ListItemInterface[] = [];
  beverages:ListItemInterface[] = [];
  bread:ListItemInterface[] = [];
  international:ListItemInterface[] = [];
  baking:ListItemInterface[] = [];
  grains:ListItemInterface[] = [];
  snacks:ListItemInterface[] = [];
  pet:ListItemInterface[] = [];
  breakfast:ListItemInterface[] = [];
  household:ListItemInterface[] = [];
  health:ListItemInterface[] = [];
  frozen:ListItemInterface[] = [];
  dairy:ListItemInterface[] = [];
  completed:ListItemInterface[] = [];

  drop(event: CdkDragDrop<ListItemInterface[]>,toCategory:string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }



    // let test = event.previousContainer.element.nativeElement.innerText;
    // console.log(test.substring(0,test.indexOf('\n')))

    let fromCategory:string = event.previousContainer.element.nativeElement.parentElement.getElementsByTagName('h2')[0].innerText.toLowerCase().replace(/\s/g, "")
    if(fromCategory != toCategory){

      switch(toCategory){
        case "deli":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "bakery":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "meat":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "produce":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "beverages":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "bread":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "international":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "baking":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "grains":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "snacks":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "pet":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "breakfast":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "household":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "health":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "frozen":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
  
        case "dairy":{
          this.listService.updateCategory(toCategory,event.container.data,fromCategory,event.previousContainer.data).subscribe();
          break;
        }
      }
    }
    

    
  }

  expandImage(){
    console.log("sweety")
  }

  completeItem(updateCategory:string,itemName:string){
    this.listService.completeItem(updateCategory,itemName).subscribe(d => {
      switch(updateCategory){
        case 'deli':
          this.deli = d.list
          break;
        case 'todo':
          this.todo = d.list
          break;
        case 'bakery':
          this.bakery = d.list
          break;
        case 'meat':
          this.meat = d.list
          break;
        case 'produce':
          this.produce = d.list
          break;
        case 'beverages':
          this.beverages = d.list
          break;
        case 'health':
          this.health = d.list
          break; 
        case 'dairy':
          this.dairy = d.list
          break; 
        case 'breakfast':
          this.breakfast = d.list
          break;
        case 'international':
          this.international = d.list
          break;
        case 'baking':
          this.baking = d.list
          break;
        case 'household':
          this.household = d.list
          break;
        case 'grains':
          this.grains = d.list
          break;
        case 'snacks':
          this.snacks = d.list
          break;
        case 'pet':
          this.pet = d.list
          break;
        case 'bread':
          this.bread = d.list
          break;
      }

      this.completed = d.completed
    })

    
  }

  initializeWebSocketConnection(){

    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({token:this.userService.getEnvironment().token}, function(frame) {

      that.stompClient.subscribe("/user/topic/activeOrder", function (message) {
        let activeOrderUpdate:CurrentOrderUserClassWithUpdateMessage = JSON.parse(message.body)
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
        //activeOrderUpdate.updateMessage
        that.updateLog.unshift(activeOrderUpdate.updateMessage);
        console.log(that.updateLog)
      })
    });
  }
}
