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
	
	
	
	List<Recipes> addRecipe(Recipes recipe){
		recipesRepo.insert(recipe);
		return recipesRepo.findAll();
	}
	
	List<Recipes> getRecipes(){
		return recipesRepo.findAll();
	}
	
	List<Recipes> updateRecipes(Recipes recipe) {
		recipesRepo.save(recipe);
		return recipesRepo.findAll();
	}
	
	List<Recipes> deleteRecipes(Recipes recipe) {
		recipesRepo.delete(recipe);
		return recipesRepo.findAll();
	}
}