package com.app.shoppingtally;

import java.util.Arrays;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.app.shoppingtally.affiliate.AffiliateData;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class ShoppingtallyApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShoppingtallyApplication.class, args);
	}
	
	@PostConstruct
    public void init(){
      // Setting Spring Boot SetTimeZone
      TimeZone.setDefault(TimeZone.getTimeZone("EST"));
    }

}
