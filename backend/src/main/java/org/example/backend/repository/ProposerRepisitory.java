package org.example.backend.repository;

import org.example.backend.model.Proposer;
import org.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProposerRepisitory extends JpaRepository<Proposer,String> {
    Optional<Proposer> findById(Long id);
}
