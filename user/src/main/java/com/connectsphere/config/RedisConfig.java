package com.connectsphere.user.config;


import com.connectsphere.user.dto.ModRequestUserDTO;
import com.connectsphere.user.dto.UserAllDetailsDTO;
import com.connectsphere.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {


  @Bean
  public RedisTemplate<String, ModRequestUserDTO> redisTemplate(RedisConnectionFactory redisConnectionFactory){
    RedisTemplate<String, ModRequestUserDTO> template = new RedisTemplate<>();
    template.setConnectionFactory(redisConnectionFactory);
    template.setKeySerializer(new StringRedisSerializer());
    template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
    template.setHashKeySerializer(new StringRedisSerializer());
    template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
    return template;
  }


}

