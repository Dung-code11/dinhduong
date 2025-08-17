package org.example.backend.controller;

import jakarta.validation.Valid;
import org.example.backend.dto.ProposerDTO;
import org.example.backend.model.Proposer;
import org.example.backend.service.ProposerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/proposer")
public class ProposerController {
    @Autowired
    private ProposerService proposerService;

    @PostMapping("/")
    public ResponseEntity<?> insert(@RequestBody @Valid ProposerDTO proposerDTO){
        Proposer proposer = proposerService.insert(proposerDTO);
        return ResponseEntity.ok("Thêm thành công " + proposer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ProposerDTO proposerDTO) {
        Proposer proposer = proposerService.update(id,proposerDTO);
        return ResponseEntity.ok("Sửa thành công "+ proposer);
    }

    @PreAuthorize("hasRole('ADMIN') && hasRole('SUPERADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> adminUpdate(@PathVariable Long id, @RequestBody ProposerDTO proposerDTO) {
        Proposer proposer = proposerService.adminUpdate(id,proposerDTO);
        return ResponseEntity.ok("Sửa thành công "+ proposer);
    }

    @GetMapping("/")
    public ResponseEntity<List<Proposer>> findAll(){
        return ResponseEntity.ok(proposerService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proposer> findById(@PathVariable Long id){
        return ResponseEntity.ok(proposerService.findById(id));
    }
}
