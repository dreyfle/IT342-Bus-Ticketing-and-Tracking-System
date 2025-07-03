package edu.cit.btts.repository;

import edu.cit.btts.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // Marks this as a Spring repository component
public interface UserRepository extends JpaRepository<User, Long> {

  // Custom method to find a user by email. Spring Data JPA automatically implements this.
  Optional<User> findByEmail(String email);
  Optional<User> findByEmailIgnoreCase(String email); // Optional: for case-insensitive lookup
}
