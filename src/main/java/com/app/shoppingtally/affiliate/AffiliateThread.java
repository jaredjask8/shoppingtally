package com.app.shoppingtally.affiliate;



import java.util.List;
import java.util.Optional;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.app.shoppingtally.list.ListRepository;
import com.app.shoppingtally.list.UserList;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class AffiliateThread extends Thread{
	private final AffiliateWebDriver affiliateDriver;
	private final String token;
	private final UserList userList;
	private final ListRepository listRepo;
	private final User user;
	private final SimpMessagingTemplate affiliateMessage;
	
	
	public void run() {
		String socketKey = user.getSocketKey();
		String affiliateDataString="";
		
		List<AffiliateData> affiliateList = affiliateDriver.startDriver(token);
		for(AffiliateData data : affiliateList) {
			affiliateDataString+=data.name+"+"+data.image+"+"+data.link+"~";
		}
		userList.setAffiliateData(affiliateDataString);
		listRepo.save(userList);
		
		//message user with their socketId
		affiliateMessage.convertAndSendToUser(socketKey,"topic/affiliate", affiliateList);
		log.info(affiliateList.toString());
	}
	
}
