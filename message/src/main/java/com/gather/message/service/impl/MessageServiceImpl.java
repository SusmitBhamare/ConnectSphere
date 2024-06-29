package com.gather.message.service.impl;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.gather.message.client.UserClient;
import com.gather.message.dummy.User;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.gather.message.dto.MessageDTO;
import com.gather.message.entity.Message;
import com.gather.message.entity.Status;
import com.gather.message.repository.MessageRepository;
import com.gather.message.service.MessageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
  
  private final SimpMessagingTemplate simpMessagingTemplate;
  private final MessageRepository messageRepository;
  private final UserClient userClient;
  private final RedisTemplate<String,Object> redisTemplate;
  
  @Override
  public void sendMessage(MessageDTO messageDTO) {
    Message message = convertToMap(messageDTO);

    for(UUID receiverId : messageDTO.getReceiverIds()){
      simpMessagingTemplate.convertAndSendToUser(receiverId.toString() , "/topic/messages", messageDTO);
      redisTemplate.opsForList().rightPush("user:" + receiverId + ":messages", message);
    }
    message.setSentAt(new Date());
    messageRepository.save(message);
  }

  private Message convertToMap(MessageDTO messageDTO) {
    Message message = new Message();
    message.setReceiverIds(messageDTO.getReceiverIds());
    message.setSenderId(messageDTO.getSenderId());
    message.setContent(messageDTO.getContent());
    message.setWorkspaceId(messageDTO.getWorkspaceId());
    message.setAttachment(messageDTO.getAttachment());
    message.setCreatedAt(messageDTO.getCreatedAt());
    message.setStatus(Status.RECEIVED);
    return message;
  }

  @Override
  public void sendMessageToWorkspace(MessageDTO messageDTO) {
    Message message = convertToMap(messageDTO);
    simpMessagingTemplate.convertAndSend("/topic/messages " + messageDTO.getWorkspaceId(), messageDTO);
    redisTemplate.opsForList().rightPush("workspace:" + messageDTO.getWorkspaceId() + ":messages", message);
    message.setSentAt(new Date());
    messageRepository.save(message);
  }

  @Override
  public void deleteMessage(String messageId) {

  }

  @Override
  @RateLimiter(name = "userBreaker" , fallbackMethod = "userBreakerFallback")
  public User getUser(String username) {
      return userClient.getUser(username);
  }

  @Override
  public List<Message> getMessages(UUID userId) {
    return List.of();
  }

  private User userBreakerFallback(Exception e){
    return null;
  }

}
