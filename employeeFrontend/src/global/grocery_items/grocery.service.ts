import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Items } from 'src/list/models/Items';

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  private baseUrl:string = "https://trackapi.nutritionix.com/v2/search/instant?query="
  constructor(private http:HttpClient) {
    
  }

  getItems(query:string):Observable<Items>{
    let headers = new HttpHeaders().set('x-app-id','3842957a').set('x-app-key','56651a6e7deed8cd569dd79142aa6f32');
    return this.http.get<Items>(this.baseUrl+query, {headers})
  }
}
