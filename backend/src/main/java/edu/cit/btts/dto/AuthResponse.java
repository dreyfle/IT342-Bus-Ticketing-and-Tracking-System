package edu.cit.btts.dto;


import edu.cit.btts.model.User;

public class AuthResponse {
  private String token;
  private User user; // Include user details for the frontend

  public AuthResponse(String token, User user) {
    this.token = token;
    this.user = user;
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
}
