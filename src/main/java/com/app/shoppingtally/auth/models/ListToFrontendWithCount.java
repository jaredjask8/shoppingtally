package com.app.shoppingtally.auth.models;

import java.util.List;
import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListToFrontendWithCount {
	List<ListItemResponse> list;
	int itemCount;
	String date;
	
}
