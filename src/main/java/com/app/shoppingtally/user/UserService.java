package com.app.shoppingtally.user;

import java.util.Calendar;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.shoppingtally.exception.UserNotFoundException;
import com.app.shoppingtally.exceptions.UserAlreadyExistsException;
import com.app.shoppingtally.registration.VerificationToken;
import com.app.shoppingtally.registration.VerificationTokenRepo;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserRepo;

import jakarta.persistence.Tuple;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Transactional
@Service
@Slf4j
@RequiredArgsConstructor
public class UserService implements IUserService{
	
	private final UserRepo userRepo;
	private final PasswordEncoder passwordEncoder;
	private final VerificationTokenRepo tokenRepository;
	
	@Override
	public List<User> getUsers() {
		return userRepo.findAll();
	}

	@Override
	public User registerUser(RegistrationRequest request) {
		Optional<User> user = this.findByEmail(request.email());
		if(user.isPresent()) {
			throw new UserAlreadyExistsException("User already exists");
		}
		
		var newUser = new User();
		newUser.setFirstname(request.firstname());
		newUser.setLastname(request.lastname());
		newUser.setEmail(request.email());
		newUser.setPassword(passwordEncoder.encode(request.password()));
		newUser.setRole(request.role());
		return userRepo.save(newUser);
	}

	@Override
	public Optional<User> findByEmail(String email) {
		return userRepo.findByEmail(email);
	}

	@Override
	public void saveUserVerificationToken(User theUser, String token) {
		
		var verificationToken = new VerificationToken(token, theUser);
		tokenRepository.save(verificationToken);
		
	}
	
	@Override
	public String validateToken(String theToken) {
		VerificationToken token = tokenRepository.findByToken(theToken);
		if(token == null) {
			return "Invalid verification token";
		}
		
		User user = token.getUser();
		Calendar calendar = Calendar.getInstance();
		
		if((token.getExpirationTime().getTime() - calendar.getTime().getTime()) < 0) {
			tokenRepository.delete(token);
			return "Token already expired";
		}
		
		user.setEnabled(true);
		userRepo.save(user);
		return "Valid";
	}
	
	
	
	
}
