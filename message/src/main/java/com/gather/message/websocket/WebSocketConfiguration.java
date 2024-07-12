package com.gather.message.websocket;

import com.gather.message.auth.JWTUtil;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.ArrayList;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

  private static final Logger log = LoggerFactory.getLogger(WebSocketConfiguration.class);
  private final JWTUtil jwtUtil;


  @Override
  public void registerStompEndpoints(@SuppressWarnings("null") StompEndpointRegistry registry){
    registry.addEndpoint("/ws")
            .setAllowedOrigins("http://localhost:3000")
            .withSockJS();
  }

  @Override
  public void configureMessageBroker(@SuppressWarnings("null") MessageBrokerRegistry registry){
    registry.enableSimpleBroker("/topic");
    registry.setApplicationDestinationPrefixes("/app");
  }

  @Override
  public void configureClientInboundChannel(ChannelRegistration channelRegistration){
    channelRegistration.interceptors(new ChannelInterceptor() {
      @Override
      public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        assert accessor != null;

        if(StompCommand.CONNECT.equals(accessor.getCommand())){
          String authorizationHeader = accessor.getFirstNativeHeader("Authorization");
          assert authorizationHeader != null;
          String token = authorizationHeader.substring(7);
          Claims claims = jwtUtil.extractAllClaims(token);
          UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                  claims.getSubject(), null, new ArrayList<>()
          );
          SecurityContextHolder.getContext().setAuthentication(authentication);
          accessor.setUser(authentication);
          accessor.setSessionAttributes(claims);
        }

        return message;
      }

    });

  }


}
