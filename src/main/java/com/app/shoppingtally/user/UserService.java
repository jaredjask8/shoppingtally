package com.app.shoppingtally.user;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.shoppingtally.exception.UserNotFoundException;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserRepo;

import jakarta.persistence.Tuple;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
@Transactional
@Service
@Slf4j
public class UserService {
	private final UserRepo userRepo;
	
	@Autowired
	public UserService(UserRepo userRepo) {
		this.userRepo = userRepo;
	}
	
	public List<User> getUsers() {
		return userRepo.findAll();
	}
	
	public User addUser(User user) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
		String hashedPassword = encoder.encode(user.getPassword());
		user.setPassword(hashedPassword);
		return userRepo.save(user);
	}
	
	public User updateEmployee(User updateUser) {
		return userRepo.save(updateUser);
	}
	
	public void deleteUser(Long id) {
		userRepo.deleteUserById(id);
	}
	
	public boolean authenticateUser(User user) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
		try {
			Optional<User> databaseUser = userRepo.findByEmail(user.getEmail());
			return encoder.matches(user.getPassword(), databaseUser.get().getPassword());
		}catch(NoSuchElementException ex) {
			return false;
		}
		
		
		
//		Long getId;
//		try {
//			getId = databaseUser.get().getId();
//		}catch(NoSuchElementException e) {
//			getId = (long) 0;
//		}
//		
//		if(getId != 0) {
//			
//		}else {
//			return false;
//		}
		 
	}
	
	
}
