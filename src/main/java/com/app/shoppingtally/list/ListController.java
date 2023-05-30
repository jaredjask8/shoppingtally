package com.app.shoppingtally.list;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.shoppingtally.date.DateService;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/v1/list")
public class ListController {
	private final ListService listService;
	
	
	public ListController(ListService listService) {
		this.listService = listService;

	}
	
	@PostMapping
	public String sendList(@RequestBody List list) {
		listService.addList(list);
		return "list sent";
	}
}
