package com.app.shoppingtally.auth;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.context.annotation.Lazy;
import org.springframework.data.repository.CrudRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.shoppingtally.auth.models.CurrentList;
import com.app.shoppingtally.auth.models.FullListRequest;
import com.app.shoppingtally.auth.models.ListFromFrontend;
import com.app.shoppingtally.auth.models.ListItemResponse;
import com.app.shoppingtally.auth.models.ListToFrontendWithCount;
import com.app.shoppingtally.auth.models.UserUpdateRequest;
import com.app.shoppingtally.auth.models.ListItemRequest;
import com.app.shoppingtally.config.JwtService;
import com.app.shoppingtally.list.ListRepository;
import com.app.shoppingtally.list.ListService;
import com.app.shoppingtally.list.UserList;
import com.app.shoppingtally.token.Token;
import com.app.shoppingtally.token.TokenRepository;
import com.app.shoppingtally.token.TokenType;
import com.app.shoppingtally.user.Role;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserDTO;
import com.app.shoppingtally.user.UserRepo;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
	
	private final UserRepo repository;
	private final ListRepository listRepo;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final TokenRepository tokenRepository;
	ListUtils listUtils = new ListUtils();
	
	
	public AuthenticationResponse register(RegisterRequest request) {
		var user = User.builder().firstname(request.getFirstname())
				.lastname(request.getLastname())
				.email(request.getEmail())
				.phone(request.getPhone())
				.address(request.getAddress())
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
		        .id(user.getId())
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
	
	public AuthenticationResponse refresh(String token) {
		try {
			var tokenUser = tokenRepository.findByToken(jwtService.extractFromBearer(token)).get();
			var user = repository.findUserById(Long.valueOf(tokenUser.getUser().getId()) ).get();
			tokenRepository.delete(tokenUser);
			var jwtToken = jwtService.generateToken(user);
			saveUserToken(user, jwtToken);
			return AuthenticationResponse.builder().token(jwtToken).build();
		}catch(Exception e){
			return AuthenticationResponse.builder().token("expired").build();
		}
	}
	
	public AuthenticationResponse signOut(String token) {
		var tokenUser = tokenRepository.findByToken(jwtService.extractFromBearer(token)).get();
		tokenRepository.delete(tokenUser);
		return AuthenticationResponse.builder().token("nice").build();
	}
	
	
	public UserDTO getUser(String token) {
		User user = repository.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token))).get();
		return UserDTO.builder()
				.firstname(user.getFirstname())
				.lastname(user.getLastname())
				.address(user.getAddress())
				.email(user.getEmail())
				.phone(user.getPhone())
				.role(user.getRole())
				.build();
	}
	
	public UserDTO updateUser(UserUpdateRequest update, String token) {
		User user = repository.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token))).get();
		switch(update.getChoice()) {
			case "first name":
				user.setFirstname(update.getUserUpdate());
				break;
			case "last name":
				user.setLastname(update.getUserUpdate());
				break;
			case "email":
				user.setEmail(update.getUserUpdate());
				break;
			case "address":
				user.setAddress(update.getUserUpdate());
				break;
			case "phone":
				user.setPhone(update.getUserUpdate());
				break;
		}
		
		repository.save(user);
		
		return UserDTO.builder()
				.firstname(user.getFirstname())
				.lastname(user.getLastname())
				.address(user.getAddress())
				.email(user.getEmail())
				.phone(user.getPhone())
				.build();
	}
	
	public ListToFrontendWithCount updateCurrentList(ListItemRequest item, String token) {
		User user = repository.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token))).get();
		String currentList = user.getCurrentList();
		user.setCurrentList(currentList+=item.getCurrentItem());
		repository.save(user);
		Integer count = user.getCurrentList().split("~").length;
		return ListToFrontendWithCount.builder()
				.itemCount(count)
				.list(convertStringListToArray(user.getCurrentList()))
				.date("")
				.build();
	}
	
	public ListToFrontendWithCount updateCurrentListWithFullList(List<ListItemResponse> list, String token) {
		//log.info(list.toString());
		Optional<User> user = repository.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		String currentList = user.get().getCurrentList();
		String tempList="";
		
		for(ListItemResponse d:list) {
			tempList+=d.getImage()+"+"+d.getName()+"+"+d.getQuantity()+"~";
		}
		
		user.get().setCurrentList(currentList+=tempList);
		repository.save(user.get());
		
		
		return ListToFrontendWithCount.builder()
				.itemCount(listUtils.convertStringListToArray(user.get().getCurrentList()).size())
				.list(listUtils.convertStringListToArray(user.get().getCurrentList()))
				.build();
	}
	
	public ListToFrontendWithCount deleteListItem(ListFromFrontend list) {
		User user = repository.findByEmail(jwtService.extractUsername(list.getToken())).get();
		user.setCurrentList(list.getList());
		repository.save(user);
		return getCurrentList(list.getToken());
	}
	
	public ListToFrontendWithCount getCurrentList(String token) {
		List<ListItemResponse> listArray = new ArrayList();
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
				listArray.add(new ListItemResponse(image,name,quantity));
			}
			
			
		});
		
		//return ListToFrontendWithCount.builder().list(listArray).itemCount(itemCount).build();
		return ListToFrontendWithCount.builder()
				.list(listArray)
				.itemCount(itemCount)
				.build();
	}
	
	public ListToFrontendWithCount updateQuantity(List<ListItemResponse> list, String token) {
		User user = repository.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token))).get();
		String tempList = "";
		//passing new array with new quantity
		//get new array parse into currentlist string
		//set currentlist to new string
		//return new list
		for(ListItemResponse d : list) {
			tempList+=d.getImage()+"+"+d.getName()+"+"+d.getQuantity()+"~";
		}
		
		user.setCurrentList(tempList);
		repository.save(user);
		
		return getCurrentList(jwtService.extractFromBearer(token));
	}
	
	
	public String getCartCount(String token) {
		List<String> tempList = new ArrayList<String>();
		Optional<User> user = repository.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		Integer count = user.get().getCurrentList().split("~").length;
		tempList = Arrays.asList(user.get().getCurrentList().split("~"));
		log.info(tempList.toString());
		
		if(tempList.get(0).equals("")) {
			return "0";
		}else {
			log.info("INNNNNNNNN");
			return count.toString();
		}
		
	}
	
	List<ListItemResponse> convertStringListToArray(String list){
		if( list != null) {
			List<ListItemResponse> listArray = new ArrayList<ListItemResponse>();
			var tempArray = list.split("~");
			
			Stream<String> arr_stream = Arrays.stream(tempArray);
			arr_stream.forEach((d) -> {
				
				if(d != "") {
					var splitByCategory = d.split("\\+");
					var image = splitByCategory[0];
					var name = splitByCategory[1];
					var quantity = splitByCategory[2];
					listArray.add(new ListItemResponse(image,name,quantity));
				}
				
				
			});
			
			return listArray;
		}else {
			return new ArrayList<ListItemResponse>();
		}
		
		
	}
}
