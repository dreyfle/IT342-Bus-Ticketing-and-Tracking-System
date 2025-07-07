package edu.cit.btts.repository;

import edu.cit.btts.model.Payment;
import edu.cit.btts.model.PaymentStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTicketId(Long ticketId);
    List<Payment> findByTicketUser_Id(Long userId);
    List<Payment> findByStatusOrderByDateAsc(PaymentStatus status);
    // Find payments by their status AND associated ticket's user ID (for passenger security)
    List<Payment> findByStatusAndTicket_UserIdOrderByDateAsc(PaymentStatus status, Long userId);
}