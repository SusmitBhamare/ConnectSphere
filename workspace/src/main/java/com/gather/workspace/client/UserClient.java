package com.gather.workspace.client;


import com.gather.workspace.auth.FeignClientConfiguration;
import com.gather.workspace.dummy.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.UUID;


@FeignClient(name = "USERSERVICE" , url = "${user-service.url}", configuration = FeignClientConfiguration.class)
public interface UserClient {

    @GetMapping("/util/profile")
    User getProfile();

    @PutMapping("/util/user/workspace/{userId}")
    void addUserToWorkspace(@PathVariable UUID userId, UUID workspaceId);

    @DeleteMapping("/util/user/workspace/{userId}")
    void removeUserFromWorkspace(@PathVariable UUID userId, UUID workspaceId);

    @GetMapping("/util/user/id/{userId}")
    User getUserById(@PathVariable UUID userId);

}