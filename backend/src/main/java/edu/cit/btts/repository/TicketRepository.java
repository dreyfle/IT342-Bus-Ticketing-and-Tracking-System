package edu.cit.btts.repository;

import edu.cit.btts.model.Ticket;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
  // Custom query to find tickets by a user's ID
  List<Ticket> findByUser_Id(Long userId);
}