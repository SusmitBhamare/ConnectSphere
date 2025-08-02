package com.connectsphere.message.dummy;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class AddUsersInteractedDTO {
    private UUID receiverId;
}
