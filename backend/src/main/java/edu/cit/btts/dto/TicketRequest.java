package edu.cit.btts.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import edu.cit.btts.model.PaymentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TicketRequest {
  @NotNull(message = "Row position cannot be null")
  @Positive(message = "Row position must be positive")
  private Integer rowPosition;

  @NotNull(message = "Column position cannot be null")
  @Positive(message = "Column position must be positive")
  private Integer columnPosition;

  @NotNull(message = "Trip ID cannot be null")
  @Positive(message = "Trip ID must be positive")
  private Long tripId;

  @NotNull(message = "Fare cannot be null")
  @Positive(message = "Fare must be a positive value")
  private Double fare;

  @NotBlank(message = "Drop-off location cannot be blank")
  @Size(max = 100, message = "Drop-off location cannot exceed 100 characters")
  private String dropOff;

  @NotNull(message = "User ID cannot be null")
  @Positive(message = "User ID must be positive")
  private Long userId; // The passenger buying the ticket

  @NotNull(message = "Payment type is required.")
  private PaymentType paymentType;

  // This will be base64 encoded string if sent via JSON for online payments.
  // It's optional for cash.
  private byte[] onlineReceipt;

  // Getters and Setters
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
  
  public PaymentType getPaymentType() { return paymentType; }
  public void setPaymentType(PaymentType paymentType) { this.paymentType = paymentType; }

  public byte[] getOnlineReceipt() { return onlineReceipt; }
  public void setOnlineReceipt(byte[] onlineReceipt) { this.onlineReceipt = onlineReceipt; }

}