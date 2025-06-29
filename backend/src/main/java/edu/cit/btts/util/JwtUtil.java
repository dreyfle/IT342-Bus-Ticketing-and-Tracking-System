package edu.cit.btts.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

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

  // Retrieve username from jwt token
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  // Retrieve expiration date from jwt token
  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
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
