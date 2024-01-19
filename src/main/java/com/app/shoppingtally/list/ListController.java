package com.app.shoppingtally.list;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Date;
import java.util.List;

import com.app.shoppingtally.auth.models.FullListRequest;
import com.app.shoppingtally.auth.models.ListItemResponse;
import com.app.shoppingtally.auth.models.ListToFrontendWithCount;
import com.app.shoppingtally.date.DateService;
import com.app.shoppingtally.list.models.CategoryUpdateRequest;
import com.app.shoppingtally.list.models.CompleteItemRequest;
import com.app.shoppingtally.list.models.CompleteItemResponse;
import com.app.shoppingtally.list.models.CurrentOrder;
import com.app.shoppingtally.list.models.ListItemWithCategoryRequest;
import com.app.shoppingtally.list.models.ShopperOrders;
import com.app.shoppingtally.list.models.ShopperRequest;
import com.app.shoppingtally.list.models.UserOrderInfo;
import com.app.shoppingtally.shopping.CurrentOrderEntity;
import com.app.shoppingtally.shopping.CurrentOrderEntityShopperResponse;
import com.app.shoppingtally.shopping.CurrentOrderEntityUserResponse;
import com.app.shoppingtally.token.Token;

import io.jsonwebtoken.io.IOException;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/v1/list")
public class ListController {
	private final ListService listService;
	
	
	public ListController(ListService listService) {
		this.listService = listService;

	}
	
	@CrossOrigin
	@PostMapping
	public ListToFrontendWithCount sendList(@RequestBody UserList list) {
		return listService.addList(list);
	}

	
	@CrossOrigin
	@PostMapping("/user")
	public List<ListDTO> getUserDates(@RequestBody Token token) {
		return listService.getUserListData(token);
	}
	
	@CrossOrigin
	@PostMapping("/dates")
	public List<String> getAllDates(@RequestBody ShopperRequest shopperRequest){
		return listService.getAllUserDates(shopperRequest);
	}
	
	@CrossOrigin
	@PostMapping("/getOrders")
	public List<ShopperOrders> getAllDates(@RequestHeader(HttpHeaders.AUTHORIZATION) String token){
		return listService.getOrders(token);
	}
	
	@CrossOrigin
	@PostMapping("/startOrder")
	public ListToFrontendWithCount startOrder(@RequestBody CurrentOrder currentOrder, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.createCurrentOrder(currentOrder, token);
		
	}
	
	
	@CrossOrigin
	@PostMapping("/getCurrentOrder")
	public CurrentOrderEntityShopperResponse getCurrentOrder(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.getCurrentOrder(token);
	}
	
	@CrossOrigin
	@PostMapping("/endCurrentOrder")
	public String endCurrentOrder(@RequestBody CurrentOrder currentOrder, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.endCurrentOrder(currentOrder,token);
	}
	
	@CrossOrigin
	@PostMapping("/updateCategories")
	public String updateCategories(@RequestBody CategoryUpdateRequest update, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.updateCategories(update, token);
	}
	
	@CrossOrigin
	@PostMapping("/completeItem")
	public CompleteItemResponse completeItem(@RequestBody CompleteItemRequest update, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.completeItem(update, token);
	}
	
	@CrossOrigin
	@PostMapping("/getActiveOrder")
	public CurrentOrderEntityUserResponse getActiveOrder(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) throws ClassNotFoundException {
		return listService.getActiveOrder(token);
	}
	
	@CrossOrigin
	@PostMapping("/hasCurrentOrder")
	public UserOrderInfo hasCurrentOrder(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.getUserOrderInfo(token);
	}
	
	@CrossOrigin
	@GetMapping("/cancelCurrentOrder")
	public UserOrderInfo cancelCurrentOrder(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.cancelCurrentOrder(token);
	}
	
	@CrossOrigin
	@PostMapping("/getUserList")
	public ListToFrontendWithCount getUserList(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.getUserList(token);
	}
	
	@CrossOrigin
	@PostMapping("/addListToCurrentOrder")
	public List<ListItemResponse> addListToCurrentOrder(@RequestBody List<ListItemResponse> list, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.addListToCurrentOrder(list,token);
	}
	
	@CrossOrigin
	@PostMapping("/addListToActiveOrder")
	public CurrentOrderEntity addListToActiveOrder(@RequestBody List<ListItemResponse> list, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.addListToActiveOrder(list,token);
	}
	
	@CrossOrigin
	@PostMapping("/addItemToCurrentOrder")
	public List<ListItemResponse> addItemToCurrentOrder(@RequestBody ListItemResponse item, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.addItemToCurrentOrder(item,token);
	}
	
	@CrossOrigin
	@PostMapping("/addItemToActiveOrder")
	public CurrentOrderEntityUserResponse addItemToActiveOrder(@RequestBody ListItemResponse item,@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.addItemToActiveOrder(item, token);
	}
	
	@CrossOrigin
	@PostMapping("/deleteCurrentOrderItem")
	public List<ListItemResponse> deleteCurrentOrderItem(@RequestBody ListItemResponse item,@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.deleteCurrentOrderItem(item, token);
	}
	
	@CrossOrigin
	@PostMapping("/increaseCurrentOrderQuantity")
	public List<ListItemResponse> increaseCurrentOrderQuantity(@RequestBody ListItemResponse item,@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.increaseCurrentOrderQuantity(item, token);
	}
	
	@CrossOrigin
	@PostMapping("/decreaseCurrentOrderQuantity")
	public List<ListItemResponse> decreaseCurrentOrderQuantity(@RequestBody ListItemResponse item,@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.decreaseCurrentOrderQuantity(item, token);
	}
	
	@CrossOrigin
	@PostMapping("/increaseActiveOrderQuantity")
	public CurrentOrderEntityUserResponse increaseActiveOrderQuantity(@RequestBody ListItemWithCategoryRequest itemWithCategory,@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.increaseActiveOrderQuantity(itemWithCategory, token);
	}
	
	@CrossOrigin
	@PostMapping("/decreaseActiveOrderQuantity")
	public CurrentOrderEntityUserResponse decreaseActiveOrderQuantity(@RequestBody ListItemWithCategoryRequest itemWithCategory,@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.decreaseActiveOrderQuantity(itemWithCategory, token);
	}
	
	@CrossOrigin
	@PostMapping("/deleteActiveOrderItem")
	public CurrentOrderEntityUserResponse deleteActiveOrderItem(@RequestBody ListItemWithCategoryRequest itemWithCategory,@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.deleteActiveOrderQuantity(itemWithCategory, token);
	}
	
}
