package com.gather.user.service.impl;

import java.util.HashMap;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gather.user.auth.JWTService;
import com.gather.user.dto.UserLoginDTO;
import com.gather.user.dto.UserLoginResponseDTO;
import com.gather.user.dto.UserRegisterDTO;
import com.gather.user.entity.User;
import com.gather.user.repository.UserRepository;
import com.gather.user.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JWTService jwtService;

  @Override
  public User register(UserRegisterDTO userRegisterDTO){
    User user = new User();
    user.setUsername(userRegisterDTO.getUsername());
    user.setPassword(passwordEncoder.encode(userRegisterDTO.getPassword()));
    user.setEmail(userRegisterDTO.getEmail());
    user.setRole(userRegisterDTO.getRole());
    user.setName(userRegisterDTO.getName());
    return userRepository.save(user);
  }

  @Override
  public UserLoginResponseDTO login(UserLoginDTO userLoginDTO){
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userLoginDTO.getUsername(), userLoginDTO.getPassword()));

    User user = userRepository.findByUsername(userLoginDTO.getUsername()).orElseThrow(() -> new IllegalArgumentException("Invalid Credentials"));
    String token = jwtService.generateToken(user);
    String refreshToken = jwtService.generateRefreshToken(new HashMap<>() , user);
    
    UserLoginResponseDTO response = new UserLoginResponseDTO();
    response.setToken(token);
    response.setRefreshToken(refreshToken);
    return response;
  }
  
}
