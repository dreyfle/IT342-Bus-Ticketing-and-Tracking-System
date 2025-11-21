package edu.cit.btts.config;

import edu.cit.btts.service.JwtUserDetailsService;
import edu.cit.btts.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

	private final JwtUserDetailsService jwtUserDetailsService;
	private final JwtUtil jwtUtil;

	public JwtRequestFilter(JwtUserDetailsService jwtUserDetailsService, JwtUtil jwtUtil) {
		this.jwtUserDetailsService = jwtUserDetailsService;
		this.jwtUtil = jwtUtil;
	}

	@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {

    final String requestTokenHeader = request.getHeader("Authorization");

    String username = null;
    String jwtToken = null;


				System.out.println("Authorization Header: " + requestTokenHeader);
				System.out.println("Extracted Token: " + jwtToken);
				System.out.println("Extracted Username: " + username);
	
    // 🔍 Log the raw header
    System.out.println("Authorization Header: " + requestTokenHeader);

    if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
        jwtToken = requestTokenHeader.substring(7);

        // 🔍 Log the extracted token
        System.out.println("Extracted Token: " + jwtToken);

        try {
            username = jwtUtil.extractUsername(jwtToken);

            // 🔍 Log the extracted username
            System.out.println("Extracted Username: " + username);

        } catch (IllegalArgumentException e) {
            System.out.println("Unable to get JWT Token");
        } catch (ExpiredJwtException e) {
            System.out.println("JWT Token has expired");
        }
    } else {
        logger.warn("JWT Token does not begin with Bearer String");
    }

    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        UserDetails userDetails = this.jwtUserDetailsService.loadUserByUsername(username);

        // 🔍 Log the loaded user
        System.out.println("UserDetails loaded: " + userDetails.getUsername());

        if (jwtUtil.validateToken(jwtToken, userDetails)) {
            System.out.println("Token is valid ✅");

            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
        } else {
            System.out.println("Token is invalid ❌");
        }
    }

    chain.doFilter(request, response);
	}
}
