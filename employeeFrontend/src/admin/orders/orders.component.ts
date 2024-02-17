import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ListService } from 'src/list/list_component/list.service';
import { ActiveShopperOrder } from 'src/list/models/ActiveShopperOrder';
import { ShopperOrder } from 'src/list/models/ShopperOrder';





@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit{
  orders:ShopperOrder[]=[]
  orderList:boolean = true;
  activeOrder:ActiveShopperOrder;
  orderStatus:boolean
  noOrdersNotification:string


  constructor(private listService:ListService, private router:Router){}
  
  ngOnInit(): void {
    //get data from server
    this.listService.getShopperOrders().subscribe({
      next:d => {
        this.orders = d.filter(d => d.isCompleted == "false")
        !this.orders.length ? this.noOrdersNotification = "No orders" : this.noOrdersNotification = ""
        d.forEach(orderData => {
          if(orderData.isActive == "true"){
            this.orderList = false;
            
          }
        })
      },
      error:d => console.error(d),
      complete:()=>console.log("nice")
      
    });

    //this.listService.getShopperOrders().pipe(map(d=>d.filter(e => {return e.isCompleted = "false")));

    console.log(this.orders.length)

    
  }

  setCurrentOrder(email:string, date:string){
    this.listService.startOrder(email,date).subscribe(d=>{
      this.activeOrder = d
    })
    
  }

  

}
