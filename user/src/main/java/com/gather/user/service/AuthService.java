package com.gather.user.service;

import com.gather.user.dto.UserLoginDTO;
import com.gather.user.dto.UserLoginResponseDTO;
import com.gather.user.dto.UserRegisterDTO;
import com.gather.user.entity.User;

public interface AuthService {
User register(UserRegisterDTO userRegisterDTO);
 UserLoginResponseDTO login(UserLoginDTO userLoginDTO);
  
}
