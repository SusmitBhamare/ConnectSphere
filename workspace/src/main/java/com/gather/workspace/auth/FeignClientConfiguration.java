package com.gather.workspace.auth;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignClientConfiguration {



    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate requestTemplate) {
                HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

                // Get the Authorization header (Bearer token)
                String authorizationHeader = request.getHeader("Authorization");

                if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                    // Extract the token (remove "Bearer " prefix)
                    String jwtToken = authorizationHeader.substring(7);

                    // Add the Bearer token to the Authorization header of the outgoing request
                    requestTemplate.header("Authorization", "Bearer " + jwtToken);
                }
            }
        };
    }
}
