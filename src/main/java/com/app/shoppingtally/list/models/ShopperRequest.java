package com.app.shoppingtally.list.models;

import com.app.shoppingtally.list.UserList;
import com.app.shoppingtally.user.User;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShopperRequest {
	String token;
	int shopperId;
}
