package com.example.satPractice.service;

import com.example.satPractice.repository.RoleRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.example.satPractice.service.TokenBlacklistService;
import javax.crypto.SecretKey;
import java.util.*;

@Service
public class JwtService {

    private String secretkey="RsIkrRmsRWRJDeRkzuyT8Xn6SJOWw/97PXlrxwgw8mE=";

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    public void validateToken(String token, UserDetails userDetails) throws JwtException {
        if (tokenBlacklistService.isTokenBlacklisted(token)) {
            logger.warn("Token is blacklisted: {}", token);
            throw new JwtException("Token is blacklisted");
        }

        String username = extractUsername(token);
        Date expiration = extractExpiration(token);

        // Token is invalid if the username does not match or the expiration date has passed
        if (!username.equals(userDetails.getUsername()) || expiration.before(new Date())) {
            logger.warn("Token has expired or is invalid: {}", token);
            throw new JwtException("Token has expired or is invalid");
        }
    }

    private Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String generateToken(String username, Set<String> roles) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", new ArrayList<>(roles));
        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*60*24))
                .signWith(SignatureAlgorithm.HS256, secretkey)
                .compact();

        logger.info("Generated JWT token for user: {}", username);
        return token;
    }

    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("roles", List.class);
    }


    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            logger.error("JWT validation failed: {}", e.getMessage());
            throw e;
        }
    }

    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretkey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
