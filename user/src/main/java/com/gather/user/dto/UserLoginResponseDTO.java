package com.gather.user.dto;

import lombok.Data;

@Data
public class UserLoginResponseDTO {
  private String token;
  private String refreshToken;
}
