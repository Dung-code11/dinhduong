package org.example.backend.service;

import org.example.backend.dto.ProfileDTO;
import org.example.backend.model.Profile;
import org.example.backend.model.User;
import org.example.backend.model.VerificationToken;
import org.example.backend.repository.ProfileRepository;
import org.example.backend.repository.UserRepository;
import org.example.backend.repository.VerificationTokenRepository;
import org.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public Profile register(ProfileDTO dto){
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        User user = new User();
        user.setId(UUID.randomUUID().toString().substring(0, 10));
        System.out.print("id: "+user.getId());
        user.setUsername(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("USER");
        user.setProvider("LOCAL");
        user.setProviderId(null);
        userRepository.save(user);

        Profile profile = new Profile();
        profile.setFullname(dto.getFullName());
        profile.setDob(dto.getDob());
        profile.setGender(dto.getGender());
        profile.setAddress(dto.getAddress());
        profile.setEmail(dto.getEmail());
        profile.setConfirmed(false);
        profile.setTotalScore(0);
        profile.setUser(user);

        Profile savedProfile = profileRepository.save(profile);

        String verificationToken = UUID.randomUUID().toString();
        VerificationToken tokenEntity = new VerificationToken(verificationToken, user);
        verificationTokenRepository.save(tokenEntity);
        sendVerificationEmail(user.getUsername(), verificationToken);

        return savedProfile;
    }

    private void sendVerificationEmail(String toEmail, String token) {
        String verifyUrl = "http://localhost:8080/api/auth/verify?token=" + token;
        String subject = "Xác thực tài khoản";
        String body = "Chào bạn,\n\nVui lòng bấm vào link dưới đây để xác thực tài khoản:\n" + verifyUrl;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
