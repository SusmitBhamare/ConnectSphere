package com.gather.user.entity;
import java.util.Collection;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user" , uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;
  private String name;
  private String username;
  private String password;
  private String email;
  private String image;
  private Collection<Role> roles;
  private Collection<UUID> messages;
  private Collection<UUID> workspaces;
}
