package com.app.shoppingtally.event;

import org.springframework.context.ApplicationEvent;

import com.app.shoppingtally.user.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrationCompleteEvent extends ApplicationEvent{
	
	
	private User user;
	private String applicationUrl;
	
	public RegistrationCompleteEvent(Object source) {
		super(source);
		// TODO Auto-generated constructor stub
	}
	
	public RegistrationCompleteEvent(User user, String applicationUrl) {
		super(user);
		this.user = user;
		this.applicationUrl = applicationUrl;
	}

}
