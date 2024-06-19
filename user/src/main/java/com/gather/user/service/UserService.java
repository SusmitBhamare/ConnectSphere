package com.gather.user.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.gather.user.dto.UserRegisterDTO;

public interface UserService {
  boolean createUser(UserRegisterDTO data);
  UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
