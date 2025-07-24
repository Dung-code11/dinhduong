package org.example.backend.controller;

import org.example.backend.dto.StaffDTO;
import org.example.backend.model.Staff;
import org.example.backend.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    @Autowired
    private StaffService staffService;

    @PostMapping
    public ResponseEntity<Staff> createStaff(@RequestBody StaffDTO dto){
        return ResponseEntity.ok(staffService.createStaff(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff(){
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaff(@PathVariable Long id){
        return ResponseEntity.ok(staffService.getStaff(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable Long id, @RequestBody StaffDTO dto) {
        return ResponseEntity.ok(staffService.updateStaff(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok("Đã xóa nhân viên");
    }
}
