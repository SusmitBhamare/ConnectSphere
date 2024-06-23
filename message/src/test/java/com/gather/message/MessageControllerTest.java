package com.gather.message;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.gather.message.controller.MessageController;
import com.gather.message.dto.MessageDTO;
import com.gather.message.service.MessageService;

import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.List;
import java.util.UUID;

class MessageControllerTest {

  @Mock
  private MessageService messageService;

  @InjectMocks
  private MessageController messageController;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testSendMessage() {
    MessageDTO messageDTO = new MessageDTO();
    messageDTO.setSenderId(new UUID(20, 20));
    messageDTO.setReceiverId(List.of(new UUID(10, 0), new UUID(10, 1)));
    messageDTO.setContent("Hello");
    messageDTO.setWorkspaceId(new UUID(30, 30));
    messageDTO.setAttachment("attachment");
    messageDTO.setCreatedAt(new Date());

    messageController.sendMessage(messageDTO);

    when(messageService.sendMessage(messageDTO)).thenReturn(true);

    // Add your test logic here
  }
}