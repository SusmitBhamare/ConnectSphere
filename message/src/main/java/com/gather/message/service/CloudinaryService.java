package com.gather.message.service;

import com.gather.message.entity.Attachment;
import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
  public Attachment upload(MultipartFile file);
}
