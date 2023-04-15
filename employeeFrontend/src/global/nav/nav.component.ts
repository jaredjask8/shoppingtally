import { Component, OnInit} from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  standalone: true,
	imports: [NgbNavModule],
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{
  active = 1;
  
  ngOnInit(): void {
    setInterval(() => {
      this.active++;
      if(this.active == 4) this.active = 1;
    }, 4000);
  }
  
 
}
