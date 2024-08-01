package com.gather.user.service.impl;

import com.gather.user.dto.UserAllDetailsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModRequestRedisService {

  private final static String MOD_REQUESTS = "MOD_REQUESTS";

  private final RedisTemplate<String , UserAllDetailsDTO> redisTemplate;

  public void storeModRequest(String key, UserAllDetailsDTO value) {
    redisTemplate.opsForHash().put(MOD_REQUESTS , key , value);
  }

  public UserAllDetailsDTO getModRequest(String username) {
    return (UserAllDetailsDTO) redisTemplate.opsForHash().get(MOD_REQUESTS , username);
  }

  public void deleteModRequest(String username) {
    redisTemplate.opsForHash().delete(MOD_REQUESTS , username);
  }

  public List<UserAllDetailsDTO> getAllModRequests(){
    Map<Object, Object> map = redisTemplate.opsForHash().entries(MOD_REQUESTS);
    return map.values().stream()
        .map(value -> (UserAllDetailsDTO) value)
        .collect(Collectors.toList());
  }

  public boolean hasModRequest(String username) {
    return redisTemplate.opsForHash().hasKey(MOD_REQUESTS, username);
  }

}
