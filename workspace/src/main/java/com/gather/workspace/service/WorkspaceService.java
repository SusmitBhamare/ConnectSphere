package com.gather.workspace.service;


import com.gather.workspace.entity.Workspace;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

public interface WorkspaceService {
    void createWorkspace(Workspace workspace);
    Workspace getWorkspaceById(UUID id);
}
