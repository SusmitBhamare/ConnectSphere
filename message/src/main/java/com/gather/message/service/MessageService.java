package com.gather.message.service;

import com.gather.message.dto.MessageDTO;
import com.gather.message.entity.Message;

import java.util.List;
import java.util.UUID;

public interface MessageService {

  MessageDTO sendMessage(Message messageDTO);

  MessageDTO sendMessageToWorkspace(Message messageDTO);

  List<MessageDTO> getMessagesForWorkspace(UUID workspaceId);

  List<MessageDTO> getMessagesForUser(UUID userId);
}
