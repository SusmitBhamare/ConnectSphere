package com.gather.user.service.impl;

import com.gather.user.dto.ModRequestUserDTO;
import com.gather.user.dto.UserAllDetailsDTO;
import com.gather.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModRequestRedisService {

  private final static String MOD_REQUESTS = "MOD_REQUESTS";

  private final RedisTemplate<String , ModRequestUserDTO> redisTemplate;

  public void storeModRequest(String key, ModRequestUserDTO value) {
    redisTemplate.opsForHash().put(MOD_REQUESTS , key , value);
  }

  public ModRequestUserDTO getModRequest(String username) {
    return (ModRequestUserDTO) redisTemplate.opsForHash().get(MOD_REQUESTS , username);
  }

  public void deleteModRequest(String username) {
    redisTemplate.opsForHash().delete(MOD_REQUESTS , username);
  }

  @Transactional
  public List<ModRequestUserDTO> getAllModRequests(){
    Map<Object,Object> map = redisTemplate.opsForHash().entries(MOD_REQUESTS);
    return map.values().stream()
        .map(value -> (ModRequestUserDTO) value)
        .collect(Collectors.toList());
  }

  public boolean hasModRequest(String username) {
    return redisTemplate.opsForHash().hasKey(MOD_REQUESTS, username);
  }

}
