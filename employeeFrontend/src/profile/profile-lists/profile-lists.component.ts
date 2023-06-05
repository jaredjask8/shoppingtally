import { Component, Input } from '@angular/core';
import { PreviousListsToClient } from '../models/PreviousListsToClient';
import { ListItem } from 'src/list/models/ListItem';

@Component({
  selector: 'app-profile-lists',
  templateUrl: './profile-lists.component.html',
  styleUrls: ['./profile-lists.component.css']
})
export class ProfileListsComponent {
  @Input() dates=[];
  @Input() lists:PreviousListsToClient[]=[];
  initListItem:ListItem[]=[];
  currentSelectedList:PreviousListsToClient=new PreviousListsToClient(-1,this.initListItem,"");

  showLists(index){
    this.currentSelectedList = this.lists[index];
  }
}
