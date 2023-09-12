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
    let map: google.maps.Map;
    async function initMap(): Promise<void> {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      map = new Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 30.50446594735964, lng: -84.2453578604141 },
      zoom: 11,
      backgroundColor:"5fd8d9",
      disableDefaultUI: true,
      keyboardShortcuts:false,
      });

      

      for(let i = 0; i < markers.length; i++){
        var marker = new google.maps.Marker({
          position: {lat: markers[i].lat, lng: markers[i].lng},
          title:markers[i].name
          
        });

        marker.setMap(map)
      }

      map.setOptions({styles:googleMapOptions})
    }

    initMap();

    gsap.registerPlugin(ScrollTrigger);
      gsap.to(".whyContainer", {backgroundColor:"black",duration:3, scrollTrigger:{
        trigger: ".whyContainer",
        scrub:.1,
        markers:true
      }});
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas:document.querySelector('#model'),
    });
    scene.background = new THREE.Color(0x7c8b9e)
    renderer.setPixelRatio();
    renderer.setSize(window.innerWidth-20, window.innerHeight);
    renderer.render(scene,camera);
    const pointLight = new THREE.AmbientLight(0xffffff,1);
    pointLight.position.set(0,0,0);
    scene.add(pointLight);

    const controls = new OrbitControls(camera, renderer.domElement)
    const loader = new GLTFLoader();
    const loaderBroccoli = new GLTFLoader();
    const loaderLogo = new GLTFLoader();
    const loaderCart = new GLTFLoader();

    const loaderOrange = new GLTFLoader();

    let appleModel;
    let shoppingTallyLogo;
    let broccoliModel;
    let cart;

    loader.load( '../assets/3d_models/apple.glb', function ( glb ) {
      appleModel = glb.scene;
      //scene.add (glb.scene);
      function animateApple(){
        requestAnimationFrame(animateApple);
        appleModel.rotation.y += .002;
        appleModel.rotation.x += .002;
        appleModel.rotation.z += .002;
        renderer.render(scene, camera)
      }
      shoppingTallyLogo.add(appleModel)
      animateApple();
    });
    

    

    loaderBroccoli.load('../assets/3d_models/broccoli.glb', function( glb){
      broccoliModel = glb.scene;
      //scene.add(glb.scene)
      function animateBroccoli(){
        requestAnimationFrame(animateBroccoli);
        broccoliModel.rotation.y += .002;
        broccoliModel.rotation.x += .002;
        broccoliModel.rotation.z += .002;
      }
      shoppingTallyLogo.add(broccoliModel)
      animateBroccoli();
    });

    loaderLogo.load( '../assets/3d_models/shoppingtally.glb', function ( glb ) {
      shoppingTallyLogo = glb.scene;
      scene.add (shoppingTallyLogo);
    });

    loaderCart.load( '../assets/3d_models/cart.glb', function ( glb ) {
      cart = glb.scene;
      scene.add (cart);
    });

  }

}
