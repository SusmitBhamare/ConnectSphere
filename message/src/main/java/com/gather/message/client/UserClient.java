package com.gather.message.client;


import com.gather.message.auth.FeignClientConfiguration;
import com.gather.message.dummy.UserAllDetailsDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "USERSERVICE" , url = "${user-service.url}" ,
        configuration = FeignClientConfiguration.class)
public interface UserClient {

    @GetMapping(value = "/util/user/id/{userId}" , produces = "application/json")
    UserAllDetailsDTO getUserById(@PathVariable UUID userId);

}
