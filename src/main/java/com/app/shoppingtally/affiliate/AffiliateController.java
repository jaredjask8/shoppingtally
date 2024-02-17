package com.app.shoppingtally.affiliate;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.shoppingtally.auth.models.ListToFrontendWithCount;
import com.app.shoppingtally.list.ListService;
import com.app.shoppingtally.list.UserList;
import com.app.shoppingtally.recipes.RecipesService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/affiliate")
public class AffiliateController {
	@Autowired
	private final AffiliateService affiliateService;
	
	
	@PostMapping("/add")
	public List<AffiliateAdminData> addAffiliateData(@RequestBody AffiliateAdminData affiliateRequest) {
		return affiliateService.addAffiliateData(affiliateRequest);
	}
	
	@GetMapping("/get")
	public List<AffiliateAdminData> getAffiliateData() {
		return affiliateService.getAffiliateData();
	}
	
	@PostMapping("/delete")
	public List<AffiliateAdminData> deleteAffiliateData(@RequestBody AffiliateAdminData affiliateRequest) {
		return affiliateService.deleteAffiliateData(affiliateRequest);
	}
}
