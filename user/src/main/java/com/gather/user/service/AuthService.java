package com.gather.user.service;

import org.springframework.http.ResponseEntity;

import com.gather.user.dto.UserLoginDTO;
import com.gather.user.dto.UserLoginResponseDTO;
import com.gather.user.dto.UserRegisterDTO;
import com.gather.user.entity.User;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthService {
User register(UserRegisterDTO userRegisterDTO);
 ResponseEntity<UserLoginResponseDTO> login(UserLoginDTO userLoginDTO , HttpServletResponse response);
 void logout(UserDetails userDetails, HttpServletResponse response);

}
