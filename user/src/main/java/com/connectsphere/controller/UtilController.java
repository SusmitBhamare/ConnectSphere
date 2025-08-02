package com.connectsphere.user.controller;


import com.connectsphere.user.dto.AddUsersInteractedDTO;
import com.connectsphere.user.dto.UserAllDetailsDTO;
import com.connectsphere.user.entity.User;
import com.connectsphere.user.service.UserService;
import com.connectsphere.user.service.UtilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/util")
public class UtilController {

    private final UtilService utilService;
    private final UserService userService;

    @GetMapping("/user/{username}")
    public ResponseEntity<UserAllDetailsDTO> getUser(@PathVariable String username) {
        UserAllDetailsDTO user = userService.getUserByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/id/{userId}")
    public ResponseEntity<UserAllDetailsDTO> getUserById(@PathVariable UUID userId) {
        UserAllDetailsDTO user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/user/verify/{username}")
    public ResponseEntity<String> verifyUser(@PathVariable String username) {
        User user = utilService.getUser(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(user.getUsername());
    }

    @GetMapping("/profile")
    public ResponseEntity<UserAllDetailsDTO> getProfile(@AuthenticationPrincipal UserDetails userDetails){
        try{
            return ResponseEntity.ok(userService.getUserByUsername(userDetails.getUsername()));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @PutMapping("/user/workspace/{userId}")
    public ResponseEntity<String> addUserToWorkspace(@PathVariable UUID userId, @RequestBody UUID workspaceId) {
        if(userService.getWorkSpaceById(workspaceId) == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Workspace not found");
        }
        try{
            userService.addUserToWorkspace(userId, workspaceId);
            return ResponseEntity.ok("Workspace updated");
        } catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    @DeleteMapping("/user/workspace/{userId}")
    public ResponseEntity<String> removeUserFromWorkspace(@PathVariable UUID userId, @RequestBody UUID workspaceId) {
        if(userService.getWorkSpaceById(workspaceId) == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Workspace not found");
        }
        try{
            userService.removeUserFromWorkspace(userId, workspaceId);
            return ResponseEntity.ok("Workspace updated");
        } catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/user/usersInteracted/{userId}")
    public ResponseEntity<String> addUsersInteracted(@PathVariable UUID userId, @RequestBody AddUsersInteractedDTO receiverId) {
        try{
            userService.addUsersInteracted(userId, receiverId.getReceiverId());
            return ResponseEntity.ok("Users updated");
        } catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }




}
