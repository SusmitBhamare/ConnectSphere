package com.connectsphere.message.controller;

import com.connectsphere.message.dto.FileUploadDTO;
import com.connectsphere.message.entity.Message;
import com.connectsphere.message.util.TokenUtility;
import lombok.AllArgsConstructor;
import org.simpleframework.xml.Path;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import com.connectsphere.message.dto.MessageDTO;
import com.connectsphere.message.service.MessageService;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;


@RestController
@AllArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public MessageDTO sendMessage(@RequestBody Message message, SimpMessageHeaderAccessor headerAccessor) {
        TokenUtility.storeToken(headerAccessor);
        if (message.getWorkspaceId() != null) {
            return messageService.sendMessageToWorkspace(message);
        } else {
            return messageService.sendMessage(message);
        }

    }

    @GetMapping("/messages/workspace/{workspaceId}")
    public ResponseEntity<List<MessageDTO>> getMessagesForWorkspace(@PathVariable UUID workspaceId) {
        return ResponseEntity.ok(messageService.getMessagesForWorkspace(workspaceId));
    }

    @GetMapping("/messages/user/{userOneId}/{userTwoId}")
    public ResponseEntity<List<MessageDTO>> getMessagesForConversation(@PathVariable UUID userOneId, @PathVariable UUID userTwoId) {
        return ResponseEntity.ok(messageService.getMessagesForConversation(userOneId , userTwoId));
    }


    @MessageMapping("/users")
    @SendTo("/topic/connectedUsers")
    public Map<String, Set<String>> getConnectedUsers() {
        return messageService.getConnectedUsers();
    }


    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<MessageDTO>> notificationMessages(@PathVariable UUID userId) {
        return messageService.getMissedMessages(userId);
    }


}
