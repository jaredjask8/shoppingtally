package com.app.shoppingtally;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@SpringBootApplication
public class ShoppingtallyApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShoppingtallyApplication.class, args);
	}
	
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/api/v1/demo-controller").allowedOrigins("http://localhost:8080");
				registry.addMapping("/api/v1/list").allowedOrigins("http://localhost:8080");
			}
		};
	}

}
