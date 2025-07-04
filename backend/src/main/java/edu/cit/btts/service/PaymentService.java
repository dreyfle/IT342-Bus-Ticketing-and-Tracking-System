package edu.cit.btts.service;

import edu.cit.btts.dto.PaymentRequest;
import edu.cit.btts.dto.PaymentResponse;
import edu.cit.btts.model.Payment;
import edu.cit.btts.model.PaymentStatus;
import edu.cit.btts.model.PaymentType;
import edu.cit.btts.model.Seat;
import edu.cit.btts.model.SeatStatus;
import edu.cit.btts.model.Ticket;
import edu.cit.btts.model.User;
import edu.cit.btts.repository.PaymentRepository;
import edu.cit.btts.repository.SeatRepository;
import edu.cit.btts.repository.TicketRepository;
import edu.cit.btts.repository.UserRepository; // For user lookup
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects; // For Objects.equals
import java.util.stream.Collectors;

@Service
public class PaymentService {

  private final PaymentRepository paymentRepository;
  private final TicketRepository ticketRepository;
  private final UserRepository userRepository; // To get User ID for security checks
  private final SeatRepository seatRepository;

  public PaymentService(PaymentRepository paymentRepository, TicketRepository ticketRepository, UserRepository userRepository, SeatRepository seatRepository) {
    this.paymentRepository = paymentRepository;
    this.ticketRepository = ticketRepository;
    this.userRepository = userRepository;
    this.seatRepository = seatRepository;
  }

  /**
   * Creates a new payment for a given ticket.
   *
   * @param request The PaymentRequest DTO containing payment details.
   * @return The created PaymentResponse DTO.
   * @throws ResponseStatusException if the associated ticket is not found.
   * @throws ResponseStatusException if online receipt is missing for ONLINE payment type.
   */
  @Transactional
  public PaymentResponse createPayment(PaymentRequest request) {
    Ticket ticket = ticketRepository.findById(request.getTicketId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found with ID: " + request.getTicketId()));

    if (request.getType() == PaymentType.ONLINE && (request.getOnlineReceipt() == null || request.getOnlineReceipt().length == 0)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Online receipt is required for online payments.");
    }
    if (request.getType() == PaymentType.CASH && request.getOnlineReceipt() != null && request.getOnlineReceipt().length > 0) {
      // Optionally, clear the receipt if cash payment to prevent storing unnecessary data
      request.setOnlineReceipt(null);
    }

    Payment payment = new Payment(
      request.getAmount(),
      request.getType(),
      request.getPurpose(),
      request.getOnlineReceipt(),
      ticket
    );
    // Default status (PENDING) and date (now()) are set in Payment entity's constructor

    Payment savedPayment = paymentRepository.save(payment);
    return mapEntityToDto(savedPayment);
  }

  /**
   * Retrieves a payment by its ID.
   * Includes security check: Passengers can only view their own payments.
   *
   * @param id The ID of the payment.
   * @return The PaymentResponse DTO.
   * @throws ResponseStatusException if payment not found, or user is forbidden to view it.
   */
  public PaymentResponse getPaymentById(Long id) {
    Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found with ID: " + id));

    // Security check: If current user is PASSENGER, ensure the payment belongs to them
    if (isCurrentUserPassenger()) {
      User currentUser = getAuthenticatedUser();
      if (!Objects.equals(payment.getTicket().getUser().getId(), currentUser.getId())) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You can only view your own payments.");
      }
    }
    return mapEntityToDto(payment);
  }

  /**
   * Retrieves all payments.
   * Restricted to TRANSIT_ADMIN and TICKET_STAFF roles.
   *
   * @return A list of all PaymentResponse DTOs.
   */
  public List<PaymentResponse> getAllPayments() {
    return paymentRepository.findAll().stream()
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
  }

  /**
   * Retrieves payments associated with a specific ticket ID.
   * Includes security check: Passengers can only view payments for their own tickets.
   *
   * @param ticketId The ID of the ticket.
   * @return A list of PaymentResponse DTOs.
   * @throws ResponseStatusException if ticket not found, or user is forbidden to view its payments.
   */
  public List<PaymentResponse> getPaymentsByTicketId(Long ticketId) {
    Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found with ID: " + ticketId));

    // Security check: If current user is PASSENGER, ensure the ticket belongs to them
    if (isCurrentUserPassenger()) {
      User currentUser = getAuthenticatedUser();
      if (!Objects.equals(ticket.getUser().getId(), currentUser.getId())) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You can only view payments for your own tickets.");
      }
    }

    return paymentRepository.findByTicketId(ticketId).stream()
      .map(this::mapEntityToDto)
      .collect(Collectors.toList());
  }

  /**
   * Updates the status of a payment.
   * Restricted to TRANSIT_ADMIN and TICKET_STAFF roles.
   *
   * @param id The ID of the payment to update.
   * @param newStatus The new status for the payment.
   * @return The updated PaymentResponse DTO.
   * @throws ResponseStatusException if payment not found, or invalid status transition.
   */
  @Transactional
  public PaymentResponse updatePaymentStatus(Long id, PaymentStatus newStatus) {
    Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found with ID: " + id));

    // Add business logic for status transitions if needed
    // For example: Cannot change from APPROVED to PENDING
    if (payment.getStatus() == PaymentStatus.APPROVED && newStatus == PaymentStatus.PENDING) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot change status from APPROVED to PENDING.");
    }
    // If payment status is APPROVED or REJECTED, and new status is the same, no action needed
    if ((payment.getStatus() == PaymentStatus.APPROVED || payment.getStatus() == PaymentStatus.REJECTED) && payment.getStatus() == newStatus) {
      return mapEntityToDto(payment); // No actual change, return current state
    }

    payment.setStatus(newStatus); // Set the new payment status

    Payment updatedPayment = paymentRepository.save(payment); // Save payment status change

    // --- LOGIC TO UPDATE SEAT STATUS BASED ON PAYMENT STATUS ---
    Ticket associatedTicket = updatedPayment.getTicket();
    if (associatedTicket != null && associatedTicket.getSeat() != null) {
      Seat associatedSeat = associatedTicket.getSeat();
      SeatStatus currentSeatStatus = associatedSeat.getStatus();
      SeatStatus desiredSeatStatus = currentSeatStatus; // Initialize with current to avoid unnecessary updates

      switch (newStatus) {
        case APPROVED:
          desiredSeatStatus = SeatStatus.BOOKED;
          break;
        case REJECTED:
          desiredSeatStatus = SeatStatus.OPEN; // Make seat available again if payment rejected
          break;
        case PENDING:
          desiredSeatStatus = SeatStatus.RESERVED; // Seat is reserved while payment is pending
          break;
        // No default needed if enum covers all cases, or handle other statuses if they exist
      }

      // Only update if the status is actually changing to avoid unnecessary DB writes
      if (desiredSeatStatus != currentSeatStatus) {
        associatedSeat.setStatus(desiredSeatStatus);
        seatRepository.save(associatedSeat); // Save the updated seat status
      }
    }

    return mapEntityToDto(updatedPayment);
  }

  /**
   * Deletes a payment by its ID.
   * Restricted to TRANSIT_ADMIN and TICKET_STAFF roles.
   *
   * @param id The ID of the payment to delete.
   * @throws ResponseStatusException if payment not found.
   */
  @Transactional
  public void deletePayment(Long id) {
    if (!paymentRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found with ID: " + id);
    }
    paymentRepository.deleteById(id);
  }

  // --- Helper Methods ---

  private PaymentResponse mapEntityToDto(Payment payment) {
    if (payment == null) return null;
    return new PaymentResponse(
            payment.getId(),
            payment.getAmount(),
            payment.getStatus(),
            payment.getType(),
            payment.getPurpose(),
            payment.getDate(),
            payment.getOnlineReceipt(),
            payment.getTicket() != null ? payment.getTicket().getId() : null
    );
  }

  private boolean isCurrentUserPassenger() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_PASSENGER"));
  }

  private User getAuthenticatedUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName(); // Assuming username (e.g., email) is the principal name
    return userRepository.findByEmail(username) // Ensure UserRepository has findByEmail
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user not found in system."));
  }
}