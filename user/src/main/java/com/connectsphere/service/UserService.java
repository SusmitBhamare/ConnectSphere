package com.connectsphere.user.service;

import com.connectsphere.user.dto.UserAllDetailsDTO;
import com.connectsphere.user.dummy.Workspace;
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

  void addUsersInteracted(UUID userId, UUID receiverId);

  String modRequest(UserDetails userDetails);

}

