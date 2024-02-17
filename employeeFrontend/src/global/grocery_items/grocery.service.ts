import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { GoogleImage } from 'src/list/models/GoogleImage';
import { Items } from 'src/list/models/Items';

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  private imageApiUrl:string = "https://www.googleapis.com/customsearch/v1?searchType=image&key=AIzaSyDlgMBQKvqL3_ilHex8BzPybSxJpfIO7jU&cx=65c8727d3bdf44d93&q="
  constructor(private http:HttpClient) {
    
  }



  getImages(query:string):Observable<GoogleImage>{
    let queryString = query.replaceAll(" ", "+")
    return this.http.get<GoogleImage>(this.imageApiUrl+queryString)
  }
}
