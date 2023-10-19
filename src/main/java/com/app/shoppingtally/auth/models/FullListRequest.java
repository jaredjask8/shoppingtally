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
public class FullListRequest {
	String token;
	List<ListItemResponse> list;
}
