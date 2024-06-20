package com.gather.message.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.gather.message.entity.Message;


@RestController
public class MessageController {
  
  @MessageMapping("/send")
  @SendTo("/topic/messages")
  public ResponseEntity<Message> sendMessage(@RequestBody Message message){
    System.out.println("Message sent: " + message);
    return ResponseEntity.ok(message);
  }
}
