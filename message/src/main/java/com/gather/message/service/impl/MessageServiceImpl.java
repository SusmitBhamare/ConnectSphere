package com.gather.message.service.impl;

import java.util.Date;
import java.util.UUID;

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
  
  @Override
  public boolean sendMessage(MessageDTO messageDTO) {
    Message message = new Message();
    message.setReceiverIds(messageDTO.getReceiverIds());
    message.setSenderId(messageDTO.getSenderId());
    message.setContent(messageDTO.getContent());
    message.setWorkspaceId(messageDTO.getWorkspaceId());
    message.setAttachment(messageDTO.getAttachment());
    message.setCreatedAt(messageDTO.getCreatedAt());
    message.setStatus(Status.RECEIVED);

    for(UUID receiverId : messageDTO.getReceiverIds()){
      simpMessagingTemplate.convertAndSendToUser(receiverId.toString() , "/topic/messages", messageDTO);
    }
    message.setSentAt(new Date());
    messageRepository.save(message);    
    return true;
  }
  
}
