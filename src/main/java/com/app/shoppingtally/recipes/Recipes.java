package com.app.shoppingtally.recipes;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import com.app.shoppingtally.shopping.CurrentOrderEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "recipes")
public class Recipes {
	@Id
	public String id;
	public String name;
	public List<Ingredient> ingredients;
	public List<String> directions;
	public String description;
}
