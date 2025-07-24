package org.example.backend.controller;

import org.example.backend.dto.CustomerDTO;
import org.example.backend.dto.UserDTO;
import org.example.backend.model.User;
import org.example.backend.security.JwtUtil;
import org.example.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.example.backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO request) {
        String token = userService.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok().body(token);
    }

//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
//        userDTO.setRole("CUSTOMER");

    /// /        userService.register(userDTO);
//        customerService.insertCustomer(new CustomerDTO());
//        return ResponseEntity.ok("Đăng ký thành công!");
//    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CustomerDTO customerDTO) {
        customerService.insertCustomer(customerDTO);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

}
