package com.connectsphere.workspace.dto;

import com.connectsphere.workspace.dummy.UserAllDetailsDTO;
import lombok.Data;

import java.util.Collection;
import java.util.UUID;

@Data
public class WorkspaceDTO {
    private UUID id;
    private String name;
    private String description;
    private Collection<UserAllDetailsDTO> members;
    private UserAllDetailsDTO createdBy;
    private String image;
}
