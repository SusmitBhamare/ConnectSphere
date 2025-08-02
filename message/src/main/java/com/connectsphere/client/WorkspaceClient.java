package com.connectsphere.message.client;

import com.connectsphere.message.auth.FeignClientConfiguration;
import com.connectsphere.message.dummy.Workspace;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "WORKSPACESERIVCE" , url = "${workspace-service.url}" , configuration = FeignClientConfiguration.class)
public interface WorkspaceClient {

    @GetMapping("/workspace/{workspaceId}")
    Workspace getWorkspaceById(@PathVariable UUID workspaceId);
}
