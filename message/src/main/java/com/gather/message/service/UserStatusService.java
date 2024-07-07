package com.gather.message.service;


import com.gather.message.dto.UserStatusDTO;

public interface UserStatusService {

    UserStatusDTO setUserOnline(String username);
    UserStatusDTO setUserOffline(String username);
    boolean isUserOnline(String username);
}
