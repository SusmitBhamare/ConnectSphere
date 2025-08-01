package com.connectsphere.message.dummy;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;
import java.util.UUID;

@Data
public class UserAllDetailsDTO {

    private UUID id;
    private String name;
    private String username;
    private String email;
    private String image;
    private Role role;
    private Collection<UUID> messagesSent;
    private Collection<UUID> messagesReceived;
    private Collection<Workspace> workspaces;
    private Collection<User> usersInteractedWith;

}
