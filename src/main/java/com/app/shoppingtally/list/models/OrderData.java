package com.app.shoppingtally.list.models;

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
public class OrderData {
	String firstname;
	String lastname;
	String phone;
	String address;
	String email;
}
