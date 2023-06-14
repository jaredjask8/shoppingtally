package com.app.shoppingtally.date;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.shoppingtally.config.JwtService;
import com.app.shoppingtally.token.Token;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserRepo;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class DateService {
	private final DateRepo dateRepo;
	private final UserRepo userRepo;
	private final DateDTOMapper dateDTOMapper;
	private final JwtService jwtService;
	
	@Autowired
	public DateService(DateRepo dateRepo, UserRepo userRepo, DateDTOMapper dateDTOMapper, JwtService jwtService) {
		this.dateRepo = dateRepo;
		this.userRepo = userRepo;
		this.dateDTOMapper = dateDTOMapper;
		this.jwtService = jwtService;
	}
	
	
	public Date addDate(Date date) {
		Optional<User> user = userRepo.findByEmail(date.getEmail());
		date.setFid(user.get().getId());
		return dateRepo.save(date);
	}
	
	public List<DateDTO> getUserDates(Token token){
		Optional<User> foundUser = userRepo.findByEmail(jwtService.extractUsername(token.getToken()));
		List<DateDTO> list = dateRepo.findByFid(foundUser.get().getId())
				.stream()
				.map(dateDTOMapper)
				.collect(Collectors.toList());
		return list;
	}
	
	
}
