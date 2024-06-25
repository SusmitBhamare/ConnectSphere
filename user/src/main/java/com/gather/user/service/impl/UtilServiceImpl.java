package com.gather.user.service.impl;

import com.gather.user.entity.User;
import com.gather.user.repository.UserRepository;
import com.gather.user.service.UtilService;
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

