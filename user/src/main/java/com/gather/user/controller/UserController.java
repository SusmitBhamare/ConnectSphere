package com.gather.user.controller;


import com.gather.user.dto.WorkspaceDTO;
import com.gather.user.dummy.Workspace;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.gather.user.service.UserService;

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



  @GetMapping("/test")
    public ResponseEntity<String> test(){
        return ResponseEntity.ok("Test");
    }
  

}
