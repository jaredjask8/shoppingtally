import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { PreviousListsToClient } from '../previousLists/models/PreviousListsToClient';
import { ListItem } from 'src/list/models/ListItem';
import { ListItemInterface } from 'src/list/models/ListItemInterface';
import { PreviousListsFromDB } from '../previousLists/models/PreviousListsFromDB';
import { ListService } from 'src/list/list_component/list.service';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { NavService } from 'src/global/nav/nav.service';

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
  currentSelectedList:ListItem[];
  inputUsed:boolean = false;
  filteredList;
  
  constructor(private listService:ListService, private userService:EnvironmentService, private navService:NavService){

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
      
    });

    
  }
  

  showLists(index){
    this.currentSelectedList = this.lists[index].list;
  }

  addItemToCurrentList(index){
    this.listService.addListItem(this.currentSelectedList[index]).subscribe(d=>console.log(d))
  }

  addItemFromMasterList(index){
    this.listService.addListItem(this.fullList[index]).subscribe(d=>{
      this.navService.cartCount.next(d.itemCount.toString())
    })
  }

  addFullList(){
    this.listService.addFullList(this.currentSelectedList).subscribe(d => console.log(d))
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
