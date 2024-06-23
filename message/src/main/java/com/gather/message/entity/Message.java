package com.gather.message.entity;

import java.util.Collection;
import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "message")
public class Message {
  
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;
  private Collection<UUID> receiverIds;
  private String content;
  private Status status;
  private UUID senderId;
  private UUID workspaceId;
  private String attachment;
  private Date sentAt;
  private Date createdAt;
}
