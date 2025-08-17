package org.example.backend.service;

import org.example.backend.dto.ProposerDTO;
import org.example.backend.model.Proposer;
import org.example.backend.model.User;
import org.example.backend.repository.ProposerRepisitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProposerService {
    @Autowired
    private ProposerRepisitory proposerRepisitory;

    public Proposer insert(ProposerDTO proposerDTO){
        Proposer proposer = new Proposer();
        User user = new User();
        proposer.setEducation(proposerDTO.getEducation());
        proposer.setMajor(proposerDTO.getMajor());
        proposer.setUnit(proposerDTO.getUnit());
        proposer.setPosition(proposerDTO.getPosition());
        proposer.setField(proposerDTO.getField());
        proposer.setPhoneNumber(proposerDTO.getPhoneNumber());
        proposer.setStatus(proposerDTO.getStatus());
        proposer.setUser(user);
        return proposerRepisitory.save(proposer);
    }

    public Proposer update(Long id, ProposerDTO proposerDTO){
        if (proposerRepisitory.findById(id).isPresent()){
            Proposer proposer = proposerRepisitory.findById(id).get();
            proposer.setEducation(proposerDTO.getEducation());
            proposer.setMajor(proposerDTO.getMajor());
            proposer.setUnit(proposerDTO.getUnit());
            proposer.setPosition(proposerDTO.getPosition());
            proposer.setField(proposerDTO.getField());
            proposer.setPhoneNumber(proposerDTO.getPhoneNumber());
            proposer.setStatus(proposerDTO.getStatus());
            return proposerRepisitory.save(proposer);
        } else {
            throw new RuntimeException("Không tìm người đề xuất với id:  " + id);
        }
    }

    public Proposer adminUpdate(Long id, ProposerDTO proposerDTO){
        if (proposerRepisitory.findById(id).isPresent()){
            Proposer proposer = proposerRepisitory.findById(id).get();
            proposer.setStatus(proposerDTO.getStatus());
            return proposerRepisitory.save(proposer);
        } else {
            throw new RuntimeException("Không tìm người đề xuất với id:  " + id);
        }
    }

    public List<Proposer> findAll(){
        return proposerRepisitory.findAll();
    }

    public Proposer findById(Long id){
        return proposerRepisitory.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với id: "+id));
    }
}
