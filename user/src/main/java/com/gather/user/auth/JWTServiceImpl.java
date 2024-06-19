package com.gather.user.auth;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;


@Service
public class JWTServiceImpl implements JWTService{

  @Value("${jwt.secret}")
  private String secret;

  @Override
  public String generateToken(UserDetails userDetails){
    return Jwts.builder().setSubject(userDetails.getUsername()).setIssuedAt(new Date(System.currentTimeMillis())).setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)).signWith(SignatureAlgorithm.HS256, getSignKey()).compact();
  }

  @Override
  public String generateRefreshToken(Map<String, Object> extraClaims, UserDetails userDetails) {
    return Jwts.builder().setClaims(extraClaims).setSubject(userDetails.getUsername()).setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + 604800000))
        .signWith(SignatureAlgorithm.HS256, getSignKey()).compact();
  }

  private Key getSignKey(){
    byte[] key = Decoders.BASE64.decode(secret);
    return Keys.hmacShaKeyFor(key);
  }

  @Override
  public String extractUsername(String token){
    return extractClaim(token, Claims::getSubject);
  }

  private <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token){
    return Jwts.parser().setSigningKey(getSignKey()).parseClaimsJws(token).getBody();
  }

  @Override
  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }

  private boolean isTokenExpired(String token){
    return extractClaim(token , Claims::getExpiration).before(new Date());
  }


  
}
