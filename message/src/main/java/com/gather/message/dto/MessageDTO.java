package com.gather.message.dto;

import java.util.Collection;
import java.util.Date;
import java.util.UUID;

import com.gather.message.dummy.UserAllDetailsDTO;
import com.gather.message.dummy.Workspace;
import com.gather.message.entity.Status;
import lombok.Data;

@Data
public class MessageDTO {
  private UUID id;
  private Collection<UserAllDetailsDTO> receivers;
  private String content;
  private UserAllDetailsDTO sender;
  private Workspace workspace;
  private String attachment;
  private Date createdAt;
  private Date sentAt;
  private Status status;
}
