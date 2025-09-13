import React, { useState, useEffect } from "react";
import styles from "../css/FoodTable.module.css";
import * as XLSX from "xlsx";
import nextlogin from "../assets/images/next.svg";
import previous from "../assets/images/previous.svg";
import previousback from "../assets/images/previousback.svg";
import nextforward from "../assets/images/nextforward.svg";
import { ingredientAPI, categoryAPI,convertToApiFormat } from "../services/ingredientApi";
import {columnGroups,groupClassMap,proteinTypeOptions,defaultSelectedColumns,defaultFilterValues,emptyIngredient} from "../services/constants";
import {calculateCarbohydrate,calculateEnergy,calculateE,calculateP,calculateL,calculateG,getPageNumbers,convertToComponentFormat} from "../utils/calculatefood";
const columns = columnGroups.flatMap(group => group.columns);
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
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState(defaultSelectedColumns);
    const [filterValues, setFilterValues] = useState(defaultFilterValues);
    const filteredData = tableData.filter(row => {
        return (
            (filterValues.group === "" || row.group === filterValues.group) &&
            (filterValues.proteinType === "" || row.proteinType === filterValues.proteinType) &&
            (searchTerm === "" || row.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });
    const startIndex = filteredData.length > 0
        ? (currentPage - 1) * itemsPerPage + 1
        : 0;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);
    const totalItems = filteredData.length;
    // Load toàn bộ ảnh trong thư mục assets/images
    const images = import.meta.glob('../assets/images/*', { eager: true, import: 'default' });
    // Tạo danh sách nhóm từ categories
    const groupOptions = ["Nhóm", ...categories.map(c => c.categoryName)];
    const getImage = (name) => images[`../assets/images/${name}`];
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
    }, [currentPage, itemsPerPage, filterValues]);
    // Hàm lấy danh mục từ API
    const fetchCategories = async () => {
        try {
            const res = await categoryAPI.getCategories();
            if (res.data && Array.isArray(res.data)) {
                setCategories(res.data);
            } else {
                console.log("Dữ liệu bị thất lạc")
            }
        } catch (err) {
            console.error("Fetch categories error:", err);
        }
    };
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
            const convertedData = response.data.content.map(item =>
                convertToComponentFormat(item, {
                    calculateCarbohydrate,
                    calculateEnergy,
                    calculateE,
                    calculateP,
                    calculateL,
                    calculateG
                })
            );
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
        setFilterValues(defaultFilterValues);
        setIsFilterOpen(false);
    };
    const handleChange = (e, rowIndex, colKey) => {
        const value = e.target.value;
        const cellKey = `${rowIndex}-${colKey}`;
        setTempDataState(prev => ({
            ...prev,
            [cellKey]: { ...prev[cellKey], newValue: value }
        }));
    };
    const handleColumnSelection = (category, isChecked) => {
        setSelectedColumns(prev => ({
            ...prev,
            [category]: isChecked
        }));
    };
    const addRow = () => {
        setTableData(prev => {
            const updated = [...prev, { ...emptyIngredient }];
            // Đặt hàng mới vào chế độ edit
            setEditingRow(updated.length - 1);
            // Cập nhật originalData với dữ liệu mới
            setOriginalData(prevOriginal => [...prevOriginal, { ...emptyIngredient }]);
            return updated;
        });
    };
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
                console.log("categories:", categoryName);
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
                    fiber: parseFloat(row["Fiber"]),
                    ash: parseFloat(row["Ash"]),
                    calci: parseFloat(row["Calci"]),
                    phosphorous: parseFloat(row["Phosphorous"]),
                    iron: parseFloat(row["Iron"]),
                    zinc: parseFloat(row["Zinc"]),
                    sodium: parseFloat(row["Sodium"]),
                    potassium: parseFloat(row["Potassium"]),
                    magnesium: parseFloat(row["Magnesium"]),
                    manganese: parseFloat(row["Manganese"]),
                    copper: parseFloat(row["Copper"]),
                    selenium: parseFloat(row["Selenium"]),
                    vitaminC: parseFloat(row["Vitamin C"]),
                    thiamine: parseFloat(row["Thiamine"]),
                    riboflavin: parseFloat(row["Riboflavin"]),
                    niacin: parseFloat(row["Niacin"]),
                    pantothenicAcid: parseFloat(row["Pantothenic acid"]),
                    vitaminB6: parseFloat(row["Vitamin B6"]),
                    folate: parseFloat(row["Folate"]),
                    folicAcid: parseFloat(row["Folic acid"]),
                    biotin: parseFloat(row["Biotin"]),
                    vitaminB12: parseFloat(row["Vitamin B12"]),
                    retinol: parseFloat(row["Retinol"]),
                    vitaminD: parseFloat(row["Vitamin D"]),
                    vitaminE: parseFloat(row["Vitamin E"]),
                    vitaminK: parseFloat(row["Vitamin K"]),
                    betaCarotene: parseFloat(row["b-carotene"]),
                    alphaCarotene: parseFloat(row["a-carotene"]),
                    betaCryptoxanthin: parseFloat(row["b-cryptoxanthin"]),
                    lycopene: parseFloat(row["Lycopene"]),
                    luteinZeaxanthin: parseFloat(row["Lutein + zeaxanthin"]),
                    isoflavoneTongSo: parseFloat(row["Isoflavone tổng số"]),
                    daidzein: parseFloat(row["Daidzein"]),
                    genistein: parseFloat(row["Genistein"]),
                    glycetin: parseFloat(row["Glycetin"]),
                    purine: parseFloat(row["Purine"]),
                    palmitic: parseFloat(row["Palmitic (C16:0)"]),
                    margaric: parseFloat(row["Margaric (C17:0)"]),
                    stearic: parseFloat(row["Stearic (C18:0)"]),
                    arachidic: parseFloat(row["Arachidic (C20:0)"]),
                    behenic: parseFloat(row["Behenic (C22:0)"]),
                    lignoceric: parseFloat(row["Lignoceric (C24:0)"]),
                    tsAxitBeoKhongNo1NoiDoi: parseFloat(row["TS acid béo không no 1 nối đôi"]),
                    myristoleic: parseFloat(row["Myristoleic (C14:1)"]),
                    palmitoleic: parseFloat(row["Palmitoleic (C16:1)"]),
                    oleic: parseFloat(row["Oleic (C18:1)"]),
                    tsAxitBeoKhongNoNhieuNoiDoi: parseFloat(row["TS acid béo không no nhiều nối đôi"]),
                    linoleic: parseFloat(row["Linoleic"]),
                    linolenic: parseFloat(row["Linolenic"]),
                    arachidonic: parseFloat(row["Arachidonic (C20:4)"]),
                    epa: parseFloat(row["EPA (C20:5 n3)"]),
                    dha: parseFloat(row["DHA (C22:6 n3)"]),
                    tsAxitBeoTrans: parseFloat(row["TS acid béo trans"]),
                    cholesterol: parseFloat(row["Cholesterol"]),
                    phytosterol: parseFloat(row["Phytosterol"]),
                    lysin: parseFloat(row["Lysin"]),
                    methionin: parseFloat(row["Methionin"]),
                    tryptophan: parseFloat(row["Tryptophan"]),
                    phenylalanin: parseFloat(row["Phenylalanin"]),
                    threonin: parseFloat(row["Threonin"]),
                    valine: parseFloat(row["Valine"]),
                    leucine: parseFloat(row["Leucine"]),
                    isoleucine: parseFloat(row["Isoleucine"]),
                    arginine: parseFloat(row["Arginine"]),
                    histidine: parseFloat(row["Histidine"]),
                    cystine: parseFloat(row["Cystine"]),
                    tyrosine: parseFloat(row["Tyrosine"]),
                    alanine: parseFloat(row["Alanine"]),
                    asparticAcid: parseFloat(row["Aspartic acid"]),
                    glutamicAcid: parseFloat(row["Glutamic acid"]),
                    glycine: parseFloat(row["Glycine"]),
                    proline: parseFloat(row["Proline"]),
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
                        <button
                            className={styles.filterButton}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            Filter
                        </button>
                    </div>
                </div>

                <div className={styles.controlsRight}>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                    />
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleUploadToServer} disabled={excelData.length === 0}>
                        Upload Excel
                    </button>
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

                {/* Filter Panel - Đặt ở đây để không ảnh hưởng đến layout của controls */}
                {isFilterOpen && (
                    <div className={styles.filterPanelOverlay}>
                        <div className={styles.filterPanel}>
                            <div className={styles.filterSection}>
                                <h3>Danh mục:</h3>
                                <select
                                    value={filterValues.group}
                                    onChange={(e) => handleFilterChange('group', e.target.value)}
                                >
                                    <option value="">Tất cả</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.categoryName}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.filterSection}>
                                <h3>Loại protein:</h3>
                                <select
                                    value={filterValues.proteinType}
                                    onChange={(e) => handleFilterChange('proteinType', e.target.value)}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="Thực vật">Thực vật</option>
                                    <option value="Động Vật">Động vật</option>
                                </select>
                            </div>

                            <div className={styles.filterSection}>
                                <h3>Chọn cột hiển thị:</h3>
                                <div className={styles.columnSelection}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={Object.values(selectedColumns).every(val => val)}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setSelectedColumns({
                                                    generalInfo: isChecked,
                                                    mainNutrients: isChecked,
                                                    protein: isChecked,
                                                    fat: isChecked,
                                                    carbohydrate: isChecked,
                                                    minerals: isChecked,
                                                    vitamins: isChecked,
                                                    others: isChecked
                                                });
                                            }}
                                        />
                                        Chọn tất cả
                                    </label>

                                    <div className={styles.columnGroup}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedColumns.generalInfo}
                                                onChange={(e) => handleColumnSelection('generalInfo', e.target.checked)}
                                            />
                                            Thông tin chung
                                        </label>
                                    </div>

                                    <div className={styles.columnGroup}>
                                        <label>Main Nutrients (chất đa lượng)</label>
                                        <div className={styles.subOptions}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedColumns.mainNutrients}
                                                    onChange={(e) => handleColumnSelection('mainNutrients', e.target.checked)}
                                                />
                                                Tất cả
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedColumns.protein}
                                                    onChange={(e) => handleColumnSelection('protein', e.target.checked)}
                                                />
                                                Protein (g)
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedColumns.fat}
                                                    onChange={(e) => handleColumnSelection('fat', e.target.checked)}
                                                />
                                                Fat (g)
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedColumns.carbohydrate}
                                                    onChange={(e) => handleColumnSelection('carbohydrate', e.target.checked)}
                                                />
                                                Carbohydrate (g)
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedColumns.minerals}
                                                    onChange={(e) => handleColumnSelection('minerals', e.target.checked)}
                                                />
                                                Minerals (chất khoáng)
                                            </label>
                                        </div>
                                    </div>

                                    <div className={styles.columnGroup}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedColumns.vitamins}
                                                onChange={(e) => handleColumnSelection('vitamins', e.target.checked)}
                                            />
                                            Vitamins
                                        </label>
                                    </div>

                                    <div className={styles.columnGroup}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedColumns.others}
                                                onChange={(e) => handleColumnSelection('others', e.target.checked)}
                                            />
                                            Khác
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.filterActions}>
                                <button
                                    className={styles.applyButton}
                                    onClick={applyFilters}
                                >
                                    Áp dụng
                                </button>
                                <button
                                    className={styles.resetButton}
                                    onClick={resetFilters}
                                >
                                    Đặt lại
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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

            {
                showDialog && (
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
                )
            }
        </div >
    );
}