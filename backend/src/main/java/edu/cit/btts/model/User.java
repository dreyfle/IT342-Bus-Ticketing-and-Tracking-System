package edu.cit.btts.model;

import jakarta.persistence.*; // Import JPA annotations

import java.util.Objects;

@Entity // Marks this class as a JPA entity
public class User {

  @Id // Marks this field as the primary key
  @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increments the ID
  private Long id; // Unique ID for the user in your database

  @Column(unique = true, nullable = false) // Ensures email is unique and not null
  private String email;

  @Column(name = "first_name") // Maps to a column named 'first_name'
  private String firstName;

  @Column(name = "last_name") // Maps to a column named 'last_name'
  private String lastName;

  // Default constructor for JPA
  public User() {
  }

  // Constructor for creating new users from Google login data
  public User(String email, String firstName, String lastName) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // Getters and Setters for all fields
  public Long getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;
    return Objects.equals(email, user.email); // Equality based on email
  }

  @Override
  public int hashCode() {
    return Objects.hash(email);
  }

  @Override
  public String toString() {
    return "User{" +
            "id=" + id +
            ", email='" + email + '\'' +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            '}';
  }
}