package com.gather.message.client;


import com.gather.message.auth.FeignClientConfiguration;
import com.gather.message.dummy.AddUsersInteractedDTO;
import com.gather.message.dummy.UserAllDetailsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@FeignClient(name = "USERSERVICE", url = "${user-service.url}",
    configuration = FeignClientConfiguration.class)
public interface UserClient {

  @GetMapping(value = "/util/user/id/{userId}", produces = "application/json")
  UserAllDetailsDTO getUserById(@PathVariable UUID userId);

  @PutMapping(value = "/util/user/usersInteracted/{userId}", consumes = "application/json")
  ResponseEntity<String> addUsersInteracted(@PathVariable UUID userId, @RequestBody AddUsersInteractedDTO receiverId);

  @DeleteMapping(value = "/util/user/usersInteracted/{userId}", consumes = "application/json")
  void removeUsersInteracted(@PathVariable  UUID userId, AddUsersInteractedDTO addUsersInteractedDTO);
}
