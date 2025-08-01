package com.connectsphere.user.service.impl;

import com.connectsphere.user.entity.User;
import com.connectsphere.user.repository.UserRepository;
import com.connectsphere.user.service.UtilService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UtilServiceImpl implements UtilService {

    private final UserRepository userRepository;

    @Override
    public User getUser(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}

