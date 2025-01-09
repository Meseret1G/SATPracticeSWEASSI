package com.example.satPractice.config;

import com.example.satPractice.service.JwtService;
import com.example.satPractice.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    @Lazy
    private UserService userService;

    private final HandlerExceptionResolver handlerExceptionResolver;

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            // Log request headers and cookies for debugging 
            logger.info("Request Headers:");
            request.getHeaderNames().asIterator().forEachRemaining(headerName -> {
                logger.info("{}: {}", headerName, request.getHeader(headerName));
            });

            if (request.getCookies() != null) {
                for (var cookie : request.getCookies()) {
                    logger.info("Cookie: {} = {}", cookie.getName(), cookie.getValue());
                }
            }

            String authHeader = request.getHeader("Authorization");
            String token = null;
            String userName = null;

            // Extract token from Authorization header or cookies
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                userName = jwtService.extractUsername(token);
            } else if (request.getCookies() != null) {
                for (var cookie : request.getCookies()) {
                    if (cookie.getName().equals("jwt")) {
                        token = cookie.getValue();
                        userName = jwtService.extractUsername(token);
                        break;
                    }
                }
            }

            logger.info("Extracted username: {}", userName);
            logger.info("Token: {}", token);

            // If a username is found and authentication is not set, proceed with authentication
            if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails user = userService.loadUserByUsername(userName);

                // Validate token
                jwtService.validateToken(token, user);  // This will throw an exception if the token is invalid

                // Convert the roles list to a list of SimpleGrantedAuthority
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                for (String role : jwtService.extractRoles(token)) {
                    authorities.add(new SimpleGrantedAuthority(role));
                }

                // Create authentication token with authorities 
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user, null, authorities);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                logger.info("Authentication successful for user: {}", userName);
            }

            filterChain.doFilter(request, response); // Continue filter chain
        } catch (ExpiredJwtException e) {
            logger.warn("Token expired for user: {}", e.getClaims().getSubject());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token expired. Please log in again.");
        }
        catch (JwtException e) {
            logger.error("Authentication failed: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token. Please log in again.");
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("An unexpected error occurred.");
        }
    }
}
