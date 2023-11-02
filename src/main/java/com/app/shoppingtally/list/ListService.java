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
import com.app.shoppingtally.list.models.CurrentOrder;
import com.app.shoppingtally.list.models.OrderData;
import com.app.shoppingtally.list.models.ShopperOrders;
import com.app.shoppingtally.list.models.ShopperRequest;
import com.app.shoppingtally.shopping.CurrentOrderEntity;
import com.app.shoppingtally.shopping.CurrentOrderEntityResponse;
import com.app.shoppingtally.shopping.CurrentOrderRepo;
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
	private final CurrentOrderRepo currentOrderRepo;
	
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
		List<ListDTO> fullList = new ArrayList();
		
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(token.getToken()));
		List<UserList> foundUserLists = listRepo.findByUserId(user.get().getId());
		
		foundUserLists.forEach(d -> {
			List<ListItemResponse> listArray = new ArrayList();
			//log.info(listArray.toString());
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
			fullList.add(new ListDTO(listArray,d.getDate()));
			
			
		});
		
		
		
		return fullList;
	}
	
	List<String> getAllUserDates(ShopperRequest shopperRequest){
		if(shopperRequest.getShopperId() == 1) {
			return listRepo.getJaysOrderDates();
		}else {
			return listRepo.getJoshsOrderDates();
		}
	}
	
	List<ListItemResponse> convertStringListToArray(String list){
		
		if( list != null) {
			List<ListItemResponse> listArray = new ArrayList();
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
	
	List<ShopperOrders> getOrders(String token) {
		//sending admin token
		//getting id from shopper
		//return all user_lists with the shopper id
		
		
		List<ListItemResponse> shopperOrdersArray = new ArrayList();
		List<ShopperOrders> shopperOrdersFullArray = new ArrayList();
		
		
		Optional<User> shopper = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		
		if(shopper.get().getShopperId() == 1) {
			
			for(List<String> list : listRepo.getJaysFullOrders()) {
				log.info(list.get(4));
				
				Optional<User> user = userRepo.findById(Long.parseLong(list.get(2)));
				OrderData orderData = OrderData.builder().firstname(user.get().getFirstname()).lastname(user.get().getLastname()).address(user.get().getAddress()).phone(user.get().getPhone()).email(user.get().getEmail()).build();
				shopperOrdersArray = convertStringListToArray(list.get(1));
				shopperOrdersFullArray.add(ShopperOrders.builder().list(shopperOrdersArray).date(list.get(0)).data(orderData).isActive(list.get(3)).isCompleted(list.get(4)).build());
			}
			
			return shopperOrdersFullArray;
		}else {
			return null;
		}
		
		
	}
	
	ListToFrontendWithCount createCurrentOrder(CurrentOrder currentOrder, String token){
		//email is passed
		//get userId with email from userRepo
		
		Optional<User> client = userRepo.findByEmail(currentOrder.getEmail());
		
		//get shopperId with token
		int shopperId = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token))).get().getShopperId();
		
		//find date and email in user_list
		UserList list = listRepo.getOrderList(currentOrder.getDate(),client.get().getId(),shopperId);
		list.setIsActive("true");
		listRepo.save(list);
		CurrentOrderEntity createFullOrder = CurrentOrderEntity.builder()
				.date(currentOrder.getDate())
				.customer_email(currentOrder.getEmail())
				.customer_firstname(client.get().getFirstname())
				.customer_lastname(client.get().getLastname())
				.customer_address(client.get().getAddress())
				.id(Long.valueOf(shopperId))
				.todoList(list.getList())
				.build();
		
		currentOrderRepo.save(createFullOrder);
		
		List<ListItemResponse> formattedList = convertStringListToArray(list.getList());
		
		
		
		
		//log.info(createFullOrder.toString());
		return ListToFrontendWithCount.builder()
				.itemCount(formattedList.size())
				.list(formattedList)
				.build();
	}
	
	CurrentOrderEntityResponse getCurrentOrder(String token){
		try {
			Thread.sleep(500);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		
		CurrentOrderEntity currentOrder = currentOrderRepo.findUserById(Long.valueOf(user.get().getShopperId()));
		
		//all lists
		List<ListItemResponse> todo = convertStringListToArray(currentOrder.getTodoList());
		List<ListItemResponse> breakfast = convertStringListToArray(currentOrder.getBreakfastList());
		List<ListItemResponse> pet = convertStringListToArray(currentOrder.getPetList());
		List<ListItemResponse> produce = convertStringListToArray(currentOrder.getProduceList());
		List<ListItemResponse> beverages = convertStringListToArray(currentOrder.getBeveragesList());
		List<ListItemResponse> bread = convertStringListToArray(currentOrder.getBreadList());
		List<ListItemResponse> international = convertStringListToArray(currentOrder.getInternationalList());
		List<ListItemResponse> baking = convertStringListToArray(currentOrder.getBakingList());
		List<ListItemResponse> grains = convertStringListToArray(currentOrder.getPastaGrainsList());
		List<ListItemResponse> snacks = convertStringListToArray(currentOrder.getSnacksList());
		List<ListItemResponse> deli = convertStringListToArray(currentOrder.getDeliList());
		List<ListItemResponse> bakery = convertStringListToArray(currentOrder.getBakeryList());
		List<ListItemResponse> meat = convertStringListToArray(currentOrder.getMeatList());
		List<ListItemResponse> household = convertStringListToArray(currentOrder.getHouseholdList());
		List<ListItemResponse> health = convertStringListToArray(currentOrder.getHealthList());
		List<ListItemResponse> frozen = convertStringListToArray(currentOrder.getFrozenList());
		List<ListItemResponse> dairy = convertStringListToArray(currentOrder.getDairyList());
		
		
		log.info(todo.toString());
		return CurrentOrderEntityResponse.builder()
				.customer_address(currentOrder.getCustomer_address())
				.customer_email(currentOrder.getCustomer_email())
				.customer_firstname(currentOrder.getCustomer_firstname())
				.customer_lastname(currentOrder.getCustomer_lastname())
				.date(currentOrder.getDate())
				.todo(todo)
				.breakfast(breakfast)
				.pet(pet)
				.produce(produce)
				.beverages(beverages)
				.bread(bread)
				.international(international)
				.baking(baking)
				.grains(grains)
				.snacks(snacks)
				.deli(deli)
				.bakery(bakery)
				.meat(meat)
				.household(household)
				.health(health)
				.frozen(frozen)
				.dairy(dairy)
				.build();
	}
	
	String endCurrentOrder(CurrentOrder currentOrder, String token) {
		//reset current order back to inactive
		Optional<User> client = userRepo.findByEmail(currentOrder.getEmail());
		
		//get shopperId with token
		int shopperId = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token))).get().getShopperId();
		
		//find date and email in user_list
		UserList list = listRepo.getOrderList(currentOrder.getDate(),client.get().getId(),shopperId);
		list.setIsActive("false");
		list.setIsCompleted("true");
		listRepo.save(list);
		return "success";
	}
	
	
	

}
