package edu.cit.btts.service;

import edu.cit.btts.dto.SeatDTO;
import edu.cit.btts.model.Seat;
import edu.cit.btts.model.SeatStatus;
import edu.cit.btts.model.Trip;
import edu.cit.btts.repository.SeatRepository;
import edu.cit.btts.repository.TripRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SeatService {

  private final SeatRepository seatRepository;
  private final TripRepository tripRepository;

    public SeatService(SeatRepository seatRepository, TripRepository tripRepository) {
        this.seatRepository = seatRepository;
        this.tripRepository = tripRepository;
    }

  // Method to find a seat by its ID
  public Seat getSeatById(Long id) {
    return seatRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Seat not found with ID: " + id));
  }

  /**
   * Retrieves all seat details for a specific trip.
   *
   * @param tripId The ID of the trip for which to retrieve seats.
   * @return A list of SeatDTOs associated with the given trip.
   * @throws ResponseStatusException if the trip is not found (optional, can return empty list instead).
   */
  public List<SeatDTO> getSeatsByTripId(Long tripId) {
      // Optional: Check if the trip itself exists. If the trip ID is invalid,
      // you might want to throw an error rather than just returning an empty list.
      Trip trip = tripRepository.findById(tripId)
          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found with ID: " + tripId));

      // Retrieve seats by trip ID
      List<Seat> seats = seatRepository.findByTripId(trip.getId()); // Use trip.getId() to be consistent

      // Map entities to DTOs
      return seats.stream()
              .map(this::mapEntityToDto)
              .collect(Collectors.toList());
  }

  // Update Seat Status (only changes status, doesn't handle ticket association directly here)
  // The TicketService will manage the bidirectional link for Seat.ticket
  public Seat updateSeatStatus(Long seatId, SeatStatus newStatus) {
    Seat seat = getSeatById(seatId);
    seat.setStatus(newStatus);
    return seatRepository.save(seat);
  }

  /**
   * Updates a seat's position (row/column) and/or its associated trip.
   * This method ensures that the new position is valid and not already taken.
   *
   * @param seatId The ID of the seat to update.
   * @param newRowPosition The new row position (can be null if not changing).
   * @param newColumnPosition The new column position (can be null if not changing).
   * @param newTripId The ID of the new trip for the seat (can be null if not changing).
   * @return The updated Seat entity.
   * @throws ResponseStatusException if new trip not found, or new position is already taken.
   */
  @Transactional
  public Seat updateSeatDetails(Long seatId, Integer newRowPosition, Integer newColumnPosition, Long newTripId) {
    Seat existingSeat = getSeatById(seatId);

    Integer effectiveRowPosition = (newRowPosition != null) ? newRowPosition : existingSeat.getRowPosition();
    Integer effectiveColumnPosition = (newColumnPosition != null) ? newColumnPosition : existingSeat.getColumnPosition();
    Trip effectiveTrip = existingSeat.getTrip(); // Start with current trip

    // If newTripId is provided and different, fetch the new trip
    if (newTripId != null && !existingSeat.getTrip().getId().equals(newTripId)) {
      effectiveTrip = tripRepository.findById(newTripId)
              .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "New Trip not found with ID: " + newTripId));
    }

    // Check for conflicts at the new position within the effective trip
    // Only perform this check if the position or trip is actually changing
    boolean positionOrTripChanged = !effectiveRowPosition.equals(existingSeat.getRowPosition()) ||
                                    !effectiveColumnPosition.equals(existingSeat.getColumnPosition()) ||
                                    !effectiveTrip.equals(existingSeat.getTrip());

    if (positionOrTripChanged) {
      Optional<Seat> conflictingSeat = seatRepository.findByTripAndRowPositionAndColumnPosition(
              effectiveTrip, effectiveRowPosition, effectiveColumnPosition);

      if (conflictingSeat.isPresent() && !conflictingSeat.get().getId().equals(seatId)) {
        throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Seat at Row: " + effectiveRowPosition + ", Column: " + effectiveColumnPosition +
                        " is already taken for Trip ID " + effectiveTrip.getId() + ".");
      }
    }

    // Update the seat properties
    existingSeat.setRowPosition(effectiveRowPosition);
    existingSeat.setColumnPosition(effectiveColumnPosition);
    existingSeat.setTrip(effectiveTrip); // Update the trip association

    return seatRepository.save(existingSeat);
  }

  // Map Seat Entity to SeatDTO
  public SeatDTO mapEntityToDto(Seat seat) {
    if (seat == null) return null;
    return new SeatDTO(
      seat.getId(),
      seat.getRowPosition(),
      seat.getColumnPosition(),
      seat.getStatus(),
      seat.getTrip() != null ? seat.getTrip().getId() : null
    );
  }
}