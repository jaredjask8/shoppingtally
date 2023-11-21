package com.app.shoppingtally.list.models;

import com.app.shoppingtally.auth.models.ListItemResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListItemWithCategoryRequest {
	ListItemResponse item;
	String category;
}
