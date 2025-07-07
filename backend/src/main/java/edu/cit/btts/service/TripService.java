package edu.cit.btts.service;

import edu.cit.btts.dto.BusDTO;
import edu.cit.btts.dto.RouteDTO;
import edu.cit.btts.dto.TripCreateRequest; // New import
import edu.cit.btts.dto.TripUpdateRequest; // New import
import edu.cit.btts.dto.TripResponse; // New import (renamed from TripDTO)
import edu.cit.btts.model.Bus;
import edu.cit.btts.model.Route;
import edu.cit.btts.model.Trip;
import edu.cit.btts.model.TripStatus;
import edu.cit.btts.repository.BusRepository;
import edu.cit.btts.repository.RouteRepository;
import edu.cit.btts.repository.TicketRepository;
import edu.cit.btts.repository.TripRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {

  private final TripRepository tripRepository;
  private final BusRepository busRepository;
  private final RouteRepository routeRepository;
  private final BusService busService;
  private final RouteService routeService;
  private final TicketRepository ticketRepository;

  // Constructor Injection
  public TripService(TripRepository tripRepository,
                      BusRepository busRepository,
                      RouteRepository routeRepository,
                      BusService busService,
                      RouteService routeService,
                      TicketRepository ticketRepository) {
    this.tripRepository = tripRepository;
    this.busRepository = busRepository;
    this.routeRepository = routeRepository;
    this.busService = busService;
    this.routeService = routeService;
    this.ticketRepository = ticketRepository;
  }

  /**
   * Creates a new Trip record, creating a new Route based on provided details.
   *
   * @param tripCreateRequest The Trip and Route data from the request.
   * @return The created TripResponse.
   * @throws ResponseStatusException if Bus not found, or if Route (origin/destination) conflict.
   */
  public TripResponse createTrip(TripCreateRequest tripCreateRequest) {
    // 1. Fetch associated Bus
    Bus bus = busRepository.findById(tripCreateRequest.getBusId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Bus not found with ID: " + tripCreateRequest.getBusId()));

    // 2. Create the new Route using RouteService
    // RouteService will handle its own conflict checks (origin/destination)
    RouteDTO newRouteDTO = routeService.createRoute(tripCreateRequest.getRouteDetails());
    // Retrieve the actual Route entity that was just created (need its ID for further operations)
    // This is a bit of a workaround; ideally, routeService.createRoute would return the entity or a mapping method for it.
    // For simplicity, we'll fetch it back, or you can make a mapping method in RouteService that returns Route entity.
    Route newRoute = routeRepository.findById(newRouteDTO.getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                                "Newly created route not found."));


    // 3. Create Trip entity
    Trip trip = new Trip(tripCreateRequest.getDepartureTime(), bus, newRoute);
    // Set default status if not provided
    if (tripCreateRequest.getStatus() != null) {
      trip.setStatus(tripCreateRequest.getStatus());
    } else {
      trip.setStatus(TripStatus.SCHEDULED); // Default status
    }

    // 4. Save Trip
    Trip savedTrip = tripRepository.save(trip);

    // 5. Return DTO
    return mapEntityToDto(savedTrip);
  }

  /**
   * Retrieves all Trip records.
   *
   * @return A list of all TripResponses.
   */
  public List<TripResponse> getAllTrips() {
    List<Trip> trips = tripRepository.findAllByOrderByDepartureTimeAsc();
    return trips.stream()
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
  }

  /**
   * Retrieves all Trip records for a specific date.
   *
   * @param date The LocalDate to filter trips by.
   * @return A list of TripResponses scheduled for the given date.
   */
  public List<TripResponse> getAllTripsByDate(LocalDate date) {
      // Define the start and end of the day for the given date
      LocalDateTime startOfDay = date.atStartOfDay(); // Same as date.atTime(LocalTime.MIN)
      LocalDateTime endOfDay = date.atTime(LocalTime.MAX); // Includes the last nanosecond of the day

      List<Trip> trips = tripRepository.findByDepartureTimeBetweenOrderByDepartureTimeAsc(startOfDay, endOfDay);
      System.out.println("Trips: "+ trips);
      return trips.stream()
              .map(this::mapEntityToDto)
              .collect(Collectors.toList());
  }

  /**
   * Retrieves a single Trip record by its ID.
   *
   * @param id The ID of the trip.
   * @return The TripResponse if found.
   * @throws ResponseStatusException if the trip is not found.
   */
  public TripResponse getTripById(Long id) {
    Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Trip not found with ID: " + id));
    return mapEntityToDto(trip);
  }

  /**
   * Updates an existing Trip record.
   * It allows updating trip-specific fields and changing the associated bus or route
   * to an *existing* bus/route by their IDs. It does not create new routes.
   *
   * @param id The ID of the trip to update.
   * @param tripUpdateRequest The updated Trip data.
   * @return The updated TripResponse.
   * @throws ResponseStatusException if the trip, bus, or route not found, or if route conflicts.
   */
  public TripResponse updateTrip(Long id, TripUpdateRequest tripUpdateRequest) { // Changed DTO type
    Trip existingTrip = tripRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Trip not found with ID: " + id));

    // Update departure time if provided
    if (tripUpdateRequest.getDepartureTime() != null) {
      existingTrip.setDepartureTime(tripUpdateRequest.getDepartureTime());
    }
    // Update status if provided
    if (tripUpdateRequest.getStatus() != null) {
      existingTrip.setStatus(tripUpdateRequest.getStatus());
    }

    // Handle Bus update if busId is provided and different
    if (tripUpdateRequest.getBusId() != null && !existingTrip.getBus().getId().equals(tripUpdateRequest.getBusId())) {
      Bus newBus = busRepository.findById(tripUpdateRequest.getBusId())
              .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                      "New Bus not found with ID: " + tripUpdateRequest.getBusId()));
      existingTrip.setBus(newBus);
    }

    // Handle Route update if routeId is provided and different
    if (tripUpdateRequest.getRouteId() != null && !existingTrip.getRoute().getId().equals(tripUpdateRequest.getRouteId())) {
      Route newRoute = routeRepository.findById(tripUpdateRequest.getRouteId())
              .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                      "New Route not found with ID: " + tripUpdateRequest.getRouteId()));

      // Check if the new route is already assigned to another trip
      // And ensure it's not assigned to the current trip (which is being updated)
      if (newRoute.getTrip() != null && !newRoute.getTrip().getId().equals(existingTrip.getId())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT,
                "New Route with ID " + tripUpdateRequest.getRouteId() + " is already assigned to another Trip (ID: " + newRoute.getTrip().getId() + ").");
      }

      // Important: To prevent the old route from endlessly holding a reference
      // if Route's setTrip handles the bidirectional relationship properly,
      // this should be fine.
      existingTrip.setRoute(newRoute);
    }

    Trip updatedTrip = tripRepository.save(existingTrip);
    return mapEntityToDto(updatedTrip);
  }

  /**
   * Deletes a Trip record by its ID.
   *
   * @param id The ID of the trip to delete.
   * @throws ResponseStatusException if the trip is not found.
   */
  public void deleteTrip(Long id) {
    if (!tripRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND,
              "Trip not found with ID: " + id);
    }
    tripRepository.deleteById(id);
  }

  /**
   * Calculates the number of available seats for a given trip.
   * Formula: (Bus rowCount * Bus columnCount) - total BOOKED tickets for that trip.
   *
   * @param tripId The ID of the trip.
   * @return The number of available seats.
   * @throws ResponseStatusException if the trip or associated bus is not found.
   */
  public Integer getAvailableSeatsForTrip(Long tripId) {
    Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found with ID: " + tripId));

    if (trip.getBus() == null) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Trip " + tripId + " is not associated with a bus.");
    }

    // Get total capacity from the bus
    Integer totalCapacity = trip.getBus().getRowCount() * trip.getBus().getColumnCount();

    // Count booked tickets for this trip
    long bookedTickets = ticketRepository.countByTripId(tripId);

    return totalCapacity - (int) bookedTickets;
  }

  // --- Helper Method for Entity -> Response DTO Mapping ---
  public TripResponse mapEntityToDto(Trip trip) { // Changed return type
    if (trip == null) return null;

    BusDTO busDetails = (trip.getBus() != null) ? busService.mapEntityToDto(trip.getBus()) : null;
    RouteDTO routeDetails = (trip.getRoute() != null) ? routeService.mapEntityToDto(trip.getRoute()) : null;

    // Calculate available seats directly during mapping
    Integer availableSeats = null;
    if (trip.getId() != null && trip.getBus() != null && trip.getBus().getRowCount() != null && trip.getBus().getColumnCount() != null) {
      // You need to ensure the `bus` object is loaded before accessing its properties.
      // If FetchType.LAZY is used, this might trigger a new query or lead to LazyInitializationException
      // if not called within a transaction or with proper fetching.
      // The getAvailableSeatsForTrip method already handles the data fetching safely.
      // Call the new method to get available seats.
      availableSeats = getAvailableSeatsForTrip(trip.getId());
    }

    return new TripResponse( // Changed DTO constructor call
      trip.getId(),
      trip.getDepartureTime(),
      trip.getStatus(),
      busDetails,
      routeDetails,
      availableSeats
    );
  }
}