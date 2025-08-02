package com.connectsphere.user.client;

import com.connectsphere.user.auth.FeignClientConfiguration;
import com.connectsphere.user.dto.WorkspaceDTO;
import com.connectsphere.user.dummy.Workspace;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "WORKSPACESERIVCE" , url = "${workspace-service.url}" , configuration = FeignClientConfiguration.class)
public interface WorkspaceClient {

    @GetMapping("/workspace/{workspaceId}")
    Workspace getWorkspaceById(@PathVariable UUID workspaceId);
}
