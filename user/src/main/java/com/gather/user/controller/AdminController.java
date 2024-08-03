package com.gather.user.controller;

import com.gather.user.dto.ModRequestUserDTO;
import com.gather.user.dto.UserAllDetailsDTO;
import com.gather.user.entity.User;
import com.gather.user.service.AdminService;
import com.gather.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/admin")
@RestController
@RequiredArgsConstructor
public class AdminController {

  private final AdminService adminService;

  @GetMapping("/mod-requests")
  public ResponseEntity<List<ModRequestUserDTO>> getModRequests() {
    try{
    return ResponseEntity.ok(adminService.getModRequests());
    } catch (Exception e){
      return ResponseEntity.badRequest().body(null);
    }
  }

  @PutMapping("/accept-mod-request/{username}")
  public ResponseEntity<String> acceptModRequest(@PathVariable String username) {
    try{
      adminService.acceptModRequest(username);
      return ResponseEntity.ok("Mod request accepted");
    }catch (Exception e){
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @DeleteMapping("/reject-mod-request/{username}")
  public ResponseEntity<String> rejectModRequest(@PathVariable String username) {
    try{
      adminService.rejectModRequest(username);
      return ResponseEntity.ok("Mod request rejected");
    }catch (Exception e){
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}