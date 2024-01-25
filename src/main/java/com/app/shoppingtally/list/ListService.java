package com.app.shoppingtally.list;

import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.tomcat.util.json.JSONParser;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.boot.jackson.JsonObjectDeserializer;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.app.shoppingtally.auth.AuthenticationService;
import com.app.shoppingtally.auth.models.FullListRequest;
import com.app.shoppingtally.auth.models.ListItemResponse;
import com.app.shoppingtally.auth.models.ListToFrontendWithCount;
import com.app.shoppingtally.config.EmailSenderService;
import com.app.shoppingtally.config.JwtService;
import com.app.shoppingtally.list.models.CategoryUpdateRequest;
import com.app.shoppingtally.list.models.CompleteItemRequest;
import com.app.shoppingtally.list.models.CompleteItemResponse;
import com.app.shoppingtally.list.models.CurrentOrder;
import com.app.shoppingtally.list.models.ListItemWithCategoryRequest;
import com.app.shoppingtally.list.models.OrderData;
import com.app.shoppingtally.list.models.ShopperOrders;
import com.app.shoppingtally.list.models.ShopperRequest;
import com.app.shoppingtally.list.models.UserOrderInfo;
import com.app.shoppingtally.shopping.CurrentOrderEntity;
import com.app.shoppingtally.shopping.CurrentOrderEntityShopperResponse;
import com.app.shoppingtally.shopping.CurrentOrderEntityUserResponse;
import com.app.shoppingtally.shopping.CurrentOrderEntityUserResponseWithUpdateMessage;
import com.app.shoppingtally.shopping.CurrentOrderRepo;
import com.app.shoppingtally.socket.Message;
import com.app.shoppingtally.token.Token;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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
	private String setList = null;
	private final SimpMessagingTemplate messagingTemplate;
	private final EmailSenderService emailSender;
	
	//////////////////CLIENT///////////////////
	
	ListToFrontendWithCount addList(UserList list){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(list.getToken()));
		list.setUser(user.get());
		list.setIsCurrentOrder("true");
		listRepo.save(list);
		user.get().setCurrentList("");
		userRepo.save(user.get());
		if(list.getShopperId() == 1) {
			emailSender.sendEmail("jayshoppingtally@gmail.com", "Order placed by " + list.getUser().getFirstname()+ " " + list.getUser().getLastname().substring(0,1)+". : "+ dateConversion(list.getDate()));
		}else if(list.getShopperId() == 2) {
			emailSender.sendEmail("joshshoppingtally@gmail.com", "Order placed by " + list.getUser().getFirstname()+ " " + list.getUser().getLastname().substring(0,1)+". : "+ dateConversion(list.getDate()));
		}
		
		return authService.getCurrentList(list.getToken());
	}
	
	String dateConversion(String date){
		String month = date.substring(5,7);
		String day = date.substring(8,10);
		String time = date.substring(date.indexOf("T")+1);
		if(time.equals("10") || time.equals("11")) {
			return time+"am on "+month+"-"+day;
		}else {
			return time+"pm on "+month+"-"+day;
		}
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
	
	public List<ListItemResponse> convertStringListToArray(String list){
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
	
	String convertArrayListToString(List<ListItemResponse> list) {
		if( list != null) {
			String tempList="";
			
			for(ListItemResponse d:list) {
				tempList+=d.getImage()+"+"+d.getName()+"+"+d.getQuantity()+"~";
			}
			
			
			return tempList;
		}else {
			return "";
		}
		
		
	}
	
	UserOrderInfo cancelCurrentOrder(String token) {
		Optional<User> client = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		List<UserList> userList = listRepo.findByCurrentOrder(client.get().getId());
		listRepo.delete(userList.get(0));
		
		return getUserOrderInfo(token);
				
		
	}
	
	UserOrderInfo getUserOrderInfo(String token) {
		Optional<User> client = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		List<UserList> userList = listRepo.findByCurrentOrder(client.get().getId());
		if(userList.isEmpty()) {
			log.info(userList.toString());
			return UserOrderInfo.builder()
					.hasActive(false)
					.hasCurrentOrder(false)
					.build();
		}else if(userList.get(0).getIsCurrentOrder().equals("true") && userList.get(0).getIsActive().equals("false")){
			return UserOrderInfo.builder()
					.hasActive(false)
					.hasCurrentOrder(true)
					.build();
		}else {
			return UserOrderInfo.builder()
					.hasActive(true)
					.hasCurrentOrder(true)
					.build();
		}
	}
	
	ListToFrontendWithCount getUserList(String token) {
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		List<UserList> userList = listRepo.findByCurrentOrder(user.get().getId());
		if(userList.isEmpty()) {
			return new ListToFrontendWithCount();
		}else {
			log.info(userList.toString());
			return ListToFrontendWithCount.builder()
					.list(convertStringListToArray(userList.get(0).getList()))
					.itemCount(userList.size())
					.date(userList.get(0).getDate())
					.build();
		}
		
	}
	
	List<ListItemResponse> addListToCurrentOrder(List<ListItemResponse> list, String token){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		UserList currentOrder = listRepo.getUserListByCurrentOrder(user.get().getId());
		String currentList = currentOrder.getList();
		String updatedList = convertArrayListToString(list);
		String newList = updatedList+=currentList;
		currentOrder.setList(newList);
		listRepo.save(currentOrder);
		return convertStringListToArray(newList);
	}
	
	CurrentOrderEntity addListToActiveOrder(List<ListItemResponse> list, String token){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		CurrentOrderEntity activeOrder = currentOrderRepo.findByDate(listRepo.getCurrentList(user.get().getId()));
		String currentTodoList = activeOrder.getTodoList();
		String updatedList = convertArrayListToString(list);
		String newList = updatedList+=currentTodoList;
		activeOrder.setTodoList(newList);
		currentOrderRepo.save(activeOrder);
		return activeOrder;
		
	}
	
	List<ListItemResponse> addItemToCurrentOrder(ListItemResponse item, String token){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		UserList list = listRepo.getUserListByCurrentOrder(user.get().getId());
		String tempItem=item.getImage()+"+"+item.getName()+"+"+item.getQuantity()+"~";
		String newList = tempItem+list.getList();
		list.setList(newList);
		listRepo.save(list);
		return convertStringListToArray(newList);
	}
	
	CurrentOrderEntityUserResponse addItemToActiveOrder(ListItemResponse item, String token) {
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		CurrentOrderEntity activeOrder = currentOrderRepo.findByDate(listRepo.getCurrentList(user.get().getId()));
		if(activeOrder != null) {
			if(activeOrder.getTodoList() != null) {
				String tempItem=item.getImage()+"+"+item.getName()+"+"+item.getQuantity()+"~";
				String todoList = activeOrder.getTodoList();
				String newTodoList = tempItem+todoList;
				activeOrder.setTodoList(newTodoList);
				currentOrderRepo.save(activeOrder);			return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(newTodoList))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			}else {
				String tempItem=item.getImage()+"+"+item.getName()+"+"+item.getQuantity()+"~";
				activeOrder.setTodoList(tempItem);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(tempItem))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			}
			
		}else {
			return new CurrentOrderEntityUserResponse();
			//log.info("sweeet");
		}
		
	}
	
	List<ListItemResponse> deleteCurrentOrderItem(ListItemResponse item, String token){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		UserList list = listRepo.getUserListByCurrentOrder(user.get().getId());
		String newList="";
		
		for(ListItemResponse currentOrderItem : convertStringListToArray(list.getList())) {
			if(!currentOrderItem.getName().equals(item.getName())) {
				newList += currentOrderItem.getImage()+"+"+currentOrderItem.getName()+"+"+currentOrderItem.getQuantity()+"~";
			}
			
			
		}
		
		list.setList(newList);
		listRepo.save(list);
		
		return convertStringListToArray(newList);
	}

	List<ListItemResponse> increaseCurrentOrderQuantity(ListItemResponse item, String token){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		UserList list = listRepo.getUserListByCurrentOrder(user.get().getId());
		String newList = "";
		for(ListItemResponse currentOrderItem : convertStringListToArray(list.getList())) {
			if(!currentOrderItem.getName().equals(item.getName())) {
				log.info(currentOrderItem.getName() + "   " + item.getName());
				newList+=currentOrderItem.getImage()+"+"+currentOrderItem.getName()+"+"+currentOrderItem.getQuantity()+"~";
			}else {
				//get item quantity and increase it
				int oldQuantity = Integer.parseInt(currentOrderItem.getQuantity());
				int newQuantity = ++oldQuantity;
				log.info(String.valueOf(newQuantity));
				newList+=currentOrderItem.getImage()+"+"+currentOrderItem.getName()+"+"+newQuantity+"~";
			}
		}
		
		list.setList(newList);
		listRepo.save(list);
		return convertStringListToArray(newList);
	}
	
	List<ListItemResponse> decreaseCurrentOrderQuantity(ListItemResponse item, String token){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		UserList list = listRepo.getUserListByCurrentOrder(user.get().getId());
		String newList = "";
		for(ListItemResponse currentOrderItem : convertStringListToArray(list.getList())) {
			if(!currentOrderItem.getName().equals(item.getName())) {
				log.info(currentOrderItem.getName() + "   " + item.getName());
				newList+=currentOrderItem.getImage()+"+"+currentOrderItem.getName()+"+"+currentOrderItem.getQuantity()+"~";
			}else {
				//get item quantity and increase it
				int oldQuantity = Integer.parseInt(currentOrderItem.getQuantity());
				int newQuantity = --oldQuantity;
				log.info(String.valueOf(newQuantity));
				newList+=currentOrderItem.getImage()+"+"+currentOrderItem.getName()+"+"+newQuantity+"~";
			}
		}
		
		list.setList(newList);
		listRepo.save(list);
		return convertStringListToArray(newList);
	}
	
	CurrentOrderEntityUserResponse increaseActiveOrderQuantity(ListItemWithCategoryRequest itemWithCategory, String token) {
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		CurrentOrderEntity activeOrder = currentOrderRepo.findByDate(listRepo.getCurrentList(user.get().getId()));
		String newList = "";
		int shopperId = listRepo.getShopperIdFromDateOfOrder(activeOrder.getDate());
		String socketKey = userRepo.getSocketKeyByShopperId(shopperId);
		log.info(user.get().getEmail());
		switch(itemWithCategory.getCategory()) {
			case "todo":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getTodoList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setTodoList(newList);
				currentOrderRepo.save(activeOrder);
				
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(newList))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "health":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getHealthList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setHealthList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(newList))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "dairy":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getDairyList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setDairyList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(newList))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "breakfast":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBreakfastList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setBreakfastList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(newList))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "international":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getInternationalList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setInternationalList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(newList))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "baking":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBakingList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setBakingList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(newList))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "grains":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getPastaGrainsList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setPastaGrainsList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(newList))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "snacks":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getSnacksList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setSnacksList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(newList))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "pet":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getPetList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setDairyList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(newList))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "household":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getHouseholdList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setHouseholdList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(newList))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "beverages":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBeveragesList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setBeveragesList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(newList))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "bread":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBreadList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setBreadList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(newList))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "frozen":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getFrozenList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setFrozenList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(newList))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "meat":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getMeatList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setMeatList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(newList))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "produce":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getProduceList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setProduceList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(newList))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "bakery":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBakeryList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setBakeryList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(newList))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "deli":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getDeliList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setDeliList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(newList))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "completed":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getCompletedList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = ++oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setCompletedList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(newList))
						.build();
			default:
				log.info("hit default");
				return new CurrentOrderEntityUserResponse();
		}
	}
	
	CurrentOrderEntityUserResponse decreaseActiveOrderQuantity(ListItemWithCategoryRequest itemWithCategory, String token) {
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		CurrentOrderEntity activeOrder = currentOrderRepo.findByDate(listRepo.getCurrentList(user.get().getId()));
		String newList = "";
		int shopperId = listRepo.getShopperIdFromDateOfOrder(activeOrder.getDate());
		String socketKey = userRepo.getSocketKeyByShopperId(shopperId);
		log.info(user.get().getEmail());
		switch(itemWithCategory.getCategory()) {
			case "todo":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getTodoList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setTodoList(newList);
				currentOrderRepo.save(activeOrder);
				
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(newList))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "health":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getHealthList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setHealthList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(newList))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "dairy":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getDairyList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setDairyList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(newList))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "breakfast":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBreakfastList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setBreakfastList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(newList))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "international":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getInternationalList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setInternationalList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(newList))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "baking":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBakingList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setBakingList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(newList))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "grains":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getPastaGrainsList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setPastaGrainsList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(newList))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "snacks":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getSnacksList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setSnacksList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(newList))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "pet":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getPetList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setDairyList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(newList))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "household":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getHouseholdList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setHouseholdList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(newList))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "beverages":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBeveragesList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setBeveragesList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(newList))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "bread":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBreadList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setBreadList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(newList))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "frozen":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getFrozenList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setFrozenList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(newList))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "meat":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getMeatList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setMeatList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(newList))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "produce":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getProduceList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setProduceList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(newList))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "bakery":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBakeryList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setBakeryList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(newList))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "deli":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getDeliList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setDeliList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(newList))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(activeOrder.getCompletedList()))
						.build();
			case "completed":
				for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getCompletedList())) {
					if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
					}else {
						int oldQuantity = Integer.parseInt(activeOrderItem.getQuantity());
						int newQuantity = --oldQuantity;
						newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+newQuantity+"~";
					}
				}
				activeOrder.setCompletedList(newList);
				currentOrderRepo.save(activeOrder);
				return CurrentOrderEntityUserResponse.builder()
						.todo(convertStringListToArray(activeOrder.getTodoList()))
						.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
						.pet(convertStringListToArray(activeOrder.getPetList()))
						.produce(convertStringListToArray(activeOrder.getProduceList()))
						.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
						.bread(convertStringListToArray(activeOrder.getBreadList()))
						.international(convertStringListToArray(activeOrder.getInternationalList()))
						.baking(convertStringListToArray(activeOrder.getBakingList()))
						.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
						.snacks(convertStringListToArray(activeOrder.getSnacksList()))
						.deli(convertStringListToArray(activeOrder.getDeliList()))
						.bakery(convertStringListToArray(activeOrder.getBakeryList()))
						.meat(convertStringListToArray(activeOrder.getMeatList()))
						.household(convertStringListToArray(activeOrder.getHouseholdList()))
						.health(convertStringListToArray(activeOrder.getHealthList()))
						.frozen(convertStringListToArray(activeOrder.getFrozenList()))
						.dairy(convertStringListToArray(activeOrder.getDairyList()))
						.completed(convertStringListToArray(newList))
						.build();
			default:
				log.info("hit default");
				return new CurrentOrderEntityUserResponse();
		}
	}
	
	CurrentOrderEntityUserResponse deleteActiveOrderQuantity(ListItemWithCategoryRequest itemWithCategory, String token){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		CurrentOrderEntity activeOrder = currentOrderRepo.findByDate(listRepo.getCurrentList(user.get().getId()));
		String newList = "";
		int shopperId = listRepo.getShopperIdFromDateOfOrder(activeOrder.getDate());
		String socketKey = userRepo.getSocketKeyByShopperId(shopperId);
		
		switch(itemWithCategory.getCategory()) {
		case "todo":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getTodoList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setTodoList(newList);
			currentOrderRepo.save(activeOrder);
			
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(newList))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "health":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getHealthList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setHealthList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(newList))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "dairy":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getDairyList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setDairyList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(newList))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "breakfast":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBreakfastList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setBreakfastList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(newList))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "international":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getInternationalList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setInternationalList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(newList))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "baking":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBakingList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setBakingList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(newList))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "grains":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getPastaGrainsList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setPastaGrainsList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(newList))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "snacks":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getSnacksList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setSnacksList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(newList))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "pet":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getPetList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setDairyList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(newList))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "household":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getHouseholdList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setHouseholdList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(newList))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "beverages":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBeveragesList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setBeveragesList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(newList))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "bread":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBreadList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setBreadList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(newList))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "frozen":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getFrozenList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setFrozenList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(newList))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "meat":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getMeatList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setMeatList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(newList))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "produce":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getProduceList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setProduceList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(newList))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "bakery":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getBakeryList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setBakeryList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(newList))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "deli":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getDeliList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setDeliList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(newList))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(activeOrder.getCompletedList()))
					.build();
		case "completed":
			for(ListItemResponse activeOrderItem : convertStringListToArray(activeOrder.getCompletedList())) {
				if(!activeOrderItem.getName().equals(itemWithCategory.getItem().getName())) {
					newList+=activeOrderItem.getImage()+"+"+activeOrderItem.getName()+"+"+activeOrderItem.getQuantity()+"~";
				}
			}
			activeOrder.setCompletedList(newList);
			currentOrderRepo.save(activeOrder);
			return CurrentOrderEntityUserResponse.builder()
					.todo(convertStringListToArray(activeOrder.getTodoList()))
					.breakfast(convertStringListToArray(activeOrder.getBreakfastList()))
					.pet(convertStringListToArray(activeOrder.getPetList()))
					.produce(convertStringListToArray(activeOrder.getProduceList()))
					.beverages(convertStringListToArray(activeOrder.getBeveragesList()))
					.bread(convertStringListToArray(activeOrder.getBreadList()))
					.international(convertStringListToArray(activeOrder.getInternationalList()))
					.baking(convertStringListToArray(activeOrder.getBakingList()))
					.grains(convertStringListToArray(activeOrder.getPastaGrainsList()))
					.snacks(convertStringListToArray(activeOrder.getSnacksList()))
					.deli(convertStringListToArray(activeOrder.getDeliList()))
					.bakery(convertStringListToArray(activeOrder.getBakeryList()))
					.meat(convertStringListToArray(activeOrder.getMeatList()))
					.household(convertStringListToArray(activeOrder.getHouseholdList()))
					.health(convertStringListToArray(activeOrder.getHealthList()))
					.frozen(convertStringListToArray(activeOrder.getFrozenList()))
					.dairy(convertStringListToArray(activeOrder.getDairyList()))
					.completed(convertStringListToArray(newList))
					.build();
		default:
			log.info("hit default");
			return new CurrentOrderEntityUserResponse();
	}
	}
	
	
	
	
	//////////////////ADMIN///////////////////
	
	List<ShopperOrders> getOrders(String token) {
		//sending admin token
		//getting id from shopper
		//return all user_lists with the shopper id
		
		
		List<ListItemResponse> shopperOrdersArray = new ArrayList();
		List<ShopperOrders> shopperOrdersFullArray = new ArrayList();
		
		
		Optional<User> shopper = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		
		if(shopper.get().getShopperId() == 1) {
			
			for(List<String> list : listRepo.getJaysFullOrders()) {
				log.info(list.toString());
				
				Optional<User> user = userRepo.findById(Long.parseLong(list.get(2)));
				OrderData orderData = OrderData.builder().firstname(user.get().getFirstname()).lastname(user.get().getLastname()).address(user.get().getAddress()).phone(user.get().getPhone()).email(user.get().getEmail()).build();
				shopperOrdersArray = convertStringListToArray(list.get(1));
				shopperOrdersFullArray.add(ShopperOrders.builder().list(shopperOrdersArray).date(list.get(0)).data(orderData).isActive(list.get(3)).isCompleted(list.get(4)).build());
			}
			
			return shopperOrdersFullArray;
		}else if(shopper.get().getShopperId() == 2){
			for(List<String> list : listRepo.getJoshsFullOrders()) {
				log.info(list.toString());
				
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
		log.info(client.get().getSocketKey());
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
		
		
		
		messagingTemplate.convertAndSendToUser(client.get().getSocketKey(), "/topic/messages", "true");
		log.info(client.get().getSocketKey());
		return ListToFrontendWithCount.builder()
				.itemCount(formattedList.size())
				.list(formattedList)
				.build();
	}
	
	CurrentOrderEntityShopperResponse getCurrentOrder(String token){
		try {
			Thread.sleep(500);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		List<ListItemResponse> todo;
		List<ListItemResponse> breakfast;
		List<ListItemResponse> pet;
		List<ListItemResponse> produce;
		List<ListItemResponse> beverages;
		List<ListItemResponse> bread;
		List<ListItemResponse> international;
		List<ListItemResponse> baking;
		List<ListItemResponse> grains;
		List<ListItemResponse> snacks;
		List<ListItemResponse> deli;
		List<ListItemResponse> bakery;
		List<ListItemResponse> meat;
		List<ListItemResponse> household;
		List<ListItemResponse> health;
		List<ListItemResponse> frozen;
		List<ListItemResponse> dairy;
		List<ListItemResponse> completed;
		
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		
		CurrentOrderEntity currentOrder = currentOrderRepo.findUserById(Long.valueOf(user.get().getShopperId()));
		
		//all lists
		if(currentOrder.getTodoList() == null) {
			todo = new ArrayList<ListItemResponse>();
		}else {
			
			todo = convertStringListToArray(currentOrder.getTodoList());
			
		}
		
		if(currentOrder.getBreakfastList() == null || currentOrder.getBreakfastList().equals("")) {
			breakfast = new ArrayList<ListItemResponse>();
		}else {
			breakfast = convertStringListToArray(currentOrder.getBreakfastList());
		}
		
		if(currentOrder.getPetList() == null || currentOrder.getPetList().equals("")) {
			pet = new ArrayList<ListItemResponse>();
		}else {
			pet = convertStringListToArray(currentOrder.getPetList());
		}
		
		if(currentOrder.getProduceList() == null || currentOrder.getProduceList().equals("")) {
			produce = new ArrayList<ListItemResponse>();
		}else {
			produce = convertStringListToArray(currentOrder.getProduceList());
		}
		
		if(currentOrder.getBeveragesList() == null || currentOrder.getBeveragesList().equals("")) {
			beverages = new ArrayList<ListItemResponse>();
		}else {
			beverages = convertStringListToArray(currentOrder.getBeveragesList());
		}
		
		if(currentOrder.getBreadList() == null || currentOrder.getBreadList().equals("")) {
			bread = new ArrayList<ListItemResponse>();
		}else {
			bread = convertStringListToArray(currentOrder.getBreadList());
		}
		
		if(currentOrder.getInternationalList() == null || currentOrder.getInternationalList().equals("")) {
			international = new ArrayList<ListItemResponse>();
		}else {
			international = convertStringListToArray(currentOrder.getInternationalList());
		}
		
		if(currentOrder.getBakingList() == null || currentOrder.getBakingList().equals("")) {
			baking = new ArrayList<ListItemResponse>();
		}else {
			baking = convertStringListToArray(currentOrder.getBakingList());
		}
		
		if(currentOrder.getPastaGrainsList() == null || currentOrder.getPastaGrainsList().equals("")) {
			grains = new ArrayList<ListItemResponse>();
		}else {
			grains = convertStringListToArray(currentOrder.getPastaGrainsList());
		}
		
		if(currentOrder.getSnacksList() == null || currentOrder.getSnacksList().equals("")) {
			snacks = new ArrayList<ListItemResponse>();
		}else {
			snacks = convertStringListToArray(currentOrder.getSnacksList());
		}
		
		if(currentOrder.getDeliList() == null || currentOrder.getDeliList().equals("")) {
			deli = new ArrayList<ListItemResponse>();
		}else {
			deli = convertStringListToArray(currentOrder.getDeliList());
		}
		
		if(currentOrder.getBakeryList() == null || currentOrder.getBakeryList().equals("")) {
			bakery = new ArrayList<ListItemResponse>();
		}else {
			bakery = convertStringListToArray(currentOrder.getBakeryList());
		}
		
		if(currentOrder.getMeatList() == null || currentOrder.getMeatList().equals("")) {
			meat = new ArrayList<ListItemResponse>();
		}else {
			meat = convertStringListToArray(currentOrder.getMeatList());
		}
		
		if(currentOrder.getHouseholdList() == null || currentOrder.getHouseholdList().equals("")) {
			household = new ArrayList<ListItemResponse>();
		}else {
			household = convertStringListToArray(currentOrder.getHouseholdList());
		}
		
		if(currentOrder.getHealthList() == null || currentOrder.getHealthList().equals("")) {
			health = new ArrayList<ListItemResponse>();
		}else {
			health = convertStringListToArray(currentOrder.getHealthList());
		}
		
		if(currentOrder.getFrozenList() == null || currentOrder.getFrozenList().equals("")) {
			frozen = new ArrayList<ListItemResponse>();
		}else {
			frozen = convertStringListToArray(currentOrder.getFrozenList());
		}
		
		if(currentOrder.getDairyList() == null || currentOrder.getDairyList().equals("")) {
			dairy = new ArrayList<ListItemResponse>();
		}else {
			dairy = convertStringListToArray(currentOrder.getDairyList());
		}
		
		if(currentOrder.getCompletedList() == null || currentOrder.getCompletedList().equals("")) {
			completed = new ArrayList<ListItemResponse>();
		}else {
			completed = convertStringListToArray(currentOrder.getCompletedList());
		}
		
//		List<ListItemResponse> todo = convertStringListToArray(currentOrder.getTodoList());
//		List<ListItemResponse> breakfast = convertStringListToArray(currentOrder.getBreakfastList());
//		List<ListItemResponse> pet = convertStringListToArray(currentOrder.getPetList());
//		List<ListItemResponse> produce = convertStringListToArray(currentOrder.getProduceList());
//		List<ListItemResponse> beverages = convertStringListToArray(currentOrder.getBeveragesList());
//		List<ListItemResponse> bread = convertStringListToArray(currentOrder.getBreadList());
//		List<ListItemResponse> international = convertStringListToArray(currentOrder.getInternationalList());
//		List<ListItemResponse> baking = convertStringListToArray(currentOrder.getBakingList());
//		List<ListItemResponse> grains = convertStringListToArray(currentOrder.getPastaGrainsList());
//		List<ListItemResponse> snacks = convertStringListToArray(currentOrder.getSnacksList());
//		List<ListItemResponse> deli = convertStringListToArray(currentOrder.getDeliList());
//		List<ListItemResponse> bakery = convertStringListToArray(currentOrder.getBakeryList());
//		List<ListItemResponse> meat = convertStringListToArray(currentOrder.getMeatList());
//		List<ListItemResponse> household = convertStringListToArray(currentOrder.getHouseholdList());
//		List<ListItemResponse> health = convertStringListToArray(currentOrder.getHealthList());
//		List<ListItemResponse> frozen = convertStringListToArray(currentOrder.getFrozenList());
//		List<ListItemResponse> dairy = convertStringListToArray(currentOrder.getDairyList());
//		List<ListItemResponse> completed = convertStringListToArray(currentOrder.getCompletedList());
		
		
		return CurrentOrderEntityShopperResponse.builder()
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
				.completed(completed)
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
		messagingTemplate.convertAndSendToUser(client.get().getSocketKey(), "/topic/messages", "false");
		list.setIsCompleted("true");
		list.setIsCurrentOrder("false");
		//list.setList(null);
		listRepo.save(list);
		return "success";
	}
	
	
	String updateCategories(CategoryUpdateRequest update, String token) {
		Optional<User> shopper = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		
		CurrentOrderEntity currentOrder = currentOrderRepo.findUserById(Long.valueOf(shopper.get().getShopperId()));
		//get user by date
		Long userId = listRepo.getUserByDate(currentOrder.getDate());
		log.info(userId.toString());
		//get socket key by user
		String socketKey = userRepo.getSocketKeyById(userId);
		log.info(socketKey);
		if(update.getFromCategory().contains(update.getToCategory())) {
			switch(update.getToCategory()) {
				case "deli":
					currentOrder.setDeliList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "grains":
					currentOrder.setPastaGrainsList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "pet":
					currentOrder.setPetList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "health":
					currentOrder.setHealthList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "dairy":
					currentOrder.setDairyList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "breakfast":
					currentOrder.setBreakfastList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "international":
					currentOrder.setInternationalList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "baking":
					currentOrder.setBakingList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "snacks":
					currentOrder.setSnacksList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "household":
					currentOrder.setHouseholdList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "beverages":
					currentOrder.setBeveragesList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "bread":
					currentOrder.setBreadList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "frozen":
					currentOrder.setFrozenList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "meat":
					currentOrder.setMeatList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "produce":
					currentOrder.setProduceList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
				case "bakery":
					currentOrder.setBakeryList(convertArrayListToString(update.getCurrentCategoryList()));
					currentOrderRepo.save(currentOrder);
					break;
			}
		}
		
		switch(update.getToCategory()) {
			case "deli":
				currentOrder.setDeliList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					//send message to client as a CurrentOrderEntityUserResponse
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
				
			case "health":
				currentOrder.setHealthList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
						log.info("INNNNNNNN TODO");
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
				
			case "dairy":
				currentOrder.setDairyList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
			case "breakfast":
				currentOrder.setBreakfastList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					log.info("INNNNNN");
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
			case "international":
				currentOrder.setInternationalList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
			case "baking":
				currentOrder.setBakingList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
				
			case "grains":
				currentOrder.setPastaGrainsList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					log.info("INNNNNNNN");
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
				
			case "snacks":
				currentOrder.setSnacksList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					log.info("INNNNNNNN");
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
				
			case "pet":
				currentOrder.setPetList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					log.info("INNNNNNNN");
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
				
			case "household":
				currentOrder.setHouseholdList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					log.info("INNNNNNNN");
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
				
			case "beverages":
				currentOrder.setBeveragesList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					log.info("INNNNNNNN");
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
				
			case "bread":
				currentOrder.setBreadList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					log.info("INNNNNNNN");
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
				
			case "frozen":
				currentOrder.setFrozenList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					log.info("INNNNNNNN");
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
				
			case "meat":
				currentOrder.setMeatList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					log.info("INNNNNNNN");
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
				
			case "produce":
				currentOrder.setProduceList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					log.info("INNNNNNNN");
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bakery")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakeryList(setList);
					}else {
						currentOrder.setBakeryList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
				
			case "bakery":
				currentOrder.setBakeryList(convertArrayListToString(update.getCurrentCategoryList()));
				if(update.getFromCategory().equals("todo")){
					log.info("INNNNNNNN");
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setTodoList(setList);
					}else {
						currentOrder.setTodoList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
					
				}else if(update.getFromCategory().equals("deli")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDeliList(setList);
					}else {
						currentOrder.setDeliList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("dairy")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setDairyList(setList);
					}else {
						currentOrder.setDairyList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("breakfast")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreakfastList(setList);
					}else {
						currentOrder.setBreakfastList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("international")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setInternationalList(setList);
					}else {
						currentOrder.setInternationalList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("baking")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBakingList(setList);
					}else {
						currentOrder.setBakingList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pasta/grains")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPastaGrainsList(setList);
					}else {
						currentOrder.setPastaGrainsList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("snacks")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setSnacksList(setList);
					}else {
						currentOrder.setSnacksList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("pets")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setPetList(setList);
					}else {
						currentOrder.setPetList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("household")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHouseholdList(setList);
					}else {
						currentOrder.setHouseholdList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("beverages")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBeveragesList(setList);
					}else {
						currentOrder.setBeveragesList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("bread")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setBreadList(setList);
					}else {
						currentOrder.setBreadList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("frozen")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setFrozenList(setList);
					}else {
						currentOrder.setFrozenList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("meat")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setMeatList(setList);
					}else {
						currentOrder.setMeatList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("produce")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setProduceList(setList);
					}else {
						currentOrder.setProduceList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}else if(update.getFromCategory().equals("health")) {
					if(update.getPreviousCategoryList().size() == 0) {
						currentOrder.setHealthList(setList);
					}else {
						currentOrder.setHealthList(convertArrayListToString(update.getPreviousCategoryList()));
					}
					
					currentOrderRepo.save(currentOrder);
				}
				
				break;
		}
		
		
		
		messagingTemplate.convertAndSendToUser(socketKey, "/topic/activeOrder", 
				CurrentOrderEntityUserResponse.builder()
				.todo(convertStringListToArray(currentOrder.getTodoList()))
				.health(convertStringListToArray(currentOrder.getHealthList()))
				.dairy(convertStringListToArray(currentOrder.getDairyList()))
				.breakfast(convertStringListToArray(currentOrder.getBreakfastList()))
				.international(convertStringListToArray(currentOrder.getInternationalList()))
				.baking(convertStringListToArray(currentOrder.getBakingList()))
				.grains(convertStringListToArray(currentOrder.getPastaGrainsList()))
				.snacks(convertStringListToArray(currentOrder.getSnacksList()))
				.pet(convertStringListToArray(currentOrder.getPetList()))
				.household(convertStringListToArray(currentOrder.getHouseholdList()))
				.beverages(convertStringListToArray(currentOrder.getBeveragesList()))
				.bread(convertStringListToArray(currentOrder.getBreadList()))
				.frozen(convertStringListToArray(currentOrder.getFrozenList()))
				.meat(convertStringListToArray(currentOrder.getMeatList()))
				.produce(convertStringListToArray(currentOrder.getProduceList()))
				.bakery(convertStringListToArray(currentOrder.getBakeryList()))
				.deli(convertStringListToArray(currentOrder.getDeliList()))
				.completed(convertStringListToArray(currentOrder.getCompletedList()))
				.date(currentOrder.getDate())
				.build()
				);
		
		return "nice";
	}
	
	CompleteItemResponse completeItem(CompleteItemRequest update, String token) {
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		String completedItem="";
		String newFromList="";
		String updatedList="";
		List<ListItemResponse> newFromListArray = new ArrayList<ListItemResponse>();
		CurrentOrderEntity currentOrder = currentOrderRepo.findUserById(Long.valueOf(user.get().getShopperId()));
		Long userId = listRepo.getUserByDate(currentOrder.getDate());
		String socketKey = userRepo.getSocketKeyById(userId);
		switch(update.getUpdateCategory()) {
			case "todo":
				for(ListItemResponse list : convertStringListToArray(currentOrder.getTodoList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getTodoList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setTodoList(null);
				}else {
					currentOrder.setTodoList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
				
			case "health":
				//return convertStringListToArray(currentOrder.getHealthList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getHealthList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getHealthList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setHealthList(null);
				}else {
					currentOrder.setHealthList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "dairy":
				//return convertStringListToArray(currentOrder.getDairyList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getDairyList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getDairyList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setDairyList(null);
				}else {
					currentOrder.setDairyList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "breakfast":
				//return convertStringListToArray(currentOrder.getBreakfastList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getBreakfastList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getBreakfastList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setBreakfastList(null);
				}else {
					currentOrder.setBreakfastList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "international":
				//return convertStringListToArray(currentOrder.getInternationalList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getInternationalList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getInternationalList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setInternationalList(null);
				}else {
					currentOrder.setInternationalList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "baking":
				//return convertStringListToArray(currentOrder.getBakingList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getBakingList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getBakingList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setBakingList(null);
				}else {
					currentOrder.setBakingList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "grains":
				//return convertStringListToArray(currentOrder.getPastaGrainsList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getPastaGrainsList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getPastaGrainsList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setPastaGrainsList(null);
				}else {
					currentOrder.setPastaGrainsList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "snacks":
				//return convertStringListToArray(currentOrder.getSnacksList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getSnacksList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getSnacksList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setSnacksList(null);
				}else {
					currentOrder.setSnacksList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "pet":
				//return convertStringListToArray(currentOrder.getPetList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getPetList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getPetList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setPetList(null);
				}else {
					currentOrder.setPetList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "household":
				//return convertStringListToArray(currentOrder.getHouseholdList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getHouseholdList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getHouseholdList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setHouseholdList(null);
				}else {
					currentOrder.setHouseholdList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "beverages":
				//return convertStringListToArray(currentOrder.getBeveragesList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getBeveragesList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getBeveragesList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setBeveragesList(null);
				}else {
					currentOrder.setBeveragesList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "bread":
				//return convertStringListToArray(currentOrder.getBreadList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getBreadList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getBreadList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setBreadList(null);
				}else {
					currentOrder.setBreadList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "frozen":
				//return convertStringListToArray(currentOrder.getFrozenList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getFrozenList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getFrozenList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setFrozenList(null);
				}else {
					currentOrder.setFrozenList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "meat":
				//return convertStringListToArray(currentOrder.getMeatList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getMeatList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getMeatList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setMeatList(null);
				}else {
					currentOrder.setMeatList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "produce":
				//return convertStringListToArray(currentOrder.getProduceList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getProduceList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getProduceList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setProduceList(null);
				}else {
					currentOrder.setProduceList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "bakery":
				//return convertStringListToArray(currentOrder.getBakeryList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getBakeryList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getBakeryList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setBakeryList(null);
				}else {
					currentOrder.setBakeryList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
			case "deli":
				//return convertStringListToArray(currentOrder.getDeliList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				for(ListItemResponse list : convertStringListToArray(currentOrder.getDeliList())) {
					if(list.getName().equals(update.getItemName())) {
						completedItem = list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}else {
						newFromList+=list.getImage()+"+"+list.getName()+"+"+list.getQuantity()+"~";
					}
				}

				if(currentOrder.getCompletedList() == null) {
					updatedList = completedItem;
				}else {
					updatedList = completedItem+=currentOrder.getCompletedList();
				}
				
				newFromListArray = convertStringListToArray(currentOrder.getDeliList()).stream().filter(d -> !update.getItemName().equals(d.getName())).collect(Collectors.toList());
				if(newFromList=="") {
					currentOrder.setDeliList(null);
				}else {
					currentOrder.setDeliList(newFromList);
				}
				currentOrder.setCompletedList(updatedList);
				currentOrderRepo.save(currentOrder);
				sendActiveOrderToClient(socketKey,currentOrder);
				return CompleteItemResponse.builder()
						.completed(convertStringListToArray(updatedList))
						.list(newFromListArray)
						.build();
		}
		
		
		
		return new CompleteItemResponse();
	}
	
	
	CurrentOrderEntityUserResponse getActiveOrder(String token){
		Optional<User> user = userRepo.findByEmail(jwtService.extractUsername(jwtService.extractFromBearer(token)));
		CurrentOrderEntity currentOrder = currentOrderRepo.findByDate(listRepo.getCurrentList(user.get().getId()));

		return CurrentOrderEntityUserResponse.builder()
				.todo(convertStringListToArray(currentOrder.getTodoList()))
				.breakfast(convertStringListToArray(currentOrder.getBreakfastList()))
				.pet(convertStringListToArray(currentOrder.getPetList()))
				.produce(convertStringListToArray(currentOrder.getProduceList()))
				.beverages(convertStringListToArray(currentOrder.getBeveragesList()))
				.bread(convertStringListToArray(currentOrder.getBreadList()))
				.international(convertStringListToArray(currentOrder.getInternationalList()))
				.baking(convertStringListToArray(currentOrder.getBakingList()))
				.grains(convertStringListToArray(currentOrder.getPastaGrainsList()))
				.snacks(convertStringListToArray(currentOrder.getSnacksList()))
				.deli(convertStringListToArray(currentOrder.getDeliList()))
				.bakery(convertStringListToArray(currentOrder.getBakeryList()))
				.meat(convertStringListToArray(currentOrder.getMeatList()))
				.household(convertStringListToArray(currentOrder.getHouseholdList()))
				.health(convertStringListToArray(currentOrder.getHealthList()))
				.frozen(convertStringListToArray(currentOrder.getFrozenList()))
				.dairy(convertStringListToArray(currentOrder.getDairyList()))
				.completed(convertStringListToArray(currentOrder.getCompletedList()))
				.date(currentOrder.getDate())
				.build();
	}
	
	
	public void setSocketCommunication(String message) throws JsonMappingException, JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		CurrentOrderEntityUserResponseWithUpdateMessage activeOrder = objectMapper.readValue(message, CurrentOrderEntityUserResponseWithUpdateMessage.class);
		//get shopperId from date of order
		int shopperId = listRepo.getShopperIdFromDateOfOrder(activeOrder.getDate().toString());
		log.info(message);
		String socketKey = userRepo.getSocketKeyByShopperId(shopperId);
		messagingTemplate.convertAndSendToUser(socketKey,"/topic/activeOrder", message);
	}
	
	void sendActiveOrderToClient(String socketKey, CurrentOrderEntity currentOrder) {
		messagingTemplate.convertAndSendToUser(socketKey,"/topic/activeOrder", CurrentOrderEntityUserResponse.builder()
				.todo(convertStringListToArray(currentOrder.getTodoList()))
				.health(convertStringListToArray(currentOrder.getHealthList()))
				.dairy(convertStringListToArray(currentOrder.getDairyList()))
				.breakfast(convertStringListToArray(currentOrder.getBreakfastList()))
				.international(convertStringListToArray(currentOrder.getInternationalList()))
				.baking(convertStringListToArray(currentOrder.getBakingList()))
				.grains(convertStringListToArray(currentOrder.getPastaGrainsList()))
				.snacks(convertStringListToArray(currentOrder.getSnacksList()))
				.pet(convertStringListToArray(currentOrder.getPetList()))
				.household(convertStringListToArray(currentOrder.getHouseholdList()))
				.beverages(convertStringListToArray(currentOrder.getBeveragesList()))
				.bread(convertStringListToArray(currentOrder.getBreadList()))
				.frozen(convertStringListToArray(currentOrder.getFrozenList()))
				.meat(convertStringListToArray(currentOrder.getMeatList()))
				.produce(convertStringListToArray(currentOrder.getProduceList()))
				.bakery(convertStringListToArray(currentOrder.getBakeryList()))
				.deli(convertStringListToArray(currentOrder.getDeliList()))
				.completed(convertStringListToArray(currentOrder.getCompletedList()))
				.date(currentOrder.getDate())
				.build());
	}
}
