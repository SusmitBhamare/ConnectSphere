package com.gather.message.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.connection.Message;
import org.springframework.stereotype.Component;


@Component
public class MessageListener implements org.springframework.data.redis.connection.MessageListener {

    Logger logger = LoggerFactory.getLogger(MessageListener.class);

    @Override
    public void onMessage(Message message, byte[] pattern) {
        logger.info("Received message:{}  from pattern: {}", new String(message.getBody()), new String(pattern));
        String channel = new String(message.getChannel());
        String body = new String(message.getBody());
        System.out.println("Received message from topic: " + channel + " with body: " + body);
    }
}
