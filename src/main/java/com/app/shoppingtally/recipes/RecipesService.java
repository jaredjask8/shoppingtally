package com.app.shoppingtally.recipes;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.app.shoppingtally.auth.AuthenticationService;
import com.app.shoppingtally.config.JwtService;
import com.app.shoppingtally.list.ListRepository;
import com.app.shoppingtally.shopping.CurrentOrderRepo;
import com.app.shoppingtally.user.UserRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecipesService {
	
	private final RecipesRepository recipesRepo;
	
	
	
	Recipes getFirstName(){
		List<Recipes> recipeInstance = recipesRepo.findAll();
		
		Recipes recipe = recipeInstance.get(0);
		List<String> tempArray = recipe.getDirections();
		tempArray.add("Meanwhile, melt 1 teaspoon butter in a skillet over medium heat; cook and stir onion until light brown, about 10 minutes. Transfer onion to a mixing bowl.");
		recipe.setDirections(tempArray);
		//recipesRepo.save(recipe);
//		recipesRepo.insert(Recipes.builder()
//				.description("test")
//				.name("test")
//				.build());
		
		return recipe;
	}
}
