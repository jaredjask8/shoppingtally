package com.app.shoppingtally.socket;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import com.app.shoppingtally.list.ListService;
import com.app.shoppingtally.shopping.CurrentOrderEntityUserResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class MessageController {
	
	private final ListService listService;
	private final SimpMessagingTemplate messagingTemplate;
	
	public MessageController(ListService listService, SimpMessagingTemplate messagingTemplate) {
		this.listService = listService;
		this.messagingTemplate = messagingTemplate;
	}
	
	@MessageMapping("/message")
    @SendToUser("/topic/messages")
    public String getPrivateMessage(final Message message,
                                             final Principal principal) throws InterruptedException {
        Thread.sleep(1000);
        return message.getMessageContent();
    }
	
    @SendToUser("/topic/activeOrder")
    public String getActiveOrder(final Message message,
                                             final Principal principal) throws InterruptedException {
		log.info(message.toString());
		Thread.sleep(1000);
        return message.getMessageContent();
    }
    
    @MessageMapping("/test")
    public void sendActiveOrderToShopper(String message,
                                             final Principal principal) throws JsonMappingException, JsonProcessingException {
    	listService.setSocketCommunication(message);
 
    	
    	log.info(message.toString());
    }
}
