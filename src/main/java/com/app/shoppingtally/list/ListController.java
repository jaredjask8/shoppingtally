package com.app.shoppingtally.list;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

import com.app.shoppingtally.auth.models.FullListRequest;
import com.app.shoppingtally.auth.models.ListItemResponse;
import com.app.shoppingtally.auth.models.ListToFrontendWithCount;
import com.app.shoppingtally.date.DateService;
import com.app.shoppingtally.list.models.CurrentOrder;
import com.app.shoppingtally.list.models.ShopperOrders;
import com.app.shoppingtally.list.models.ShopperRequest;
import com.app.shoppingtally.shopping.CurrentOrderEntity;
import com.app.shoppingtally.shopping.CurrentOrderEntityResponse;
import com.app.shoppingtally.token.Token;

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
		//return token;
	}
	
	@CrossOrigin
	@PostMapping("/getCurrentOrder")
	public CurrentOrderEntityResponse getCurrentOrder(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.getCurrentOrder(token);
	}
	
	@CrossOrigin
	@PostMapping("/endCurrentOrder")
	public String endCurrentOrder(@RequestBody CurrentOrder currentOrder, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
		return listService.endCurrentOrder(currentOrder,token);
	}
	
}
