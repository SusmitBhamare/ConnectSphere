package com.connectsphere.user.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.connectsphere.user.entity.User;

public interface UserRepository extends JpaRepository<User, UUID>{
  Optional<User> findByUsername(String username);
}
