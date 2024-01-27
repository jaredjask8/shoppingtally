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
	
	public List<AffiliateData> addAffiliateData(AffiliateData affiliateRequest){
		affiliateRepo.save(affiliateRequest);
		return affiliateRepo.findAll();
	}
	
	public List<AffiliateData> getAffiliateData(){
		return affiliateRepo.findAll();
	}
	
	public List<AffiliateData> deleteAffiliateData(AffiliateData affiliateRequest){
		affiliateRepo.delete(affiliateRequest);
		return affiliateRepo.findAll();
	}
}
