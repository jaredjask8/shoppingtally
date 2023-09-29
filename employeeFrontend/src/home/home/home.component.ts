import { AfterViewInit, ChangeDetectorRef, Component,ElementRef,HostBinding,OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
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

const testimonials:Testimonial[] = [
  {
    initials:"BF",
    body:"Jay has been shopping for us for three years. He is a true professional and takes pride in knowing your likes/dislikes so you don't have to compromise on what you would choose if you were shopping. The ease of using his service allows me time for other things which is a huge value for me. On top of it all, Jay is just so awesome, we didn't only get groceries, we got an amazing friend we look forward to seeing all the time.",
  },
  {
    initials:"TD",
    body:"I've been using Jay as my personal shopper for about 2 months! He is fantastic! He pays attention to details! He picks quality items. He communicates if they are out of a requested item & he's always on time! Jay is amazing!"
  },
  {
    initials:"KK",
    body:"Had a fabulous experience with Jay today. I've been out of town for several months and had to reorient myself to the process. Jay was extremely helpful and even squeezed me in on his busy Saturday. Thank you Jay for all you do."
  },
  {
    initials:"SB",
    body:"Jay is the best! He always gets exactly what we ask for and even remembers our favorite items and makes sure we get what we need and what we want! We would not know what to do without Jay and would recommend him to everyone to make their life better and easier. Our dogs even get excited when Jay comes to the door because he is so friendly and has become a great friend."
  },
  {
    initials:"RL",
    body:"Jay is amazing! He has been our personal shopper for years and we have never had an issue. He goes out of his way to assure he gets exactly what we like. I recommend this business with no reservations."
  },
  {
    initials:"AG",
    body:"Shopping in-store with two young kids is not ideal. We've been working with Jay for quite a while now, and he has taken all the stress of shopping away. He's thorough, timely, trustworthy, and quickly learns preferences/dislikes. Makes my life so much easier!"
  },
  {
    initials:"SR",
    body:"Jay took so much time going over Any List and making sure I understood his services. I have used Jay for over a year and I won't deal with anyone else. Jay you are the best!"
  }
  
]


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('100ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('100ms', style({ opacity: 0 }))
  ])
]),
  
  ]
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



  
    

  constructor(private userService:EnvironmentService, private renderer:Renderer2, private cdr: ChangeDetectorRef){
    
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
  
        //console.log(tempArray)
        this.testimonials.reset(tempArray)
        
        console.log(this.testimonials)
  
        
      }
  
      ,10000)
    }else if(window.innerWidth <= 900){
      this.mobileResolution.next(true)
      this.cdr.detectChanges()
      console.log("in")
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
  
        //console.log(tempArray)
        this.testimonials.reset(tempArray)
        
        console.log(this.testimonials)
  
        
      }
  
      ,10000)
    }
    
  }


  ngOnInit(): void {
    this.mobileResolution$ = this.mobileResolution.asObservable()
    if(window.innerWidth >= 900){
      this.mobileResolution.next(false)
    }
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
  
        //console.log(tempArray)
        this.testimonials.reset(tempArray)
        
        console.log(this.testimonials)
  
        
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
  
        //console.log(tempArray)
        this.testimonials.reset(tempArray)
        
        console.log(this.testimonials)
  
        
      }
  
      ,10000)
    }
  }

}
