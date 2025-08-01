package com.connectsphere.message.service.impl;

import java.util.*;
import java.util.concurrent.TimeUnit;

import com.connectsphere.message.client.UserClient;
import com.connectsphere.message.client.WorkspaceClient;
import com.connectsphere.message.dummy.AddUsersInteractedDTO;
import com.connectsphere.message.dummy.UserAllDetailsDTO;
import com.connectsphere.message.entity.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.connectsphere.message.dto.MessageDTO;
import com.connectsphere.message.entity.Message;
import com.connectsphere.message.repository.MessageRepository;
import com.connectsphere.message.service.MessageService;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

  private static final Logger log = LoggerFactory.getLogger(MessageServiceImpl.class);
  private final MessageRepository messageRepository;
  private final UserClient userClient;
  private final WorkspaceClient workspaceClient;
  private final RedisTemplate<String, MessageDTO> redisTemplate;
  private final RedisTemplate<String, String> stringRedisTemplate;
  private static final String OFFLINE_MESSAGES_KEY = "offlineMessages:";


  public MessageDTO messageDTOMapper(Message message) {
    MessageDTO messageDTO = new MessageDTO();
    messageDTO.setId(message.getId());
    messageDTO.setContent(message.getContent());
    messageDTO.setSender(userClient.getUserById(message.getSenderId()));

    messageDTO.setReceivers(new ArrayList<>());
    for (UUID receiverId : message.getReceiverIds()) {
      UserAllDetailsDTO user = userClient.getUserById(receiverId);
      messageDTO.getReceivers().add(user);
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
  public MessageDTO sendMessage(Message message) {
    message.setSentAt(new Date());
    for (UUID receiverId : message.getReceiverIds()) {
      AddUsersInteractedDTO addUsersInteractedDTO = new AddUsersInteractedDTO(receiverId);
      userClient.addUsersInteracted(message.getSenderId(), addUsersInteractedDTO);
    }
    messageRepository.save(message);
    MessageDTO messageDTO = messageDTOMapper(message);

    for (UserAllDetailsDTO user : messageDTO.getReceivers()) {
      if (!isUserOnline(user.getUsername())) {
        storeOfflineMessage(user.getId(), messageDTO);
      } else {
        redisTemplate.convertAndSend("/topic/messages", messageDTO);
      }
      String key = generateKeyForRedisConversation(message.getSenderId(), user.getId());
      redisTemplate.opsForList().rightPush(key, messageDTO);
    }


    return messageDTO;
  }

  private void storeOfflineMessage(UUID id, MessageDTO messageDTO) {
    redisTemplate.opsForList().rightPush(OFFLINE_MESSAGES_KEY + id, messageDTO);
  }

  private static String generateKeyForRedisConversation(UUID id1, UUID id2) {
    List<UUID> keys = new ArrayList<>(List.of(id1, id2));
    Collections.sort(keys);
    return "chat:" + keys.get(0) + ":" + keys.get(1);
  }


  @Override
  public MessageDTO sendMessageToWorkspace(Message message) {
    message.setSentAt(new Date());
    messageRepository.save(message);
    MessageDTO messageDTO = messageDTOMapper(message);
    redisTemplate.convertAndSend("/topic/messages/ " + message.getWorkspaceId(), messageDTO);
    redisTemplate.opsForList().rightPush("workspace:" + message.getWorkspaceId() + ":messages", messageDTO);
    return messageDTO;
  }


  @Override
  public List<MessageDTO> getMessagesForWorkspace(UUID workspaceId) {
    List<MessageDTO> messagesDTO = redisTemplate.opsForList().range("workspace:" + workspaceId + ":messages", 0, -1);
    if (messagesDTO == null) {
      return new ArrayList<>();
    }
    if (messagesDTO.isEmpty()) {
      List<Message> messages = messageRepository.findAllByWorkspaceId(workspaceId);
      for (Message message : messages) {
        MessageDTO messageDTO = messageDTOMapper(message);
        redisTemplate.opsForList().rightPush("workspace:" + workspaceId + ":messages", messageDTO);
        messagesDTO.add(messageDTO);
      }
    }

    return messagesDTO;
  }

  @Override
//  @Transactional
  // This annotation is used to specify that the method is a transactional method. i.e. it will be executed within a transaction.
  public List<MessageDTO> getMessagesForConversation(UUID senderId, UUID receiverId) {
    String key = generateKeyForRedisConversation(senderId, receiverId);
    List<MessageDTO> messagesDTO = redisTemplate.opsForList().range(key, 0, -1);
    if (messagesDTO == null) {
      return new ArrayList<>();
    }
    if (messagesDTO.isEmpty()) {
      List<Message> messages = messageRepository.findAllBySenderIdAndReceiverIdsContains(senderId, receiverId);
      for (Message message : messages) {
        MessageDTO messageDTO = messageDTOMapper(message);
        redisTemplate.opsForList().rightPush(key, messageDTO);
        messagesDTO.add(messageDTO);
      }
    }
    return messagesDTO;
  }

  @Override
  public Map<String, Set<String>> getConnectedUsers() {
    Set<String> connectedUsers = stringRedisTemplate.opsForSet().members("connectedUsers");
    HashMap<String, Set<String>> map = new HashMap<>();
    map.put("connectedUsers", connectedUsers);
    return map;
  }

  @Override
  public ResponseEntity<List<MessageDTO>> getMissedMessages(UUID userId) {
    List<MessageDTO> offlineMessages = redisTemplate.opsForList().range(OFFLINE_MESSAGES_KEY + userId, 0, -1);
    if (offlineMessages == null) {
      return ResponseEntity.ok(new ArrayList<>());
    }

    List<MessageDTO> messageDTOS = new ArrayList<>();
    for (MessageDTO message : offlineMessages) {
      userClient.addUsersInteracted(userId , new AddUsersInteractedDTO(message.getSender().getId()));
    }

    redisTemplate.delete(OFFLINE_MESSAGES_KEY + userId);

    return ResponseEntity.ok(offlineMessages);
  }


  private boolean isUserOnline(String username) {
    return Boolean.TRUE.equals(stringRedisTemplate.opsForSet().isMember("connectedUsers", username));
  }


}
