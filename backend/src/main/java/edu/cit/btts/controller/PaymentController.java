package edu.cit.btts.controller;

import edu.cit.btts.dto.ApiResponse; // Make sure this import points to your non-generic ApiResponse
import edu.cit.btts.dto.PaymentRequest;
import edu.cit.btts.dto.PaymentResponse;
import edu.cit.btts.model.PaymentStatus;
import edu.cit.btts.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

  private final PaymentService paymentService;

  public PaymentController(PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  /**
   * Records a new payment for a ticket.
   * Accessible by ADMIN, STAFF, and PASSENGER roles.
   * Passengers can record their own payments.
   *
   * @param request The PaymentRequest DTO.
   * @return A ResponseEntity with the created PaymentResponse.
   */
  @PostMapping
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF', 'PASSENGER')")
  public ResponseEntity<ApiResponse> createPayment(@Valid @RequestBody PaymentRequest request) { 
    PaymentResponse payment = paymentService.createPayment(request);
    return new ResponseEntity<>(new ApiResponse(true, "Payment recorded successfully.", payment), HttpStatus.CREATED); 
  }

  /**
   * Retrieves a specific payment by its ID.
   * ADMIN and STAFF can view any payment. Passengers can only view their own payments.
   *
   * @param id The ID of the payment.
   * @return A ResponseEntity with the PaymentResponse.
   */
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF', 'PASSENGER')")
  public ResponseEntity<ApiResponse> getPaymentById(@PathVariable Long id) { 
    PaymentResponse payment = paymentService.getPaymentById(id);
    return ResponseEntity.ok(new ApiResponse(true, "Payment retrieved successfully.", payment));
  }

  /**
   * Retrieves all payments in the system.
   * Accessible only by ADMIN and STAFF roles.
   *
   * @return A ResponseEntity with a list of all PaymentResponse.
   */
  @GetMapping
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF')")
  public ResponseEntity<ApiResponse> getAllPayments() { 
    List<PaymentResponse> payments = paymentService.getAllPayments();
    return ResponseEntity.ok(new ApiResponse(true, "All payments retrieved successfully.", payments)); 
  }

  /**
   * Retrieves all payments associated with a specific ticket.
   * ADMIN and STAFF can view payments for any ticket. Passengers can only view payments for their own tickets.
   *
   * @param ticketId The ID of the ticket.
   * @return A ResponseEntity with a list of PaymentResponse for the given ticket.
   */
  @GetMapping("/ticket/{ticketId}")
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF', 'PASSENGER')")
  public ResponseEntity<ApiResponse> getPaymentsByTicketId(@PathVariable Long ticketId) {
    List<PaymentResponse> payments = paymentService.getPaymentsByTicketId(ticketId);
    return ResponseEntity.ok(new ApiResponse(true, "Payments for ticket retrieved successfully.", payments)); 
  }

  /**
   * Updates the status of a payment (e.g., from PENDING to APPROVED).
   * Accessible only by ADMIN and STAFF roles.
   *
   * @param id The ID of the payment.
   * @param status The new PaymentStatus to set.
   * @return A ResponseEntity with the updated PaymentResponse.
   */
  @PatchMapping("/{id}/status")
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF')")
  public ResponseEntity<ApiResponse> updatePaymentStatus(
    @PathVariable Long id,
    @RequestParam PaymentStatus status) {
    PaymentResponse updatedPayment = paymentService.updatePaymentStatus(id, status);
    return ResponseEntity.ok(new ApiResponse(true, "Payment status updated successfully.", updatedPayment)); 
  }

  /**
   * Deletes a payment.
   * Accessible only by ADMIN and STAFF roles.
   *
   * @param id The ID of the payment to delete.
   * @return A ResponseEntity indicating success.
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF')")
  public ResponseEntity<ApiResponse> deletePayment(@PathVariable Long id) { 
    paymentService.deletePayment(id);
    return ResponseEntity.ok(new ApiResponse(true, "Payment deleted successfully.", null));
  }
}