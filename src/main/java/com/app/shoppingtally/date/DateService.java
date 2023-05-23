package com.app.shoppingtally.date;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserRepo;
import com.app.shoppingtally.user.UserService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class DateService {
	private final DateRepo dateRepo;
	private final UserRepo userRepo;
	private final UserService userService;
	private final DateDTOMapper dateDTOMapper;
	
	@Autowired
	public DateService(DateRepo dateRepo, UserRepo userRepo, UserService userService, DateDTOMapper dateDTOMapper) {
		this.dateRepo = dateRepo;
		this.userRepo = userRepo;
		this.userService = userService;
		this.dateDTOMapper = dateDTOMapper;
	}
	
	
	public Date addDate(Date date) {
		Optional<User> user = userService.findByEmail(date.getEmail());
		date.setFid(user.get().getId());
		return dateRepo.save(date);
	}
	
	public List<DateDTO> getUserDates(User user){
		Optional<User> foundUser = userService.findByEmail(user.getEmail());
		return dateRepo.findByFid(foundUser.get().getId())
				.stream()
				.map(dateDTOMapper)
				.collect(Collectors.toList());
	}
}
