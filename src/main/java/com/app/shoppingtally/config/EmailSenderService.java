package com.app.shoppingtally.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {
	@Autowired
	private JavaMailSender mailSender;
	
	public void sendEmail(String toEmail, String subject) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("system.shoppingtally@gmail.com");
		message.setTo(toEmail);
		message.setSubject(subject);
		message.setText("");
		
		mailSender.send(message);
		
		
	}
}
