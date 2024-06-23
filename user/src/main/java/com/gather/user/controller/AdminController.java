package com.gather.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/admin")
@RestController
public class AdminController {
  
  @GetMapping("/test")
  public ResponseEntity<String> test() {
    return ResponseEntity.ok("Admin Controller Test");
  }
}