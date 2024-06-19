package com.gather.user.auth;

import java.util.Date;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;


@Component
public class JwtUtil {
  
  @Value("${jwt.secret}")
  private String secret;

  private Claims extractAllClaims(String token){
    return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
  }

  public <T> T extractClaim(String token , Function<Claims, T> claimsResolver){
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  public String generateToken(String username){
    return createToken(username);
  }

  private String createToken(String subject){
    return Jwts.builder()
    .setSubject(subject)
    .setIssuedAt(new Date(System.currentTimeMillis()))
    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
    .signWith(SignatureAlgorithm.HS256 , secret)
    .compact();
  }

  private boolean isTokenExpired(String token){
    return extractExpiration(token).before(new Date());
  }

  public Date extractExpiration(String token){
    return extractClaim(token, Claims::getExpiration);
  }

  public Boolean validateToken(String token, String username){
    final String usernameFromToken = extractUsername(token);
    return (usernameFromToken.equals(username) && !isTokenExpired(token));
  }

  public String extractUsername(String token){
    return extractClaim(token, Claims::getSubject);
  }

}
