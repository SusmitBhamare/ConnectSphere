package com.gather.user.service;

import com.gather.user.dto.UserAllDetailsDTO;
import com.gather.user.entity.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AdminService {

  void createAdmin();

  ResponseEntity<List<UserAllDetailsDTO>> getModRequests();

  void acceptModRequest(String username);

  void rejectModRequest(String username);
}
