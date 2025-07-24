package org.example.backend.service;

import org.example.backend.dto.UserDTO;
import org.example.backend.model.User;
import org.example.backend.repository.UserRepository;
import org.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;

    public void register(UserDTO userDTO) {
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString().substring(0, 10)); // hoặc tự sinh theo logic khác
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole("CUSTOMER"); // Mặc định là CUSTOMER
        userRepository.save(user);
    }

    public String login(String username, String password) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            return jwtUtil.generateToken(userDetails);

        } catch (BadCredentialsException e) {
            System.out.println(">>> Sai mật khẩu hoặc tài khoản không tồn tại");
            throw new RuntimeException("Sai thông tin đăng nhập");
        } catch (Exception e) {
            System.out.println(">>> Lỗi khác: " + e.getMessage());
            throw new RuntimeException("Lỗi đăng nhập");
        }
    }



}
