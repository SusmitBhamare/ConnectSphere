package com.connectsphere.user.dto;



import com.connectsphere.user.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRegisterDTO {
  private String name;
  private String username;
  private String password;
  private String email;
}
