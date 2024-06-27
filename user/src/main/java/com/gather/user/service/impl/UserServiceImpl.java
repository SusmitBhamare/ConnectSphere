package com.gather.user.service.impl;

import com.gather.user.client.WorkspaceClient;
import com.gather.user.dummy.Workspace;
import com.gather.user.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.gather.user.repository.UserRepository;
import com.gather.user.service.UserService;

import lombok.RequiredArgsConstructor;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;
  private final WorkspaceClient workspaceClient;

  @Override
  public UserDetailsService userDetailsService(){
    return new UserDetailsService() {

      @Override
      public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
          .orElseThrow(() -> new UsernameNotFoundException("User not found"));
      }
      
    };
  }

  @Override
  public void updateWorkspace(String username, UUID workspaceId) {
    User user = userRepository.findByUsername(username).orElse(null);
    if(user != null){
      Collection<UUID> workspaces = user.getWorkspaces();
      if(workspaces.contains(workspaceId)){
        throw new IllegalArgumentException("User already has this workspace");
      }
      workspaces.add(workspaceId);
      user.setWorkspaces(workspaces);
      userRepository.save(user);
    }

  }

  @Override
  public Workspace getWorkSpaceById(UUID workspaceId) {
    return workspaceClient.getWorkspaceById(workspaceId);
  }

}
