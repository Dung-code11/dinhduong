package org.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "nguoi_dung")
public class User {

    @Id
    @Column(name = "id", length = 36, nullable = false, unique = true)
    private String id;

    @Column(name = "ten_dang_nhap", nullable = false, length = 100, unique = true)
    private String username;

    @Column(name = "mat_khau", length = 100, nullable = false)
    private String password;

    @Column(name = "vai_tro", length = 50, nullable = false)
    private String role;

    @Column(name = "kenh")
    private String provider;

    @Column(name = "id_kenh")
    private String providerId;

//    private String provider;      // "local", "google", "facebook"
//    private String providerId;    // ID từ Google/Facebook

    // Constructors
    public User() {}

    public User(String id, String username, String password, String role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }
}
