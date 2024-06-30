package com.gather.workspace.controller;


import com.gather.workspace.entity.Workspace;
import com.gather.workspace.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/workspace")
@RequiredArgsConstructor
public class WorkspaceController {
    private static final Logger logger = LoggerFactory.getLogger(WorkspaceController.class);
    private final WorkspaceService workspaceService;

    @GetMapping()
    public ResponseEntity<String> test() {
        logger.info("Workspace Controller Test");
        return ResponseEntity.ok("Workspace Controller Test");
    }

    @PostMapping()
    public ResponseEntity<String> createWorkspace(@RequestBody Workspace workspace){
        workspaceService.createWorkspace(workspace);
        return ResponseEntity.ok("Workspace created");
    }

    @GetMapping("/{workspaceId}")
    public ResponseEntity<Workspace> getWorkspace(@PathVariable UUID workspaceId){
        return ResponseEntity.ok(workspaceService.getWorkspaceById(workspaceId));
    }


}
