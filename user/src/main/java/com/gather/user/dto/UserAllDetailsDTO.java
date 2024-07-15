package com.gather.user.dto;

import com.gather.user.dummy.Workspace;
import com.gather.user.entity.Role;
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
}
