package com.gather.message.util;


import com.gather.message.auth.JWTUtil;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;

@RequiredArgsConstructor
public class TokenUtility {

    @Getter
    private static String storedToken;
    private static void setToken(String token){
        storedToken = token;
    }
    private static final Logger log = LoggerFactory.getLogger(TokenUtility.class);

    public static void storeToken(SimpMessageHeaderAccessor accessor) {
        String authorization = accessor.getFirstNativeHeader("Authorization");
        if(authorization == null){
            log.info("Token not present");
            return;
        }
        String token = authorization.substring(7);
        setToken(token);
        if(storedToken.equals(token)){
            log.info("Token present " + token);
            return;
        }
        log.info("Token not present so stored now " + token);
        setToken(token);
    }
}
