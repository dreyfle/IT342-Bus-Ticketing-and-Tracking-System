package edu.cit.btts.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RouteDTO {

    private Long id; // Nullable for creation, non-null for update

    @NotBlank(message = "Origin cannot be empty")
    @Size(max = 100, message = "Origin cannot exceed 100 characters")
    private String origin;

    @NotBlank(message = "Destination cannot be empty")
    @Size(max = 100, message = "Destination cannot exceed 100 characters")
    private String destination;

    @NotEmpty(message = "Stops list cannot be empty") // Ensure the list is not empty
    @Size(max = 10, message = "Maximum 10 stops allowed") // Example: Limit number of stops
    // Add @Size to individual elements if needed: @Size(max=50, message="Stop name too long")
    private List<String> stops = new ArrayList<>(); // Changed to List<String>
    
    @NotNull(message = "Base price cannot be null")
    @Min(value = 0, message = "Base price must be a non-negative value")
    private Double basePrice; // Renamed field
    
    public RouteDTO() {
    }

    public RouteDTO(Long id, String origin, String destination, List<String> stops, Double basePrice) {
        this.id = id;
        this.origin = origin;
        this.destination = destination;
        this.stops = stops != null ? new ArrayList<String>(stops) : new ArrayList<String>();
        this.basePrice = basePrice;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public List<String> getStops() {
        return stops;
    }

    public void setStops(List<String> stops) {
        this.stops = stops != null ? new ArrayList<String>(stops) : new ArrayList<String>();
    }

    public Double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }
}