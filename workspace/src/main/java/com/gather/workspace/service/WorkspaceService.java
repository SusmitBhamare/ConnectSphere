package com.gather.workspace.service;


import com.gather.workspace.dummy.UserAllDetailsDTO;
import com.gather.workspace.entity.Workspace;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface WorkspaceService {
    void createWorkspace(Workspace workspace);
    Workspace getWorkspaceById(UUID id);

    List<UserAllDetailsDTO> getMembers(UUID workspaceId);

    void addMember(UUID workspaceId, Map<String, List<UUID>> userId);

    void removeMember(UUID workspaceId, UUID userId);

    void deleteWorkspace(UUID workspaceId);
}

