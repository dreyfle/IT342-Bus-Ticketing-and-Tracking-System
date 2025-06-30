package edu.cit.btts.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import edu.cit.btts.model.User;
import edu.cit.btts.repository.UserRepository;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

  @Value("${jwt.secret}")
  private String secret;

  @Value("${jwt.expiration}")
  private long jwtExpirationInMs;

  private final UserRepository userRepository;

  // Constructor injection for UserRepository
    public JwtUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

  // Retrieve username from jwt token
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  // Retrieve expiration date from jwt token
  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  // New: Extract roles from JWT claims
  public String extractRole(String token) {
    Claims claims = extractAllClaims(token);
    // Assuming you store roles under a claim named "role" or "roles"
    // Adjust "role" if you use a different claim name
    return claims.get("role", String.class);
  }

  // New: Extract user ID from JWT claims
  public Long extractUserId(String token) {
    Claims claims = extractAllClaims(token);
    // JWT claims are typically JSON primitive types. IDs might be stored as Integer or Long.
    // It's safer to get as Long if your User ID is Long.
    return claims.get("userId", Long.class);
  }

  // New: Extract first name from JWT claims
  public String extractFirstName(String token) {
    Claims claims = extractAllClaims(token);
    return claims.get("firstName", String.class);
  }

  // New: Extract last name from JWT claims
  public String extractLastName(String token) {
    Claims claims = extractAllClaims(token);
    return claims.get("lastName", String.class);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  // For retrieving any information from token we will need the secret key
  private Claims extractAllClaims(String token) {
    return Jwts.parser()
            .setSigningKey(getSigningKey()) // Use the key for parsing
            .build()
            .parseClaimsJws(token)
            .getBody();
  }

  // Check if the token has expired
  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  // Generate token for user
  public String generateToken(UserDetails userDetails) {
    Map<String, Object> claims = new HashMap<>();

    // Get the full User object from the database using the email
    // This is necessary to get id, firstName, lastName etc.
    User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new IllegalArgumentException("User not found for JWT generation: " + userDetails.getUsername()));

    // Add roles as a claim
    // Assuming a user has only one role for now, as per your setup (PASSENGER, TICKET_STAFF, TRANSIT_ADMIN)
    String role = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .filter(a -> a.startsWith("ROLE_")) // Ensure it's a role authority
            .map(a -> a.substring(5)) // Remove "ROLE_" prefix
            .findFirst() // Get the first role (assuming single role per user for simplicity)
            .orElse("PASSENGER"); // Default if no role found (shouldn't happen)

    claims.put("role", role); // Add the role as a claim

    // Add additional user details as claims
    claims.put("userId", user.getId());
    claims.put("firstName", user.getFirstName());
    claims.put("lastName", user.getLastName());

    return createToken(claims, userDetails.getUsername());
  }

  private String createToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
            .setClaims(claims) // Still valid for adding custom claims
            .subject(subject) // New way to set subject
            .issuedAt(new Date(System.currentTimeMillis())) // New way to set issued at
            .expiration(new Date(System.currentTimeMillis() + jwtExpirationInMs)) // New way to set expiration
            .signWith(getSigningKey()) // Only pass the Key, SignatureAlgorithm is inferred or handled internally by Keys
            .compact();
  }

  // Validate token
  public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }

  private Key getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
