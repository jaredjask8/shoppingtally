import { Component } from '@angular/core';
import { Review } from './models/Review';
import { FormControl, Validators } from '@angular/forms';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  constructor(config: NgbRatingConfig){
    config.max = 5;
  }
  readonly = true;
  currentRate = 0;
  reviews:Review[]=[
    {
      title:"Bad review",
      review:"Service was awful",
      rating:2
    },
    {
      title:"Good review",
      review:"Service was good",
      rating:5
    }
  

]
}
