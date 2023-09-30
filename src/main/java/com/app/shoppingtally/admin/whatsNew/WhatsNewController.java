package com.app.shoppingtally.admin.whatsNew;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.shoppingtally.list.UserList;

@RestController
@CrossOrigin("https://www.shoppingtally.click")
@RequestMapping("/api/v1/admin/whatsNew")
public class WhatsNewController {
	
	private final WhatsNewService whatsNewService;
	
	public WhatsNewController(WhatsNewService whatsNewService) {
		this.whatsNewService = whatsNewService;
		
	}
	
	@CrossOrigin("https://www.shoppingtally.click")
	@PostMapping("/push")
	public WhatsNew setWhatsNew(@RequestBody WhatsNew whatsNew) {
		whatsNewService.upload(whatsNew);
		return whatsNew;
	}
	
	@CrossOrigin("https://www.shoppingtally.click")
	@GetMapping("/list")
	public List<WhatsNew> getWhatsNew() {
		return whatsNewService.download();
	}
}
