import { Component, OnInit} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { RegisterService } from 'src/register/register.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title:string = '';
  displayLoadingIndicator=false;
  

  constructor(private router:Router, private registerService: RegisterService){
    
  }
  ngOnInit(): void {
    this.router.events.subscribe(e => {
      if(e instanceof NavigationStart){
        this.displayLoadingIndicator = true;
      }

      if(e instanceof NavigationEnd){
        this.displayLoadingIndicator = false;
        console.log("ended")
      }
    })

    console.log(this.registerService.checkAdmin$)
  }

  
}
