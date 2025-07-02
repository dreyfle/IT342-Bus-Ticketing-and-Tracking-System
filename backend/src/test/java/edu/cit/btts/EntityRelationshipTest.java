package edu.cit.btts;

import edu.cit.btts.model.*;
import edu.cit.btts.repository.*;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class EntityRelationshipTest {

    @Autowired private BusRepository busRepository;
    @Autowired private RouteRepository routeRepository;
    @Autowired private TripRepository tripRepository;
    @Autowired private SeatRepository seatRepository;
    @Autowired private TicketRepository ticketRepository;
    @Autowired private UserRepository userRepository;

    @Autowired private EntityManager entityManager;

    @Test
    @Transactional
    void testAllEntityRelationships() {
        System.out.println("\n--- Starting Entity Relationship Test ---");

        // --- 1. Create and Save User (for Ticket) ---
        System.out.println("\n--- 1. Creating and Saving a User ---");
        User testUser = new User("test.user@example.com", "Test", "User", Role.PASSENGER);
        testUser = userRepository.save(testUser);
        assertNotNull(testUser.getId(), "User should have an ID after saving.");
        System.out.println("Saved User: " + testUser);


        // --- 2. Create and Save Bus ---
        System.out.println("\n--- 2. Creating and Saving a Bus ---");
        Bus bus = new Bus("PLATE123", "Citibus 1", "Cit Express", 10, 4, "1,2,3,4,5,6,7,8,9,10", "A,B,C,D");
        bus = busRepository.save(bus);
        assertNotNull(bus.getId(), "Bus should have an ID after saving.");
        System.out.println("Saved Bus: " + bus);

        // --- 3. Create and Save Route ---
        System.out.println("\n--- 3. Creating and Saving a Route ---");
        Route route = new Route("Cebu City", "Manila", "Ormoc, Tacloban", 1500.00);
        route = routeRepository.save(route);
        assertNotNull(route.getId(), "Route should have an ID after saving.");
        System.out.println("Saved Route: " + route);


        // --- 4. Create and Save Trip (linking Bus and Route) ---
        System.out.println("\n--- 4. Creating and Saving a Trip ---");
        LocalDateTime departureTime = LocalDateTime.now().plusHours(2);

        Trip trip = new Trip(departureTime, bus, route);

        trip = tripRepository.save(trip);
        assertNotNull(trip.getId(), "Trip should have an ID after saving.");
        System.out.println("Saved Trip: " + trip);
        System.out.println("Trip's Bus (name): " + trip.getBus().getName());
        System.out.println("Trip's Route (origin): " + trip.getRoute().getOrigin());

        entityManager.flush();
        entityManager.clear();
        System.out.println("Flushed EntityManager and cleared context for fresh fetch.");


        // --- 4a. Verifying Route's One-to-One Trip association ---
        System.out.println("\n--- 4a. Verifying Route's One-to-One Trip association ---");
        Optional<Route> fetchedRouteOptional = routeRepository.findById(route.getId());
        assertTrue(fetchedRouteOptional.isPresent(), "Fetched Route should be present.");
        Route fetchedRoute = fetchedRouteOptional.get();
        assertNotNull(fetchedRoute.getTrip(), "Fetched Route should have an associated Trip.");
        assertEquals(trip.getId(), fetchedRoute.getTrip().getId(), "Route's trip ID should match the saved trip ID.");
        System.out.println("Route '" + fetchedRoute.getOrigin() + " to " + fetchedRoute.getDestination() + "' is linked to Trip ID: " + fetchedRoute.getTrip().getId());


        // --- 5. Create and Save Seats (linking to Trip) ---
        System.out.println("\n--- 5. Creating and Saving Seats for the Trip ---");
        Trip refreshedTripForSeats = tripRepository.findById(trip.getId()).get();

        Set<Seat> seats = new HashSet<>();
        Seat seat1 = new Seat(1, 1, refreshedTripForSeats);
        Seat seat2 = new Seat(1, 2, refreshedTripForSeats);
        Seat seat3 = new Seat(2, 1, refreshedTripForSeats);

        seat1 = seatRepository.save(seat1);
        seat2 = seatRepository.save(seat2);
        seat3 = seatRepository.save(seat3);

        assertNotNull(seat1.getId(), "Seat 1 should have an ID.");
        assertNotNull(seat2.getId(), "Seat 2 should have an ID.");
        assertNotNull(seat3.getId(), "Seat 3 should have an ID.");

        System.out.println("Saved 3 Seats for Trip ID: " + refreshedTripForSeats.getId());
        System.out.println("Seat 1: " + seat1.getRowPosition() + ", " + seat1.getColumnPosition() + ", Status: " + seat1.getStatus());

        entityManager.flush();
        entityManager.clear();
        System.out.println("Flushed EntityManager and cleared context after saving seats.");

        Trip fetchedTripAfterSeats = tripRepository.findById(trip.getId()).get();
        assertEquals(3, fetchedTripAfterSeats.getSeats().size(), "Trip should have 3 seats.");
        System.out.println("Fetched Trip ID " + fetchedTripAfterSeats.getId() + " has " + fetchedTripAfterSeats.getSeats().size() + " seats after refresh.");


        // --- 6. Create and Save a Ticket (linking to Seat, Trip, and User) ---
        System.out.println("\n--- 6. Creating and Saving a Ticket ---");
        Seat refreshedSeat1ForTicket = seatRepository.findById(seat1.getId()).get();
        Trip refreshedTripForTicket = tripRepository.findById(trip.getId()).get();

        Double ticketFare = route.getPricing();
        String dropOffLocation = "Tacloban";
        Ticket ticket = new Ticket(refreshedSeat1ForTicket, refreshedTripForTicket, ticketFare, dropOffLocation, testUser);
        ticket = ticketRepository.save(ticket);
        assertNotNull(ticket.getId(), "Ticket should have an ID.");
        System.out.println("Saved Ticket: " + ticket);
        System.out.println("Ticket's Seat ID: " + ticket.getSeat().getId());
        System.out.println("Ticket's Trip ID: " + ticket.getTrip().getId());
        System.out.println("Ticket's User Email: " + ticket.getUser().getEmail());

        refreshedSeat1ForTicket.setStatus(SeatStatus.BOOKED);
        seatRepository.save(refreshedSeat1ForTicket);
        System.out.println("Updated Seat " + refreshedSeat1ForTicket.getId() + " status to: " + refreshedSeat1ForTicket.getStatus());

        entityManager.flush();
        entityManager.clear();
        System.out.println("Flushed EntityManager and cleared context before verifying Seat's Ticket.");

        System.out.println("\n--- 6a. Verifying Seat's One-to-One Ticket association ---");
        Optional<Seat> fetchedSeatOptional = seatRepository.findById(refreshedSeat1ForTicket.getId());
        assertTrue(fetchedSeatOptional.isPresent(), "Fetched Seat should be present.");
        Seat fetchedSeat = fetchedSeatOptional.get();
        assertNotNull(fetchedSeat.getTicket(), "Fetched Seat should have an associated Ticket.");
        assertEquals(ticket.getId(), fetchedSeat.getTicket().getId(), "Seat's ticket ID should match the saved ticket ID.");
        System.out.println("Seat " + fetchedSeat.getId() + " is linked to Ticket ID: " + fetchedSeat.getTicket().getId());


        // --- 7. Test Cascading Deletes ---
        System.out.println("\n--- 7. Testing Cascading Deletes ---");
        Long tripIdToDelete = trip.getId();
        Long ticketIdToDelete = ticket.getId();
        Long seat1IdToDelete = seat1.getId();
        Long seat2IdToDelete = seat2.getId();
        Long seat3IdToDelete = seat3.getId();
        Long userId = testUser.getId();
        Long routeIdToKeep = route.getId(); // Keep route ID to verify it exists

        System.out.println("Attempting to delete Trip with ID: " + tripIdToDelete);
        tripRepository.deleteById(tripIdToDelete);
        System.out.println("Trip deleted. Checking if associated entities are removed...");

        entityManager.flush();
        entityManager.clear();

        assertFalse(tripRepository.findById(tripIdToDelete).isPresent(), "Trip should be deleted.");
        System.out.println("Trip " + tripIdToDelete + " is successfully deleted.");

        assertFalse(seatRepository.findById(seat1IdToDelete).isPresent(), "Seat 1 should be deleted due to Trip cascade.");
        assertFalse(seatRepository.findById(seat2IdToDelete).isPresent(), "Seat 2 should be deleted due to Trip cascade.");
        assertFalse(seatRepository.findById(seat3IdToDelete).isPresent(), "Seat 3 should be deleted due to Trip cascade.");
        System.out.println("All Seats associated with Trip " + tripIdToDelete + " are successfully deleted.");

        assertFalse(ticketRepository.findById(ticketIdToDelete).isPresent(), "Ticket should be deleted due to Trip cascade.");
        System.out.println("Ticket " + ticketIdToDelete + " is successfully deleted.");

        assertTrue(userRepository.findById(userId).isPresent(), "User should NOT be deleted, as Ticket is ManyToOne to User.");
        System.out.println("User " + testUser.getEmail() + " is still present (as expected).");

        // --- CORRECTED ASSERTION FOR ROUTE ---
        // Route should NOT be deleted when Trip is deleted, because the Trip owns the FK
        // and doesn't cascade removal to the Route itself. The Route just becomes unreferenced.
        assertTrue(routeRepository.findById(routeIdToKeep).isPresent(), "Route should NOT be deleted when Trip is deleted.");
        System.out.println("Route " + routeIdToKeep + " is still present (as expected, since Trip doesn't cascade delete to Route).");


        System.out.println("\n--- Entity Relationship Test Completed Successfully! ---");
    }
}