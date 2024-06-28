package com.gather.user.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final StringRedisTemplate redisTemplate;

    public void storeToken(String key, String value , long timeout){
        redisTemplate.opsForValue().set(key, value, timeout);
    }

    public String getToke(String key){
        return redisTemplate.opsForValue().get(key);
    }

    public void deleteToken(String key){
        redisTemplate.delete(key);
    }

    public boolean isTokenPresent(String key){
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}
