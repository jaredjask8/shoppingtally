package com.app.shoppingtally.registration;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.shoppingtally.event.RegistrationCompleteEvent;
import com.app.shoppingtally.user.RegistrationRequest;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/register")
public class RegistrationController {
	private final UserService userService;
	private final ApplicationEventPublisher publisher;
	private final VerificationTokenRepo tokenRepo;
	
	@PostMapping
	public String registerUser(@RequestBody RegistrationRequest registrationRequest, final HttpServletRequest request) {
		User user = userService.registerUser(registrationRequest);
		publisher.publishEvent(new RegistrationCompleteEvent(user,applicationUrl(request)));
		return "Success!";
	}
	
	@GetMapping("/verifyEmail")
	public String verifyEmail(@RequestParam("token") String token) {
		VerificationToken theToken = tokenRepo.findByToken(token);
		if(theToken.getUser().isEnabled()) {
			return "Account is verified already";
		}
		
		String verificationResult = userService.validateToken(token);
		if(verificationResult.equalsIgnoreCase("valid")) {
			return "Email verified successfully";
		}else {
			return "Invalid verification token";
		}
	}
	
	
	
	
	public String applicationUrl(HttpServletRequest request) {
		return "http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath();
	}
}
