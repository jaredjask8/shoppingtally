import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from './models/Review';
import { Observable } from 'rxjs/internal/Observable';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private http:HttpClient, private userService:EnvironmentService) { }

  sendReview(review:Review):Observable<Review[]>{
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.userService.getEnvironment().token).set('Access-Control-Allow-Origin', '*');
    return this.http.post<Review[]>(environment.apiUrl+"/api/v1/reviews", review, {headers});
  }

  getReviews():Observable<Review[]>{
    return this.http.get<Review[]>(environment.apiUrl+"/api/v1/reviews/all");
  }
}
