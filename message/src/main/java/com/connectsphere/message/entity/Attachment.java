package com.connectsphere.message.entity;

import lombok.Data;

@Data
public class Attachment {

  private String url;
  private String name;
  private String type;
  private long size;
  private String extension;

}
