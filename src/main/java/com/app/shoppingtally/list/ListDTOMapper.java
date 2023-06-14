package com.app.shoppingtally.list;

import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.app.shoppingtally.date.Date;
import com.app.shoppingtally.date.DateDTO;

@Service
public class ListDTOMapper implements Function<UserList, ListDTO>{
	
	@Override
	public ListDTO apply(UserList list) {
		return new ListDTO(list.getList(), list.getDate());
	}
}
