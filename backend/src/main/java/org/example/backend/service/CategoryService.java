package org.example.backend.service;

import org.example.backend.dto.CategoryDTO;
import org.example.backend.model.Category;
import org.example.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public Category insert(CategoryDTO dto){
        Category category = new Category();
        category.setCategoryName(dto.getCategoryName());
        return categoryRepository.save(category);
    }

    public Category update(Long id, CategoryDTO dto){
        if(categoryRepository.findById(id).isPresent()){
            Category category = categoryRepository.findById(id).get();
            category.setCategoryName(dto.getCategoryName());
            return categoryRepository.save(category);
        } else {
            throw new RuntimeException("Không tìm thấy danh mục với id:  " + id);
        }
    }

    public List<Category> findAll(){
        return categoryRepository.findAll();
    }

    public Category findById(Long id){
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với id: "+id));
    }

    public void delete(Long id){
        if(categoryRepository.existsById(String.valueOf(id))){
            categoryRepository.deleteById(String.valueOf(id));
        } else {
            throw new RuntimeException("Không tìm thấy danh mục với id:  " + id);
        }
    }
}
