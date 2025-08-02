package com.connectsphere.user.auth;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.connectsphere.user.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JWTAuthFilter extends OncePerRequestFilter{
  
  private final JWTService jwtService;
  private final UserService userService;
  
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        final String jwt;

        if(username == null && (authorizationHeader == null || !authorizationHeader.startsWith("Bearer "))){
          filterChain.doFilter(request, response);
          return;
        }

        jwt = authorizationHeader.substring(7);
        username = jwtService.extractUsername(jwt);

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
          UserDetails userDetails = userService.userDetailsService().loadUserByUsername(username);
          if(jwtService.isTokenValid(jwt, userDetails)){
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            System.out.println(userDetails.getAuthorities());
            token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            context.setAuthentication(token);
            SecurityContextHolder.setContext(context);
          }
        }

        filterChain.doFilter(request, response);
  }

}
