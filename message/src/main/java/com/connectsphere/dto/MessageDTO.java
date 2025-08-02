package com.connectsphere.message.dto;

import java.util.Collection;
import java.util.Date;
import java.util.UUID;

import com.connectsphere.message.dummy.UserAllDetailsDTO;
import com.connectsphere.message.dummy.Workspace;
import com.connectsphere.message.entity.Attachment;
import com.connectsphere.message.entity.Status;
import lombok.Data;

@Data
public class MessageDTO {
  private UUID id;
  private Collection<UserAllDetailsDTO> receivers;
  private String content;
  private UserAllDetailsDTO sender;
  private Workspace workspace;
  private Attachment attachment;
  private Date createdAt;
  private Date sentAt;
  private Status status;
}
