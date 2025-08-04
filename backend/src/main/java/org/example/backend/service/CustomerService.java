package org.example.backend.service;

import org.example.backend.dto.CustomerDTO;
import org.example.backend.model.Customer;
import org.example.backend.model.User;
import org.example.backend.repository.CustomerRepository;
import org.example.backend.repository.UserRepository;
import org.example.backend.security.JwtFilter;
import org.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Customer insertCustomer(CustomerDTO dto){
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }
        User user = new User();
        user.setId(UUID.randomUUID().toString().substring(0, 10));
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("CUSTOMER");
        user.setProvider("LOCAL");
        user.setProviderId(null); // hoặc ""
        userRepository.save(user);

        Customer customer = new Customer();
        customer.setFullName(dto.getFullName());
        customer.setSex(dto.getSex());
        customer.setDob(dto.getDob());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());
        customer.setUser(user);
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomer(){
        return customerRepository.findAll() ;
    }

    public Customer getCustomerById(Long id){
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));
    }

    public Customer updateCustomer(Long id, CustomerDTO dto){
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));
        if (dto.getFullName() != null) {
            customer.setFullName(dto.getFullName());
        }
        if(dto.getSex() != null) {
            customer.setSex(dto.getSex());
        }
        if(dto.getDob() != null) {
            customer.setDob(dto.getDob());
        }
        if (dto.getEmail() != null) {
            customer.setEmail(dto.getEmail());
        }
        if (dto.getPhone() != null) {
            customer.setPhone(dto.getPhone());
        }
        if (dto.getAddress() != null) {
            customer.setAddress(dto.getAddress());
        }

        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
        userRepository.delete(customer.getUser());
    }

    public Customer findCustomerByToken(String token) {
        String username = jwtUtil.getUsernameFromToken(token);

        // Tìm user theo username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // Tìm customer theo userId (idAccount)
        return customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy customer"));
    }
}
