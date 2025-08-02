package com.connectsphere.user.service.impl;

import com.connectsphere.user.entity.Role;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.connectsphere.user.auth.JWTService;
import com.connectsphere.user.dto.UserLoginDTO;
import com.connectsphere.user.dto.UserLoginResponseDTO;
import com.connectsphere.user.dto.UserRegisterDTO;
import com.connectsphere.user.entity.User;
import com.connectsphere.user.repository.UserRepository;
import com.connectsphere.user.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JWTService jwtService;
  private final TokenRedisService redisService;


  @Override
  public User register(UserRegisterDTO userRegisterDTO){
    User user = new User();
    user.setUsername(userRegisterDTO.getUsername());
    user.setPassword(passwordEncoder.encode(userRegisterDTO.getPassword()));
    user.setEmail(userRegisterDTO.getEmail());
    user.setRole(Role.USER);
    user.setName(userRegisterDTO.getName());
    return userRepository.save(user);
  }

  @Override
  public ResponseEntity<UserLoginResponseDTO> login(UserLoginDTO userLoginDTO , HttpServletResponse response){
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userLoginDTO.getUsername(), userLoginDTO.getPassword()));

    User user = userRepository.findByUsername(userLoginDTO.getUsername()).orElseThrow(() -> new IllegalArgumentException("Invalid Credentials"));
    userRepository.save(user);
    String token = jwtService.generateToken(user);

    Cookie tokenCookie = new Cookie("token" , token);
    tokenCookie.setPath("/");
    tokenCookie.setHttpOnly(false);
    tokenCookie.setMaxAge(10*60*60);
    response.addCookie(tokenCookie);
    UserLoginResponseDTO responseBody = new UserLoginResponseDTO();
    responseBody.setToken(token);
    redisService.addToSet("connectedUsers", user.getUsername());

    return ResponseEntity.ok().header("Access-Control-Allow-Credentials", "true").body(responseBody);
  }

  @Override
  public void logout(UserDetails userDetails, HttpServletResponse response){
    redisService.removeFromSet("connectedUsers", userDetails.getUsername());
    redisService.deleteToken("token_" + userDetails.getUsername());
    response.setHeader("Set-Cookie", "token=; path=/; max-age=0; HttpOnly; SameSite=None; Secure");
  }

}
