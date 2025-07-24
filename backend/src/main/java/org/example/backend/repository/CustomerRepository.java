package org.example.backend.repository;

import org.example.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmail(String email);
    Optional<Customer> findByUserId(String userId); // userId là cột `userid` trong bảng customer
}
