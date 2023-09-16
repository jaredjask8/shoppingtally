import { Component,OnInit } from '@angular/core';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  showMessage:boolean = false;

  constructor(private userService:EnvironmentService){}
  ngOnInit(): void {
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

    // gsap.registerPlugin(ScrollTrigger);
    //   gsap.to(".whyContainer", {backgroundColor:"black",duration:3, scrollTrigger:{
    //     trigger: ".whyContaine r",
    //     scrub:.1,
    //     markers:false
    //   }});
  }

}
