package com.gather.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRegisterDTO {
  private String name;
  private String username;
  private String password;
  private String email;
  private String role;
}
