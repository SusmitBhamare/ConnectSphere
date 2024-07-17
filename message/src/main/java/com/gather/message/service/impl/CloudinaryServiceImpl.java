package com.gather.message.service.impl;

import com.cloudinary.Cloudinary;
import com.gather.message.service.CloudinaryService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

  @Resource
  private Cloudinary cloudinary;

  @Override
  public String upload(MultipartFile file, String folder) {
    try{
      Map<Object , Object> options = new HashMap<>();
      options.put("folder" , folder);
      Map uploadFile = cloudinary.uploader().upload(file.getBytes() , options);
      String publicId = (String) uploadFile.get("public_id");
      return cloudinary.url().secure(true).generate(publicId);
    } catch (Exception e){
      throw new RuntimeException("Could not upload file");
    }
  }
}
