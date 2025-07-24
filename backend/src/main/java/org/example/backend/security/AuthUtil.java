package org.example.backend.security;

import org.example.backend.service.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("authUtil")
public class AuthUtil {
    public boolean isSelf(Long id, Authentication authentication) {
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
        boolean equals = user.getId().equals(id);
        return equals;
    }
}
