package com.gather.user.controller;

import com.gather.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/mod")
@RequiredArgsConstructor
public class ModController {

    private final UserService userService;

    @PutMapping("/workspace")
    public ResponseEntity<String> updateWorkspace(@AuthenticationPrincipal UserDetails userDetails, @RequestBody UUID workspaceId) {
        if(userService.getWorkSpaceById(workspaceId) == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Workspace not found");
        }
        try{
            userService.updateWorkspace(userDetails.getUsername(), workspaceId);
            return ResponseEntity.ok("Workspace updated");
        } catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }
}
