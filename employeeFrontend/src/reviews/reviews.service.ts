import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from './models/Review';
import { Observable } from 'rxjs/internal/Observable';
import { EnvironmentService } from 'src/global/utility/environment.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http:HttpClient, private userService:EnvironmentService) { }

  sendReview(review:Review):Observable<Review[]>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.userService.getEnvironment().token).set('Access-Control-Allow-Origin', '*');
    return this.http.post<Review[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/reviews", review, {headers});
  }

  getReviews():Observable<Review[]>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.userService.getEnvironment().token).set('Access-Control-Allow-Origin', '*');
    return this.http.post<Review[]>("https://shoppingtally.click/test/shoppingtally-0.0.2-SNAPSHOT/api/v1/reviews/all", null, {headers});
  }
}
