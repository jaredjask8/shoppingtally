package com.app.shoppingtally.recipes;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {
	String basicIngredient;
	String recipeIngredient;
	String unit;
	String quantity;
	String initialQuantity;
}