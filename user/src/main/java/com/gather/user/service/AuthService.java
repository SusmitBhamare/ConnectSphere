package com.gather.user.service;

import org.springframework.http.ResponseEntity;

import com.gather.user.dto.UserLoginDTO;
import com.gather.user.dto.UserLoginResponseDTO;
import com.gather.user.dto.UserRegisterDTO;
import com.gather.user.entity.User;

import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
User register(UserRegisterDTO userRegisterDTO);
 ResponseEntity<UserLoginResponseDTO> login(UserLoginDTO userLoginDTO , HttpServletResponse response);
 void logout(User user, HttpServletResponse response);

}
