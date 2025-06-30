package edu.cit.btts.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/protected")
public class ProtectedController {

  @GetMapping
  public ResponseEntity<?> getProtectedData() {
    // Get the authenticated user's details from Spring Security context
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName(); // This will be the email from our UserDetails

    Map<String, String> data = new HashMap<>();
    data.put("message", "This is protected data for " + username + "!");
    data.put("secretInfo", "Only authenticated users can see this.");
    data.put("authorities", authentication.getAuthorities().toArray()[0].toString());
    return ResponseEntity.ok(data);
  }


}
