import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons, NgbCarousel, NgbCarouselModule, NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RegisterService } from 'src/register/register.service';
import { RouterModule } from '@angular/router';
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
export class NavComponent{
  closeResult: string;
  showLogin:boolean=true;
  showNavigationArrows = false;
	showNavigationIndicators = false;
	images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/350/300`);

	constructor(private offcanvasService: NgbOffcanvas, config: NgbCarouselConfig, private registerService:RegisterService, private userService:EnvironmentService, private listService:ListService, private profileService:ProfileService) {
    config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
  }
  
  
  

	openEnd(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'end' });
	}



  showProfile(){
    if(this.userService.getEnvironment().log === "1"){
      this.showLogin = false;
      return true;
    }else{
      return false;
    }
  }

  loadUser(){
    this.profileService.setUserListData();
  }




    
 
}
