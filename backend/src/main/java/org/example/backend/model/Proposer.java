package org.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "nguoi_de_xuat")
public class Proposer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trinh_do_hoc_van")
    private String education;

    @Column(name = "nghe_nghiep")
    private String major;

    @Column(name = "don_vi_cong_tac")
    private String unit;

    @Column(name = "vi_tri_cong_tac")
    private String position;

    @Column(name = "linh_vuc_cong_tac")
    private String field;

    @Column(name = "so_dien_thoai",length = 10)
    private int phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "Trang_thai_ho_so", columnDefinition = "ENUM('USER','USERPRO','ADMIN','SUPERADMIN')")
    private Trangthai status;

    @OneToOne
    @JoinColumn(name = "nguoi_dung_id", referencedColumnName = "id", nullable = false)
    private User user;

    public enum Trangthai{
        USER,USERPRO,ADMIN,SUPERADMIN
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public int getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(int phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Trangthai getStatus() {
        return status;
    }

    public void setStatus(Trangthai status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
