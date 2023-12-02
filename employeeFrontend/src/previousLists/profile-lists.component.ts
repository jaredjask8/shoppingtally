import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { PreviousListsToClient } from '../previousLists/models/PreviousListsToClient';
import { ListItem } from 'src/list/models/ListItem';
import { ListItemInterface } from 'src/list/models/ListItemInterface';
import { PreviousListsFromDB } from '../previousLists/models/PreviousListsFromDB';
import { ListService } from 'src/list/list_component/list.service';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { NavService } from 'src/global/nav/nav.service';
import { List } from 'src/list/models/List';
import { CurrentOrderUser } from 'src/list/models/CurrentOrderUser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-lists',
  templateUrl: './profile-lists.component.html',
  styleUrls: ['./profile-lists.component.css'],
})
export class ProfileListsComponent implements OnInit{
  fullList:ListItem[]=[];
  masterList:ListItem[]=[];
  dateArray:string[]=[];
  lists;
  inputUsed:boolean = false;
  filteredList;
  hasOrder:boolean
  isActive:boolean

  //list states
  cart:List
  current:List
  active:CurrentOrderUser
  
  constructor(private listService:ListService, private userService:EnvironmentService, private navService:NavService,private snackBar: MatSnackBar){

  }

  uniqueFilter(value, index, self) {
    console.log(self)
    return self.indexOf(value) === index;
  }

  ngOnInit(): void {
    this.listService.getDates(this.userService.getEnvironment().token).subscribe(d => { 
      //console.log(d)
      //this.fullList = d;
      
      d.forEach(t => {
        this.dateArray.push(t.date);
        t.list.forEach(m=>{
          this.fullList.push(m);
        })
        this.lists = d;
      })

      this.fullList = this.fullList.filter((elem,index)=>this.fullList.findIndex(obj => obj.name === elem.name) === index)
      
    });

    this.navService.cartVisibility$.subscribe(d => {
      if(d.hasCurrentOrder && !d.hasActive){
        this.hasOrder = true
        this.listService.getUserList().subscribe(d=>{
          this.current = d
        })
      }else if(d.hasCurrentOrder && d.hasActive){
        this.hasOrder = true
        this.isActive = true
        this.listService.getActiveOrder().subscribe(d=>{
          this.active = d
        })
      }else{
        this.listService.getCurrentList().subscribe(d=>{
          this.cart = d
        })
      }
    })

    
  }

  addItemToOrderState(index){
    if(this.hasOrder && !this.isActive){
      //send to current order if item passes check
      if(this.checkItemValidity(this.fullList[index].name)){
        this.listService.addItemToCurrentOrder(this.fullList[index]).subscribe(d=> {
          this.current.list = d
        })
        this.snackBar.open("Item added")
        setTimeout(()=>{this.snackBar.dismiss()},2000)
      }else{
        this.snackBar.open("Item already in current order")
        setTimeout(()=>{this.snackBar.dismiss()},2000)
      }
    }else{
      //send to active order if item passes check
      if(this.checkItemValidity(this.fullList[index].name)){
        this.listService.addItemToActiveOrder(this.fullList[index]).subscribe(d=>{
          this.active = d
        })
        this.snackBar.open("Item added")
        setTimeout(()=>{this.snackBar.dismiss()},2000)
      }else{
        this.snackBar.open("Item already in current order")
        setTimeout(()=>{this.snackBar.dismiss()},2000)
      }
      
      
    }
  }

  checkItemValidity(item:string):boolean{
    let itemFound = true;
    if(!this.hasOrder && !this.isActive){
      //cart state
      this.cart.list.forEach(d=>{
        if(d.name === item){
          itemFound = false;
        }
      })
    }else if(this.hasOrder && !this.isActive){
      //current order state
      this.current.list.forEach(d=>{
        if(d.name === item){
          itemFound = false;
        }
      })
    }else{
      //active order state
      let tempArray = [];
      let fullActiveArray = tempArray.concat(
        this.active.todo,
        this.active.deli,
        this.active.health,
        this.active.dairy,
        this.active.breakfast,
        this.active.international,
        this.active.baking,
        this.active.grains,
        this.active.snacks,
        this.active.pet,
        this.active.household,
        this.active.beverages,
        this.active.bread,
        this.active.frozen,
        this.active.meat,
        this.active.produce,
        this.active.bakery,
        this.active.completed
      )
      fullActiveArray.forEach(d=>{
        //console.log(d.name)
        if(d.name === item){
          itemFound = false;
        }
      })
    }

    return itemFound;
    
  }

  addItemToCart(index){
    let that = this
    this.listService.getCurrentList().subscribe(d=>{
      that.cart = d
      if(that.checkItemValidity(that.fullList[index].name)){
        that.listService.addListItem(that.fullList[index]).subscribe(d=>{
          that.navService.cartCount.next(d.itemCount.toString())
          that.cart = d
        })
        that.snackBar.open("Item added")
        setTimeout(()=>{that.snackBar.dismiss()},2000)
      }else{
        that.snackBar.open("Item already in current order")
        setTimeout(()=>{that.snackBar.dismiss()},2000)
      }
    })
    
    
  }


  keyPress(event){
    if(event.target.value == ''){
      this.inputUsed = false
    }else{
      this.inputUsed = true
      this.filteredList = this.search(event.target.value)
    }
    
  }

  search(value: string) {
    let filter = this.fullList.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    return [...filter];
  }
}
