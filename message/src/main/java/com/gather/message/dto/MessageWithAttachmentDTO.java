package com.gather.message.dto;

import com.gather.message.entity.Status;
import jakarta.persistence.ElementCollection;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;
import java.util.Date;
import java.util.UUID;

@Data
public class MessageWithAttachmentDTO {
  private UUID id;
  private Collection<UUID> receiverIds;
  private String content;
  private Status status;
  private UUID senderId;
  private UUID workspaceId;
  private MultipartFile attachment;
  private Date sentAt;
  private Date createdAt;
}
