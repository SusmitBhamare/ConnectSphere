package com.gather.user.dummy;

import jakarta.persistence.ElementCollection;
import lombok.Data;

import java.util.Collection;
import java.util.UUID;

@Data
public class Workspace {

    private UUID id;
    private String name;
    private String description;
    private Collection<UUID> members;
    private UUID createdBy;
    private String image;
}

