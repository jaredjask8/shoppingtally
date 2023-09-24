import { Component, OnInit } from '@angular/core';
import { Review } from './models/Review';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { ReviewsService } from './reviews.service';



@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit{
  
  constructor(config: NgbRatingConfig, private reviewsService:ReviewsService){
    config.max = 5;
  }
  ngOnInit(): void {
    this.reviewsService.getReviews().subscribe(d => this.reviews = d);
  }
  review=""
  reviewTitle=""
  readonly = true;
  currentRate = 0;
  reviews:Review[]=[]

  createReview(){
    this.reviewsService.sendReview(new Review(this.reviewTitle,this.review,this.currentRate)).subscribe(d => this.reviews = d);
  }


}
