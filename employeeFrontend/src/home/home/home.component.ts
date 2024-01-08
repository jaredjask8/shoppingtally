import { AfterViewInit, ChangeDetectorRef, Component,ElementRef,HostBinding,OnInit, QueryList, Renderer2, ViewChildren, ViewEncapsulation } from '@angular/core';
import { GroceryService } from 'src/global/grocery_items/grocery.service';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { markers } from 'src/global/googleMapUtility/markers';
import { googleMapOptions } from 'src/global/googleMapUtility/googleMapOptions';
import { Loader } from "@googlemaps/js-api-loader";

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {gsap} from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { routeAnimationState } from 'src/global/routeAnimations';
import { Testimonial } from 'src/models/testimonials/Testimonial';
import { animate, style, transition, trigger } from '@angular/animations';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { WhatsNew } from 'src/models/WhatsNew';
import { AdminService } from 'src/admin/admin.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [ routeAnimationState ],
})
export class HomeComponent implements OnInit,AfterViewInit{
  @HostBinding('@routeAnimationTrigger') routeAnimation = true;
  showMessage:boolean = false;
  

  //Testimonials animation
  tempIndex:ElementRef
  @ViewChildren('test')testimonials:QueryList<ElementRef<HTMLElement>>
  mobileResolution:BehaviorSubject<boolean> = new BehaviorSubject(false);
  desktopResolution:BehaviorSubject<boolean> = new BehaviorSubject(true);
  mobileResolution$:Observable<boolean>
  mobileInterval:any
  desktopInterval:any
  initialDesktopInterval:any
  initialMobileInterval:any
  initialMobileBool:boolean

  //WHATS NEW PROPERTIES
  selectedFile: any;
  imgUrl:any;
  file:File;
  image:any;
  image1;
  title1;
  description1;
  image2;
  title2;
  description2;
  array:WhatsNew[]
  whatsNewList:Observable<WhatsNew[]>



  
    

  constructor(private userService:EnvironmentService, private renderer:Renderer2, private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer, private adminService:AdminService){
    
  }

  ngAfterViewInit(): void {
    if(window.innerWidth >= 900){
      this.mobileResolution.next(false)
      this.initialDesktopInterval = setInterval(() => {
      
        for(let i = 0; i < 7; i++){
          if(i == 0 || i == 6){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'scale','1')
          }else if(i == 1){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','left 2s, opacity 2s, scale 2s')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'left','7%')
            
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'opacity','1')
          }else if(i == 2){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','left 2s')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'left','40%')
          }else if(i == 3){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','left 2s')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'left','73%')
          }else if(i == 4){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','left 2s, opacity 2s, scale 300ms')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'opacity','0')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'scale','0')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'left','-200px')
          }
        }
        
        let tempArray = this.testimonials.toArray()
        this.tempIndex = tempArray[6];
        for (let j = tempArray.length - 1; j >= 0; j--){
          tempArray[j] = tempArray[j-1];
        }
        tempArray[0] = this.tempIndex;
  
        this.testimonials.reset(tempArray)
      
  
        
      }
  
      ,10000)
    }else if(window.innerWidth <= 900){
      this.mobileResolution.next(true)
      this.cdr.detectChanges()
      this.initialMobileInterval = setInterval(() => {
      
        for(let i = 0; i < 7; i++){
          if(i == 0 || i == 6){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'scale','1')
          }else if(i == 1){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','top 2s, opacity 4s, scale 2s')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'top','7%')
            
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'opacity','1')
          }else if(i == 2){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','top 2s')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'top','40%')
          }else if(i == 3){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','top 2s')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'top','73%')
          }else if(i == 4){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','top 2s, opacity 2s, scale 300ms')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'opacity','0')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'scale','0')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'top','-100px')
          }
        }
        
        let tempArray = this.testimonials.toArray()
        this.tempIndex = tempArray[6];
        for (let j = tempArray.length - 1; j >= 0; j--){
          tempArray[j] = tempArray[j-1];
        }
        tempArray[0] = this.tempIndex;
  
        this.testimonials.reset(tempArray)
      
  
        
      }
  
      ,10000)
    }
    
  }


  ngOnInit(): void {
    this.mobileResolution$ = this.mobileResolution.asObservable()
    if(window.innerWidth >= 900){
      this.mobileResolution.next(false)
    }

    this.adminService.getWhatsNew().subscribe(d => {
      this.array = d;
      
      
      // this.image1 = d[0].imageData;
      // this.title1 = d[0].title;
      // this.description1 = d[0].description;

      // this.image2 = d[1].imageData;
      // this.title2 = d[1].title;
      // this.description2 = d[1].description;

    })

    //this.whatsNewList = this.adminService.getWhatsNew()
  }



  onResize(event) {
    clearInterval(this.initialDesktopInterval)
    clearInterval(this.initialMobileInterval)
    event.target.innerWidth <= 900 ? this.mobileResolution.next(true) : this.mobileResolution.next(false);
    clearInterval(this.mobileInterval)
    clearInterval(this.desktopInterval)
    
    if(!this.mobileResolution.value){

      this.desktopInterval = setInterval(() => {
      
        for(let i = 0; i < 7; i++){
          if(i == 0 || i == 6){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'scale','1')
          }else if(i == 1){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','left 2s, opacity 2s, scale 2s')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'left','7%')
            
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'opacity','1')
          }else if(i == 2){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','left 2s')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'left','40%')
          }else if(i == 3){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','left 2s')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'left','73%')
          }else if(i == 4){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','left 2s, opacity 2s, scale 300ms')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'opacity','0')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'scale','0')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'left','-200px')
          }
        }
        
        let tempArray = this.testimonials.toArray()
        this.tempIndex = tempArray[6];
        for (let j = tempArray.length - 1; j >= 0; j--){
          tempArray[j] = tempArray[j-1];
        }
        tempArray[0] = this.tempIndex;
        this.testimonials.reset(tempArray)
      
  
        
      }
  
      ,10000)
    }else{
      //mobile vertical animation
      this.mobileInterval = setInterval(() => {
      
        for(let i = 0; i < 7; i++){
          if(i == 0 || i == 6){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'scale','1')
          }else if(i == 1){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','top 2s, opacity 4s, scale 2s')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'top','7%')
            
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'opacity','1')
          }else if(i == 2){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','top 2s')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'top','40%')
          }else if(i == 3){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','top 2s')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'top','73%')
          }else if(i == 4){
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'transition','top 2s, opacity 2s, scale 300ms')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'opacity','0')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'scale','0')
            this.renderer.setStyle(this.testimonials.get(i).nativeElement,'top','-100px')
          }
        }
        
        let tempArray = this.testimonials.toArray()
        this.tempIndex = tempArray[6];
        for (let j = tempArray.length - 1; j >= 0; j--){
          tempArray[j] = tempArray[j-1];
        }
        tempArray[0] = this.tempIndex;
  
        this.testimonials.reset(tempArray)
      
  
        
      }
  
      ,10000)
    }
  }

  

}
