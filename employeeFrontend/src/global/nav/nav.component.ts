import { Component, TemplateRef, ViewEncapsulation} from '@angular/core';
import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons, NgbCarousel, NgbCarouselModule, NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  standalone: true,
  imports: [NgbDatepickerModule, NgbCarouselModule, NgIf, NgFor],
  styleUrls: ['./nav.component.css'],
  providers:[NgbCarouselConfig]
})
export class NavComponent {
  closeResult: string;
  showNavigationArrows = false;
	showNavigationIndicators = false;
	images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/350/300`);

	constructor(private offcanvasService: NgbOffcanvas, config: NgbCarouselConfig) {
    config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
  }

	openEnd(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'end' });
	}
 
}
