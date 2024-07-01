package com.gather.user.service;

import com.gather.user.dto.UserAllDetailsDTO;
import com.gather.user.dummy.Workspace;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.UUID;

public interface UserService {
  UserDetailsService userDetailsService();

  void addUserToWorkspace(UUID userId, UUID workspaceId);

  Workspace getWorkSpaceById(UUID workspaceId);

  List<Workspace> getWorkspaces(UserDetails userId);

  UserAllDetailsDTO getUserByUsername(String username);

  UserAllDetailsDTO getUserById(UUID userId);

  void removeUserFromWorkspace(UUID userId, UUID workspaceId);

}

