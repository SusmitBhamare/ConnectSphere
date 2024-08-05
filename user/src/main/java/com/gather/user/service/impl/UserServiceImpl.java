package com.gather.user.service.impl;

import com.gather.user.client.WorkspaceClient;
import com.gather.user.dto.ModRequestUserDTO;
import com.gather.user.dto.UserAllDetailsDTO;
import com.gather.user.dummy.Workspace;
import com.gather.user.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.gather.user.repository.UserRepository;
import com.gather.user.service.UserService;

import lombok.RequiredArgsConstructor;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;
  private final WorkspaceClient workspaceClient;
  private final TokenRedisService redisService;
  private final ModRequestRedisService modRequestRedisService;

  @Override
  public UserDetailsService userDetailsService() {
    return new UserDetailsService() {

      @Override
      public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
      }

    };
  }

  @Override
  public void addUserToWorkspace(UUID userId, UUID workspaceId) {
    User user = userRepository.findById(userId).orElse(null);
    if (user != null) {
      Collection<UUID> workspaces = user.getWorkspaces();
      if (workspaces.contains(workspaceId)) {
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

  @Override
  public List<Workspace> getWorkspaces(UserDetails userDetails) {

    User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
    List<Workspace> workspaces = new ArrayList<>();
    if (user != null) {
      Collection<UUID> workspacesUUID = user.getWorkspaces();
      for (UUID workspaceId : workspacesUUID) {
        workspaces.add(workspaceClient.getWorkspaceById(workspaceId));
      }
    }
    return workspaces;
  }

  @Override
  public UserAllDetailsDTO getUserByUsername(String username) {
    User user = userRepository.findByUsername(username).orElse(null);
    if(user == null) return null;
    return userToUserAllDetailsDTO(user, new HashSet<>() );
  }

  public UserAllDetailsDTO userToUserAllDetailsDTO(User user, Set<UUID> visited) {
    UserAllDetailsDTO userAllDetailsDTO = new UserAllDetailsDTO();
    userAllDetailsDTO.setId(user.getId());
    userAllDetailsDTO.setName(user.getName());
    userAllDetailsDTO.setImage(user.getImage());
    userAllDetailsDTO.setEmail(user.getEmail());
    userAllDetailsDTO.setRole(user.getRole());
    userAllDetailsDTO.setUsername(user.getUsername());
    userAllDetailsDTO.setWorkspaces(new ArrayList<>());

    visited.add(user.getId());

    for (UUID workspaceId : user.getWorkspaces()) {
      userAllDetailsDTO.getWorkspaces().add(workspaceClient.getWorkspaceById(workspaceId));
    }
    userAllDetailsDTO.setUsersInteractedWith(new ArrayList<>());
    for (UUID userId : user.getUsersInteractedWith()) {
      if (visited.contains(userId)) {
        continue;
      }
      User interactedUser = userRepository.findById(userId).orElse(null);
      if (interactedUser == null) {
        continue;
      }
      userAllDetailsDTO.getUsersInteractedWith().add(interactedUser);
    }
    userAllDetailsDTO.setMessagesReceived(new ArrayList<>());
    userAllDetailsDTO.setMessagesSent(new ArrayList<>());
    return userAllDetailsDTO;
  }


  @Override
  public UserAllDetailsDTO getUserById(UUID userId) {
    User user = userRepository.findById(userId).orElse(null);
    if(user == null){
      throw new IllegalArgumentException("User not found");
    }
    return userToUserAllDetailsDTO(user,new HashSet<>());
  }

  @Override
  public void removeUserFromWorkspace(UUID userId, UUID workspaceId) {
    User user = userRepository.findById(userId).orElse(null);
    if (user != null) {
      Collection<UUID> workspaces = user.getWorkspaces();
      if (!workspaces.contains(workspaceId)) {
        throw new IllegalArgumentException("User does not have this workspace");
      }
      workspaces.remove(workspaceId);
      if (workspaces.isEmpty()) {
        user.setWorkspaces(new ArrayList<>());
      } else {
        user.setWorkspaces(workspaces);
      }
      userRepository.save(user);
    }
  }

  @Override
  public void addUsersInteracted(UUID userId, UUID receiverId) {
    User user = userRepository.findById(userId).orElse(null);
    if (user == null) {
      throw new IllegalArgumentException("User not found");
    }
    Collection<UUID> usersInteracted = user.getUsersInteractedWith();
    if(usersInteracted.contains(receiverId)){
      return;
    }
    usersInteracted.add(receiverId);
    user.setUsersInteractedWith(usersInteracted);
    userRepository.save(user);
  }

  @Override
  public String modRequest(UserDetails userDetails) {
    User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
    if(user == null){
      throw new IllegalArgumentException("User not found");
    }
    if(modRequestRedisService.hasModRequest(userDetails.getUsername())){
      throw new IllegalArgumentException("Mod request already sent");
    }
    ModRequestUserDTO modRequestUserDTO = new ModRequestUserDTO();
    modRequestUserDTO.setUsername(userDetails.getUsername());
    modRequestUserDTO.setEmail(user.getEmail());
    modRequestUserDTO.setName(user.getName());
    modRequestUserDTO.setWorkspaces(new ArrayList<>(user.getWorkspaces()));
    modRequestUserDTO.setUsersInteractedWith(new ArrayList<>(user.getUsersInteractedWith()));

    modRequestRedisService.storeModRequest(userDetails.getUsername(), modRequestUserDTO);
    return "Mod request sent";
  }


}
