import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Recipes } from './models/Recipes';

@Injectable({
  providedIn: 'root'
})
export class MealkitService implements OnInit{

  constructor(private http:HttpClient) { }

  ngOnInit(){
    
  }

  getRecipes():Observable<Recipes>{
    return this.http.get<Recipes>("http://localhost:8080/recipes")
  }
}
