package edu.cit.btts.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.btts.dto.ApiResponse;
import edu.cit.btts.dto.UpdateRoleRequest;
import edu.cit.btts.dto.UserDTO;
import edu.cit.btts.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserController {
  private final UserService userService;

  // Constructor for UserService
  public UserController(UserService userService) {
    this.userService = userService;
  }

  /**
   * Retrieves all user accounts.
   * Accessible only by TRANSIT_ADMIN and TICKET_STAFF roles.
   *
   * @return A ResponseEntity with a list of UserDTOs.
   */
  @GetMapping // Maps to GET /api/users
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN')") // Restrict access
  public ResponseEntity<ApiResponse> getAllUsers() {
    List<UserDTO> users = userService.getAllUsers();
    return ResponseEntity.ok(new ApiResponse(true, "All users retrieved successfully.", users));
  }

  @PutMapping("/role")
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF', 'PASSENGER')")
  public ResponseEntity<ApiResponse> updateRoleByEmail(@Valid @RequestBody UpdateRoleRequest request) {
    boolean isUpdated = userService.updateRoleByEmail(request.getEmail(), request.getRole());
    
    return isUpdated 
      ? ResponseEntity.status(HttpStatus.OK).body(new ApiResponse(true, "User role updated successfully."))
      : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, "User role update failed."));
  }

  @PutMapping("/{id}") // Changed endpoint path variable to {id}
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF', 'PASSENGER')")
  public ResponseEntity<ApiResponse> updateUserDetails(@PathVariable Long id, 
                                                        @Valid @RequestBody UserDTO userDTO) {
    UserDTO updatedUser = userService.updateUserDetails(id, userDTO);
    return ResponseEntity.ok(new ApiResponse(true, "User details updated successfully.", updatedUser));
  }

  /**
   * Deletes a User by its ID.
   * Accessible only by TRANSIT_ADMIN.
   *
   * @param id The ID of the User to delete.
   * @return ResponseEntity with success message.
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('TRANSIT_ADMIN')")
  public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
    userService.deleteUser(id); // Delegate to service
    return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully."));
  }
}
