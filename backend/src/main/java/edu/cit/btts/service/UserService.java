package edu.cit.btts.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.cit.btts.model.Role;
import edu.cit.btts.model.User;
import edu.cit.btts.repository.UserRepository;

@Service
public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Updates the User's role
   * 
   * @param email The email of the user whose role needs to be updated
   * @param role The new role given to the user
   * @return true if update is successful, else false
   */
  public boolean updateRoleByEmail(String email, Role role) {
    User existing_user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
            "User not found with email: " + email));

    // Only allow known roles
    if (role == Role.PASSENGER || role == Role.TICKET_STAFF || role == Role.TRANSIT_ADMIN) {
        existing_user.setRole(role);
        userRepository.save(existing_user); // <--- Save the updated user
        return true;
    } else {
        return false;
    }
  }
}
