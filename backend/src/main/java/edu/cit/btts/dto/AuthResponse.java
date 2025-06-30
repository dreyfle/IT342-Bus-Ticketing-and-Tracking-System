package edu.cit.btts.dto;


import edu.cit.btts.model.Role;
import edu.cit.btts.model.User;

public class AuthResponse {
  private String token;
  private User user; // Contains user details including role
  private Role role; // Explicitly include role for convenience on frontend

  public AuthResponse(String token, User user) {
    this.token = token;
    this.user = user;
    this.role = user.getRole(); // Set the role from the user object
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Role getRole() { // Getter for role
    return role;
  }

  public void setRole(Role role) { // Setter for role
    this.role = role;
  }
}
