package com.connectsphere.user.dto;

import com.connectsphere.user.dummy.Workspace;
import com.connectsphere.user.entity.Role;
import com.connectsphere.user.entity.User;
import lombok.Data;

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
