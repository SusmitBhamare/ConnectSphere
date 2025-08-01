package com.connectsphere.message.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.connectsphere.message.entity.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

  List<Message> findAllByWorkspaceId(UUID workspaceId);

  List<Message> findAllBySenderIdAndReceiverIdsContains(UUID senderId, UUID receiverId);

  void deleteBySenderIdAndReceiverIdsContains(UUID userOneId, UUID userTwoId);
}