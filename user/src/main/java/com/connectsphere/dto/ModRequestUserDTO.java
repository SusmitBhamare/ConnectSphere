package com.connectsphere.user.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ModRequestUserDTO {
  private String username;
  private String email;
  private String name;
  private List<UUID> workspaces;
  private List<UUID> usersInteractedWith;
}
