package com.app.shoppingtally.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.app.shoppingtally.exception.UserNotFoundException;
import com.app.shoppingtally.user.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserRegistrationDetailsService implements UserDetailsService{

	private final UserRepo repo;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		return repo.findByEmail(email).map(UserRegistrationDetails::new).orElseThrow(() -> new UserNotFoundException("User not found"));
	}

}
