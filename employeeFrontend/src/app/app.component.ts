import { Component, HostListener, OnInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { NavService } from 'src/global/nav/nav.service';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { ListService } from 'src/list/list_component/list.service';
import { UserOrderInfo } from 'src/list/models/UserOrderInfo';
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
  testTimer:string="nope"
  @HostListener('document:click', ['$event'])
    handlerFunction(e: MouseEvent) {
      if(this.userService.getEnvironment().log == "1"){
        this.userService.stopLogoutTimer()
        this.userService.startLogoutTimer()
      }
      
    }

  

  constructor(private router:Router, private navService:NavService, private modalService: NgbModal, private listService:ListService, private userService:EnvironmentService,private snackBar: MatSnackBar, private registerService:RegisterService){
    
  }
  ngOnInit(): void {
    if(this.registerService.getCredentials()){
      this.registerService.userCredentials.next(true)
    }else{
      this.registerService.userCredentials.next(false)
    }
    
    
    this.router.events.subscribe(e => {
      if(e instanceof NavigationStart){
        this.displayLoadingIndicator = true;
      }

      if(e instanceof NavigationEnd){
        this.displayLoadingIndicator = false;
      }
    })

    this.showModal = this.navService.loginClicked$;
    
    this.userService.signOutSnackbar$.subscribe(d=>{
      if(d){
        this.snackBar.open("You have been signed out","",{duration:10000})
      }
    })


    //check if user is logged in
    if(this.userService.getEnvironment().log == "1"){
      this.userService.stopLoginTimer()
      this.userService.stopLogoutTimer()

      //for mobile devices on screen lock, refresh token when they come back to the page
      if(window.matchMedia("(max-width: 500px)").matches){
        this.userService.refreshLogin().subscribe(d=>this.userService.setToken(d.token))
        this.testTimer = "sweeeet"
      }
      
      this.userService.startLoginTimer()
      this.userService.startLogoutTimer()
      this.listService.getUserHasOrder().subscribe(d => {
        this.navService.cartVisibility.next(new UserOrderInfo(d.hasActive,d.hasCurrentOrder))
      })
      
    }
  }

  openBackDropCustomClass(content) {
		this.modalService.open(content, { backdropClass: 'light-blue-backdrop' });
	}

  
}
