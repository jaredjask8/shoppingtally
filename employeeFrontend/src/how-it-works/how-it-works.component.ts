import { Component, OnInit } from '@angular/core';
import { Environment } from 'src/global/utility/Environment';
import { EnvironmentService } from 'src/global/utility/environment.service';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit{
  constructor(private userService:EnvironmentService){}

  ngOnInit(): void {
    this.userService.initializeWebSocketConnection()
  }
  
}
