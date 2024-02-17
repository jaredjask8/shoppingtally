import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { EnvironmentService } from 'src/global/utility/environment.service';



@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewChecked{
  

  
  
  constructor(private userService:EnvironmentService){}
  ngAfterViewChecked(): void {
  }
  

  
  ngOnInit(): void {
    
    if(this.userService.getEnvironment().log == "1"){
      this.userService.initializeWebSocketConnection()
    }
    
  }
  


  
}
