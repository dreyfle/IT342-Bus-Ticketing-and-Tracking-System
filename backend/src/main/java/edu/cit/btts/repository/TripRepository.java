package edu.cit.btts.repository;

import edu.cit.btts.model.Trip;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

  List<Trip> findAllByOrderByDepartureTimeAsc(); 
  // Find trips where departureTime is between startOfDay and endOfDay
  List<Trip> findByDepartureTimeBetweenOrderByDepartureTimeAsc(LocalDateTime startOfDay, LocalDateTime endOfDay);
}