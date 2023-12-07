package com.app.shoppingtally.recipes;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.shoppingtally.user.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RecipesController {

	private final RecipesService recipeService;
	
	
	@GetMapping("/recipes")
	public Recipes getUsers(){
		return recipeService.getFirstName();
		
	}
}
