package edu.cit.btts.controller;

import edu.cit.btts.dto.ApiResponse;
import edu.cit.btts.dto.SeatDTO;
import edu.cit.btts.model.SeatStatus;
import edu.cit.btts.service.SeatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Assuming you have security
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/by-trip/{tripId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'PASSENGER')") // Adjust roles as needed
    public ResponseEntity<ApiResponse> getSeatsByTripId(@PathVariable Long tripId) {
        List<SeatDTO> seats = seatService.getSeatsByTripId(tripId);
        return ResponseEntity.ok(new ApiResponse(true, "Seats for Trip ID " + tripId + " retrieved successfully.", seats));
    }
}