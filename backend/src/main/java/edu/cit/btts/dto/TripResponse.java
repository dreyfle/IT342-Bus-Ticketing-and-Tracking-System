package edu.cit.btts.dto;

import edu.cit.btts.model.TripStatus;
import java.time.LocalDateTime;

public class TripResponse {

  private Long id;
  private LocalDateTime departureTime;
  private TripStatus status;
  private BusDTO busDetails; // Nested DTO for bus details
  private RouteDTO routeDetails; // Nested DTO for route details
  private Integer availableSeats;

  public TripResponse() {
  }

  public TripResponse(Long id, LocalDateTime departureTime, TripStatus status, BusDTO busDetails, RouteDTO routeDetails, Integer availableSeats) {
    this.id = id;
    this.departureTime = departureTime;
    this.status = status;
    this.busDetails = busDetails;
    this.routeDetails = routeDetails;
    this.availableSeats = availableSeats; 
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

  public BusDTO getBusDetails() {
    return busDetails;
  }

  public void setBusDetails(BusDTO busDetails) {
    this.busDetails = busDetails;
  }

  public RouteDTO getRouteDetails() {
    return routeDetails;
  }

  public void setRouteDetails(RouteDTO routeDetails) {
    this.routeDetails = routeDetails;
  }

  public Integer getAvailableSeats() { return availableSeats; } // NEW GETTER
  public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; } // NEW SETTER

}