package edu.cit.btts.service;

import edu.cit.btts.dto.TicketRequest;
import edu.cit.btts.dto.TicketResponse;
import edu.cit.btts.dto.TicketUpdateRequest;
import edu.cit.btts.dto.PaymentRequest;
import edu.cit.btts.dto.PaymentResponse;
import edu.cit.btts.dto.SeatDTO;
import edu.cit.btts.dto.TripResponse;
import edu.cit.btts.dto.UserDTO;
import edu.cit.btts.model.Payment;
import edu.cit.btts.model.PaymentPurpose;
import edu.cit.btts.model.PaymentType;
import edu.cit.btts.model.Seat;
import edu.cit.btts.model.SeatStatus;
import edu.cit.btts.model.Ticket;
import edu.cit.btts.model.Trip;
import edu.cit.btts.model.User;
import edu.cit.btts.repository.PaymentRepository;
import edu.cit.btts.repository.SeatRepository;
import edu.cit.btts.repository.TicketRepository;
import edu.cit.btts.repository.TripRepository;
import edu.cit.btts.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

  private final TicketRepository ticketRepository;
  private final SeatRepository seatRepository; // Used for direct seat operations
  private final TripRepository tripRepository;
  private final UserRepository userRepository;
  private final SeatService seatService; // For mapping Seat to SeatDTO
  private final TripService tripService; // For mapping Trip to TripResponse (assuming you have one)
  private final UserService userService; // For mapping User to UserDTO (assuming you have one)
  private final PaymentService paymentService;
  private final PaymentRepository paymentRepository;

  public TicketService(TicketRepository ticketRepository,
                        SeatRepository seatRepository,
                        TripRepository tripRepository,
                        UserRepository userRepository,
                        SeatService seatService,
                        TripService tripService, 
                        UserService userService,
                        PaymentService paymentService,
                        PaymentRepository paymentRepository) {
    this.ticketRepository = ticketRepository;
    this.seatRepository = seatRepository;
    this.tripRepository = tripRepository;
    this.userRepository = userRepository;
    this.seatService = seatService;
    this.tripService = tripService;
    this.userService = userService;
    this.paymentService = paymentService;
    this.paymentRepository = paymentRepository;
  }

/**
   * Creates a new Ticket and a new Seat, handling cash payment.
   *
   * @param request The ticket creation request data.
   * @return The created TicketResponse.
   */
  @Transactional
  public TicketResponse createTicketForCash(TicketRequest request) {
    // Validate payment type explicitly for this method
    if (request.getPaymentType() != PaymentType.CASH) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This endpoint is for CASH payments only.");
    }
    if (request.getOnlineReceipt() != null && request.getOnlineReceipt().length > 0) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cash payments should not include an online receipt.");
    }

    return createTicketInternal(request, null); // Pass null for online receipt
  }

  /**
   * Creates a new Ticket and a new Seat, handling online payment.
   *
   * @param request The ticket creation request data.
   * @return The created TicketResponse.
   */
  @Transactional
  public TicketResponse createTicketForOnline(TicketRequest request) {
    // Validate payment type explicitly for this method
    if (request.getPaymentType() != PaymentType.ONLINE) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This endpoint is for ONLINE payments only.");
    }
    if (request.getOnlineReceipt() == null || request.getOnlineReceipt().length == 0) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Online receipt is required for online payments.");
    }

    return createTicketInternal(request, request.getOnlineReceipt());
  }

  /**
   * Internal helper method for creating Ticket and Seat, and recording Payment.
   *
   * @param request The common ticket request data.
   * @param onlineReceiptBytes The byte array for online receipt (null for cash).
   * @return The created TicketResponse.
   */
  private TicketResponse createTicketInternal(TicketRequest request, byte[] onlineReceiptBytes) {
    // 1. Fetch Trip
    Trip trip = tripRepository.findById(request.getTripId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Trip not found with ID: " + request.getTripId()));

    // 2. Fetch User (Passenger)
    User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "User (passenger) not found with ID: " + request.getUserId()));

    // 3. Check if a seat at this position already exists for this trip
    seatRepository.findByTripAndRowPositionAndColumnPosition(
                    trip, request.getRowPosition(), request.getColumnPosition())
            .ifPresent(existingSeat -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Seat at Row: " + request.getRowPosition() + ", Column: " + request.getColumnPosition() +
                                " already exists and is " + existingSeat.getStatus() + " for Trip ID " + request.getTripId());
            });

    // 4. Create a new Seat
    Seat newSeat = new Seat(request.getRowPosition(), request.getColumnPosition(), trip);
    if (request.getPaymentType() == PaymentType.CASH) {
      newSeat.setStatus(SeatStatus.BOOKED); // Cash payment, immediately BOOKED
    } else if (request.getPaymentType() == PaymentType.ONLINE) {
      newSeat.setStatus(SeatStatus.RESERVED); // Online payment, initially RESERVED
    } else {
      // Fallback or error if payment type is unexpected (though validation should catch this)
      newSeat.setStatus(SeatStatus.OPEN); // Default to OPEN or throw error
    }

    // 5. Save the new Seat
    Seat savedSeat = seatRepository.save(newSeat);

    // 6. Create Ticket entity
    Ticket ticket = new Ticket(savedSeat, trip, request.getFare(), request.getDropOff(), user);

    // 7. Save Ticket (This establishes the seat_id foreign key on the ticket)
    Ticket savedTicket = ticketRepository.save(ticket);

    // 8. Update the savedSeat to link it back to the ticket (bidirectional consistency)
    savedSeat.setTicket(savedTicket);
    seatRepository.save(savedSeat);

    // 9. Create Payment for the ticket
    PaymentRequest paymentRequest = new PaymentRequest();
    paymentRequest.setAmount(BigDecimal.valueOf(request.getFare())); // Use ticket fare as payment amount
    paymentRequest.setType(request.getPaymentType());
    paymentRequest.setPurpose(PaymentPurpose.TICKET_FARE); // Always Ticket Fare for initial booking
    paymentRequest.setOnlineReceipt(onlineReceiptBytes); // Pass the receipt bytes
    paymentRequest.setTicketId(savedTicket.getId()); // Link to the newly created ticket

    paymentService.createPayment(paymentRequest); // Delegate payment creation to PaymentService

    // 10. Return Response DTO
    return mapEntityToDto(savedTicket);
  }

  /**
   * Retrieves all Ticket records.
   *
   * @return A list of all TicketResponses.
   */
  public List<TicketResponse> getAllTickets() {
    return ticketRepository.findAll().stream()
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
  }

  /**
   * Retrieves a single Ticket record by its ID.
   *
   * @param id The ID of the ticket.
   * @return The TicketResponse if found.
   * @throws ResponseStatusException if the ticket is not found.
   */
  public TicketResponse getTicketById(Long id) {
    Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Ticket not found with ID: " + id));
    return mapEntityToDto(ticket);
  }

  /**
   * Updates an existing Ticket record.
   * Allows changing fare, drop-off, or assigning to a different available seat/trip/user.
   *
   * @param id The ID of the ticket to update.
   * @param request The updated Ticket data.
   * @return The updated TicketResponse.
   * @throws ResponseStatusException if Ticket, Seat, Trip, or User not found, or Seat is unavailable.
   */
  @Transactional
  public TicketResponse updateTicket(Long id, TicketUpdateRequest request) {
    Ticket existingTicket = ticketRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Ticket not found with ID: " + id));
    
    boolean seatDetailsChanged = false;
    Long newTripId = null;
    Integer newRowPosition = null;
    Integer newColumnPosition = null;            
    
    // Check if tripId is provided and different
    if (request.getTripId() != null) {
      if (!request.getTripId().equals(existingTicket.getTrip().getId())) {
        newTripId = request.getTripId();
        seatDetailsChanged = true;
      } else {
        // If provided tripId is the same as current, explicitly set it to avoid nulls later
        newTripId = existingTicket.getTrip().getId();
      }
    } else {
      // If tripId is not provided in the request, assume no change for trip on seat
      newTripId = existingTicket.getTrip().getId();
    }

    // Check if rowPosition is provided and different
    if (request.getRowPosition() != null && !request.getRowPosition().equals(existingTicket.getSeat().getRowPosition())) {
      newRowPosition = request.getRowPosition();
      seatDetailsChanged = true;
    }

    // Check if columnPosition is provided and different
    if (request.getColumnPosition() != null && !request.getColumnPosition().equals(existingTicket.getSeat().getColumnPosition())) {
      newColumnPosition = request.getColumnPosition();
      seatDetailsChanged = true;
    }

    // If any seat details (position or trip) have changed, call SeatService to update the seat
    if (seatDetailsChanged) {
      Seat updatedSeat = seatService.updateSeatDetails(
                              existingTicket.getSeat().getId(),
                              newRowPosition,
                              newColumnPosition,
                              newTripId);
      // Update the ticket's reference to the potentially updated seat object
      existingTicket.setSeat(updatedSeat);
      // The seat's status should remain BOOKED as it's still associated with this ticket.
    }

    // Handle User change: If new user ID is provided AND it's different
    if (request.getUserId() != null && !existingTicket.getUser().getId().equals(request.getUserId())) {
      User newUser = userRepository.findById(request.getUserId())
              .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                      "New User (passenger) not found with ID: " + request.getUserId()));
      existingTicket.setUser(newUser);
    }

    // Update fare and drop-off
    if (request.getFare() != null) {
      existingTicket.setFare(request.getFare());
    }
    if (request.getDropOff() != null && !request.getDropOff().isBlank()) {
      existingTicket.setDropOff(request.getDropOff());
    }

    Ticket updatedTicket = ticketRepository.save(existingTicket);
    return mapEntityToDto(updatedTicket);
  }

  /**
   * Deletes a Ticket record by its ID.
   * Also updates the associated seat status back to OPEN and removes its ticket reference.
   *
   * @param id The ID of the ticket to delete.
   * @throws ResponseStatusException if the ticket is not found.
   */
  @Transactional
  public void deleteTicket(Long id) {
    Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Ticket not found with ID: " + id));

    Seat associatedSeat = ticket.getSeat();

    // Delete the ticket first (owning side of the relationship)
    ticketRepository.deleteById(id);

    if (associatedSeat != null) {
      // Remove the ticket reference from the seat before deleting if it's bidirectional
      // associatedSeat.setTicket(null);
      seatRepository.delete(associatedSeat); // Explicitly delete the seat
    }
  }

  /**
   * Finds tickets by User ID.
   * @param userId The ID of the user (passenger).
   * @return List of TicketResponses belonging to the user.
   */
  public List<TicketResponse> findByUserId(Long userId) {
    // Optional: Validate if user exists before querying
    if (!userRepository.existsById(userId)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + userId);
    }
    return ticketRepository.findByUser_Id(userId).stream()
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
  }
  
  /**
   * Finds tickets for the currently authenticated user.
   * @return List of TicketResponses belonging to the current user.
   */
  public List<TicketResponse> findTicketsForCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated.");
    }

    String email = authentication.getName(); // Assuming principal name is the user's email
    User user = userRepository.findByEmail(email) // You'll need findByEmail in UserRepository
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Authenticated user not found in system."));

    return ticketRepository.findByUser_Id(user.getId()).stream()
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
  }

  // --- Helper Method for Entity -> Response DTO Mapping ---
  private TicketResponse mapEntityToDto(Ticket ticket) {
    if (ticket == null) return null;

    SeatDTO seatDetails = (ticket.getSeat() != null) ? seatService.mapEntityToDto(ticket.getSeat()) : null;
    TripResponse tripDetails = (ticket.getTrip() != null) ? tripService.mapEntityToDto(ticket.getTrip()) : null; // Assumes tripService.mapEntityToDto exists
    UserDTO userDetails = (ticket.getUser() != null) ? userService.mapEntityToDto(ticket.getUser()) : null; // Assumes userService.mapEntityToDto exists
    List<PaymentResponse> paymentResponses = paymentRepository.findByTicketId(ticket.getId()).stream()
            .map(this::mapPaymentEntityToDto) // Use a helper method to map Payment to PaymentResponse
            .collect(Collectors.toList());
    
    return new TicketResponse(
      ticket.getId(),
      ticket.getFare(),
      ticket.getDropOff(),
      seatDetails,
      tripDetails,
      userDetails,
      paymentResponses 
    );
  }

  // NEW: Helper method to map Payment entity to PaymentResponse DTO
  // This method is a duplicate of the one in PaymentService, but it's good to have it here
  // if PaymentService's method is not public or you want to control the mapping within TicketService.
  // If you prefer, you could make PaymentService's mapEntityToDto public and call paymentService.mapEntityToDto(payment)
  private PaymentResponse mapPaymentEntityToDto(Payment payment) {
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
}