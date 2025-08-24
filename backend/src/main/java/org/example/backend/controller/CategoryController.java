package org.example.backend.controller;

import org.example.backend.dto.CategoryDTO;
import org.example.backend.model.Category;
import org.example.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping("/")
    public ResponseEntity<Category> insert(@RequestBody CategoryDTO categoryDTO) {
        Category category = categoryService.insert(categoryDTO);
        return ResponseEntity.ok(category); // ✅ trả về object Category dạng JSON
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody CategoryDTO categoryDTO) {
        Category category = categoryService.update(id, categoryDTO);
        return ResponseEntity.ok(category); // ✅ trả về Category JSON
    }

    @GetMapping("/")
    public ResponseEntity<List<Category>> findAll() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> findById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok("Xóa thành công category id: " + id);
    }
}
