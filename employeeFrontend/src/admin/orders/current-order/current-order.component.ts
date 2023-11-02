import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ListService } from 'src/list/list_component/list.service';
import { CurrentOrder } from 'src/list/models/CurrentOrder';
import { ListItemInterface } from 'src/list/models/ListItemInterface';

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.component.html',
  styleUrls: ['./current-order.component.css'],
  standalone:true,
  imports:[
    CommonModule,
    CdkDropList,
    CdkDrag
  ]
})
export class CurrentOrderComponent implements OnInit{
  currentOrder:CurrentOrder
  
  

  constructor(private listService:ListService){}

  ngOnInit(): void {
    //get current order list
    this.listService.getCurrentOrder().subscribe(d=>{
      
      this.todo = d.todo
      this.currentOrder = d;
    })
  }

  endCurrentOrder(){
    this.listService.endCurrentOrder(this.currentOrder.customer_email, this.currentOrder.date).subscribe(d=>console.log(d));
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

  drop(event: CdkDragDrop<ListItemInterface[]>,category:string) {
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

    switch(category){
      case "deli":{
        this.listService.updateCategory(category,this.deli);
        break;
      }

      case "bakery":{
        this.listService.updateCategory(category,this.bakery);
        break;
      }

      case "meat":{
        this.listService.updateCategory(category,this.meat);
        break;
      }

      case "produce":{
        this.listService.updateCategory(category,this.produce);
        break;
      }

      case "beverages":{
        this.listService.updateCategory(category,this.beverages);
        break;
      }

      case "bread":{
        this.listService.updateCategory(category,this.bread);
        break;
      }

      case "international":{
        this.listService.updateCategory(category,this.international);
        break;
      }

      case "baking":{
        this.listService.updateCategory(category,this.baking);
        break;
      }

      case "grains":{
        this.listService.updateCategory(category,this.grains);
        break;
      }

      case "snacks":{
        this.listService.updateCategory(category,this.snacks);
        break;
      }

      case "pet":{
        this.listService.updateCategory(category,this.pet);
        break;
      }

      case "breakfast":{
        this.listService.updateCategory(category,this.breakfast);
        break;
      }

      case "household":{
        this.listService.updateCategory(category,this.household);
        break;
      }

      case "health":{
        this.listService.updateCategory(category,this.health);
        break;
      }

      case "frozen":{
        this.listService.updateCategory(category,this.frozen);
        break;
      }

      case "dairy":{
        this.listService.updateCategory(category,this.dairy);
        break;
      }
    }

    
  }

  expandImage(){
    console.log("sweety")
  }
 
}
