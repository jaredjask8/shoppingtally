package com.app.shoppingtally.reviews;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.shoppingtally.config.JwtService;
import com.app.shoppingtally.list.ListService;

import java.util.List;

import org.springframework.http.HttpHeaders;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {
	private final ReviewService reviewService;
	private final JwtService jwtService;
	
	public ReviewController(ReviewService reviewService, JwtService jwtService) {
		this.reviewService = reviewService;
		this.jwtService = jwtService;
	}
	
	@PostMapping
	public List<Review> addReview(@RequestBody Review review, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		reviewService.addReview(jwtService.extractFromBearer(token), review);
		return reviewService.getReviews();
	}
	
	@PostMapping("/all")
	public List<Review> getReviews() {
		return reviewService.getReviews();
	}
}
