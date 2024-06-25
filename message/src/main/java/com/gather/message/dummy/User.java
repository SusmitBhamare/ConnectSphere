package com.gather.message.dummy;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Collection;
import java.util.UUID;

public class User {

    private UUID id;
    private String name;
    private String username;
    private String password;
    private String email;
    private String image;
    private Role role;
    private Collection<UUID> messagesSent;
    private Collection<UUID> messagesReceived;
    private Collection<UUID> workspaces;
}
