package edu.cit.btts.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "origin", nullable = false, length = 100)
    private String origin;

    @Column(name = "destination", nullable = false, length = 100)
    private String destination;

    @ElementCollection(fetch = FetchType.LAZY) // Stores collection of basic types
    @CollectionTable(name = "route_stops", joinColumns = @JoinColumn(name = "route_id")) // Defines the join table
    @Column(name = "stop_name", length = 100) // Column in the route_stops table
    private List<String> stops = new ArrayList<>(); // Initialize to prevent NullPointerException
    
    @Column(name = "base_price", nullable = false)
    private Double basePrice; // Base fare for this route

    // A Route will have 1 Trip
    @OneToOne(mappedBy = "route", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Trip trip; // The single trip associated with this route

    public Route() {
    }

    public Route(String origin, String destination, List<String> stops, Double basePrice) {
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
        this.stops = stops != null ? new ArrayList<>(stops) : new ArrayList<>(); // Defensive copy
    }

    public Double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        // If the new trip is different from the current one, and current one exists
        if (this.trip != null && !this.trip.equals(trip)) {
            this.trip.setRoute(null); // Break the old link
        }
        this.trip = trip;
        // Ensure the new trip also knows about this route
        if (trip != null && (trip.getRoute() == null || !trip.getRoute().equals(this))) {
            trip.setRoute(this);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Route route = (Route) o;
        return Objects.equals(id, route.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Route{" +
                "id=" + id +
                ", origin='" + origin + '\'' +
                ", destination='" + destination + '\'' +
                ", basePrice=" + basePrice +
                ", stops=" + stops +
                '}';
    }
}