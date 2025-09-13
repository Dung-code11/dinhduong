import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api/",
});

// Interceptor để gắn token cho mọi request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ingredientAPI
export const ingredientAPI = {
    getIngredients: (page = 0, size = 10, search = "", filters = {}) =>
        API.get("user/ingredients", {
            params: {
                page,
                size,
                search,
                category: filters.group,
                proteinType: filters.proteinType === "Thực vật" ? "THUC_VAT" :
                    filters.proteinType === "Động Vật" ? "DONG_VAT" : ""
            }
        }),
    getAllIngredients: () => API.get("user/ingredients"),
    getIngredientById: (id) => API.get(`user/ingredients/${id}`),
    createIngredient: (data) => API.post("user/ingredients", data),
    updateIngredient: (id, data) => API.put(`user/ingredients/${id}`, data),
    deleteIngredient: (id) => API.delete(`user/ingredients/${id}`),
};

// categoryAPI
export const categoryAPI = {
    getCategories: () => API.get("superadmin/category/")
};
export const convertToApiFormat = (componentData) => {
        const categoryObj = categories.find(c => c.categoryName.trim() === componentData.group.trim());
        return {
            material: componentData.name,
            categoryId: categoryObj ? categoryObj.id : null,
            loaiProtein: componentData.proteinType === "Thực vật" ? "THUC_VAT" : "DONG_VAT",
            edible: componentData.Edible,
            water: componentData.Water,
            protein: componentData.Protein,
            fat: componentData.Fat,
            fiber: componentData.Fiber,
            ash: componentData.Ash,
            calci: componentData.Calci,
            phosphorous: componentData.Phosphorous,
            iron: componentData.Iron,
            zinc: componentData.Zinc,
            sodium: componentData.Sodium,
            potassium: componentData.Potassium,
            magnesium: componentData.Magnesium,
            manganese: componentData.Manganese,
            copper: componentData.Copper,
            selenium: componentData.Selenium,
            vitaminC: componentData["Vitamin C"],
            thiamine: componentData.Thiamine,
            riboflavin: componentData.Riboflavin,
            niacin: componentData.Niacin,
            pantothenicAcid: componentData["Pantothenic acid"],
            vitaminB6: componentData["Vitamin B6"],
            folate: componentData.Folate,
            folicAcid: componentData["Folic acid"],
            biotin: componentData.Biotin,
            vitaminB12: componentData["Vitamin B12"],
            retinol: componentData.Retinol,
            vitaminD: componentData["Vitamin D"],
            vitaminE: componentData["Vitamin E"],
            vitaminK: componentData["Vitamin K"],
            betaCarotene: componentData["b-carotene"],
            alphaCarotene: componentData["a-carotene"],
            betaCryptoxanthin: componentData["b-cryptoxanthin"],
            lycopene: componentData.Lycopene,
            luteinZeaxanthin: componentData["Lutein + zeaxanthin"],
            isoflavoneTongSo: componentData["Isoflavone tổng số"],
            daidzein: componentData.Daidzein,
            genistein: componentData.Genistein,
            glycetin: componentData.Glycetin,
            purine: componentData.Purine,
            palmitic: componentData["Palmitic (C16:0)"],
            margaric: componentData["Margaric (C17:0)"],
            stearic: componentData["Stearic (C18:0)"],
            arachidic: componentData["Arachidic (C20:0)"],
            behenic: componentData["Behenic (C22:0)"],
            lignoceric: componentData["Lignoceric (C24:0)"],
            tsAxitBeoKhongNo1NoiDoi: componentData["TS acid béo không no 1 nối đôi"],
            myristoleic: componentData["Myristoleic (C14:1)"],
            palmitoleic: componentData["Palmitoleic (C16:1)"],
            oleic: componentData["Oleic (C18:1)"],
            tsAxitBeoKhongNoNhieuNoiDoi: componentData["TS acid béo không no nhiều nối đôi"],
            linoleic: componentData.Linoleic,
            linolenic: componentData.Linolenic,
            arachidonic: componentData["Arachidonic (C20:4)"],
            epa: componentData["EPA (C20:5 n3)"],
            dha: componentData["DHA (C22:6 n3)"],
            tsAxitBeoTrans: componentData["TS acid béo trans"],
            cholesterol: componentData.Cholesterol,
            phytosterol: componentData.Phytosterol,
            lysin: componentData.Lysin,
            methionin: componentData.Methionin,
            tryptophan: componentData.Tryptophan,
            phenylalanin: componentData.Phenylalanin,
            threonin: componentData.Threonin,
            valine: componentData.Valine,
            leucine: componentData.Leucine,
            isoleucine: componentData.Isoleucine,
            arginine: componentData.Arginine,
            histidine: componentData.Histidine,
            cystine: componentData.Cystine,
            tyrosine: componentData.Tyrosine,
            alanine: componentData.Alanine,
            asparticAcid: componentData["Asportic acid"],
            glutamicAcid: componentData["Glutamic acid"],
            glycine: componentData.Glycine,
            proline: componentData.Proline,
            serine: componentData.Serine
        };
    };