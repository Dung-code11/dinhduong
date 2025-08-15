package org.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ho_so_ca_nhan")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ho_ten", length = 255)
    private String fullname;

    @Column(name = "ngay_sinh")
    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    @Column(name = "gioi_tinh", columnDefinition = "ENUM('NAM','NU')")
    private GioiTinh gender;

    @Column(name = "dia_chi", length = 255)
    private String address;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "da_xac_thuc")
    private Boolean isConfirmed;

    @Column(name = "tong_diem")
    private Integer totalScore;

    @OneToOne
    @JoinColumn(name = "nguoi_dung_id", referencedColumnName = "id", nullable = false)
    private User user;

    public enum GioiTinh {
        NAM, NU
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public GioiTinh getGender() {
        return gender;
    }

    public void setGender(GioiTinh gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public Boolean getConfirmed() {
        return isConfirmed;
    }

    public void setConfirmed(Boolean confirmed) {
        isConfirmed = confirmed;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
