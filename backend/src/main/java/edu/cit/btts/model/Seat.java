package edu.cit.btts.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "seats",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"trip_id", "row_position", "column_position"})
       }) // Ensures combination of trip, row, col is unique
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "row_position", nullable = false)
    private Integer rowPosition;

    @Column(name = "column_position", nullable = false)
    private Integer columnPosition;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private SeatStatus status;

    // A Seat will belong to 1 Trip
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false) // Foreign key column
    private Trip trip;

    // A Seat will belong to 1 Ticket only (OneToOne relationship)
    // mappedBy indicates the owning side is in the Ticket entity
    @OneToOne(mappedBy = "seat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Ticket ticket; // Will be null if not ticketed


    public Seat() {
        this.status = SeatStatus.OPEN; // Default status
    }

    public Seat(Integer rowPosition, Integer columnPosition, Trip trip) {
        this.rowPosition = rowPosition;
        this.columnPosition = columnPosition;
        this.status = SeatStatus.OPEN; // Default status for newly created seats
        this.trip = trip;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRowPosition() {
        return rowPosition;
    }

    public void setRowPosition(Integer rowPosition) {
        this.rowPosition = rowPosition;
    }

    public Integer getColumnPosition() {
        return columnPosition;
    }

    public void setColumnPosition(Integer columnPosition) {
        this.columnPosition = columnPosition;
    }

    public SeatStatus getStatus() {
        return status;
    }

    public void setStatus(SeatStatus status) {
        this.status = status;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Seat seat = (Seat) o;
        return Objects.equals(id, seat.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Seat{" +
                "id=" + id +
                ", rowPosition=" + rowPosition +
                ", columnPosition=" + columnPosition +
                ", status=" + status +
                '}';
    }
}