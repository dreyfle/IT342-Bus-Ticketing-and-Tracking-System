package edu.cit.btts.repository;

import edu.cit.btts.model.Bus;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
  Optional<Bus> findByPlateNumber(String plateNumber);
}