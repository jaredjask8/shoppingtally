package com.app.shoppingtally.auth;


import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import com.app.shoppingtally.config.JwtService;
import com.app.shoppingtally.token.Token;
import com.app.shoppingtally.token.TokenRepository;
import com.app.shoppingtally.token.TokenType;
import com.app.shoppingtally.user.Role;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
	
	private final UserRepo repository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final TokenRepository tokenRepository;
	
	public AuthenticationResponse register(RegisterRequest request) {
		var user = User.builder().firstname(request.getFirstname())
				.lastname(request.getLastname())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(Role.USER)
				.build();
		var savedUser = repository.save(user);
		var jwtToken = jwtService.generateToken(user);
		saveUserToken(savedUser,jwtToken);
		return AuthenticationResponse.builder().token(jwtToken).build();
	}

	private void saveUserToken(User user, String jwtToken) {
		var token = Token.builder()
		        .user(user)
		        .token(jwtToken)
		        .tokenType(TokenType.BEARER)
		        .expired(false)
		        .revoked(false)
		        .build();
		    tokenRepository.save(token);
		
	}

	public AuthenticationResponse authenticate(AuthenticationRequest request){
		
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));
			var user = repository.findByEmail(request.getEmail()).orElseThrow();
			var jwtToken = jwtService.generateToken(user);
			saveUserToken(user, jwtToken);
			return AuthenticationResponse.builder().token(jwtToken).build();
		}catch(Exception e){
			return AuthenticationResponse.builder().token(e.getMessage()).build();
		}
		
		
		
		
	}
	
	
	public User getUser(Token token) {
		return repository.findByEmail(jwtService.extractUsername(token.getToken())).get();
	}
	
}
