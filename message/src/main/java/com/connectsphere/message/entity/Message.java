package com.connectsphere.message.entity;

import java.util.Collection;
import java.util.Date;
import java.util.UUID;

import jakarta.persistence.*;
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
  @ElementCollection
  private Collection<UUID> receiverIds;
  private String content;
  private Status status;
  private UUID senderId;
  private UUID workspaceId;
  @Embedded
  private Attachment attachment;
  private Date sentAt;
  private Date createdAt;
}
