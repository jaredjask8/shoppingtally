package com.app.shoppingtally.shopping;

import java.util.List;

import com.app.shoppingtally.auth.models.ListItemResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurrentOrderEntityUserResponseWithUpdateMessage {
	String token;
	String date;
	String updateMessage;
	
	List<ListItemResponse> todo;
	List<ListItemResponse> deli;
	List<ListItemResponse> bakery;
	List<ListItemResponse> household;
	List<ListItemResponse> health;
	List<ListItemResponse> frozen;
	List<ListItemResponse> dairy;
	List<ListItemResponse> produce;
	List<ListItemResponse> beverages;
	List<ListItemResponse> bread;
	List<ListItemResponse> international;
	List<ListItemResponse> baking;
	List<ListItemResponse> grains;
	List<ListItemResponse> snacks;
	List<ListItemResponse> pet;
	List<ListItemResponse> breakfast;
	List<ListItemResponse> meat;
	List<ListItemResponse> completed;
}