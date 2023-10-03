import { Component, OnInit} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { NavService } from 'src/global/nav/nav.service';
import { RegisterService } from 'src/register/register.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title:string = '';
  displayLoadingIndicator=false;
  showModal:Observable<boolean>
  closeResult: string;

  

  constructor(private router:Router, private registerService: RegisterService, private navService:NavService, private modalService: NgbModal){
    
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

    this.showModal = this.navService.loginClicked$;
  }

  openBackDropCustomClass(content) {
		this.modalService.open(content, { backdropClass: 'light-blue-backdrop' });
	}

  
}
