package edu.cit.btts.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A Ticket will have 1 Seat only
    // A Seat will belong to 1 Ticket only
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", unique = true, nullable = false) // Foreign key to Seat, must be unique
    private Seat seat;

    // A Ticket will belong to only 1 Trip
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false) // Foreign key to Trip
    private Trip trip;

    @Column(name = "fare", nullable = false)
    private Double fare;

    @Column(name = "drop_off", nullable = false, length = 100)
    private String dropOff;

    // Optional: Link to the User who bought the ticket (assuming you have a User entity)
    // You have a User entity from previous steps. It's common to link tickets to users.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // Assuming a ticket must be linked to a user
    private User user; // Link to the User who purchased the ticket


    public Ticket() {
    }

    public Ticket(Seat seat, Trip trip, Double fare, String dropOff, User user) {
        this.seat = seat;
        this.trip = trip;
        this.fare = fare;
        this.dropOff = dropOff;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public Double getFare() {
        return fare;
    }

    public void setFare(Double fare) {
        this.fare = fare;
    }

    public String getDropOff() {
        return dropOff;
    }

    public void setDropOff(String dropOff) {
        this.dropOff = dropOff;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Ticket ticket = (Ticket) o;
        return Objects.equals(id, ticket.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Ticket{" +
                "id=" + id +
                ", fare=" + fare +
                ", dropOff='" + dropOff + '\'' +
                '}';
    }
}