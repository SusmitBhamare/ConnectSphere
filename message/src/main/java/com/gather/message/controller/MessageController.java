package com.gather.message.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.gather.message.dto.MessageDTO;
import com.gather.message.service.MessageService;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
public class MessageController {

  private final MessageService messageService;
  
  @MessageMapping("/chat")
  @SendTo("/topic/messages")
  public ResponseEntity<String> sendMessage(@RequestBody MessageDTO message){
    System.out.println("Message Received" + message);
    messageService.sendMessage(message);
    return new ResponseEntity<>("Message Sent" , HttpStatus.OK);
  }

  @GetMapping("/test")
  public String test(){
    return "Test";
  }
}
