import styles from "../css/FoodTable.module.css";
export const groupClassMap = {
        "Ngũ cốc và sản phẩm chế biến": styles.ngucoc,
        "Khoai củ và sản phẩm chế biến": styles.khoaicu,
        "Hạt, quả, giàu đạm, béo và sản phẩm chế biến": styles.hat,
        "Rau, quả, củ dùng làm rau": styles.raucu,
        "Quả chín": styles.quachin,
        "Dầu, mỡ, bơ": styles.dau,
        "Thịt và sản phẩm chế biến": styles.thit,
        "Thủy sản và sản phẩm chế biến": styles.thuysan,
        "Trứng và sản phẩm chế biến": styles.trung,
        "Sữa và sản phẩm chế biến": styles.sua,
        "Đồ hộp": styles.dohop,
        "Đồ ngọt (đường, bánh, mứt, kẹo)": styles.dongot,
        "Gia vị, nước chấm": styles.gia_vi,
        "Nước giải khát": styles.nuocgiaikhat,
        "Đồ ăn truyền thống": styles.truyenthong
    };
export const columnGroups = [
    {
        group: "General",
        columns: [
            { key: "Energy", label: "Energy (Kcal)" },
        ]
    },
    {
        group: "Main nutrients",
        columns: [
            { key: "Water", label: "Water (g)" },
            { key: "Protein", label: "Protein (g)" },
            { key: "Fat", label: "Fat (g)" },
            { key: "Carbohydrate", label: "Carbohydrate (g)" },
            { key: "Fiber", label: "Fiber (g)" },
            { key: "Ash", label: "Ash (g)" }
        ]
    },
    {
        group: "Minerals",
        columns: [
            { key: "Calci", label: "Calci (mg)" },
            { key: "Phosphorous", label: "Phosphorous (mg)" },
            { key: "Iron", label: "Iron (mg)" },
            { key: "Zinc", label: "Zinc (mg)" },
            { key: "Sodium", label: "Sodium (mg)" },
            { key: "Potassium", label: "Potassium (mg)" },
            { key: "Magnesium", label: "Magnesium (mg)" },
            { key: "Manganese", label: "Manganese (mg)" },
            { key: "Copper", label: "Copper (µg)" },
            { key: "Selenium", label: "Selenium (µg)" }

        ]
    },
    {
        group: "Vitamin and Provitamins",
        columns: [
            { key: "Vitamin C", label: "Vitamin C (mg)" },
            { key: "Thiamine", label: "Thiamine (mg)" },
            { key: "Riboflavin", label: "Riboflavin (mg)" },
            { key: "Niacin", label: "Niacin (mg)" },
            { key: "Pantothenic acid", label: "Pantothenic acid (mg)" },
            { key: "Vitamin B6", label: "Vitamin B6 (mg)" },
            { key: "Folate", label: "Folate (µg)" },
            { key: "Folic acid", label: "Folic acid (µg)" },
            { key: "Biotin", label: "Biotin (µg)" },
            { key: "Vitamin B12", label: "Vitamin B12 (µg)" },
            { key: "Retinol", label: "Retinol (µg)" },
            { key: "Vitamin A -RAE", label: "Vitamin A -RAE (µg)" },
            { key: "Vitamin D", label: "Vitamin D (µg)" },
            { key: "Vitamin E", label: "Vitamin E (mg)" },
            { key: "Vitamin K", label: "Vitamin K (µg)" },
            { key: "b-carotene", label: "b-carotene (µg)" },
            { key: "a-carotene", label: "a-carotene (µg)" },
            { key: "b-cryptoxanthin", label: "b-cryptoxanthin (µg)" }


        ]
    },
    {
        group: "Các Isoflavon",
        columns: [
            { key: "Lycopene", label: "Lycopene (mcg)" },
            { key: "Lutein + zeaxanthin", label: "Lutein + zeaxanthin (mcg)" },
            { key: "Isoflavone tổng số", label: "Isoflavone tổng số (mg)" },
            { key: "Daidzein", label: "Daidzein (mg)" },
            { key: "Genistein", label: "Genistein (mg)" },
            { key: "Glycetin", label: "Glycetin (mg)" }
        ]
    },
    {
        group: "Purines",
        columns: [
            { key: "Purine", label: "Purine (mg)" }
        ]
    },
    {
        group: "Các acid béo",
        columns: [
            { key: "TS Axit béo no", label: "TS Axit béo no (g)" },
            { key: "Palmitic (C16:0)", label: "Palmitic (C16:0) (g)" },
            { key: "Margaric (C17:0)", label: "Margaric (C17:0) (g)" },
            { key: "Stearic (C18:0)", label: "Stearic (C18:0) (g)" },
            { key: "Arachidic (C20:0)", label: "Arachidic (C20:0) (g)" },
            { key: "Behenic (C22:0)", label: "Behenic (C22:0) (g)" },
            { key: "Lignoceric (C24:0)", label: "Lignoceric (C24:0) (g)" },
            { key: "TS acid béo không no 1 nối đôi", label: "TS acid béo không no 1 nối đôi (g)" },
            { key: "Myristoleic (C14:1)", label: "Myristoleic (C14:1) (g)" },
            { key: "Palmitoleic (C16:1)", label: "Palmitoleic (C16:1) (g)" },
            { key: "Oleic (C18:1)", label: "Oleic (C18:1) (g)" },
            { key: "TS acid béo không no nhiều nối đôi", label: "TS acid béo không no nhiều nối đôi (g)" },
            { key: "Linoleic", label: "Linoleic (g)" },
            { key: "Linolenic", label: "Linolenic (g)" },
            { key: "Arachidonic (C20:4)", label: "Arachidonic (C20:4) (g)" },
            { key: "EPA (C20:5 n3)", label: "EPA (C20:5 n3) (g)" },
            { key: "DHA (C22:6 n3)", label: "DHA (C22:6 n3) (g)" },
            { key: "TS acid béo trans", label: "TS acid béo trans (g)" },
            { key: "Cholesterol", label: "Cholesterol (mg)" },
            { key: "Phytosterol", label: "Phytosterol (mg)" }
        ]
    },
    {
        group: "Các acid amin",
        columns: [
            { key: "Lysin", label: "Lysin (mg)" },
            { key: "Methionin", label: "Methionin (mg)" },
            { key: "Tryptophan", label: "Tryptophan (mg)" },
            { key: "Phenylalanin", label: "Phenylalanin (mg)" },
            { key: "Threonin", label: "Threonin (mg)" },
            { key: "Valine", label: "Valine (mg)" },
            { key: "Leucine", label: "Leucine (mg)" },
            { key: "Isoleucine", label: "Isoleucine (mg)" },
            { key: "Arginine", label: "Arginine (mg)" },
            { key: "Histidine", label: "Histidine (mg)" },
            { key: "Cystine", label: "Cystine (mg)" },
            { key: "Tyrosine", label: "Tyrosine (mg)" },
            { key: "Alanine", label: "Alanine (mg)" },
            { key: "Aspartic acid", label: "Aspartic acid (mg)" },
            { key: "Glutamic acid", label: "Glutamic acid (mg)" },
            { key: "Glycine", label: "Glycine (mg)" },
            { key: "Proline", label: "Proline (mg)" },
            { key: "Serine", label: "Serine (mg)" }
        ]
    }
];
export const proteinTypeOptions = [
    "Nhóm Protein", "Thực vật", "Động Vật"
];
export const defaultSelectedColumns = {
    generalInfo: true,
    mainNutrients: true,
    protein: true,
    fat: true,
    carbohydrate: true,
    minerals: true,
    vitamins: true,
    others: true
};

export const defaultFilterValues = {
    group: "",
    proteinType: ""
};

export const emptyIngredient = {
    id: null,
    name: "",
    group: "Nhóm",
    proteinType: "Nhóm Protein",
    Edible: "",
    Water: "",
    Protein: "",
    Fat: "",
    Fiber: "",
    Ash: "",
    Calci: "",
    Phosphorous: "",
    Iron: "",
    Zinc: "",
    Sodium: "",
    Potassium: "",
    Magnesium: "",
    Manganese: "",
    Copper: "",
    Selenium: "",
    "Vitamin C": "",
    Thiamine: "",
    Riboflavin: "",
    Niacin: "",
    "Pantothenic acid": "",
    "Vitamin B6": "",
    Folate: "",
    "Folic acid": "",
    Biotin: "",
    "Vitamin B12": "",
    Retinol: "",
    "Vitamin D": "",
    "Vitamin E": "",
    "Vitamin K": "",
    "b-carotene": "",
    "a-carotene": "",
    "b-cryptoxanthin": "",
    Lycopene: "",
    "Lutein + zeaxanthin": "",
    "Isoflavone tổng số": "",
    Daidzein: "",
    Genistein: "",
    Glycetin: "",
    Purine: "",
    "Palmitic (C16:0)": "",
    "Margaric (C17:0)": "",
    "Stearic (C18:0)": "",
    "Arachidic (C20:0)": "",
    "Behenic (C22:0)": "",
    "Lignoceric (C24:0)": "",
    "TS acid béo không no 1 nối đôi": "",
    "Myristoleic (C14:1)": "",
    "Palmitoleic (C16:1)": "",
    "Oleic (C18:1)": "",
    "TS acid béo không no nhiều nối đôi": "",
    Linoleic: "",
    Linolenic: "",
    "Arachidonic (C20:4)": "",
    "EPA (C20:5 n3)": "",
    "DHA (C22:6 n3)": "",
    "TS acid béo trans": "",
    Cholesterol: "",
    Phytosterol: "",
    Lysin: "",
    Methionin: "",
    Tryptophan: "",
    Phenylalanin: "",
    Threonin: "",
    Valine: "",
    Leucine: "",
    Isoleucine: "",
    Arginine: "",
    Histidine: "",
    Cystine: "",
    Tyrosine: "",
    Alanine: "",
    "Aspartic acid": "",
    "Glutamic acid": "",
    Glycine: "",
    Proline: "",
    Serine: "",
    // Các trường tính toán sẽ tự động tính
    Carbohydrate: 0,
    Energy: 0,
    E: 0,
    P: 0,
    L: 0,
    G: 0,
    "Vitamin A -RAE": null
};