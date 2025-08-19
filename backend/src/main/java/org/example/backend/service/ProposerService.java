package org.example.backend.service;

import org.example.backend.dto.ProposerDTO;
import org.example.backend.model.Proposer;
import org.example.backend.model.User;
import org.example.backend.repository.ProposerRepisitory;
import org.example.backend.repository.UserRepository;
import org.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProposerService {
    @Autowired
    private ProposerRepisitory proposerRepisitory;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;

    public Proposer insert(ProposerDTO proposerDTO,String token){
        Proposer proposer = new Proposer();
        String userId = jwtUtil.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id = " + userId));
        proposer.setEducation(proposerDTO.getEducation());
        proposer.setMajor(proposerDTO.getMajor());
        proposer.setUnit(proposerDTO.getUnit());
        proposer.setPosition(proposerDTO.getPosition());
        proposer.setField(proposerDTO.getField());
        proposer.setPhoneNumber(proposerDTO.getPhoneNumber());
        proposer.setStatus(Proposer.Trangthai.CHO_DUYET);
        proposer.setUser(user);
        return proposerRepisitory.save(proposer);
    }

    public Proposer update(Long id, ProposerDTO proposerDTO) {
        return proposerRepisitory.findById(id)
                .map(existing -> {
                    if (proposerDTO.getEducation() != null && !proposerDTO.getEducation().isEmpty()) {
                        existing.setEducation(proposerDTO.getEducation());
                    }
                    if (proposerDTO.getMajor() != null && !proposerDTO.getMajor().isEmpty()) {
                        existing.setMajor(proposerDTO.getMajor());
                    }
                    if (proposerDTO.getUnit() != null && !proposerDTO.getUnit().isEmpty()) {
                        existing.setUnit(proposerDTO.getUnit());
                    }
                    if (proposerDTO.getPosition() != null && !proposerDTO.getPosition().isEmpty()) {
                        existing.setPosition(proposerDTO.getPosition());
                    }
                    if (proposerDTO.getField() != null && !proposerDTO.getField().isEmpty()) {
                        existing.setField(proposerDTO.getField());
                    }
                    if (proposerDTO.getPhoneNumber() != null && !proposerDTO.getPhoneNumber().isEmpty()) {
                        existing.setPhoneNumber(proposerDTO.getPhoneNumber());
                    }
                    return proposerRepisitory.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm người đề xuất với id: " + id));
    }


    public Proposer adminUpdate(Long id, ProposerDTO proposerDTO){
        return proposerRepisitory.findById(id)
                .map(existing -> {
                    // chỉ update status
                    if (proposerDTO.getStatus() != null) {
                        existing.setStatus(proposerDTO.getStatus());
                    }
                    return proposerRepisitory.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm người đề xuất với id: " + id));
    }

    public List<Proposer> findAll(){
        return proposerRepisitory.findAll();
    }

    public Proposer findById(Long id){
        return proposerRepisitory.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với id: "+id));
    }
}
