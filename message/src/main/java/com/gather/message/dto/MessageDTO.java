package com.gather.message.dto;

import java.util.Collection;
import java.util.Date;
import java.util.UUID;

import lombok.Data;

@Data
public class MessageDTO {
    private UUID id;
  private Collection<UUID> receiverIds;
  private String content;
  private UUID senderId;
  private UUID workspaceId;
  private String attachment;
  private Date createdAt;
}
