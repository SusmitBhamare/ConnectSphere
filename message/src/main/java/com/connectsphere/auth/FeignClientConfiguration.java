package com.connectsphere.message.auth;

import com.connectsphere.message.util.TokenUtility;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import feign.codec.Decoder;
import feign.codec.Encoder;
import feign.codec.ErrorDecoder;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


@Configuration
@RequiredArgsConstructor
public class FeignClientConfiguration {

    private static final Logger log = LoggerFactory.getLogger(FeignClientConfiguration.class);

    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate requestTemplate) {
                if (RequestContextHolder.getRequestAttributes() == null) {
                    String jwtToken = TokenUtility.getStoredToken();
                    log.info("Token: " + jwtToken);
                    if (jwtToken != null) {
                        requestTemplate.header("Authorization", "Bearer " + jwtToken);
                    }
                } else {
                    HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
                    String authorizationHeader = request.getHeader("Authorization");
                    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                        String jwtToken = authorizationHeader.substring(7);
                        requestTemplate.header("Authorization", "Bearer " + jwtToken);
                    }

                }
            }
        };
    }

}