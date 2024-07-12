package com.gather.message.dummy;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Workspace {
    private UUID id;
    private String name;
    private String description;
    private Collection<UUID> members;
    private UUID createdBy;
    private String image;
}
