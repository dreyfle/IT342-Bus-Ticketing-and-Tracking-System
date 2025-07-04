package edu.cit.btts.dto;

import edu.cit.btts.model.TripStatus;
import jakarta.validation.constraints.FutureOrPresent;
import java.time.LocalDateTime;

public class TripUpdateRequest {

  // ID is typically taken from path variable, but sometimes included for clarity
  private Long id;

  @FutureOrPresent(message = "Departure time cannot be in the past.")
  private LocalDateTime departureTime;

  private TripStatus status;

  private Long busId; // Optional: change associated bus
  private Long routeId; // Optional: change associated route to an existing one

  public TripUpdateRequest() {
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public LocalDateTime getDepartureTime() {
    return departureTime;
  }

  public void setDepartureTime(LocalDateTime departureTime) {
    this.departureTime = departureTime;
  }

  public TripStatus getStatus() {
    return status;
  }

  public void setStatus(TripStatus status) {
    this.status = status;
  }

  public Long getBusId() {
    return busId;
  }

  public void setBusId(Long busId) {
    this.busId = busId;
  }

  public Long getRouteId() {
    return routeId;
  }

  public void setRouteId(Long routeId) {
    this.routeId = routeId;
  }
}