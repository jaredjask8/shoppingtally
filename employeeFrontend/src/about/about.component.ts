import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';



@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements AfterViewChecked{
  

  
  
  constructor(private renderer : Renderer2){}
  ngAfterViewChecked(): void {
  }
  

  
  ngOnInit(): void {
    

    
  }
  


  
}
