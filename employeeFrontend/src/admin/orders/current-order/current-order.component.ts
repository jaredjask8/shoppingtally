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

  drop(event: CdkDragDrop<ListItemInterface[]>) {
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
  }
 
}
