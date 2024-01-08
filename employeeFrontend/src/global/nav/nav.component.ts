import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons, NgbCarousel, NgbCarouselModule, NgbCarouselConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RegisterService } from 'src/register/register.service';
import { Router, RouterModule } from '@angular/router';
import { EnvironmentService } from '../utility/environment.service';
import { ListService } from 'src/list/list_component/list.service';
import { ProfileService } from 'src/profile/profile.service';
import { NavService } from './nav.service';
import { OrderModalComponent } from "../bootstrap-components/order-modal/order-modal.component";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    standalone: true,
    styleUrls: ['./nav.component.css'],
    providers: [NgbCarouselConfig],
    imports: [NgbDatepickerModule, NgbCarouselModule, NgIf, NgFor, MatButtonModule, RouterModule]
})
export class NavComponent implements OnInit{
  closeResult: string;
  cartItemCounter:string;

  //control nav components on login and logout
  showLogin:boolean=true;
  showAdmin:boolean;
  username:string="Guest"
  cartVisibility:boolean=false
  userLoggedIn:boolean
 

	constructor(private offcanvasService: NgbOffcanvas, private registerService:RegisterService, private userService:EnvironmentService, private profileService:ProfileService, private navService:NavService) {


    // call register service to check if user is admin
    this.registerService.checkAdmin$.subscribe(d => {
      if(d == true){
        this.showAdmin = true;
      }else{
        this.showAdmin = false;
      }
    });
    
  }
  ngOnInit(): void {
    
    
    if(this.userService.getEnvironment().log == "1"){
      this.navService.getCartCount().subscribe(d=>{
        this.cartItemCounter = d
      })

      this.userService.userLoggedIn.next(true)
      
      this.navService.cartVisibility$.subscribe(d=>{
        this.cartVisibility = !d.hasCurrentOrder
      })

      this.navService.cartVisibilityFromUser$.subscribe(d=>{
        this.cartVisibility = d
      })

      this.userService.userLoggedIn$.subscribe(d=>{
        this.userLoggedIn = d
      })
      
    }else{
      this.userLoggedIn = false
    }

    
    this.navService.cartCount$.subscribe(d=>this.cartItemCounter=d)
  }
  
  
  
  // mat nav bar functionality
	openEnd(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'end' });
	}


  // if user logs in successfully browser session sets log to 1
  // if log is 1 check signout observable / will return boolean to display login or profile buttons
  // also change the username in navbar
  // else reset to guest 
  showProfile(){
    if(this.userService.getEnvironment().log === "1"){
      this.profileService.signOut$.subscribe(d => this.showLogin = d);
      this.profileService.setSignOut(false);
      //this.username = this.userService.getUser().firstname
      return true;
    }else{
      this.username = "Guest";
      this.showAdmin = false;
      return false;
    }
  }


  loadUser(){
    //this.profileService.setUserListData();
  }

  loginClicked(){
    this.navService.loginClicked.next(true);
  }

  registerClicked(){
    this.navService.registerClicked.next(true);
  }

  cartClicked(){
    this.navService.cartClicked.next(true);
  }



    
 
}
