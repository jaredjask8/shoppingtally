package com.app.shoppingtally.socket;

import com.app.shoppingtally.user.Role;
import com.app.shoppingtally.user.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {
	private String messageContent;
}
