package edu.cit.btts.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import edu.cit.btts.dto.UserDTO;
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
   * Retrieves all User records from the database.
   *
   * @return A list of UserDTOs representing all users.
   */
  @Transactional(readOnly = true) // Mark as read-only as it's a retrieval operation
  public List<UserDTO> getAllUsers() {
    return userRepository.findAll().stream()
            .map(this::mapEntityToDto) // Map each User entity to a UserDTO
            .collect(Collectors.toList()); // Collect into a List
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

  /**
   * Updates the User's first name and last name by User ID.
   *
   * @param id The ID of the user whose name needs to be updated.
   * @param userDTO A UserDTO containing the new first name and last name.
   * Only firstName and lastName from userDTO will be used.
   * @return The updated UserDTO.
   * @throws ResponseStatusException if user not found.
   */
  @Transactional
  public UserDTO updateUserDetails(Long id, UserDTO userDTO) { // Changed String email to Long id
    User existingUser = userRepository.findById(id) // Changed findByEmail to findById
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "User not found with ID: " + id)); // Updated error message

    // Update first name if provided and different
    if (userDTO.getFirstName() != null && !userDTO.getFirstName().isBlank()) {
      existingUser.setFirstName(userDTO.getFirstName());
    }

    // Update last name if provided and different
    if (userDTO.getLastName() != null && !userDTO.getLastName().isBlank()) {
      existingUser.setLastName(userDTO.getLastName());
    }

    User updatedUser = userRepository.save(existingUser);
    return mapEntityToDto(updatedUser);
  }

  /**
   * Deletes a User record by its ID.
   *
   * @param id The ID of the User to delete.
   * @throws ResponseStatusException if the User is not found.
   */
  public void deleteUser(Long id) {
    if (!userRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND,
              "User not found with ID: " + id);
    }
    userRepository.deleteById(id);
  }

  public UserDTO mapEntityToDto(User user) {
    if (user == null) return null;
    return new UserDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole());
  }
}
