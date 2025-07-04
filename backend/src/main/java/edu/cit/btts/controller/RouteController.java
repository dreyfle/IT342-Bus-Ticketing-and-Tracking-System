package edu.cit.btts.controller;

import edu.cit.btts.dto.ApiResponse;
import edu.cit.btts.dto.RouteDTO;
import edu.cit.btts.service.RouteService; // Import the new RouteService
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService; // Inject the RouteService

    // Constructor Injection for RouteService
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    /**
     * Creates a new Route.
     * Accessible only by TRANSIT_ADMIN.
     *
     * @param routeDTO The Route data to create.
     * @return ResponseEntity with the created RouteDTO and success message.
     */
    @PostMapping
    @PreAuthorize("hasRole('TRANSIT_ADMIN')")
    public ResponseEntity<ApiResponse> createRoute(@Valid @RequestBody RouteDTO routeDTO) {
        RouteDTO createdRoute = routeService.createRoute(routeDTO); // Delegate to service
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Route created successfully.", createdRoute));
    }

    /**
     * Retrieves all Routes.
     * Accessible by TRANSIT_ADMIN and TICKET_STAFF.
     *
     * @return List of RouteDTOs.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF', 'PASSENGER')") // Allowing passengers to view routes
    public ResponseEntity<List<RouteDTO>> getAllRoutes() {
        List<RouteDTO> routes = routeService.getAllRoutes(); // Delegate to service
        return ResponseEntity.ok(routes);
    }

    /**
     * Retrieves a Route by its ID.
     * Accessible by TRANSIT_ADMIN and TICKET_STAFF.
     *
     * @param id The ID of the route to retrieve.
     * @return RouteDTO if found.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF', 'PASSENGER')") // Allowing passengers to view routes
    public ResponseEntity<RouteDTO> getRouteById(@PathVariable Long id) {
        RouteDTO route = routeService.getRouteById(id); // Delegate to service
        return ResponseEntity.ok(route);
    }

    /**
     * Updates an existing Route.
     * Accessible only by TRANSIT_ADMIN.
     *
     * @param id The ID of the route to update.
     * @param routeDTO The updated Route data.
     * @return ResponseEntity with the updated RouteDTO and success message.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TRANSIT_ADMIN')")
    public ResponseEntity<ApiResponse> updateRoute(@PathVariable Long id, @Valid @RequestBody RouteDTO routeDTO) {
        RouteDTO updatedRoute = routeService.updateRoute(id, routeDTO); // Delegate to service
        return ResponseEntity.ok(new ApiResponse(true, "Route updated successfully.", updatedRoute));
    }

    /**
     * Deletes a Route by its ID.
     * Accessible only by TRANSIT_ADMIN.
     *
     * @param id The ID of the route to delete.
     * @return ResponseEntity with success message.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TRANSIT_ADMIN')")
    public ResponseEntity<ApiResponse> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id); // Delegate to service
        return ResponseEntity.ok(new ApiResponse(true, "Route deleted successfully."));
    }
}