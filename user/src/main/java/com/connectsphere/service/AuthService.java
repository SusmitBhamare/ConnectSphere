package com.connectsphere.user.service;

import org.springframework.http.ResponseEntity;

import com.connectsphere.user.dto.UserLoginDTO;
import com.connectsphere.user.dto.UserLoginResponseDTO;
import com.connectsphere.user.dto.UserRegisterDTO;
import com.connectsphere.user.entity.User;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthService {
User register(UserRegisterDTO userRegisterDTO);
 ResponseEntity<UserLoginResponseDTO> login(UserLoginDTO userLoginDTO , HttpServletResponse response);
 void logout(UserDetails userDetails, HttpServletResponse response);

}
