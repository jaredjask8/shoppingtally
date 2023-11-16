package com.app.shoppingtally.list.models;

import java.util.List;

import com.app.shoppingtally.auth.models.ListItemResponse;
import com.app.shoppingtally.shopping.CurrentOrderEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryUpdateRequest {
	String toCategory;
	List<ListItemResponse> currentCategoryList;
	String fromCategory;
	List<ListItemResponse> previousCategoryList;
}
