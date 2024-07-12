package com.gather.message.service.impl;

import com.gather.message.dto.UserStatusDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserStatusServiceImpl  implements UserStatusService {

    private final RedisTemplate<String,Boolean> userStatusTemplate;

    @Override
    public UserStatusDTO setUserOnline(String username) {
        String key = "user_online:" + username;
        userStatusTemplate.opsForValue().set(key, true);
        UserStatusDTO userStatusDTO = new UserStatusDTO();
        userStatusDTO.setUsername(username);
        userStatusDTO.setOnline(true);
        return userStatusDTO;
    }

    @Override
    public UserStatusDTO setUserOffline(String username) {
        String key = "user_online:" + username;
        UserStatusDTO userStatusDTO = new UserStatusDTO();
        userStatusDTO.setUsername(username);
        userStatusDTO.setOnline(true);
        return userStatusDTO;
    }

    @Override
    public boolean isUserOnline(String username) {
        String key = "user_online:" + username;
        return Boolean.TRUE.equals(userStatusTemplate.opsForValue().get(key));
    }
}
