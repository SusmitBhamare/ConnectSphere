package com.connectsphere.user.controller;



import com.connectsphere.user.dummy.Workspace;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.connectsphere.user.service.UserService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;


  @GetMapping("/workspaces")
  public ResponseEntity<List<Workspace>> getWorkspaces(@AuthenticationPrincipal UserDetails userDetails){
    return ResponseEntity.ok(userService.getWorkspaces(userDetails));
  }

  @PostMapping("/mod-request")
  public ResponseEntity<String> modRequest(@AuthenticationPrincipal UserDetails userDetails){
    try{
      return ResponseEntity.ok(userService.modRequest(userDetails));
    } catch (Exception e){
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
  

}
