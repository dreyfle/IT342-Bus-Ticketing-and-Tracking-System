package edu.cit.btts.dto;

import edu.cit.btts.model.PaymentStatus;
import edu.cit.btts.model.PaymentPurpose;
import edu.cit.btts.model.PaymentType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {
  private Long id;
  private BigDecimal amount;
  private PaymentStatus status;
  private PaymentType type;
  private PaymentPurpose purpose;
  private LocalDateTime date;
  private byte[] onlineReceipt; // For response, can be encoded to base64 if needed by frontend
  private Long ticketId; // Just the ID, or you could embed a TicketResponse DTO if more details are needed

  public PaymentResponse() {
  }

  public PaymentResponse(Long id, BigDecimal amount, PaymentStatus status, PaymentType type, PaymentPurpose purpose, LocalDateTime date, byte[] onlineReceipt, Long ticketId) {
    this.id = id;
    this.amount = amount;
    this.status = status;
    this.type = type;
    this.purpose = purpose;
    this.date = date;
    this.onlineReceipt = onlineReceipt;
    this.ticketId = ticketId;
  }

  // Getters and Setters
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public PaymentStatus getStatus() {
    return status;
  }

  public void setStatus(PaymentStatus status) {
    this.status = status;
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

  public LocalDateTime getDate() {
    return date;
  }

  public void setDate(LocalDateTime date) {
    this.date = date;
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