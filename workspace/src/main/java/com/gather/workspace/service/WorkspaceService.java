package com.gather.workspace.service;


import com.gather.workspace.dummy.User;
import com.gather.workspace.entity.Workspace;

import java.util.List;
import java.util.UUID;

public interface WorkspaceService {
    void createWorkspace(Workspace workspace);
    Workspace getWorkspaceById(UUID id);

    List<User> getMembers(UUID workspaceId);

    void addMember(UUID workspaceId, UUID userId);

    void removeMember(UUID workspaceId, UUID userId);
}

