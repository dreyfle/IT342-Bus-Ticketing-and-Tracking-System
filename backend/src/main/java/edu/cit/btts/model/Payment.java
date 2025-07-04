package edu.cit.btts.model;

import jakarta.persistence.*;
import java.math.BigDecimal; // Use BigDecimal for currency to avoid precision issues
import java.time.LocalDateTime;

@Entity
@Table(name = "payments") // Pluralize table name as per common convention
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private BigDecimal amount;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PaymentStatus status;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PaymentType type;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PaymentPurpose purpose;

  @Column(nullable = false)
  private LocalDateTime date;

  @Lob // Large Object annotation for potentially large binary data
  @Column(name = "online_receipt")
  private byte[] onlineReceipt;

  @ManyToOne(fetch = FetchType.LAZY) // Many payments to one ticket
  @JoinColumn(name = "ticket_id", nullable = false) // Foreign key column
  private Ticket ticket;

  // Constructors
  public Payment() {
    this.status = PaymentStatus.PENDING; // Default status on creation
    this.date = LocalDateTime.now(); // Default date to current time
  }

  public Payment(BigDecimal amount, PaymentType type, PaymentPurpose purpose, byte[] onlineReceipt, Ticket ticket) {
    this(); // Call default constructor to set default status and date
    this.amount = amount;
    this.type = type;
    this.purpose = purpose;
    this.onlineReceipt = onlineReceipt;
    this.ticket = ticket;
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

  public Ticket getTicket() {
    return ticket;
  }

  public void setTicket(Ticket ticket) {
    this.ticket = ticket;
  }
}