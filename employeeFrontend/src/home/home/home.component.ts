import { Component,HostBinding,OnInit } from '@angular/core';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [routeAnimationState]
})
export class HomeComponent implements OnInit{
  @HostBinding('@routeAnimationTrigger') routeAnimation = true;
  showMessage:boolean = false;
  mobile:boolean;

  constructor(private userService:EnvironmentService){}
  ngOnInit(): void {

    if (window.screen.width === 360) { // 768px portrait
      this.mobile = true;
    }
    // let map: google.maps.Map;
    // async function initMap(): Promise<void> {
    //   const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    //   map = new Map(document.getElementById("map") as HTMLElement, {
    //   center: { lat: 30.50446594735964, lng: -84.2453578604141 },
    //   zoom: 11,
    //   backgroundColor:"5fd8d9",
    //   disableDefaultUI: true,
    //   keyboardShortcuts:false,
    //   });

      

    //   for(let i = 0; i < markers.length; i++){
    //     var marker = new google.maps.Marker({
    //       position: {lat: markers[i].lat, lng: markers[i].lng},
    //       title:markers[i].name
          
    //     });

    //     marker.setMap(map)
    //   }

    //   map.setOptions({styles:googleMapOptions})
    // }

    // initMap();

    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".whatsNew1", {opacity:"1", scrollTrigger:{
      trigger: ".whatsNew1",
      scrub:.5,
      //markers:true,
      end:"+=500"
    }});
    gsap.to(".whatsNew2", {opacity:"1", scrollTrigger:{
      trigger: ".whatsNew2",
      scrub:.5,
      //markers:true,
      end:"+=500"
    }});

    gsap.to(".testDataContainer", {scale:1, scrollTrigger:{
      trigger: ".testTitle",
      scrub:.1,
      //markers:true,
      end:"+=800"
    }});

    
    
  }

  onResize(event) {
    event.target.innerWidth <= 500 ? this.mobile = true : this.mobile = false;
  }

}
