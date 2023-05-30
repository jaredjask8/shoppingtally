import { Component, TemplateRef, ViewEncapsulation} from '@angular/core';
import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons, NgbCarousel, NgbCarouselModule, NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RegisterService } from 'src/register/register.service';
import { config } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  standalone: true,
  imports: [NgbDatepickerModule, NgbCarouselModule, NgIf, NgFor,MatButtonModule],
  styleUrls: ['./nav.component.css'],
  providers:[NgbCarouselConfig]
})
export class NavComponent {
  closeResult: string;
  showLogin:boolean=true;
  showProfile:boolean=false;
  showNavigationArrows = false;
	showNavigationIndicators = false;
	images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/350/300`);

	constructor(private offcanvasService: NgbOffcanvas, config: NgbCarouselConfig, private registerService:RegisterService) {
    config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
  }

	openEnd(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'end' });
	}

    checkLogin():boolean{
        let check;
        this.registerService.currentLoginCheck.subscribe(d => check = d);
        return check;
    }

    checkProfile(){
        let check;
        this.registerService.currentProfileCheck.subscribe(d => check = d);
        return check;
    }
 
}
