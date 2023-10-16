package com.app.shoppingtally.auth.models;

import com.app.shoppingtally.token.Token;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListItem {
	
	
	private String token;
	private String currentItem;
	
}
