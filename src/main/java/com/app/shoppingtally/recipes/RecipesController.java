package com.app.shoppingtally.recipes;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.shoppingtally.user.User;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/recipes")
public class RecipesController {

	private final RecipesService recipeService;
	
	
	@PostMapping("/addRecipe")
	public void addRecipe(@RequestBody Recipes recipe){
		recipeService.addRecipe(recipe);
		
	}
	
	@PostMapping("/getRecipes")
	public List<Recipes> getRecipes(){
		return recipeService.getRecipes();
		
	}
}
