import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons, NgbCarousel, NgbCarouselModule, NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RegisterService } from 'src/register/register.service';
import { Router, RouterModule } from '@angular/router';
import { EnvironmentService } from '../utility/environment.service';
import { ListService } from 'src/list/list_component/list.service';
import { ProfileService } from 'src/profile/profile.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  standalone: true,
  imports: [NgbDatepickerModule, NgbCarouselModule, NgIf, NgFor,MatButtonModule, RouterModule],
  styleUrls: ['./nav.component.css'],
  providers:[NgbCarouselConfig]
})
export class NavComponent implements OnInit{
  closeResult: string;

  //control nav components on login and logout
  showLogin:boolean=true;
  showAdmin:boolean;
  username:string="Guest"
 

	constructor(private offcanvasService: NgbOffcanvas, config: NgbCarouselConfig, private registerService:RegisterService, private userService:EnvironmentService, private listService:ListService, private profileService:ProfileService, private router:Router) {


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
      //this.username = this.userService.getUser().firstname;
      return true;
    }else{
      this.username = "Guest";
      this.showAdmin = false;
      return false;
    }
  }


  loadUser(){
    this.profileService.setUserListData();
  }




    
 
}
