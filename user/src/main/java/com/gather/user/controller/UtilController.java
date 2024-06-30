package com.gather.user.controller;


import com.gather.user.dto.UserAllDetailsDTO;
import com.gather.user.entity.User;
import com.gather.user.service.UserService;
import com.gather.user.service.UtilService;
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
        return ResponseEntity.ok(userService.getUserByUsername(userDetails.getUsername()));
    }


    @PutMapping("/user/workspace/{userId}")
    public ResponseEntity<String> updateWorkspace(@PathVariable UUID userId, @RequestBody UUID workspaceId) {
        if(userService.getWorkSpaceById(workspaceId) == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Workspace not found");
        }
        try{
            userService.updateWorkspace(userId, workspaceId);
            return ResponseEntity.ok("Workspace updated");
        } catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

}
