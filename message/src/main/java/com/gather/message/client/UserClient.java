package com.gather.message.client;


import com.gather.message.dummy.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USERSERVICE" , url = "${user-service.url}")
public interface UserClient {

    @GetMapping("/util/user/{username}")
    User getUser(@PathVariable String username);

}
