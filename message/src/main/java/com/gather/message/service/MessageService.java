package com.gather.message.service;

import com.gather.message.dto.MessageDTO;
import com.gather.message.dummy.User;
import com.gather.message.entity.Message;

import java.util.List;
import java.util.UUID;

public interface MessageService {

  void sendMessage(Message messageDTO);

  void sendMessageToWorkspace(Message messageDTO);

  List<Message> getMessagesForWorkspace(UUID workspaceId);

}