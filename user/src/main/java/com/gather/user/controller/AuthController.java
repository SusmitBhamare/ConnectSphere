package com.gather.user.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gather.user.auth.JwtUtil;
import com.gather.user.dto.UserLoginDTO;
import com.gather.user.dto.UserRegisterDTO;
import com.gather.user.service.UserService;

@RequestMapping("/auth")
@RestController
public class AuthController {

  @Autowired
  private JwtUtil jwtUtil;
  @Autowired
  private UserService userService;
  @Autowired
  private PasswordEncoder passwordEncoder;

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody UserRegisterDTO userRegisterDTO){
    if(userService.loadUserByUsername(userRegisterDTO.getUsername()) != null){
      return ResponseEntity.badRequest().body("User already exists");
    }

    userService.createUser(userRegisterDTO);
    return ResponseEntity.ok("User created successfully");
  }

  @PostMapping("/login")
  public ResponseEntity<String> login(@RequestBody UserLoginDTO userLoginDTO){
    UserDetails user = userService.loadUserByUsername(userLoginDTO.getUsername());
    if( user == null){
      return ResponseEntity.badRequest().body("User doesn't exist");
    }

    if(!passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword())){
      return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }

    String token = jwtUtil.generateToken(userLoginDTO.getUsername());
    HttpHeaders headers = new HttpHeaders();
    headers.add("Authorization", "Bearer " + token);
    return ResponseEntity.ok().headers(headers).body("Logged in.");
  }



  
}
