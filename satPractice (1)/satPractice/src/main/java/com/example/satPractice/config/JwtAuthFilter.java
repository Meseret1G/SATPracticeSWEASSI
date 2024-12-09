package com.example.satPractice.config;

import com.example.satPractice.service.JwtService;
import com.example.satPractice.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    @Lazy
    private UserService userService;

    private final HandlerExceptionResolver handlerExceptionResolver;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            System.out.println("Request Headers:");
            request.getHeaderNames().asIterator().forEachRemaining(headerName -> {
                System.out.println(headerName + ": " + request.getHeader(headerName));
            });

            if (request.getCookies() != null) {
                for (var cookie : request.getCookies()) {
                    System.out.println("Cookie: " + cookie.getName() + " = " + cookie.getValue());
                }
            }

            String authHeader = request.getHeader("Authorization");
            String token = null;
            String userName = null;

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

            System.out.println("Extracted username: " + userName);
            System.out.println("Token: " + token);

            if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails user = userService.loadUserByUsername(userName);
                if (Boolean.TRUE.equals(jwtService.validateToken(token, user))) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user, null, new ArrayList<>());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    System.out.println("Authentication successful for user: " + userName);
                } else {
                    System.out.println("Invalid token for user: " + userName);
                }
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            System.err.println("Authentication failed: " + e.getMessage());
            handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }
}