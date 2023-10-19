package com.app.shoppingtally.list;

import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.app.shoppingtally.auth.AuthenticationService;
import com.app.shoppingtally.auth.models.FullListRequest;
import com.app.shoppingtally.auth.models.ListItemResponse;
import com.app.shoppingtally.auth.models.ListToFrontendWithCount;
import com.app.shoppingtally.config.JwtService;
import com.app.shoppingtally.token.Token;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ListService {
	private final ListRepository listRepo;
	private final JwtService jwtService;
	private final UserRepo userRepo;
	private final AuthenticationService authService;
	
	ListToFrontendWithCount addList(UserList list){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(list.getToken()));
		list.setUser(user.get());
		listRepo.save(list);
		user.get().setCurrentList("");
		userRepo.save(user.get());
		return authService.getCurrentList(list.getToken());
	}
	
	List<ListDTO> getUserListData(Token token){
		
		List<String> dateArray = new ArrayList();
		List<ListDTO> fullList = new ArrayList();;
		
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(token.getToken()));
		//List<ListDTO> list = listRepo.findByUserId(foundUser.get().getId()).stream().map(listDTOMapper).collect(Collectors.toList());
		List<UserList> foundUserLists = listRepo.findByUserId(user.get().getId());
//		var tempArray = foundUserLists.getList().split("~");
//		Stream<String> arr_stream = Arrays.stream(tempArray);
//		
//		arr_stream.forEach(d->{
//			if(d != "") {
//				var splitByCategory = d.split("\\+");
//				var image = splitByCategory[0];
//				var name = splitByCategory[1];
//				var quantity = splitByCategory[2];
//				listArray.add(new ListToFrontend(image,name,quantity));
//				//dateArray.add(d.date);
//			}
//			
//			
//		});
		
		foundUserLists.forEach(d -> {
			List<ListItemResponse> listArray = new ArrayList();
			log.info(listArray.toString());
			var tempArray = d.getList().split("~");
			Stream<String> arr_stream = Arrays.stream(tempArray);
			dateArray.add(d.getDate());
			arr_stream.forEach(m->{
				if(m != "") {
					
					var splitByCategory = m.split("\\+");
					var image = splitByCategory[0];
					var name = splitByCategory[1];
					var quantity = splitByCategory[2];
					listArray.add(new ListItemResponse(image,name,quantity));
					
				}
				
				
			});
			//ListDTO test = new ListDTO(listArray,d.getDate());
			log.info(listArray.toString());
			fullList.add(new ListDTO(listArray,d.getDate()));
			//listArray.clear();
			//log.info(listArray.toString());
			
			
		});
		
		
		
		return fullList;
	}
	
	List<String> getAllUserDates(){
		return listRepo.getAllUserDates();
	}

	

}
