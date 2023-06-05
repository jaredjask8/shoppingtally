import { Component,OnInit } from '@angular/core';
import { GroceryService } from 'src/global/grocery_items/grocery.service';
import { EnvironmentService } from 'src/global/utility/environment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  constructor(private userService:EnvironmentService){}
  ngOnInit(): void {
    
  }

}
