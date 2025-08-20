package org.example.backend.service;

import org.example.backend.model.Profile;
import org.example.backend.model.User;
import org.example.backend.repository.ProfileRepository;
import org.example.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@Service
public class CustomOidcUserService extends OidcUserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProfileRepository profileRepository;

    private static final Logger LOGGER = LoggerFactory.getLogger(CustomOidcUserService.class);

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        LOGGER.info(">>> CustomOidcUserService.loadUser CALLED");
        OidcUser oidcUser = super.loadUser(userRequest);

        Map<String, Object> attrs = oidcUser.getAttributes();
        String email = (String) attrs.get("email");
        String providerId = (String) attrs.get("sub");

        User user = userRepository.findByProviderAndProviderId("GOOGLE", providerId)
                .orElseGet(() -> {
                    LOGGER.info("Creating new user from Google OIDC: {}", email);
                    return createUserAndProfile(email, providerId, attrs);
                });

        return new DefaultOidcUser(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole())),
                oidcUser.getIdToken(),
                oidcUser.getUserInfo()
        );
    }

    private User createUserAndProfile(String email, String providerId, Map<String,Object> attrs) {
        User user = new User();
        user.setId(UUID.randomUUID().toString().substring(0,10));
        user.setUsername(email);
        user.setProvider("GOOGLE");
        user.setProviderId(providerId);
        user.setRole("USER");
        userRepository.save(user);

        Profile profile = new Profile();
        profile.setUser(user);
        profile.setEmail(email);
        profile.setFullname((String) attrs.get("name"));
        profile.setConfirmed(true);
        profileRepository.save(profile);

        return user;
    }
}

