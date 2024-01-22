package com.app.shoppingtally.admin.whatsNew;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class WhatsNewService {
	
	@Autowired
	private WhatsNewRepo whatsNewRepo;
	
	public void upload(WhatsNew whatsNewData) {
		try {
			whatsNewRepo.save(whatsNewData);
		}catch(Exception e) {
			e.getMessage();
		}
		
	}
	
	public List<WhatsNew> download() {
		return whatsNewRepo.findAll();
	}
	
	
}
