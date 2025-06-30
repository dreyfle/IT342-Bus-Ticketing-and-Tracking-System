package edu.cit.btts.model;

public enum Role {
  PASSENGER,
  TICKET_STAFF, // Renamed to follow Java enum conventions (UPPER_SNAKE_CASE)
  TRANSIT_ADMIN; // Renamed to follow Java enum conventions

  // You can add methods here if needed, e.g., to get a display name
  public String getDisplayName() {
    return this.name().replace("_", " "); // Converts TICKET_STAFF to Ticket Staff
  }

  // Spring Security expects roles to be prefixed with "ROLE_"
  public String getAuthorityName() {
    return "ROLE_" + this.name();
  }
}
