package edu.cit.btts.model;

public enum SeatStatus {
    OPEN,
    BOOKED,     // Means a ticket has been issued for it
    RESERVED,   // Temporarily held, e.g., during checkout process
    UNAVAILABLE // For seats that can't be used (e.g., driver's seat, broken seat)
}