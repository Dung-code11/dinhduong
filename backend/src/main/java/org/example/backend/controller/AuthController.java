package org.example.backend.controller;

import org.example.backend.dto.ProfileDTO;
import org.example.backend.dto.UserDTO;
import org.example.backend.model.Profile;
import org.example.backend.model.VerificationToken;
import org.example.backend.repository.ProfileRepository;
import org.example.backend.repository.VerificationTokenRepository;
import org.example.backend.security.JwtUtil;
import org.example.backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.example.backend.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JwtUtil jwtUtil;

    private final VerificationTokenRepository tokenRepository;
    private final ProfileRepository profileRepository;

    public AuthController(VerificationTokenRepository tokenRepository, ProfileRepository profileRepository) {
        this.tokenRepository = tokenRepository;
        this.profileRepository = profileRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO request) {
        String token = userService.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok().body(token);
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody ProfileDTO profileDTO) {
        profileService.register(profileDTO);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    @GetMapping("/verify")
    public String verifyAccount(@RequestParam String token) {
        VerificationToken vt = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ"));

        if (vt.isExpired()) {
            throw new RuntimeException("Token đã hết hạn");
        }

        Profile profile = profileRepository.findByUserId(vt.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy profile"));

        // Cập nhật trạng thái xác thực
        profile.setConfirmed(true);
        profileRepository.save(profile);

        // Xóa token sau khi xác thực để tránh dùng lại
        tokenRepository.delete(vt);

        return "Tài khoản đã được xác thực thành công. Bạn có thể đăng nhập.";
    }

    @RestController
    @RequestMapping("/api/auth")
    public class GoogleAuthController {

        @GetMapping("/google-success")
        public String success(OAuth2AuthenticationToken authentication) {
            Map<String, Object> attributes = authentication.getPrincipal().getAttributes();
            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");

            // Nếu user chưa tồn tại -> tạo mới
            // Nếu đã có -> trả JWT hoặc session

            return "Đăng nhập thành công với email: " + email + ", tên: " + name;
        }
    }

}
