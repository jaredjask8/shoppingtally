package com.app.shoppingtally.list;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.app.shoppingtally.config.JwtService;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListService {
	private final ListRepository listRepo;
	private final JwtService jwtService;
	private final UserRepo userRepo;
	
	void addList(List list){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(list.getToken()));
		list.setUser(user.get());
		listRepo.save(list);
	}
}
