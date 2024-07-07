package com.gather.message.controller;

import com.gather.message.dto.UserStatusDTO;
import com.gather.message.entity.Message;
import com.gather.message.service.UserStatusService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.gather.message.dto.MessageDTO;
import com.gather.message.service.MessageService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;


@RestController
@RequiredArgsConstructor
public class MessageController {

  private final MessageService messageService;
  private final UserStatusService userStatusService;
  
  @MessageMapping("/chat")
  public Message sendMessage(@RequestBody Message message){
    if(message.getWorkspaceId() != null){
      messageService.sendMessageToWorkspace(message);
    } else{
    messageService.sendMessage(message);
    }

    return message;
  }

  @MessageMapping("/user/online/{username}")
  @SendTo("/topic/userStatus")
  public ResponseEntity<UserStatusDTO> setUserOnline(@PathVariable String username){
    UserStatusDTO userStatusDTO =  userStatusService.setUserOnline(username);
    return new ResponseEntity<>(userStatusDTO , HttpStatus.OK);
  }

  @MessageMapping("/user/offline/{username}")
  @SendTo("/topic/userStatus")
  public ResponseEntity<UserStatusDTO> setUserOffline(@PathVariable String username){
    UserStatusDTO userStatusDTO = userStatusService.setUserOffline(username);
    return new ResponseEntity<>(userStatusDTO , HttpStatus.OK);
  }

  @GetMapping("/user/status/{username}")
  public boolean isUserOnline(@PathVariable String username) {
    return userStatusService.isUserOnline(username);
  }

  @GetMapping("/workspace/{workspaceId}")
  public ResponseEntity<List<Message>> getMessagesForWorkspace(@PathVariable UUID workspaceId){
    return ResponseEntity.ok(messageService.getMessagesForWorkspace(workspaceId));
  }

}
