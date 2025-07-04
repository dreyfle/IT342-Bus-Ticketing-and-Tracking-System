package edu.cit.btts.controller;

import edu.cit.btts.dto.ApiResponse;
import edu.cit.btts.dto.TicketRequest;
import edu.cit.btts.dto.TicketResponse;
import edu.cit.btts.dto.TicketUpdateRequest;
import edu.cit.btts.service.TicketService;
import edu.cit.btts.repository.UserRepository; // Needed for fetching user in getMyTickets (if not using custom UserDetails)
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails; // Or your custom UserDetails type
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

  private final TicketService ticketService;
  private final UserRepository userRepository; // Inject if you need to fetch User ID from username

  public TicketController(TicketService ticketService, UserRepository userRepository) {
    this.ticketService = ticketService;
    this.userRepository = userRepository;
  }

  /**
     * Creates a new Ticket and Seat with a CASH payment.
     * Accessible by ADMIN, STAFF, and PASSENGER roles.
     *
     * @param request The ticket creation request data.
     * @return ResponseEntity with the created TicketResponse.
     */
    @PostMapping("/cash") // Specific endpoint for cash payments
    @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF', 'PASSENGER')")
    public ResponseEntity<ApiResponse> createTicketCash(@Valid @RequestBody TicketRequest request) {
        TicketResponse ticket = ticketService.createTicketForCash(request);
        return new ResponseEntity<>(new ApiResponse(true, "Ticket created successfully with cash payment.", ticket), HttpStatus.CREATED);
    }

    /**
     * Creates a new Ticket and Seat with an ONLINE payment.
     * Accessible by ADMIN, STAFF, and PASSENGER roles.
     *
     * @param request The ticket creation request data.
     * @return ResponseEntity with the created TicketResponse.
     */
    @PostMapping("/online") // Specific endpoint for online payments
    @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF', 'PASSENGER')")
    public ResponseEntity<ApiResponse> createTicketOnline(@Valid @RequestBody TicketRequest request) {
        TicketResponse ticket = ticketService.createTicketForOnline(request);
        return new ResponseEntity<>(new ApiResponse(true, "Ticket created successfully with online payment.", ticket), HttpStatus.CREATED);
    }

  /**
   * Retrieves all Tickets.
   * Accessible by TRANSIT_ADMIN, TICKET_STAFF.
   *
   * @return List of TicketResponses.
   */
  @GetMapping
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF')")
  public ResponseEntity<List<TicketResponse>> getAllTickets() {
    List<TicketResponse> tickets = ticketService.getAllTickets();
    return ResponseEntity.ok(tickets);
  }

  /**
   * Retrieves a Ticket by its ID.
   * Accessible by TRANSIT_ADMIN, TICKET_STAFF.
   *
   * @param id The ID of the ticket to retrieve.
   * @return TicketResponse if found.
   */
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF')")
  public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id) {
    TicketResponse ticket = ticketService.getTicketById(id);
    return ResponseEntity.ok(ticket);
  }

  /**
   * Updates an existing Ticket.
   * Accessible only by TRANSIT_ADMIN and TICKET_STAFF.
   *
   * @param id The ID of the ticket to update.
   * @param request The updated Ticket data.
   * @return ResponseEntity with the updated TicketResponse and success message.
   */
  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF')")
  public ResponseEntity<ApiResponse> updateTicket(@PathVariable Long id, @Valid @RequestBody TicketUpdateRequest request) {
    TicketResponse updatedTicket = ticketService.updateTicket(id, request);
    return ResponseEntity.ok(new ApiResponse(true, "Ticket updated successfully.", updatedTicket));
  }

  /**
   * Deletes a Ticket by its ID.
   * Accessible only by TRANSIT_ADMIN and TICKET_STAFF.
   *
   * @param id The ID of the ticket to delete.
   * @return ResponseEntity with success message.
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF')")
  public ResponseEntity<ApiResponse> deleteTicket(@PathVariable Long id) {
    ticketService.deleteTicket(id);
    return ResponseEntity.ok(new ApiResponse(true, "Ticket deleted successfully."));
  }

  /**
   * Endpoint for a passenger to get their own tickets.
   * Accessible only by PASSENGER.
   * The user ID is retrieved from the authenticated principal.
   *
   * @return List of TicketResponses belonging to the authenticated user.
   */
  @GetMapping("/my-tickets")
  @PreAuthorize("hasRole('PASSENGER')")
  public ResponseEntity<List<TicketResponse>> getMyTickets() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    Long currentUserId;

    if (principal instanceof UserDetails) {
      String username = ((UserDetails) principal).getUsername();
      // Assuming your User entity has an email field and your UserRepository can find by email
      currentUserId = userRepository.findByEmail(username)
                          .map(edu.cit.btts.model.User::getId) // Map to User ID
                          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Authenticated user not found in database."));
    } else {
      // This might happen if using anonymous authentication or a different principal type
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated or principal type not recognized.");
    }

    List<TicketResponse> myTickets = ticketService.findByUserId(currentUserId);
    return ResponseEntity.ok(myTickets);
  }
}