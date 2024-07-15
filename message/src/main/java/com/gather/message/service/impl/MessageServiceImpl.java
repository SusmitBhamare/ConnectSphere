package com.gather.message.service.impl;

import java.util.*;

import com.gather.message.client.UserClient;
import com.gather.message.client.WorkspaceClient;
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
    public MessageDTO sendMessage(Message message) {
        message.setSentAt(new Date());
        for (UUID receiverId : message.getReceiverIds()) {
            redisTemplate.convertAndSend("/topic/messages", message);
            redisTemplate.opsForList().rightPush("user:" + receiverId + ":messages", message);
        }
        messageRepository.save(message);
        return messageDTOMapper(message);
    }


    @Override
    public MessageDTO sendMessageToWorkspace(Message message) {
        message.setSentAt(new Date());
        redisTemplate.convertAndSend("/topic/messages/ " + message.getWorkspaceId(), message);
        redisTemplate.opsForList().rightPush("workspace:" + message.getWorkspaceId() + ":messages", message);
        messageRepository.save(message);
        return messageDTOMapper(message);
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
    public List<MessageDTO> getMessagesForUser(UUID userId) {
        List<Message> messages = redisTemplate.opsForList().range("user:" + userId + ":messages", 0, -1);
        if (messages == null) {
            return new ArrayList<>();
        }
        if (messages.isEmpty()) {
            messages = messageRepository.findAllByReceiverIdsContains(userId);
            for (Message message : messages) {
                redisTemplate.opsForList().rightPush("user:" + userId + ":messages", message);
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
        HashMap<String , Set<String>> map = new HashMap<>();
        map.put("connectedUsers", connectedUsers);
        return map;
    }


}
