package org.example.backend.service;

import org.example.backend.dto.IngredientDTO;
import org.example.backend.model.Category;
import org.example.backend.model.Ingredient;
import org.example.backend.model.User;
import org.example.backend.repository.CategoryRepository;
import org.example.backend.repository.IngredientRepository;
import org.example.backend.repository.UserRepository;
import org.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.List;

@Service
public class IngredientService {
    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public Ingredient create(IngredientDTO dto, String token) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        String userId = jwtUtil.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id = " + userId));

        Ingredient ingredient = toEntity(dto, category, user);
        return ingredientRepository.save(ingredient);
    }

    public List<Ingredient> findAll() {
        return ingredientRepository.findAll();
    }

    public Ingredient findById(Long id) {
        return ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found with id = " + id));
    }

//    public Ingredient update(Long id, IngredientDTO dto, String token) {
//        Ingredient existing = findById(id);
//
//        Category category = categoryRepository.findById(dto.getCategoryId())
//                .orElseThrow(() -> new RuntimeException("Category not found"));
//
//        String userId = jwtUtil.getUserIdFromToken(token);
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id = " + userId));
//
//        Ingredient updated = toEntity(dto, category, user);
//        updated.setId(existing.getId());
//
//        return ingredientRepository.save(updated);
//    }
    public Ingredient update(Long id, IngredientDTO dto, String token) {
        Ingredient existing = findById(id);

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        String userId = jwtUtil.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id = " + userId));

        String role = user.getRole();

        // Nếu là USER hoặc USERPRO → tạo bản ghi chờ duyệt
        if ("USER".equalsIgnoreCase(role) || "USERPRO".equalsIgnoreCase(role)) {
            Ingredient pending = new Ingredient();
            pending.setMaterial(dto.getMaterial() != null ? dto.getMaterial() : existing.getMaterial());
            pending.setCategory(category);
            pending.setUser(user);
            pending.setLoaiProtein(dto.getLoaiProtein() != null ? dto.getLoaiProtein() : existing.getLoaiProtein());
            pending.setTrangThai(Ingredient.TrangThai.CHO_DUYET);

            updateEntityFields(pending, dto);

            return ingredientRepository.save(pending); // bản ghi này sẽ được admin duyệt sau
        }

        // Nếu là ADMIN hoặc SUPERADMIN → update trực tiếp
        if ("ADMIN".equalsIgnoreCase(role) || "SUPERADMIN".equalsIgnoreCase(role)) {
            existing.setCategory(category);
            updateEntityFields(existing, dto);
            existing.setTrangThai(Ingredient.TrangThai.DA_DUYET);
            return ingredientRepository.save(existing);
        }

        throw new RuntimeException("Role không hợp lệ: " + role);
    }

    public void delete(Long id) {
        Ingredient existing = findById(id);
        ingredientRepository.delete(existing);
    }

    private Ingredient toEntity(IngredientDTO dto, Category category, User user) {
        Ingredient ingredient = new Ingredient();
        ingredient.setMaterial(dto.getMaterial());
        ingredient.setCategory(category);
        ingredient.setUser(user);
        ingredient.setLoaiProtein(dto.getLoaiProtein());
        String role = user.getRole();
        if ("USER".equalsIgnoreCase(role) || "USERPRO".equalsIgnoreCase(role)) {
            ingredient.setTrangThai(Ingredient.TrangThai.CHO_DUYET);
        } else if ("ADMIN".equalsIgnoreCase(role) || "SUPERADMIN".equalsIgnoreCase(role)) {
            ingredient.setTrangThai(Ingredient.TrangThai.DA_DUYET);
        } else {
            ingredient.setTrangThai(Ingredient.TrangThai.CHO_DUYET);
        }
        ingredient.setEdible(dto.getEdible());
        ingredient.setWater(dto.getWater());
        ingredient.setProtein(dto.getProtein());
        ingredient.setFat(dto.getFat());
        ingredient.setFiber(dto.getFiber());
        ingredient.setAsh(dto.getAsh());
        ingredient.setCalci(dto.getCalci());
        ingredient.setPhosphorous(dto.getPhosphorous());
        ingredient.setIron(dto.getIron());
        ingredient.setZinc(dto.getZinc());
        ingredient.setSodium(dto.getSodium());
        ingredient.setPotassium(dto.getPotassium());
        ingredient.setMagnesium(dto.getMagnesium());
        ingredient.setManganese(dto.getManganese());
        ingredient.setCopper(dto.getCopper());
        ingredient.setSelenium(dto.getSelenium());
        ingredient.setVitaminC(dto.getVitaminC());
        ingredient.setThiamine(dto.getThiamine());
        ingredient.setRiboflavin(dto.getRiboflavin());
        ingredient.setNiacin(dto.getNiacin());
        ingredient.setPantothenicAcid(dto.getPantothenicAcid());
        ingredient.setVitaminB6(dto.getVitaminB6());
        ingredient.setFolate(dto.getFolate());
        ingredient.setFolicAcid(dto.getFolicAcid());
        ingredient.setBiotin(dto.getBiotin());
        ingredient.setVitaminB12(dto.getVitaminB12());
        ingredient.setRetinol(dto.getRetinol());
        ingredient.setVitaminD(dto.getVitaminD());
        ingredient.setVitaminE(dto.getVitaminE());
        ingredient.setVitaminK(dto.getVitaminK());
        ingredient.setBetaCarotene(dto.getBetaCarotene());
        ingredient.setAlphaCarotene(dto.getAlphaCarotene());
        ingredient.setBetaCryptoxanthin(dto.getBetaCryptoxanthin());
        ingredient.setLycopene(dto.getLycopene());
        ingredient.setLuteinZeaxanthin(dto.getLuteinZeaxanthin());
        ingredient.setIsoflavoneTongSo(dto.getIsoflavoneTongSo());
        ingredient.setDaidzein(dto.getDaidzein());
        ingredient.setGenistein(dto.getGenistein());
        ingredient.setGlycitein(dto.getGlycitein());
        ingredient.setPurine(dto.getPurine());
        ingredient.setPalmitic(dto.getPalmitic());
        ingredient.setMargaric(dto.getMargaric());
        ingredient.setStearic(dto.getStearic());
        ingredient.setArachidic(dto.getArachidic());
        ingredient.setBehenic(dto.getBehenic());
        ingredient.setLignoceric(dto.getLignoceric());
        ingredient.setTsAxitBeoKhongNo1Noi(dto.getTsAxitBeoKhongNo1Noi());
        ingredient.setMyristoleic(dto.getMyristoleic());
        ingredient.setPalmitoleic(dto.getPalmitoleic());
        ingredient.setOleic(dto.getOleic());
        ingredient.setTsAxitBeoKhongNoNhieuNoiDoi(dto.getTsAxitBeoKhongNoNhieuNoiDoi());
        ingredient.setLinoleic(dto.getLinoleic());
        ingredient.setLinolenic(dto.getLinolenic());
        ingredient.setArachidonic(dto.getArachidonic());
        ingredient.setEpa(dto.getEpa());
        ingredient.setDha(dto.getDha());
        ingredient.setTsAcidBeoTrans(dto.getTsAcidBeoTrans());
        ingredient.setCholesterol(dto.getCholesterol());
        ingredient.setPhytosterol(dto.getPhytosterol());
        ingredient.setLysin(dto.getLysin());
        ingredient.setMethionin(dto.getMethionin());
        ingredient.setTryptophan(dto.getTryptophan());
        ingredient.setPhenylalanin(dto.getPhenylalanin());
        ingredient.setThreonin(dto.getThreonin());
        ingredient.setValine(dto.getValine());
        ingredient.setLeucine(dto.getLeucine());
        ingredient.setIsoleucine(dto.getIsoleucine());
        ingredient.setArginine(dto.getArginine());
        ingredient.setHistidine(dto.getHistidine());
        ingredient.setCystine(dto.getCystine());
        ingredient.setTyrosine(dto.getTyrosine());
        ingredient.setAlanine(dto.getAlanine());
        ingredient.setAsparticAcid(dto.getAsparticAcid());
        ingredient.setGlutamicAcid(dto.getGlutamicAcid());
        ingredient.setGlycine(dto.getGlycine());
        ingredient.setProline(dto.getProline());
        ingredient.setSerine(dto.getSerine());

        return ingredient;
    }

    private void updateEntityFields(Ingredient existing, IngredientDTO dto) {
        try {
            Field[] fields = IngredientDTO.class.getDeclaredFields();
            for (Field field : fields) {
                field.setAccessible(true);
                Object newValue = field.get(dto);

                if (newValue == null) {
                    continue; // bỏ qua nếu null
                }

                if (newValue instanceof String str) {
                    if (str.trim().isEmpty()) {
                        continue; // bỏ qua nếu chuỗi rỗng
                    }
                }

                // Tìm field tương ứng trong Ingredient
                try {
                    Field existingField = Ingredient.class.getDeclaredField(field.getName());
                    existingField.setAccessible(true);
                    existingField.set(existing, newValue);
                } catch (NoSuchFieldException ignore) {
                    // DTO có field nhưng Entity không có thì bỏ qua
                }
            }
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Error updating entity fields", e);
        }
    }
}
