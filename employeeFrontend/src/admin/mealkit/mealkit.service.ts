import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { Recipes } from './models/Recipes';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MealkitService implements OnInit{
  
  constructor(private http:HttpClient, private userService:EnvironmentService) { }

  ngOnInit(){
    
  }

  addRecipe(recipe:Recipes):Observable<Recipes[]>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<Recipes[]>(environment.apiUrl+"/api/v1/recipes/addRecipe",recipe,{headers:headers})
  }

  getRecipes():Observable<Recipes[]>{
    let token = this.userService.getEnvironment().token
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post<Recipes[]>(environment.apiUrl+"/api/v1/recipes/getRecipes",null,{headers:headers})
  }

  deleteRecipe(recipe:Recipes):Observable<Recipes[]>{
    return this.http.post<Recipes[]>(environment.apiUrl+"/api/v1/recipes/deleteRecipes",recipe)
  }

  updateRecipe(recipe:Recipes):Observable<Recipes[]>{
    return this.http.post<Recipes[]>(environment.apiUrl+"/api/v1/recipes/updateRecipes",recipe)
  }
}
