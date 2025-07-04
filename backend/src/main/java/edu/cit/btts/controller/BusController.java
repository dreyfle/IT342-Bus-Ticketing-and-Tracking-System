package edu.cit.btts.controller;

import edu.cit.btts.dto.ApiResponse;
import edu.cit.btts.dto.BusDTO;
import edu.cit.btts.service.BusService; // Import the new BusService
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    private final BusService busService; // Inject the BusService

    // Constructor Injection for BusService
    public BusController(BusService busService) {
        this.busService = busService;
    }

    /**
     * Creates a new Bus.
     * Accessible only by TRANSIT_ADMIN.
     *
     * @param busDTO The Bus data to create.
     * @return ResponseEntity with the created BusDTO and success message.
     */
    @PostMapping
    @PreAuthorize("hasRole('TRANSIT_ADMIN')")
    public ResponseEntity<ApiResponse> createBus(@Valid @RequestBody BusDTO busDTO) {
        BusDTO createdBus = busService.createBus(busDTO); // Delegate to service
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Bus created successfully.", createdBus));
    }

    /**
     * Retrieves all Buses.
     * Accessible by TRANSIT_ADMIN and TICKET_STAFF.
     *
     * @return List of BusDTOs.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF')")
    public ResponseEntity<List<BusDTO>> getAllBuses() {
        List<BusDTO> buses = busService.getAllBuses(); // Delegate to service
        return ResponseEntity.ok(buses);
    }

    /**
     * Retrieves a Bus by its ID.
     * Accessible by TRANSIT_ADMIN and TICKET_STAFF.
     *
     * @param id The ID of the bus to retrieve.
     * @return BusDTO if found.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF')")
    public ResponseEntity<BusDTO> getBusById(@PathVariable Long id) {
        BusDTO bus = busService.getBusById(id); // Delegate to service
        return ResponseEntity.ok(bus);
    }

    /**
     * Updates an existing Bus.
     * Accessible only by TRANSIT_ADMIN.
     *
     * @param id The ID of the bus to update.
     * @param busDTO The updated Bus data.
     * @return ResponseEntity with the updated BusDTO and success message.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TRANSIT_ADMIN')")
    public ResponseEntity<ApiResponse> updateBus(@PathVariable Long id, @Valid @RequestBody BusDTO busDTO) {
        BusDTO updatedBus = busService.updateBus(id, busDTO); // Delegate to service
        return ResponseEntity.ok(new ApiResponse(true, "Bus updated successfully.", updatedBus));
    }

    /**
     * Deletes a Bus by its ID.
     * Accessible only by TRANSIT_ADMIN.
     *
     * @param id The ID of the bus to delete.
     * @return ResponseEntity with success message.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TRANSIT_ADMIN')")
    public ResponseEntity<ApiResponse> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id); // Delegate to service
        return ResponseEntity.ok(new ApiResponse(true, "Bus deleted successfully."));
    }
}