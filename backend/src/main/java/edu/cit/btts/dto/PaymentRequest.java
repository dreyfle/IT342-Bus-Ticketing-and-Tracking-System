package edu.cit.btts.dto;

import edu.cit.btts.model.PaymentPurpose;
import edu.cit.btts.model.PaymentType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class PaymentRequest {

  @NotNull(message = "Amount cannot be null")
  @Positive(message = "Amount must be a positive value")
  private BigDecimal amount;

  @NotNull(message = "Payment type cannot be null")
  private PaymentType type;

  @NotNull(message = "Payment purpose cannot be null")
  private PaymentPurpose purpose;

  // This will be base64 encoded string if sent via JSON, or raw bytes if multipart form-data.
  // For simplicity, we'll assume it's a byte array that Spring can map from multipart file.
  // If you plan to send it as base64 in JSON, you'd make this a String and decode it in service.
  private byte[] onlineReceipt; // Optional for CASH type

  @NotNull(message = "Ticket ID cannot be null")
  @Positive(message = "Ticket ID must be positive")
  private Long ticketId;

  // Getters and Setters
  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public PaymentType getType() {
    return type;
  }

  public void setType(PaymentType type) {
    this.type = type;
  }

  public PaymentPurpose getPurpose() {
    return purpose;
  }

  public void setPurpose(PaymentPurpose purpose) {
    this.purpose = purpose;
  }

  public byte[] getOnlineReceipt() {
    return onlineReceipt;
  }

  public void setOnlineReceipt(byte[] onlineReceipt) {
    this.onlineReceipt = onlineReceipt;
  }

  public Long getTicketId() {
    return ticketId;
  }

  public void setTicketId(Long ticketId) {
    this.ticketId = ticketId;
  }
}