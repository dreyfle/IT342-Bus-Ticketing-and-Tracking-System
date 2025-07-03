package edu.cit.btts.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.btts.dto.ApiResponse;
import edu.cit.btts.dto.UpdateRoleRequest;
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

  @PutMapping("/role")
  @PreAuthorize("hasAnyRole('TRANSIT_ADMIN', 'TICKET_STAFF', 'PASSENGER')")
  public ResponseEntity<ApiResponse> updateRoleByEmail(@Valid @RequestBody UpdateRoleRequest request) {
    boolean isUpdated = userService.updateRoleByEmail(request.getEmail(), request.getRole());
    
    return isUpdated 
      ? ResponseEntity.status(HttpStatus.OK).body(new ApiResponse(true, "User role updated successfully."))
      : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse(false, "User role update failed."));
  }

}
