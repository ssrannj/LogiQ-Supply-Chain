package com.logiq.backend.service.impl;

import com.logiq.backend.dto.AuthResponse;
import com.logiq.backend.dto.LoginRequest;
import com.logiq.backend.dto.RegisterRequest;
import com.logiq.backend.model.User;
import com.logiq.backend.model.UserRole;
import com.logiq.backend.repository.UserRepository;
import com.logiq.backend.service.AuthService;
import com.logiq.backend.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return new AuthResponse(null, request.getEmail(), null, "FAILURE: Email is already registered!");
        }

        User newUser = new User();
        newUser.setFullName(request.getFullName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(UserRole.CUSTOMER);

        userRepository.save(newUser);
        
        // Generate Token on success so they are auto-logged-in for demo
        String token = JwtUtil.generateToken(newUser.getEmail(), newUser.getRole().name());

        return new AuthResponse(token, newUser.getEmail(), newUser.getRole().name(), newUser.getFullName(), "SUCCESS: Account created! You can now log in.");
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User dbUser = userRepository.findByEmail(request.getEmail());

        if (dbUser != null && passwordEncoder.matches(request.getPassword(), dbUser.getPassword())) {
            // GENERATE THE JWT TOKEN (JwtUtil expects String, String)
            String token = JwtUtil.generateToken(dbUser.getEmail(), dbUser.getRole().name());
            
            // Return with full info including Name for the demo UI
            return new AuthResponse(token, dbUser.getEmail(), dbUser.getRole().name(), dbUser.getFullName(), "SUCCESS");
        } else {
            return new AuthResponse(null, request.getEmail(), null, "FAILURE: Invalid Credentials");
        }
    }
}
