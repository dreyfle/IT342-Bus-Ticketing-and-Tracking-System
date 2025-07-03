package edu.cit.btts.dto;

import edu.cit.btts.model.TripStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class TripCreateRequest {

  @NotNull(message = "Departure time is required.")
  @FutureOrPresent(message = "Departure time cannot be in the past.")
  private LocalDateTime departureTime;

  private TripStatus status; // Optional for creation, defaults to SCHEDULED in service

  @NotNull(message = "Bus ID is required.")
  private Long busId;

  @NotNull(message = "Route details are required to create a new route for the trip.")
  @Valid // This ensures nested RouteDTO is also validated
  private RouteDTO routeDetails; // This will contain the details for the new route

  public TripCreateRequest() {
  }

  // Getters and Setters
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

  public RouteDTO getRouteDetails() {
    return routeDetails;
  }

  public void setRouteDetails(RouteDTO routeDetails) {
    this.routeDetails = routeDetails;
  }
}