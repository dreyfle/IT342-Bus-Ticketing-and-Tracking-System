package edu.cit.btts.service;

import edu.cit.btts.model.User;
import edu.cit.btts.repository.UserRepository;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class JwtUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository; // Inject UserRepository

  public JwtUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  // Method to save a user (will update if email exists due to save behavior or create new)
  public User saveUser(User user) {
    // Find by email. If exists, update. If not, save new.
    // For Google login, it's usually: if (findByEmail().isPresent()) { fetch } else { save }
    // The repository's save method acts as both insert and update.
    return userRepository.save(user);
  }

  public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(email)
      .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    // Create a GrantedAuthority from the user's role
    GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getAuthorityName());

      // Spring Security's UserDetails expects a password (even if empty for OAuth users).
      // For JWT, the password is not used after the token is issued.
    return new org.springframework.security.core.userdetails.User(
      user.getEmail(), 
      "",
      Collections.singletonList(authority)); // Empty list for authorities/roles for now
  }
}