package edu.cit.btts.controller;

import edu.cit.btts.dto.AuthResponse;
import edu.cit.btts.dto.GoogleLoginRequest;
import edu.cit.btts.model.User;
import edu.cit.btts.service.GoogleTokenVerifierService;
import edu.cit.btts.service.JwtUserDetailsService;
import edu.cit.btts.util.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final GoogleTokenVerifierService googleTokenVerifierService;
  private final JwtUtil jwtUtil;
  private final JwtUserDetailsService jwtUserDetailsService;

  public AuthController(GoogleTokenVerifierService googleTokenVerifierService,
                        JwtUtil jwtUtil,
                        JwtUserDetailsService jwtUserDetailsService) {
    this.googleTokenVerifierService = googleTokenVerifierService;
    this.jwtUtil = jwtUtil;
    this.jwtUserDetailsService = jwtUserDetailsService;
  }

  @PostMapping("/google")
  public ResponseEntity<?> googleAuth(@RequestBody GoogleLoginRequest request) {
    try {
      GoogleIdToken.Payload payload = googleTokenVerifierService.verify(request.getIdToken());

      if (payload == null) {
        return ResponseEntity.status(401).body("Invalid Google ID Token.");
      }

      String email = payload.getEmail();
      String firstName = (String) payload.get("given_name");
      String lastName = (String) payload.get("family_name");

      // --- Database interaction logic ---
      Optional<User> existingUserOptional = jwtUserDetailsService.findByEmail(email);
      User user;

      if (existingUserOptional.isPresent()) {
        // User exists, fetch them
        user = existingUserOptional.get();
        System.out.println("Existing user logged in: " + email);
        // Optionally update their first/last name in case it changed on Google's side
        user.setFirstName(firstName);
        user.setLastName(lastName);
        jwtUserDetailsService.saveUser(user); // save to update
      } else {
        // New user, create and save them
        user = new User(email, firstName, lastName);
        user = jwtUserDetailsService.saveUser(user); // Save to the database
        System.out.println("New user registered: " + email);
      }

      // Generate your custom JWT for the user
      UserDetails userDetails = jwtUserDetailsService.loadUserByUsername(email);
      String token = jwtUtil.generateToken(userDetails);

      return ResponseEntity.ok(new AuthResponse(token, user));

    } catch (GeneralSecurityException | IOException e) {
      System.err.println("Error verifying Google ID Token: " + e.getMessage());
      // Log the stack trace for more detailed debugging in development
      e.printStackTrace();
      return ResponseEntity.status(500).body("Error processing Google login.");
    } catch (Exception e) { // Catch any other unexpected exceptions
      System.err.println("An unexpected error occurred during Google login: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.status(500).body("An internal server error occurred.");
    }
  }
}
