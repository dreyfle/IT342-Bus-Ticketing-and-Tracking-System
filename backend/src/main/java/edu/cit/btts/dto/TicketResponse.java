package edu.cit.btts.dto;

import java.util.List;

// Assuming you have TripResponse and UserDTO from previous steps
// import edu.cit.btts.dto.TripResponse;
// import edu.cit.btts.dto.UserDTO;

public class TicketResponse {
  private Long id;
  private Double fare;
  private String dropOff;
  private SeatDTO seatDetails; // Nested Seat details
  private TripResponse tripDetails; // Nested Trip details
  private UserDTO userDetails; // Nested User (Passenger) details
  private List<PaymentResponse> payments;

  public TicketResponse() {}

  public TicketResponse(Long id, Double fare, String dropOff, SeatDTO seatDetails, TripResponse tripDetails, UserDTO userDetails, List<PaymentResponse> payments) {
    this.id = id;
    this.fare = fare;
    this.dropOff = dropOff;
    this.seatDetails = seatDetails;
    this.tripDetails = tripDetails;
    this.userDetails = userDetails;
    this.payments = payments; 
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
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

  public SeatDTO getSeatDetails() {
    return seatDetails;
  }

  public void setSeatDetails(SeatDTO seatDetails) {
    this.seatDetails = seatDetails;
  }

  public TripResponse getTripDetails() {
    return tripDetails;
  }

  public void setTripDetails(TripResponse tripDetails) {
    this.tripDetails = tripDetails;
  }

  public UserDTO getUserDetails() {
    return userDetails;
  }

  public void setUserDetails(UserDTO userDetails) {
    this.userDetails = userDetails;
  }

  public List<PaymentResponse> getPayments() {
    return payments;
  }

  public void setPayments(List<PaymentResponse> payments) {
    this.payments = payments;
  }
}