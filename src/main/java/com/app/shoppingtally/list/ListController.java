package com.app.shoppingtally.list;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

import com.app.shoppingtally.date.DateService;
import com.app.shoppingtally.token.Token;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/list")
public class ListController {
	private final ListService listService;
	
	
	public ListController(ListService listService) {
		this.listService = listService;

	}
	
	@PostMapping
	public String sendList(@RequestBody UserList list) {
		listService.addList(list);
		return "list sent";
	}
	
	@PostMapping("/user")
	public List<ListDTO> getUserDates(@RequestBody Token token) {
		return listService.getUserListData(token);
	}
	
	@PostMapping("/dates")
	public List<String> getAllDates(){
		return listService.getAllUserDates();
	}
}
