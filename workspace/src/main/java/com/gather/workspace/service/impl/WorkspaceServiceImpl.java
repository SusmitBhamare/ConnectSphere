package com.gather.workspace.service.impl;

import com.gather.workspace.client.UserClient;
import com.gather.workspace.dummy.UserAllDetailsDTO;
import com.gather.workspace.entity.Workspace;
import com.gather.workspace.repository.WorkspaceRepository;
import com.gather.workspace.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository repository;
    private final UserClient userClient;

    @Override
    public void createWorkspace(Workspace workspace) {
        UserAllDetailsDTO user = userClient.getProfile();
        if(user != null){
            workspace.setCreatedBy(user.getId());
            repository.save(workspace);
            userClient.updateWorkspace(user.getId() , workspace.getId());
        }

        for(UUID member : workspace.getMembers()){
            userClient.updateWorkspace(member ,workspace.getId());
        }

    }

    @Override
    public Workspace getWorkspaceById(UUID id) {
        return repository.findById(id).orElse(null);
    }


}
