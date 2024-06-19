package com.gather.user.dto;



import com.gather.user.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRegisterDTO {
  private String name;
  private String username;
  private String password;
  private String email;
  private Role role;
}
