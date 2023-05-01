package com.app.shoppingtally.event;

import java.util.UUID;

import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class RegistrationCompleteEventListener implements ApplicationListener<RegistrationCompleteEvent>{

	private final UserService userService;
	
	@Override
	public void onApplicationEvent(RegistrationCompleteEvent event) {
		User theUser = event.getUser();
		String verificationToken = UUID.randomUUID().toString();
		userService.saveUserVerificationToken(theUser, verificationToken);
		String url = event.getApplicationUrl()+"/register/verifyEmail?token="+verificationToken;
		log.info("Click the link to verify : {}",url);
	}

}
