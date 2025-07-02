package edu.cit.btts.repository;

import edu.cit.btts.model.Route;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
  Optional<Route> findByOriginAndDestination(String origin, String destination);
}