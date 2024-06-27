package com.gather.workspace.client;


import com.gather.workspace.auth.FeignClientConfiguration;
import com.gather.workspace.dummy.User;
import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.UUID;


@FeignClient(name = "USERSERVICE" , url = "${user-service.url}", configuration = FeignClientConfiguration.class)
public interface UserClient {

    @GetMapping("/util/user/{username}")
    User getUser(@PathVariable String username);

    @PutMapping("/mod/workspace")
    void updateWorkspace(UUID workspaceId);

}