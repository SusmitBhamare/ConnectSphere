package com.gather.message.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gather.message.entity.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message,UUID> {
  
}