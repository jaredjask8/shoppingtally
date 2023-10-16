package com.app.shoppingtally.auth.models;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListToFrontendWithCount {
	List<ListToFrontend> list;
	int itemCount;
	
	
}
