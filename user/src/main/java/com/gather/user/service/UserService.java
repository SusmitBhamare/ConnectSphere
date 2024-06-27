package com.gather.user.service;

import com.gather.user.dummy.Workspace;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.UUID;

public interface UserService {
  UserDetailsService userDetailsService();

  void updateWorkspace(String username, UUID workspaceId);

  Workspace getWorkSpaceById(UUID workspaceId);
}

