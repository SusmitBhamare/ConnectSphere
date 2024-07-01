package com.gather.workspace.service.impl;

import com.gather.workspace.client.UserClient;
import com.gather.workspace.dummy.User;
import com.gather.workspace.entity.Workspace;
import com.gather.workspace.repository.WorkspaceRepository;
import com.gather.workspace.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository repository;
    private final UserClient userClient;

    @Override
    public void createWorkspace(Workspace workspace) {
        User user = userClient.getProfile();
        if(user != null){
            workspace.setCreatedBy(user.getId());
            repository.save(workspace);
            userClient.addUserToWorkspace(user.getId() , workspace.getId());
        }

        for(UUID member : workspace.getMembers()){
            userClient.addUserToWorkspace(member ,workspace.getId());
        }

    }

    @Override
    public Workspace getWorkspaceById(UUID id) {
        return repository.findById(id).orElse(null);

    }

    @Override
    public List<User> getMembers(UUID workspaceId) {
        Workspace workspace = repository.findById(workspaceId).orElse(null);
        if(workspace == null){
            return null;
        }
        List<User> members = new ArrayList<>();
        for(UUID userId : workspace.getMembers()){
            members.add(userClient.getUserById(userId));
        }
        return members;
    }

    @Override
    public void addMember(UUID workspaceId, UUID userId) {
        if(userClient.getUserById(userId) == null){
            throw new IllegalArgumentException("User not found");
        }
        Workspace workspace = repository.findById(workspaceId).orElse(null);
        if(workspace == null){
            throw new IllegalArgumentException("Workspace not found");
        }
        workspace.getMembers().add(userId);
        repository.save(workspace);
        userClient.addUserToWorkspace(userId , workspaceId);
    }

    @Override
    public void removeMember(UUID workspaceId, UUID userId) {
        if(userClient.getUserById(userId) == null){
            throw new IllegalArgumentException("User not found");
        }
        Workspace workspace = repository.findById(workspaceId).orElse(null);
        if(workspace == null){
            throw new IllegalArgumentException("Workspace not found");
        }
        workspace.getMembers().remove(userId);
        repository.save(workspace);
        userClient.removeUserFromWorkspace(userId , workspaceId);
    }


}
