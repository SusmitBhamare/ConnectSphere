package com.gather.user.controller;

import com.gather.user.service.impl.TokenRedisService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gather.user.dto.UserLoginDTO;
import com.gather.user.dto.UserLoginResponseDTO;
import com.gather.user.dto.UserRegisterDTO;
import com.gather.user.entity.User;
import com.gather.user.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
   
  private final AuthService authService;
  private final TokenRedisService redisService;

  @PostMapping("/register")
  public ResponseEntity<User> register(@RequestBody UserRegisterDTO userRegisterDTO){
    return ResponseEntity.ok().body(authService.register(userRegisterDTO));
  }

  @PostMapping("/login")
  public ResponseEntity<UserLoginResponseDTO> login(@RequestBody UserLoginDTO userLoginDTO , 
      HttpServletResponse response){
    return authService.login(userLoginDTO , response);
  }

  @PostMapping("/logout")
  public ResponseEntity<String> logout(@AuthenticationPrincipal UserDetails userDetails , HttpServletResponse response){
    authService.logout(userDetails, response);
    return ResponseEntity.ok().body("Logged out successfully");
  }
}
