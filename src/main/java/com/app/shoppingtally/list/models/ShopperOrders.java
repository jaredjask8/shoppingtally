package com.app.shoppingtally.list.models;

import java.util.List;
import java.util.Optional;

import com.app.shoppingtally.auth.models.ListItemResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopperOrders {
	OrderData data;
	String date;
	List<ListItemResponse> list;
	String isActive;
	String isCompleted;
}
