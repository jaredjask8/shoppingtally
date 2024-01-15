package com.app.shoppingtally.user;

import lombok.Builder;

@Builder
public record UserDTO(
		String firstname,
		String lastname,
		String email,
		String address,
		Role role
) {
	
}
