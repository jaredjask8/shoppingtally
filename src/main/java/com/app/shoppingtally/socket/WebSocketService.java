package com.app.shoppingtally.socket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {
	private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
 
    }
    
    public void notifyFrontend(final String message) {
        ResponseMessage response = new ResponseMessage(message);

        messagingTemplate.convertAndSend("/topic/messages", response);
    }
    
    public void notifyUser(final String id, final String message) {
        ResponseMessage response = new ResponseMessage(message);
        messagingTemplate.convertAndSendToUser(id, "/topic/private-messages", response);
    }
    
}
