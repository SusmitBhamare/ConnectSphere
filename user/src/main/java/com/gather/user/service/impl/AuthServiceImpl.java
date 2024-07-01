package com.gather.user.service.impl;

import com.gather.user.entity.Role;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gather.user.auth.JWTService;
import com.gather.user.dto.UserLoginDTO;
import com.gather.user.dto.UserLoginResponseDTO;
import com.gather.user.dto.UserRegisterDTO;
import com.gather.user.entity.User;
import com.gather.user.repository.UserRepository;
import com.gather.user.service.AuthService;

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
  private final RedisService redisService;

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
    String token = jwtService.generateToken(user);

    Cookie tokenCookie = new Cookie("token" , token);
    tokenCookie.setPath("/");
    tokenCookie.setHttpOnly(false);
    tokenCookie.setMaxAge(10*60*60);
    response.addCookie(tokenCookie);

    UserLoginResponseDTO responseBody = new UserLoginResponseDTO();
    responseBody.setToken(token);
    return ResponseEntity.ok().header("Access-Control-Allow-Credentials", "true").body(responseBody);
  }

  @Override
  public void logout(UserDetails user, HttpServletResponse response){
    response.setHeader("Set-Cookie", "token=; path=/; max-age=0; HttpOnly; SameSite=None; Secure");
    redisService.deleteToken("token_" + user.getUsername());
  }

}
