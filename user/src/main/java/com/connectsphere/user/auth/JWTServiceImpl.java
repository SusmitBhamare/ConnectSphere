package com.connectsphere.user.auth;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import com.connectsphere.user.service.impl.TokenRedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;


@Service
@RequiredArgsConstructor
public class JWTServiceImpl implements JWTService{

  private final TokenRedisService redisService;
  @Value("${jwt.secret}")
  private String secret;

  private final TokenRedisService service;

  private static final long JWT_EXPIRATION = 1000 * 60 * 60 * 10; // 10 hours


  @Override
  public String generateToken(UserDetails userDetails){
    String token = Jwts.builder().setSubject(userDetails.getUsername()).setIssuedAt(new Date(System.currentTimeMillis())).setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION)).signWith(SignatureAlgorithm.HS256, getSignKey()).compact();
    redisService.storeToken("token_" + userDetails.getUsername(), token, JWT_EXPIRATION);
    return token;
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
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token) && redisService.isTokenPresent("token_" +  userDetails.getUsername()));
  }

  private boolean isTokenExpired(String token){
    return extractClaim(token , Claims::getExpiration).before(new Date());
  }


  
}
