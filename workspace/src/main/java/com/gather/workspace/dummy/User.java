package com.gather.workspace.dummy;

import com.gather.workspace.entity.Workspace;
import lombok.Data;

import java.util.Collection;
import java.util.UUID;

@Data
public class User {

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
