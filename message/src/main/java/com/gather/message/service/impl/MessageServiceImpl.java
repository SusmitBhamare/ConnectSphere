package com.gather.message.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.gather.message.client.UserClient;
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
  public void sendMessage(Message message) {
    message.setSentAt(new Date());
    for(UUID receiverId : message.getReceiverIds()){
      redisTemplate.convertAndSend("/topic/messages", message);
      redisTemplate.opsForList().rightPush("user:" + receiverId + ":messages", message);
    }
    messageRepository.save(message);
  }



  @Override
  public void sendMessageToWorkspace(Message message) {
    message.setSentAt(new Date());
    redisTemplate.convertAndSend("/topic/messages/ " + message.getWorkspaceId(), message);
    redisTemplate.opsForList().rightPush("workspace:" + message.getWorkspaceId() + ":messages", message);
    messageRepository.save(message);
  }



  @Override
  public List<Message> getMessagesForWorkspace(UUID workspaceId) {
    List<Object> messages = redisTemplate.opsForList().range("workspace:" + workspaceId + ":messages", 0, -1);
    if(messages == null){
      return new ArrayList<>();
    }
//    if(messages.isEmpty()){
//      messages = messageRepository.findAllByWorkspaceId(workspaceId);
//      for(Message message : messages){
//        redisTemplate.opsForList().rightPush("workspace:" + workspaceId + ":messages", message);
//      }
//    }
//    return messages;
      return null;
  }


}
