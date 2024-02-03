package com.app.shoppingtally.affiliate;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AffiliateService {
	@Autowired
	private final AffiliateRepository affiliateRepo;
	
	public List<AffiliateAdminData> addAffiliateData(AffiliateAdminData affiliateRequest){
		affiliateRepo.save(affiliateRequest);
		return affiliateRepo.findAll();
	}
	
	public List<AffiliateAdminData> getAffiliateData(){
		//AffiliateData data = webDriver.startDriver();
		//affiliateRepo.save(data);
		return affiliateRepo.findAll();
	}
	
	public List<AffiliateAdminData> deleteAffiliateData(AffiliateAdminData affiliateRequest){
		affiliateRepo.delete(affiliateRequest);
		return affiliateRepo.findAll();
	}
}
