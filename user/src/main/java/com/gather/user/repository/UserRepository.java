package com.gather.user.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gather.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User,UUID> {
  public User findByUserName(String username);
}
