package edu.cit.btts.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

// No @NotNull or @NotBlank at the class level for optional fields
public class TicketUpdateRequest {

  // These fields are for updating the associated Seat's position or Trip.
  // They are optional for update.
  @Positive(message = "Row position must be positive if provided")
  private Integer rowPosition;

  @Positive(message = "Column position must be positive if provided")
  private Integer columnPosition;

  @Positive(message = "Trip ID must be positive if provided")
  private Long tripId;

  // These fields are for updating the Ticket itself.
  // They are optional for update.
  @Positive(message = "Fare must be a positive value if provided")
  private Double fare;

  @Size(max = 100, message = "Drop-off location cannot exceed 100 characters if provided")
  private String dropOff; // No @NotBlank, allowing null for partial update

  @Positive(message = "User ID must be positive if provided")
  private Long userId; // For reassigning the ticket to a different user, optional

  // --- Getters and Setters ---
  public Integer getRowPosition() {
    return rowPosition;
  }

  public void setRowPosition(Integer rowPosition) {
    this.rowPosition = rowPosition;
  }

  public Integer getColumnPosition() {
    return columnPosition;
  }

  public void setColumnPosition(Integer columnPosition) {
    this.columnPosition = columnPosition;
  }

  public Long getTripId() {
    return tripId;
  }

  public void setTripId(Long tripId) {
    this.tripId = tripId;
  }

  public Double getFare() {
    return fare;
  }

  public void setFare(Double fare) {
    this.fare = fare;
  }

  public String getDropOff() {
    return dropOff;
  }

  public void setDropOff(String dropOff) {
    this.dropOff = dropOff;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }
}