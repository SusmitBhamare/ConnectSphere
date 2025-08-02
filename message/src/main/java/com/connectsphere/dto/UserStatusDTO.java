package com.connectsphere.message.dto;

import lombok.Data;

@Data
public class UserStatusDTO {
    private String username;
    private boolean isOnline;
}
