package com.app.shoppingtally.auth;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.data.repository.CrudRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.shoppingtally.auth.models.CurrentList;
import com.app.shoppingtally.auth.models.ListFromFrontend;
import com.app.shoppingtally.auth.models.ListToFrontend;
import com.app.shoppingtally.auth.models.ListToFrontendWithCount;
import com.app.shoppingtally.auth.models.ListItem;
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
				.currentList("")
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
	
	public void updateCurrentList(ListItem item) {
		User user = repository.findByEmail(jwtService.extractUsername(item.getToken())).get();
		String test = user.getCurrentList();
		user.setCurrentList(test+=item.getCurrentItem());
		repository.save(user);
	}
	
	public ListToFrontendWithCount deleteListItem(ListFromFrontend list) {
		User user = repository.findByEmail(jwtService.extractUsername(list.getToken())).get();
		user.setCurrentList(list.getList());
		repository.save(user);
		return getCurrentList(list.getToken());
	}
	
	public ListToFrontendWithCount getCurrentList(String token) {
		List<ListToFrontend> listArray = new ArrayList();
		Integer itemCount=0;
		
		User user = repository.findByEmail(jwtService.extractUsername(token)).get();
		var tempArray = user.getCurrentList().split("~");
		if(tempArray[0] != "") {
			itemCount = tempArray.length;
		}
		//log.info(itemCount.toString() + " hello");
		Stream<String> arr_stream = Arrays.stream(tempArray);
		arr_stream.forEach((d) -> {
			
			if(d != "") {
				var splitByCategory = d.split("\\+");
				var image = splitByCategory[0];
				var name = splitByCategory[1];
				var quantity = splitByCategory[2];
				listArray.add(new ListToFrontend(image,name,quantity));
			}
			
			
		});
		return new ListToFrontendWithCount(listArray,itemCount);
	}
	
}
