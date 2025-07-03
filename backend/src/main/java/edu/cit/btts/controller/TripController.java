package edu.cit.btts.controller;

import edu.cit.btts.dto.ApiResponse;
import edu.cit.btts.dto.TripCreateRequest; // New import
import edu.cit.btts.dto.TripUpdateRequest; // New import
import edu.cit.btts.dto.TripResponse; // New import
import edu.cit.btts.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

  private final TripService tripService;

  public TripController(TripService tripService) {
    this.tripService = tripService;
  }

  /**
   * Creates a new Trip, creating a new Route based on provided details.
   * Accessible only by TRANSIT_ADMIN.
   *
   * @param tripCreateRequest The Trip and new Route data to create.
   * @return ResponseEntity with the created TripResponse and success message.
   */
  @PostMapping
  @PreAuthorize("hasRole('TRANSIT_ADMIN')")
  public ResponseEntity<ApiResponse> createTrip(@Valid @RequestBody TripCreateRequest tripCreateRequest) { // Changed DTO type
    TripResponse createdTrip = tripService.createTrip(tripCreateRequest); // Delegate to service
    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(new ApiResponse(true, "Trip created successfully.", createdTrip));
  }

  /**
   * Retrieves all Trips.
   * Accessible by TRANSIT_ADMIN, TICKET_STAFF, and PASSENGER.
   *
   * @return List of TripResponses.
   */
  @GetMapping
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF', 'PASSENGER')")
  public ResponseEntity<List<TripResponse>> getAllTrips() { // Changed DTO type
    List<TripResponse> trips = tripService.getAllTrips(); // Delegate to service
    return ResponseEntity.ok(trips);
  }

  /**
   * Retrieves a Trip by its ID.
   * Accessible by TRANSIT_ADMIN, TICKET_STAFF, and PASSENGER.
   *
   * @param id The ID of the trip to retrieve.
   * @return TripResponse if found.
   */
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF', 'PASSENGER')")
  public ResponseEntity<TripResponse> getTripById(@PathVariable Long id) { // Changed DTO type
    TripResponse trip = tripService.getTripById(id); // Delegate to service
    return ResponseEntity.ok(trip);
  }

  /**
   * Updates an existing Trip.
   * Accessible only by TRANSIT_ADMIN.
   *
   * @param id The ID of the trip to update.
   * @param tripUpdateRequest The updated Trip data.
   * @return ResponseEntity with the updated TripResponse and success message.
   */
  @PutMapping("/{id}")
  @PreAuthorize("hasRole('TRANSIT_ADMIN')")
  public ResponseEntity<ApiResponse> updateTrip(@PathVariable Long id, @Valid @RequestBody TripUpdateRequest tripUpdateRequest) { // Changed DTO type
    TripResponse updatedTrip = tripService.updateTrip(id, tripUpdateRequest); // Delegate to service
    return ResponseEntity.ok(new ApiResponse(true, "Trip updated successfully.", updatedTrip));
  }

  /**
   * Deletes a Trip by its ID.
   * Accessible only by TRANSIT_ADMIN.
   *
   * @param id The ID of the trip to delete.
   * @return ResponseEntity with success message.
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('TRANSIT_ADMIN')")
  public ResponseEntity<ApiResponse> deleteTrip(@PathVariable Long id) {
    tripService.deleteTrip(id); // Delegate to service
    return ResponseEntity.ok(new ApiResponse(true, "Trip deleted successfully."));
  }
}