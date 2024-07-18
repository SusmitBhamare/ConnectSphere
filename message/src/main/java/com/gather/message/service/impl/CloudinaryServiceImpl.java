package com.gather.message.service.impl;

import com.cloudinary.Cloudinary;
import com.gather.message.entity.Attachment;
import com.gather.message.service.CloudinaryService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

  @Resource
  private Cloudinary cloudinary;

  @Override
  public Attachment upload(MultipartFile file) {
    try{
      Map<Object , Object> options = new HashMap<>();
      options.put("folder" , "gather");
      options.put("resource_type" , "auto");
      Map uploadFile = cloudinary.uploader().upload(file.getBytes() , options);
      String publicId = (String) uploadFile.get("public_id");
      String url = cloudinary.url().secure(true).generate(publicId);
      Attachment attachment = new Attachment();
      attachment.setUrl(url);
      attachment.setName(file.getOriginalFilename());
      attachment.setSize(file.getSize());
      attachment.setType(file.getContentType());
      attachment.setExtension(Objects.requireNonNull(
          file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf(".")
          + 1));
      return attachment;
    } catch (Exception e){
      throw new RuntimeException("Could not upload file");
    }
  }
}
