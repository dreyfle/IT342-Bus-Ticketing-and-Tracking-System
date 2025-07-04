package edu.cit.btts.service;

import edu.cit.btts.dto.RouteDTO;
import edu.cit.btts.model.Route;
import edu.cit.btts.repository.RouteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    // Constructor Injection
    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    /**
     * Creates a new Route record.
     *
     * @param routeDTO The Route data from the request.
     * @return The created RouteDTO.
     * @throws ResponseStatusException if a route with the same origin and destination already exists.
     */
    public RouteDTO createRoute(RouteDTO routeDTO) {
        // Business logic: Check for existing route with same origin and destination
        if (routeRepository.findByOriginAndDestination(routeDTO.getOrigin(), routeDTO.getDestination()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Route from '" + routeDTO.getOrigin() + "' to '" + routeDTO.getDestination() + "' already exists.");
        }

        Route route = new Route();
        mapDtoToEntity(routeDTO, route); // Map DTO fields to the new Route entity

        Route savedRoute = routeRepository.save(route); // Save to database
        return mapEntityToDto(savedRoute); // Map saved entity back to DTO for response
    }

    /**
     * Retrieves all Route records.
     *
     * @return A list of all RouteDTOs.
     */
    public List<RouteDTO> getAllRoutes() {
        List<Route> routes = routeRepository.findAll();
        return routes.stream()
                .map(this::mapEntityToDto) // Map each Route entity to a RouteDTO
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single Route record by its ID.
     *
     * @param id The ID of the route.
     * @return The RouteDTO if found.
     * @throws ResponseStatusException if the route is not found.
     */
    public RouteDTO getRouteById(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Route not found with ID: " + id));
        return mapEntityToDto(route);
    }

    /**
     * Updates an existing Route record.
     *
     * @param id The ID of the route to update.
     * @param routeDTO The updated Route data.
     * @return The updated RouteDTO.
     * @throws ResponseStatusException if the route is not found or if the new origin/destination conflicts with another route.
     */
    public RouteDTO updateRoute(Long id, RouteDTO routeDTO) {
        Route existingRoute = routeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Route not found with ID: " + id));

        // Business logic: Check for origin/destination conflict if they are being changed
        if (!existingRoute.getOrigin().equalsIgnoreCase(routeDTO.getOrigin()) ||
            !existingRoute.getDestination().equalsIgnoreCase(routeDTO.getDestination())) {

            Optional<Route> routeWithSameOriginDest = routeRepository.findByOriginAndDestination(
                                                                        routeDTO.getOrigin(),
                                                                        routeDTO.getDestination());
            if (routeWithSameOriginDest.isPresent() && !routeWithSameOriginDest.get().getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Another route from '" + routeDTO.getOrigin() + "' to '" + routeDTO.getDestination() + "' already exists.");
            }
        }

        mapDtoToEntity(routeDTO, existingRoute); // Map updated DTO fields to the existing entity

        Route updatedRoute = routeRepository.save(existingRoute); // Save changes
        return mapEntityToDto(updatedRoute); // Map updated entity back to DTO
    }

    /**
     * Deletes a Route record by its ID.
     *
     * @param id The ID of the route to delete.
     * @throws ResponseStatusException if the route is not found.
     */
    public void deleteRoute(Long id) {
        if (!routeRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Route not found with ID: " + id);
        }
        routeRepository.deleteById(id);
    }

    // --- Helper Methods for DTO <-> Entity Mapping (private to the service) ---

    // Converts a Route entity to a RouteDTO
    private RouteDTO mapEntityToDto(Route route) {
        if (route == null) return null;
        return new RouteDTO(
                route.getId(),
                route.getOrigin(),
                route.getDestination(),
                route.getStops(),
                route.getBasePrice()
        );
    }

    // Maps fields from a RouteDTO to a Route entity
    private void mapDtoToEntity(RouteDTO routeDTO, Route route) {
        // ID is not mapped from DTO to entity here as it's typically set by JPA or path variable
        route.setOrigin(routeDTO.getOrigin());
        route.setDestination(routeDTO.getDestination());
        route.setStops(routeDTO.getStops());
        route.setBasePrice(routeDTO.getBasePrice());
        // Note: Trip is intentionally not mapped here. Route to Trip is a OneToOne, typically managed from Trip side
        // or through a dedicated method if a Route can *assign* a Trip directly.
        // For simplicity, we assume trips are managed separately or linked after route creation.
    }
}