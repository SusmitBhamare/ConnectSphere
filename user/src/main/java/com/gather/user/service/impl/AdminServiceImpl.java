package com.gather.user.service.impl;

import com.gather.user.dto.ModRequestUserDTO;
import com.gather.user.entity.Role;
import com.gather.user.entity.User;
import com.gather.user.repository.UserRepository;
import com.gather.user.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

  private final ModRequestRedisService modRequestRedisService;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void createAdmin(){
    User user = new User();
    user.setUsername("admin");
    user.setPassword(passwordEncoder.encode("admin"));
    user.setRole(Role.ADMIN);
    user.setEmail("admin@admin.com");
    user.setName("Admin");

    userRepository.save(user);
  }

  @Override
  public List<ModRequestUserDTO> getModRequests() {
    return modRequestRedisService.getAllModRequests();
  }

  @Override
  public void acceptModRequest(String username) {
    ModRequestUserDTO userDetails = modRequestRedisService.getModRequest(username);
    if (userDetails == null) {
      throw new IllegalArgumentException("User's mod request not found");
    }
    User user = userRepository.findByUsername(username).orElse(null);
    if (user == null) {
      throw new IllegalArgumentException("User not found");
    }

    user.setRole(Role.MOD);
    userRepository.save(user);
    modRequestRedisService.deleteModRequest(username);

  }

  @Override
  public void rejectModRequest(String username) {
    ModRequestUserDTO userDetails = modRequestRedisService.getModRequest(username);
    if (userDetails == null) {
      throw new IllegalArgumentException("User's mod request not found");
    }
    modRequestRedisService.deleteModRequest(username);
  }
}
