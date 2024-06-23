package com.gather.message.service;

import com.gather.message.dto.MessageDTO;

public interface MessageService {

  boolean sendMessage(MessageDTO messageDTO);
  
} 