package org.example.backend.controller;

import org.example.backend.dto.IngredientDTO;
import org.example.backend.model.Ingredient;
import org.example.backend.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/ingredients")
public class IngredientController {
    @Autowired
    private IngredientService ingredientService;

    @PostMapping
    public ResponseEntity<Ingredient> create(@RequestBody IngredientDTO dto, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", ""); // cắt "Bearer " ra
        Ingredient created = ingredientService.create(dto, token);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Ingredient>> findAll() {
        return ResponseEntity.ok(ingredientService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ingredient> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ingredientService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ingredient> update(@PathVariable Long id, @RequestBody IngredientDTO dto, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Ingredient updated = ingredientService.update(id, dto, token);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/approve/{pendingId}")
    public ResponseEntity<Ingredient> approvePending(@PathVariable Long pendingId, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Ingredient approved = ingredientService.approvePending(pendingId, token);
        return ResponseEntity.ok(approved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        ingredientService.delete(id);
        return ResponseEntity.ok("Deleted ingredient with id " + id);
    }
}
