package com.gather.workspace.dto;

import com.gather.workspace.dummy.User;
import lombok.Data;

import java.util.Collection;
import java.util.UUID;

@Data
public class WorkspaceDTO {
    private UUID id;
    private String name;
    private String description;
    private Collection<User> members;
    private User createdBy;
    private String image;
}
