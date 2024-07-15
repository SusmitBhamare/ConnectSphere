package com.gather.message.controller;

import com.gather.message.entity.Message;
import com.gather.message.util.TokenUtility;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.gather.message.dto.MessageDTO;
import com.gather.message.service.MessageService;

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

    @GetMapping("/messages/user/{userId}")
    public ResponseEntity<List<MessageDTO>> getMessagesForUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(messageService.getMessagesForUser(userId));
    }

    @MessageMapping("/users")
    @SendTo("/topic/connectedUsers")
    public Map<String, Set<String>> getConnectedUsers() {
        return messageService.getConnectedUsers();
    }


}
