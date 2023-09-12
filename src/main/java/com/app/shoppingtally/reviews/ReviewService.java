package com.app.shoppingtally.reviews;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.app.shoppingtally.config.JwtService;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserRepo;

@Service
public class ReviewService {
	private final UserRepo userRepo;
	private final ReviewsRepo reviewRepo;
	private final JwtService jwtService; 
	
	private ReviewService(UserRepo userRepo, ReviewsRepo reviewRepo, JwtService jwtService) {
		this.userRepo = userRepo;
		this.reviewRepo = reviewRepo;
		this.jwtService = jwtService;
	}
	
	void addReview(String token, Review review){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(token));
		review.setUser(user.get());
		reviewRepo.save(review);
	}
	
	List<Review> getReviews() {
		return reviewRepo.findAll();
	}
}
