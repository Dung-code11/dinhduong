import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/FoodTable.module.css";
import * as XLSX from "xlsx";
import nextlogin from "../assets/images/next.svg";
import previous from "../assets/images/previous.svg";
import previousback from "../assets/images/previousback.svg";
import nextforward from "../assets/images/nextforward.svg";

// API service functions
const API = axios.create({
    baseURL: "http://localhost:8080/api/",
});

// interceptor để gắn token cho mọi request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ingredientAPI
const ingredientAPI = {
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
const categoryAPI = {
    getCategories: () => API.get("superadmin/category/")
};

export default function FoodTable() {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [excelData, setExcelData] = useState([]);
    const [error, setError] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [originalData, setOriginalData] = useState([]);
    const [changedCells, setChangedCells] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [tempDataState, setTempDataState] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [openFilter, setOpenFilter] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Nhóm");
    const [categories, setCategories] = useState([]);
    const [filterValues, setFilterValues] = useState({
        group: "",
        proteinType: ""
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filteredData = tableData.filter(row => {
        return (
            (filterValues.group === "" || row.group === filterValues.group) &&
            (filterValues.proteinType === "" || row.proteinType === filterValues.proteinType) &&
            (searchTerm === "" || row.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });
    // const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                endPage = 4;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }

            if (startPage > 2) {
                pages.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await fetchCategories();
                await fetchIngredients(0, itemsPerPage); // Page 0, size = itemsPerPage
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        fetchIngredients(currentPage - 1, itemsPerPage);
    }, [currentPage, itemsPerPage, searchTerm, filterValues]);
    // Hàm lấy danh mục từ API
    const fetchCategories = async () => {
        try {
            const res = await categoryAPI.getCategories();
            if (res.data && Array.isArray(res.data)) {
                setCategories(res.data);
            } else {
                // Fallback data nếu API không trả về dữ liệu
                console.log("Dữ liệu bị thất lạc")
            }
        } catch (err) {
            console.error("Fetch categories error:", err);
        }
    };

    // Hàm tính toán các giá trị phụ thuộc
    const calculateCarbohydrate = (item) => {
        return 100 - ((item.water  ) + (item.protein  ) + (item.fat  ) + (item.ash  ));
    };

    const calculateEnergy = (item) => {
        return 4 * (item.protein  ) + 9 * (item.fat  ) + 4 * calculateCarbohydrate(item);
    };

    const calculateE = (item) => {
        return ((item.edible  ) * calculateEnergy(item)) / 100;
    };

    const calculateP = (item) => {
        return (item.protein  ) * calculateEnergy(item) / 100;
    };

    const calculateL = (item) => {
        return (item.fat  ) * calculateEnergy(item) / 100;
    };

    const calculateG = (item) => {
        return calculateCarbohydrate(item) * calculateEnergy(item) / 100;
    };
    const startIndex = filteredData.length > 0
        ? (currentPage - 1) * itemsPerPage + 1
        : 0;

    const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);
    const totalItems = filteredData.length;

    const fetchIngredients = async (page = currentPage - 1, size = itemsPerPage) => {
        try {
            setLoading(true);
            const response = await ingredientAPI.getIngredients(
                page,
                size,
                searchTerm,
                filterValues
            );

            const data = response.data;

            // Chuyển đổi dữ liệu từ API sang định dạng component mong đợi
            const convertedData = response.data.content.map(item => ({
                id: item.id,
                name: item.material,
                group: item.category?.categoryName || "",
                proteinType: item.loaiProtein === "THUC_VAT" ? "Thực vật" : "Động Vật",
                Edible: item.edible,
                Water: item.water,
                Protein: item.protein,
                Fat: item.fat,
                Fiber: item.fiber,
                Ash: item.ash,
                Calci: item.calci,
                Phosphorous: item.phosphorous,
                Iron: item.iron,
                Zinc: item.zinc,
                Sodium: item.sodium,
                Potassium: item.potassium,
                Magnesium: item.magnesium,
                Manganese: item.manganese,
                Copper: item.copper,
                Selenium: item.selenium,
                "Vitamin C": item.vitaminC,
                Thiamine: item.thiamine,
                Riboflavin: item.riboflavin,
                Niacin: item.niacin,
                "Pantothenic acid": item.pantothenicAcid,
                "Vitamin B6": item.vitaminB6,
                Folate: item.folate,
                "Folic acid": item.folicAcid,
                Biotin: item.biotin,
                "Vitamin B12": item.vitaminB12,
                Retinol: item.retinol,
                "Vitamin D": item.vitaminD,
                "Vitamin E": item.vitaminE,
                "Vitamin K": item.vitaminK,
                "b-carotene": item.betaCarotene,
                "a-carotene": item.alphaCarotene,
                "b-cryptoxanthin": item.betaCryptoxanthin,
                Lycopene: item.lycopene,
                "Lutein + zeaxanthin": item.luteinZeaxanthin,
                "Isoflavone tổng số": item.isoflavoneTongSo,
                Daidzein: item.daidzein,
                Genistein: item.genistein,
                Glycetin: item.glycetin,
                Purine: item.purine,
                "Palmitic (C16:0)": item.palmitic,
                "Margaric (C17:0)": item.margaric,
                "Stearic (C18:0)": item.stearic,
                "Arachidic (C20:0)": item.arachidic,
                "Behenic (C22:0)": item.behenic,
                "Lignoceric (C24:0)": item.lignoceric,
                "TS acid béo không no 1 nối đôi": item.tsAxitBeoKhongNo1NoiDoi,
                "Myristoleic (C14:1)": item.myristoleic,
                "Palmitoleic (C16:1)": item.palmitoleic,
                "Oleic (C18:1)": item.oleic,
                "TS acid béo không no nhiều nối đôi": item.tsAxitBeoKhongNoNhieuNoiDoi,
                Linoleic: item.linoleic,
                Linolenic: item.linolenic,
                "Arachidonic (C20:4)": item.arachidonic,
                "EPA (C20:5 n3)": item.epa,
                "DHA (C22:6 n3)": item.dha,
                "TS acid béo trans": item.tsAxitBeoTrans,
                Cholesterol: item.cholesterol,
                Phytosterol: item.phytosterol,
                Lysin: item.lysin,
                Methionin: item.methionin,
                Tryptophan: item.tryptophan,
                Phenylalanin: item.phenylalanin,
                Threonin: item.threonin,
                Valine: item.valine,
                Leucine: item.leucine,
                Isoleucine: item.isoleucine,
                Arginine: item.arginine,
                Histidine: item.histidine,
                Cystine: item.cystine,
                Tyrosine: item.tyrosine,
                Alanine: item.alanine,
                "Aspartic acid": item.asparticAcid,
                "Glutamic acid": item.glutamicAcid,
                Glycine: item.glycine,
                Proline: item.proline,
                Serine: item.serine,
                // Tính toán các trường phụ thuộc
                Carbohydrate: calculateCarbohydrate(item),
                Energy: calculateEnergy(item),
                E: calculateE(item),
                P: calculateP(item),
                L: calculateL(item),
                G: calculateG(item),
                "Vitamin A -RAE": null // Có thể tính toán sau nếu cần
            }));
            setTableData(convertedData);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
            setError(null);
        } catch (err) {
            setError("Lỗi khi tải dữ liệu: " + (err.response?.data?.message || err.message));
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const convertToApiFormat = (componentData) => {
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
            asparticAcid: componentData["Aspartic acid"],
            glutamicAcid: componentData["Glutamic acid"],
            glycine: componentData.Glycine,
            proline: componentData.Proline,
            serine: componentData.Serine
        };
    };

    const groupClassMap = {
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

    // Load toàn bộ ảnh trong thư mục assets/images
    const images = import.meta.glob('../assets/images/*', { eager: true, import: 'default' });
    const getImage = (name) => images[`../assets/images/${name}`];

    const columns = [
        { key: "Edible", label: "Edible (%)" },
        { key: "Energy", label: "Energy (Kcal)" },
        { key: "E", label: "E" },
        { key: "Water", label: "Water (g)" },
        { key: "Protein", label: "Protein (g)" },
        { key: "P", label: "P" },
        { key: "Fat", label: "Fat (g)" },
        { key: "L", label: "L" },
        { key: "Carbohydrate", label: "Carbohydrate (g)" },
        { key: "G", label: "G" },
        { key: "Fiber", label: "Fiber (g)" },
        { key: "Ash", label: "Ash (g)" },
        { key: "Calci", label: "Calci (mg)" },
        { key: "Phosphorous", label: "Phosphorous (mg)" },
        { key: "Iron", label: "Iron (mg)" },
        { key: "Zinc", label: "Zinc (mg)" },
        { key: "Sodium", label: "Sodium (mg)" },
        { key: "Potassium", label: "Potassium (mg)" },
        { key: "Magnesium", label: "Magnesium (mg)" },
        { key: "Manganese", label: "Manganese (mg)" },
        { key: "Copper", label: "Copper (µg)" },
        { key: "Selenium", label: "Selenium (µg)" },
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
        { key: "b-cryptoxanthin", label: "b-cryptoxanthin (µg)" },
        { key: "Lycopene", label: "Lycopene (mcg)" },
        { key: "Lutein + zeaxanthin", label: "Lutein + zeaxanthin (mcg)" },
        { key: "Isoflavone tổng số", label: "Isoflavone tổng số (mg)" },
        { key: "Daidzein", label: "Daidzein (mg)" },
        { key: "Genistein", label: "Genistein (mg)" },
        { key: "Glycetin", label: "Glycetin (mg)" },
        { key: "Purine", label: "Purine (mg)" },
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
        { key: "Phytosterol", label: "Phytosterol (mg)" },
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
    ];

    // Tạo danh sách nhóm từ categories
    const groupOptions = ["Nhóm", ...categories.map(c => c.categoryName)];

    const proteinTypeOptions = [
        "Nhóm Protein", "Thực vật", "Động Vật"
    ];

    const editRow = (rowIndex) => {
        setOriginalData(tableData.map(row => ({ ...row })));
        setEditingRow(rowIndex);
        const row = tableData[rowIndex];
        const tempRow = {};
        Object.keys(row).forEach(key => {
            tempRow[`${rowIndex}-${key}`] = {
                rowIndex,
                colKey: key,
                newValue: row[key]
            };
        });
        setTempDataState(tempRow);
    };

    const deleteRow = async (rowIndex) => {
        const row = tableData[rowIndex];
        if (window.confirm(`Bạn có chắc muốn xóa "${row.name}"?`)) {
            try {
                if (row.id) {
                    await ingredientAPI.deleteIngredient(row.id);
                }
                setTableData(prev => prev.filter((_, i) => i !== rowIndex));
            } catch (err) {
                setError("Lỗi khi xóa: " + (err.response?.data?.message || err.message));
                console.error("Delete error:", err);
            }
        }
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset về trang đầu khi search
    };
    const handleFilterChange = (filterType, value) => {
        setFilterValues(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const applyFilters = () => {
        setCurrentPage(1); // Reset về trang đầu khi áp dụng filter
        setIsFilterOpen(false);
    };

    const resetFilters = () => {
        setFilterValues({
            group: "",
            proteinType: ""
        });
        setIsFilterOpen(false);
    };
    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    };


    const handleChange = (e, rowIndex, colKey) => {
        const value = e.target.value;
        const cellKey = `${rowIndex}-${colKey}`;
        setTempDataState(prev => ({
            ...prev,
            [cellKey]: { ...prev[cellKey], newValue: value }
        }));
    };

    const addRow = () => {
        const newRow = {
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

        setTableData(prev => {
            const updated = [...prev, newRow];
            // Đặt hàng mới vào chế độ edit
            setEditingRow(updated.length - 1);
            // Cập nhật originalData với dữ liệu mới
            setOriginalData(prevOriginal => [...prevOriginal, { ...newRow }]);
            return updated;
        });
    };

    // Sửa hàm handleKeyDown để xử lý đúng khi thêm mới
    const handleKeyDown = async (e, rowIndex) => {
        if (e.key === "Enter") {
            const updatedTable = [...tableData];

            // lấy row hiện tại
            let rowData = { ...updatedTable[rowIndex] };

            // ghi đè bằng giá trị mới trong tempDataState
            Object.keys(rowData).forEach(colKey => {
                const cellKey = `${rowIndex}-${colKey}`;
                if (tempDataState[cellKey] !== undefined) {
                    rowData[colKey] = tempDataState[cellKey].newValue;
                }
            });
            // Cập nhật giá trị name nếu đang edit
            // if (e.target.tagName === "INPUT" && e.target.name === "name") {
            //     rowData.name = e.target.value.trim();
            // }

            try {
                const apiData = convertToApiFormat(rowData);

                if (!rowData.id) {
                    // Thêm mới
                    const response = await ingredientAPI.createIngredient(apiData);
                    rowData.id = response.data.id; // Gán ID mới từ server
                } else {
                    // Cập nhật
                    await ingredientAPI.updateIngredient(rowData.id, apiData);
                }

                // Cập nhật state
                updatedTable[rowIndex] = rowData;
                setTableData(updatedTable);
                setOriginalData(updatedTable.map(r => ({ ...r })));
                setEditingRow(null);
                setTempDataState({});

            } catch (err) {
                setError("Lỗi khi lưu: " + (err.response?.data?.message || err.message));
                console.error("Save error:", err);
                // Khôi phục lại dữ liệu gốc nếu có lỗi
                setTableData([...originalData]);
            }
        }
    };
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0]; // lấy sheet đầu tiên
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // convert về JSON

            console.log("Excel data:", jsonData);
            setExcelData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };
    const handleUploadToServer = async () => {
        console.log("Danh sách categories:", categories);
        
        try {
            // Map dữ liệu excel thành format API mong đợi
            const formattedData = excelData.map(row => {
                // Tìm category đúng
                const categoryName = row["danh_muc"];
                console.log("categories:",categoryName);
                const categoryObj = categories.find(c =>
                    c.categoryName.trim() === categoryName.trim()
                );

                if (!categoryObj) {
                    console.warn(`Không tìm thấy category: ${categoryName}`);
                    return null;
                }

                // Xử lý proteinType
                const proteinTypeExcel = row["loai_protein"];
                let loaiProtein = "";
                if (proteinTypeExcel.includes("Thực vật") || proteinTypeExcel.includes("THUC_VAT")) {
                    loaiProtein = "THUC_VAT";
                } else if (proteinTypeExcel.includes("Động Vật") || proteinTypeExcel.includes("DONG_VAT")) {
                    loaiProtein = "DONG_VAT";
                }

                return {
                    material: row["ten_nguyen_lieu"],
                    categoryId: categoryObj.id,
                    loaiProtein: loaiProtein,
                    edible: parseFloat(row["Edible"]),
                    water: parseFloat(row["Water"]),
                    protein: parseFloat(row["Protein"]),
                    fat: parseFloat(row["Fat"]),
                    fiber: parseFloat(row["Fiber"])  ,
                    ash: parseFloat(row["Ash"])  ,
                    calci: parseFloat(row["Calci"])  ,
                    phosphorous: parseFloat(row["Phosphorous"])  ,
                    iron: parseFloat(row["Iron"])  ,
                    zinc: parseFloat(row["Zinc"])  ,
                    sodium: parseFloat(row["Sodium"])  ,
                    potassium: parseFloat(row["Potassium"])  ,
                    magnesium: parseFloat(row["Magnesium"])  ,
                    manganese: parseFloat(row["Manganese"])  ,
                    copper: parseFloat(row["Copper"])  ,
                    selenium: parseFloat(row["Selenium"])  ,
                    vitaminC: parseFloat(row["Vitamin C"])  ,
                    thiamine: parseFloat(row["Thiamine"])  ,
                    riboflavin: parseFloat(row["Riboflavin"])  ,
                    niacin: parseFloat(row["Niacin"])  ,
                    pantothenicAcid: parseFloat(row["Pantothenic acid"])  ,
                    vitaminB6: parseFloat(row["Vitamin B6"])  ,
                    folate: parseFloat(row["Folate"])  ,
                    folicAcid: parseFloat(row["Folic acid"])  ,
                    biotin: parseFloat(row["Biotin"])  ,
                    vitaminB12: parseFloat(row["Vitamin B12"])  ,
                    retinol: parseFloat(row["Retinol"])  ,
                    vitaminD: parseFloat(row["Vitamin D"])  ,
                    vitaminE: parseFloat(row["Vitamin E"])  ,
                    vitaminK: parseFloat(row["Vitamin K"])  ,
                    betaCarotene: parseFloat(row["b-carotene"])  ,
                    alphaCarotene: parseFloat(row["a-carotene"])  ,
                    betaCryptoxanthin: parseFloat(row["b-cryptoxanthin"])  ,
                    lycopene: parseFloat(row["Lycopene"])  ,
                    luteinZeaxanthin: parseFloat(row["Lutein + zeaxanthin"])  ,
                    isoflavoneTongSo: parseFloat(row["Isoflavone tổng số"])  ,
                    daidzein: parseFloat(row["Daidzein"])  ,
                    genistein: parseFloat(row["Genistein"])  ,
                    glycetin: parseFloat(row["Glycetin"])  ,
                    purine: parseFloat(row["Purine"])  ,
                    palmitic: parseFloat(row["Palmitic (C16:0)"])  ,
                    margaric: parseFloat(row["Margaric (C17:0)"])  ,
                    stearic: parseFloat(row["Stearic (C18:0)"])  ,
                    arachidic: parseFloat(row["Arachidic (C20:0)"])  ,
                    behenic: parseFloat(row["Behenic (C22:0)"])  ,
                    lignoceric: parseFloat(row["Lignoceric (C24:0)"])  ,
                    tsAxitBeoKhongNo1NoiDoi: parseFloat(row["TS acid béo không no 1 nối đôi"])  ,
                    myristoleic: parseFloat(row["Myristoleic (C14:1)"])  ,
                    palmitoleic: parseFloat(row["Palmitoleic (C16:1)"])  ,
                    oleic: parseFloat(row["Oleic (C18:1)"])  ,
                    tsAxitBeoKhongNoNhieuNoiDoi: parseFloat(row["TS acid béo không no nhiều nối đôi"])  ,
                    linoleic: parseFloat(row["Linoleic"])  ,
                    linolenic: parseFloat(row["Linolenic"])  ,
                    arachidonic: parseFloat(row["Arachidonic (C20:4)"])  ,
                    epa: parseFloat(row["EPA (C20:5 n3)"])  ,
                    dha: parseFloat(row["DHA (C22:6 n3)"])  ,
                    tsAxitBeoTrans: parseFloat(row["TS acid béo trans"])  ,
                    cholesterol: parseFloat(row["Cholesterol"])  ,
                    phytosterol: parseFloat(row["Phytosterol"])  ,
                    lysin: parseFloat(row["Lysin"])  ,
                    methionin: parseFloat(row["Methionin"])  ,
                    tryptophan: parseFloat(row["Tryptophan"])  ,
                    phenylalanin: parseFloat(row["Phenylalanin"])  ,
                    threonin: parseFloat(row["Threonin"])  ,
                    valine: parseFloat(row["Valine"])  ,
                    leucine: parseFloat(row["Leucine"])  ,
                    isoleucine: parseFloat(row["Isoleucine"])  ,
                    arginine: parseFloat(row["Arginine"])  ,
                    histidine: parseFloat(row["Histidine"])  ,
                    cystine: parseFloat(row["Cystine"])  ,
                    tyrosine: parseFloat(row["Tyrosine"])  ,
                    alanine: parseFloat(row["Alanine"])  ,
                    asparticAcid: parseFloat(row["Aspartic acid"])  ,
                    glutamicAcid: parseFloat(row["Glutamic acid"])  ,
                    glycine: parseFloat(row["Glycine"])  ,
                    proline: parseFloat(row["Proline"])  ,
                    serine: parseFloat(row["Serine"])  
                };
            }).filter(item => item !== null); // Lọc bỏ những item không có category

            if (formattedData.length === 0) {
                alert("Không có dữ liệu hợp lệ để upload!");
                return;
            }

            console.log("Dữ liệu đã format:", formattedData);

            // Gửi lần lượt từng dòng
            let successCount = 0;
            let errorCount = 0;

            for (const item of formattedData) {
                try {
                    await ingredientAPI.createIngredient(item);
                    successCount++;
                } catch (err) {
                    console.error("Lỗi khi tạo ingredient:", err);
                    errorCount++;
                }
            }

            alert(`Upload hoàn tất! Thành công: ${successCount}, Lỗi: ${errorCount}`);
            fetchIngredients(0, itemsPerPage); // refresh lại bảng

        } catch (err) {
            console.error("Upload error:", err);
            alert("Có lỗi khi upload Excel: " + err.message);
        }
    };
    if (loading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    return (
        <div>
            {/* Header */}
            <header className={styles.siteHeader}>
                <h1 className={styles.siteTitle}>Bảng thành phần nguyên liệu</h1>
                <div className={styles.userControls}>
                    <button className={`${styles.iconButton} ${styles.notificationButton}`}>
                        <img src={getImage("bell.svg")} alt="Notifications" className={styles.iconBell} />
                        <span className={styles.notificationBadge}></span>
                    </button>
                    <div className={styles.userProfile}>
                        <img src={getImage("avatar.png")} alt="Adam Vasylenko" className={styles.avatar} />
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>Adam Vasylenko</span>
                            <span className={styles.userRole}>Member</span>
                        </div>
                        <button className={styles.iconButton}>
                            <img src={getImage("dropdown.svg")} alt="User menu" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Error display */}
            {error && (
                <div className={styles.errorBanner}>
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Controls */}
            <div className={styles.widgetControls}>
                <div className={styles.controlsLeft}>
                    <div className={styles.searchInput}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className={styles.filterWrapper}>
                        <button onClick={() => setOpenFilter(!openFilter)}>Filter</button>
                        {openFilter && (
                            <div className={styles.filterMenu}>
                                {columnGroups.map((group) => (
                                    <div key={group.key} className={styles.filterGroup}>
                                        <div className={styles.groupHeader}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={group.columns.every((c) =>
                                                        visibleColumns.includes(c.key)
                                                    )}
                                                    onChange={() => toggleGroup(group)}
                                                />
                                                {group.group}
                                            </label>
                                        </div>
                                        <div className={styles.filterOptions}>
                                            {group.columns.map((col) => (
                                                <label key={col.key}>
                                                    <input
                                                        type="checkbox"
                                                        checked={visibleColumns.includes(col.key)}
                                                        onChange={() => toggleColumn(col.key)}
                                                    />
                                                    {col.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.controlsRight}>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                    />
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleUploadToServer} disabled={excelData.length === 0}>
                        Upload Excel</button>
                    <button
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={addRow}
                    >
                        <img src={getImage("add.svg")} alt="" className={styles.iconSm} />
                        <span>Add</span>
                    </button>
                    <button
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        onClick={fetchIngredients}
                    >
                        <img src={getImage("refresh.svg")} alt="" className={styles.iconSm} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                <div className={styles.foodTable}>
                    {/* Header */}
                    <div className={`${styles.tableRow} ${styles.tableHeader}`}>
                        <div className={`${styles.tableCell} ${styles.stickyCol}`}>Tên nguyên liệu</div>
                        <div className={styles.tableCell}>Nhóm</div>
                        <div className={styles.tableCell}>Loại Protein</div>
                        {columns.map(col => (
                            <div key={col.key} className={styles.tableCell}>{col.label}</div>
                        ))}
                        <div className={styles.tableCell}>Hành động</div>
                    </div>

                    {/* Body */}
                    {filteredData.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={styles.tableRow}
                            onDoubleClick={() => editRow(rowIndex)}
                        >
                            <div className={styles.tableCell}>
                                {editingRow === rowIndex ? (
                                    <input
                                        name="name"
                                        value={tempDataState[`${rowIndex}-name`]?.newValue ?? row.name}
                                        onChange={e => handleChange(e, rowIndex, "name")}
                                        onKeyDown={e => handleKeyDown(e, rowIndex)}
                                    />
                                ) : row.name}
                            </div>
                            <div className={styles.tableCell}>
                                {editingRow === rowIndex ? (
                                    <select
                                        value={tempDataState[`${rowIndex}-group`]?.newValue ?? row.group}
                                        onChange={e => handleChange(e, rowIndex, "group")}
                                        onKeyDown={e => handleKeyDown(e, rowIndex)}
                                    >
                                        {groupOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className={`${styles.badge} ${groupClassMap[row.group]}`}>{row.group}</span>
                                )}
                            </div>
                            <div className={styles.tableCell}>
                                {editingRow === rowIndex ? (
                                    <select
                                        value={tempDataState[`${rowIndex}-proteinType`]?.newValue ?? row.proteinType}
                                        onChange={e => handleChange(e, rowIndex, "proteinType")}
                                        onKeyDown={e => handleKeyDown(e, rowIndex)}
                                    >
                                        {proteinTypeOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : row.proteinType}
                            </div>

                            {columns.map(col => (
                                <div key={col.key} className={styles.tableCell}>
                                    {editingRow === rowIndex ? (
                                        <input
                                            value={tempDataState[`${rowIndex}-${col.key}`]?.newValue ?? row[col.key] ?? ""}
                                            onChange={e => handleChange(e, rowIndex, col.key)}
                                            onKeyDown={e => handleKeyDown(e, rowIndex)}
                                        />
                                    ) : row[col.key]}
                                </div>
                            ))}
                            <div className={styles.tableCell}>
                                <button onClick={() => editRow(rowIndex)}>✏️</button>
                                <button onClick={() => deleteRow(rowIndex)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.paginationWrapper}>
                <div className={styles.paginationInfo}>
                    Hiển thị {startIndex}-{endIndex} của {totalItems} mục
                </div>
                <div className={styles.paginationControls}>
                    <button
                        className={styles.pageButton}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <img src={previousback} alt="previousback" />
                    </button>
                    <button
                        className={styles.pageButton}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <img src={previous} alt="previous" />
                    </button>

                    {getPageNumbers().map((pageNum, index) => (
                        pageNum === '...' ? (
                            <span key={`dots-${index}`} className={styles.pageDots}>...</span>
                        ) : (
                            <button
                                key={pageNum}
                                className={`${styles.pageButton} ${currentPage === pageNum ? styles.pageActive : ''}`}
                                onClick={() => setCurrentPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        )
                    ))}

                    <button
                        className={styles.pageButton}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <img src={nextlogin} alt="nextlogin" />
                    </button>
                    <button
                        className={styles.pageButton}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <img src={nextforward} alt="nextforward" />
                    </button>
                </div>
            </div>

            {showDialog && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Thay đổi dữ liệu</h3>
                        <ul>
                            {changedCells.map((cell, i) => (
                                <li key={i}>
                                    {cell.row} - Cột {cell.col}: "{cell.oldValue}" → "{cell.newValue}"
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setShowDialog(false)}>Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
}