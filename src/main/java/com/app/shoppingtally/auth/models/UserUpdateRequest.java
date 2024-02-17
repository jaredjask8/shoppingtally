package com.app.shoppingtally.auth.models;

import com.app.shoppingtally.list.models.CurrentOrder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {
	String userUpdate;
	String choice;
}
