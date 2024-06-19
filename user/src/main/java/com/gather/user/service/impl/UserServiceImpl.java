package com.gather.user.service.impl;

import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.gather.user.dto.UserRegisterDTO;
import com.gather.user.entity.Role;
import com.gather.user.entity.User;
import com.gather.user.repository.UserRepository;
import com.gather.user.service.UserService;

@Service
public class UserServiceImpl implements UserService {

  @Autowired
  private UserRepository repository;

  @Autowired
  private BCryptPasswordEncoder passwordEncoder;

  @Override
  public boolean createUser(UserRegisterDTO data) {
    try {
      User user = new User();
      user.setName(data.getName());
      user.setUsername(data.getUsername());
      user.setPassword(passwordEncoder.encode(data.getPassword()));
      user.setEmail(data.getEmail());
      user.setRoles(Arrays.asList(new Role(data.getRole())));
      repository.save(user);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
    User user = repository.findByUserName(username);
    if(user == null){
      throw new UsernameNotFoundException("User not found");
    }
    return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), mapRolesToAuthorities(user.getRoles()));
  }

  private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles) {
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
    }

}
