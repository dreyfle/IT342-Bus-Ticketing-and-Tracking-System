package edu.cit.btts.repository;

import edu.cit.btts.model.Seat;
import edu.cit.btts.model.Trip;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
  // Custom method to find a seat by trip, row, and column position
  // This leverages the unique constraint you already have on the Seat entity
  Optional<Seat> findByTripAndRowPositionAndColumnPosition(Trip trip, Integer rowPosition, Integer columnPosition);
}