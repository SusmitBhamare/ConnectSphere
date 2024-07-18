package com.gather.message.service;

import com.gather.message.dto.MessageDTO;
import com.gather.message.entity.Message;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public interface MessageService {

  MessageDTO sendMessage(Message messageDTO);

  MessageDTO sendMessageToWorkspace(Message messageDTO);

  List<MessageDTO> getMessagesForWorkspace(UUID workspaceId);

  List<MessageDTO> getMessagesForConversation(UUID userOneId, UUID userTwoId);

  Map<String, Set<String>> getConnectedUsers();


}
