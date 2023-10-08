package com.app.shoppingtally.date;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.shoppingtally.token.Token;
import com.app.shoppingtally.user.User;

@CrossOrigin
@RestController
@RequestMapping("/api/dates")
public class DateController {
	
	private final DateService dateService;
	
	public DateController(DateService dateService) {
		this.dateService = dateService;

	}
	
	@CrossOrigin
	@PostMapping("/add")
	public String addDates(@RequestBody Date date) {
		dateService.addDate(date);
		return "success";
	}
	
	@CrossOrigin
	@PostMapping("/all")
	public ResponseEntity<List<DateDTO>> getUserDates(@RequestBody Token token){
		return ResponseEntity.ok(dateService.getUserDates(token));
	}
}
