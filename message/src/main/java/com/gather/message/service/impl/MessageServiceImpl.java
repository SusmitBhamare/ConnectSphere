package com.gather.message.service.impl;

import java.util.*;

import com.gather.message.client.UserClient;
import com.gather.message.client.WorkspaceClient;
import com.gather.message.dto.MessageWithAttachmentDTO;
import com.gather.message.dummy.AddUsersInteractedDTO;
import com.gather.message.service.CloudinaryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.gather.message.dto.MessageDTO;
import com.gather.message.entity.Message;
import com.gather.message.repository.MessageRepository;
import com.gather.message.service.MessageService;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

  private static final Logger log = LoggerFactory.getLogger(MessageServiceImpl.class);
  private final SimpMessagingTemplate simpMessagingTemplate;
  private final MessageRepository messageRepository;
  private final UserClient userClient;
  private final WorkspaceClient workspaceClient;
  private final RedisTemplate<String, Message> redisTemplate;
  private final RedisTemplate<String, String> stringRedisTemplate;
  private final CloudinaryService cloudinaryService;


  public MessageDTO messageDTOMapper(Message message) {
    MessageDTO messageDTO = new MessageDTO();
    messageDTO.setId(message.getId());
    messageDTO.setContent(message.getContent());
    messageDTO.setSender(userClient.getUserById(message.getSenderId()));

    messageDTO.setReceivers(new ArrayList<>());
    for (UUID receiverId : message.getReceiverIds()) {
      messageDTO.getReceivers().add(userClient.getUserById(receiverId));
    }

    if (message.getWorkspaceId() != null) {
      messageDTO.setWorkspace(workspaceClient.getWorkspaceById(message.getWorkspaceId()));
    }
    messageDTO.setAttachment(message.getAttachment());
    messageDTO.setStatus(message.getStatus());
    messageDTO.setCreatedAt(message.getCreatedAt());
    return messageDTO;
  }

  @Override
  public MessageDTO sendMessage(MessageWithAttachmentDTO message) {
    message.setSentAt(new Date());
    Message message1 = convertToMessage(message);
    for (UUID receiverId : message.getReceiverIds()) {
      AddUsersInteractedDTO addUsersInteractedDTO = new AddUsersInteractedDTO(receiverId);
      System.out.println("addUsersInteractedDTO: " + addUsersInteractedDTO);
      userClient.addUsersInteracted(message.getSenderId(), addUsersInteractedDTO);
      redisTemplate.convertAndSend("/topic/messages", message1);
      String key = generateKeyForRedisConversation(message1.getSenderId(), receiverId);
      redisTemplate.opsForList().rightPush(key, message1);
    }
    messageRepository.save(message1);
    return messageDTOMapper(message1);
  }

  private static String generateKeyForRedisConversation(UUID id1, UUID id2) {
    List<UUID> keys = new ArrayList<>(List.of(id1, id2));
    Collections.sort(keys);
    return "chat:" + keys.get(0) + keys.get(1);
  }


  @Override
  public MessageDTO sendMessageToWorkspace(MessageWithAttachmentDTO message) {
    message.setSentAt(new Date());
    // Image
    Message message1 = convertToMessage(message);
    redisTemplate.convertAndSend("/topic/messages/ " + message.getWorkspaceId(), message1);
    redisTemplate.opsForList().rightPush("workspace:" + message.getWorkspaceId() + ":messages", message1);
    messageRepository.save(message1);
    return messageDTOMapper(message1);
  }

  private Message convertToMessage(MessageWithAttachmentDTO messageDTO) {
    Message message = new Message();
    message.setId(UUID.randomUUID());
    message.setContent(messageDTO.getContent());
    message.setSenderId(messageDTO.getSenderId());
    message.setReceiverIds(messageDTO.getReceiverIds());
    message.setWorkspaceId(messageDTO.getWorkspaceId());
    if(messageDTO.getAttachment() != null){
      message.setAttachment(cloudinaryService.upload(messageDTO.getAttachment() , messageDTO.getSenderId().toString()));
    } else{
      message.setAttachment("");
    }
    message.setSentAt(new Date());
    message.setCreatedAt(new Date());
    return message;
  }


  @Override
  public List<MessageDTO> getMessagesForWorkspace(UUID workspaceId) {
    List<Message> messages = redisTemplate.opsForList().range("workspace:" + workspaceId + ":messages", 0, -1);
    if (messages == null) {
      return new ArrayList<>();
    }
    if (messages.isEmpty()) {
      messages = messageRepository.findAllByWorkspaceId(workspaceId);
      for (Message message : messages) {
        redisTemplate.opsForList().rightPush("workspace:" + workspaceId + ":messages", message);
      }
    }
    List<MessageDTO> messageDTOS = new ArrayList<>();
    for (Message message : messages) {
      messageDTOS.add(messageDTOMapper(message));
    }
    return messageDTOS;
  }

  @Override
  @Transactional // This annotation is used to specify that the method is a transactional method. i.e. it will be executed within a transaction.
  public List<MessageDTO> getMessagesForConversation(UUID senderId, UUID receiverId) {
    String key = generateKeyForRedisConversation(senderId, receiverId);
    List<Message> messages = redisTemplate.opsForList().range(key, 0, -1);
    if (messages == null) {
      return new ArrayList<>();
    }
    if (messages.isEmpty()) {
      messages = messageRepository.findAllBySenderIdAndReceiverIdsContains(senderId, receiverId);
      for (Message message : messages) {
        redisTemplate.opsForList().rightPush(key, message);
      }
    }
    List<MessageDTO> messageDTOS = new ArrayList<>();
    for (Message message : messages) {
      messageDTOS.add(messageDTOMapper(message));
    }
    return messageDTOS;
  }

  @Override
  public Map<String, Set<String>> getConnectedUsers() {
    Set<String> connectedUsers = stringRedisTemplate.opsForSet().members("connectedUsers");
    HashMap<String, Set<String>> map = new HashMap<>();
    map.put("connectedUsers", connectedUsers);
    return map;
  }


}
