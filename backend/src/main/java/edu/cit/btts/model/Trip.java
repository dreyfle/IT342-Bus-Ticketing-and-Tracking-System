package edu.cit.btts.model;

import jakarta.persistence.*;
import java.time.LocalDateTime; // Use LocalDateTime for date and time
import java.util.Objects;
import java.util.Set; // For one-to-many relationship with Seat and Ticket

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;

    @Enumerated(EnumType.STRING) // Store enum name as string in DB
    @Column(name = "status", nullable = false, length = 20)
    private TripStatus status;

    // Relationships:
    
    // A Trip will use only one Bus
    @ManyToOne(fetch = FetchType.LAZY) // Lazy fetching for performance
    @JoinColumn(name = "bus_id", nullable = false) // Foreign key column
    private Bus bus;

    // A Trip will have only 1 Route
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", unique = true, nullable = false) // Foreign key to Route, must be unique
    private Route route;

    // A Trip will have multiple Seats
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Seat> seats;

    // A Trip will have multiple Tickets
    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Ticket> tickets;


    public Trip() {
        this.status = TripStatus.SCHEDULED; // Default status
    }

    public Trip(LocalDateTime departureTime, Bus bus, Route route) {
        this.departureTime = departureTime;
        this.status = TripStatus.SCHEDULED; // Default status for new trips
        this.bus = bus;
        this.route = route;
        // Crucially, set the inverse side here
        if (this.route != null) {
            this.route.setTrip(this);
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public TripStatus getStatus() {
        return status;
    }

    public void setStatus(TripStatus status) {
        this.status = status;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        // If the new route is different from the current one, and current one exists
        if (this.route != null && !this.route.equals(route)) {
            this.route.setTrip(null); // Break the old link
        }
        this.route = route;
        // Ensure the new route also knows about this trip
        if (route != null && (route.getTrip() == null || !route.getTrip().equals(this))) {
            route.setTrip(this); // Ensure the inverse side is set
        }
    }

    public Set<Seat> getSeats() {
        return seats;
    }

    public void setSeats(Set<Seat> seats) {
        this.seats = seats;
    }

    public Set<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(Set<Ticket> tickets) {
        this.tickets = tickets;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Trip trip = (Trip) o;
        return Objects.equals(id, trip.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Trip{" +
                "id=" + id +
                ", departureTime=" + departureTime +
                ", status=" + status +
                '}';
    }
}