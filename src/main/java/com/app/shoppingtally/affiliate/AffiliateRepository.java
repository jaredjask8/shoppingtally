package com.app.shoppingtally.affiliate;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AffiliateRepository extends MongoRepository<AffiliateAdminData,String>{
	
}
