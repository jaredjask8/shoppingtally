package com.app.shoppingtally.auth;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.shoppingtally.auth.models.CurrentList;
import com.app.shoppingtally.auth.models.FullListRequest;
import com.app.shoppingtally.auth.models.ListFromFrontend;
import com.app.shoppingtally.auth.models.ListItemRequest;
import com.app.shoppingtally.auth.models.ListItemResponse;
import com.app.shoppingtally.auth.models.ListToFrontendWithCount;
import com.app.shoppingtally.token.Token;
import com.app.shoppingtally.user.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthenticationController {
	private final AuthenticationService service;
	
	@PostMapping("/register")
	public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request){
		return ResponseEntity.ok(service.register(request));
	}
	
	@PostMapping("/authenticate")
	public AuthenticationResponse authenticate(@RequestBody AuthenticationRequest request){
		return service.authenticate(request);
	}
	
	@PostMapping("/user")
	public User getUser(@RequestBody Token token){
		return service.getUser(token);
	}
	
	@CrossOrigin
	@PostMapping("/addToList")
	public String addToList(@RequestBody ListItemRequest item) {
		return service.updateCurrentList(item);
	}
	
	@GetMapping("/checkUser")
	public boolean checkUser(@RequestBody String requestedEmail) {
		return service.checkUser(requestedEmail);
	}
	
	@CrossOrigin
	@PostMapping("/addFullList")
	public String addToList(@RequestBody FullListRequest list) {
		return service.updateCurrentListWithFullList(list);
		
	}
	
	@CrossOrigin
	@PostMapping("/deleteListItem")
	public ListToFrontendWithCount deleteListItem(@RequestBody ListFromFrontend item) {
		ListToFrontendWithCount newList = service.deleteListItem(item);
		return newList;
	}
	
	@CrossOrigin
	@PostMapping("/getUserList")
	public ResponseEntity<ListToFrontendWithCount> getCurrentList(@RequestBody String token) {
		return new ResponseEntity<ListToFrontendWithCount>(service.getCurrentList(token), HttpStatus.OK);
	}
	
	@CrossOrigin
	@PostMapping("/updateQuantity")
	public ListToFrontendWithCount increaseQuantity(@RequestBody FullListRequest list){
		return service.updateQuantity(list);
	}
	
	@CrossOrigin
	@PostMapping("/getCartCount")
	public String getCartCount(@RequestHeader(HttpHeaders.AUTHORIZATION) String token){
		return service.getCartCount(token);
	}
}
