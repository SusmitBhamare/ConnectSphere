package com.connectsphere.user.service;

import com.connectsphere.user.dto.ModRequestUserDTO;
import com.connectsphere.user.dto.UserAllDetailsDTO;
import com.connectsphere.user.entity.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AdminService {

  void createAdmin();

  List<ModRequestUserDTO> getModRequests();

  void acceptModRequest(String username);

  void rejectModRequest(String username);
}
