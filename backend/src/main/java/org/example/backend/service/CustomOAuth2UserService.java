package org.example.backend.service;

import org.example.backend.model.Profile;
import org.example.backend.model.User;
import org.example.backend.repository.ProfileRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // "google" hoặc "facebook"
        Map<String, Object> attrs = oAuth2User.getAttributes();

        // Lấy providerId & email tuỳ nhà cung cấp
        String provider = registrationId.toUpperCase(); // GOOGLE / FACEBOOK
        String providerId = extractProviderId(provider, attrs);
        String email = extractEmail(provider, attrs);

        // Tìm tài khoản theo provider + providerId
        User user = userRepository.findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> createUserAndProfileFromOAuth(provider, providerId, email, attrs));

        // Có thể cập nhật profile nếu provider trả thêm thông tin mới
        updateProfileIfNeeded(user.getId(), attrs);

        // Tuỳ bạn: return DefaultOAuth2User với authorities và nameAttributeKey
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole())),
                oAuth2User.getAttributes(),
                userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName()
        );
    }

    private String extractProviderId(String provider, Map<String, Object> attrs) {
        if ("GOOGLE".equals(provider)) {
            // Google dùng "sub"
            return String.valueOf(attrs.get("sub"));
        }
        if ("FACEBOOK".equals(provider)) {
            // Facebook dùng "id"
            return String.valueOf(attrs.get("id"));
        }
        throw new IllegalArgumentException("Unsupported provider " + provider);
    }

    private String extractEmail(String provider, Map<String, Object> attrs) {
        Object email = attrs.get("email");
        return email != null ? email.toString() : null;
    }

    private User createUserAndProfileFromOAuth(String provider, String providerId, String email, Map<String, Object> attrs) {
        // Tạo User (không cần password)
        User user = new User();
        user.setId(UUID.randomUUID().toString().substring(0, 10));
        user.setUsername(email != null ? email : (provider + "_" + providerId)); // fallback nếu không có email
        user.setPassword(null);             // hoặc một chuỗi random, nhưng không dùng cho đăng nhập local
        user.setRole("USER");
        user.setProvider(provider);         // "GOOGLE"/"FACEBOOK"
        user.setProviderId(providerId);
        userRepository.save(user);

        // Tạo Profile cơ bản
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setEmail(email);
        profile.setFullname(extractName(provider, attrs));
        profile.setDob(extractDob(provider, attrs));            // đa số provider không trả DOB trừ khi xin scope
        profile.setGender(parseGender(extractGender(provider, attrs)));
        profile.setAddress(null);
        profile.setConfirmed(true);     // Đăng nhập qua OAuth coi như đã xác thực email của provider (tuỳ chính sách)
        profile.setTotalScore(0);
        profileRepository.save(profile);

        return user;
    }

    private void updateProfileIfNeeded(String userId, Map<String, Object> attrs) {
        // tuỳ nhu cầu: cập nhật tên, avatar... nếu trống
        profileRepository.findByUserId(userId).ifPresent(p -> {
            if (p.getFullname() == null) p.setFullname(extractName("ANY", attrs));
            if (p.getEmail() == null) p.setEmail((String) attrs.get("email"));
            profileRepository.save(p);
        });
    }

    private String extractName(String provider, Map<String, Object> attrs) {
        // Google: "name", Facebook: "name"
        Object name = attrs.get("name");
        return name != null ? name.toString() : null;
    }

    private LocalDate extractDob(String provider, Map<String, Object> attrs) {
        // Thường không có; nếu có thì parse theo định dạng provider trả về
        return null;
    }

    private String extractGender(String provider, Map<String, Object> attrs) {
        // Facebook có thể trả "male"/"female" nếu xin scope; Google thường không
        Object g = attrs.get("gender");
        return g != null ? g.toString() : null;
    }

    private Profile.GioiTinh parseGender(String s) {
        if (s == null || s.isBlank()) return null;
        s = s.trim().toUpperCase();
        if ("MALE".equals(s) || "NAM".equals(s)) return Profile.GioiTinh.NAM;
        if ("FEMALE".equals(s) || "NU".equals(s) || "NỮ".equals(s)) return Profile.GioiTinh.NU;
        return null;
    }

}
