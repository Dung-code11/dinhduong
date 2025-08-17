package org.example.backend.dto;

import lombok.Data;
import org.example.backend.model.Proposer;

@Data
public class ProposerDTO {
    private String education;
    private String major;
    private String unit;
    private String position;
    private String field;
    private int phoneNumber;
    private Proposer.Trangthai status;

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

    public Proposer.Trangthai getStatus() {
        return status;
    }

    public void setStatus(Proposer.Trangthai status) {
        this.status = status;
    }

}
