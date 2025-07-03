package edu.cit.btts.dto;

import edu.cit.btts.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public class UpdateRoleRequest {

  @Email(message = "Invalid email format")
  @NotNull(message = "Email is required")
  private String email;

  @NotNull(message = "Role is required")
  private Role role;

  // Getters and setters
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }
}
