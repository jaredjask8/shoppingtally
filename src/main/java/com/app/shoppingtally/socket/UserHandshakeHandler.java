package com.app.shoppingtally.socket;

import com.app.shoppingtally.auth.AuthenticationService;
import com.app.shoppingtally.config.JwtService;
import com.app.shoppingtally.list.ListRepository;
import com.app.shoppingtally.shopping.CurrentOrderRepo;
import com.app.shoppingtally.user.User;
import com.app.shoppingtally.user.UserRepo;
import com.sun.security.auth.UserPrincipal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import java.util.Optional;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

public class UserHandshakeHandler extends DefaultHandshakeHandler{
	private final Logger LOG = LoggerFactory.getLogger(UserHandshakeHandler.class);
	

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
    	final String randomId = UUID.randomUUID().toString();
        LOG.info("User with ID '{}' opened the page", randomId);
        
        return new UserPrincipal(randomId);
    }
}
