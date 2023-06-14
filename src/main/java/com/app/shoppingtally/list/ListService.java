package com.app.shoppingtally.list;

import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

import com.app.shoppingtally.config.JwtService;
import com.app.shoppingtally.token.Token;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ListService {
	private final ListRepository listRepo;
	private final JwtService jwtService;
	private final UserRepo userRepo;
	private final ListDTOMapper listDTOMapper;
	
	void addList(UserList list){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(list.getToken()));
		list.setUser(user.get());
		listRepo.save(list);
	}
	
	List<ListDTO> getUserListData(Token token){
		Optional<User> foundUser = userRepo.findByEmail(jwtService.extractUsername(token.getToken()));
		List<ListDTO> list = listRepo.findByUserId(foundUser.get().getId()).stream().map(listDTOMapper).collect(Collectors.toList());
		return list;
	}
	
	List<String> getAllUserDates(){
		return listRepo.getAllUserDates();
	}
	

}
