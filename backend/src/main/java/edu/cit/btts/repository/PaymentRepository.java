package edu.cit.btts.repository;

import edu.cit.btts.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTicketId(Long ticketId);
    List<Payment> findByTicketUser_Id(Long userId);
}