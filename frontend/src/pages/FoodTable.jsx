import React, { useState } from "react";
import styles from "../css/FoodTable.module.css";
export default function FoodTable() {
    const foodCategories = [
        { group: "Ngũ cốc", className: "ngucoc" },
        { group: "Rau", className: "rau" },
        { group: "Trái cây", className: "traicay" },
        { group: "Thịt", className: "thit" },
        { group: "Hải sản", className: "haisan" },
    ];
    const groupClassMap = {
        "Ngũ cốc & sản phẩm chế biến": styles.ngucoc,
        "Khoai củ & sản phẩm": styles.khoaicu,
        "Hạt, quả giàu protein/lipid": styles.hat,
        "Rau, quả, củ làm rau": styles.raucu,
        "Quả chín": styles.quachin,
        "Dầu, mỡ, bơ": styles.dau,
        "Thịt & sản phẩm": styles.thit,
        "Thủy sản & sản phẩm": styles.thuysan,
        "Trứng & sản phẩm": styles.trung,
        "Sữa & sản phẩm": styles.sua,
        "Đồ hộp": styles.dohop,
        "Đồ ngọt (bánh, mứt...)": styles.dongot,
        "Gia vị, nước chấm": styles.gia_vi,
        "Nước giải khát": styles.nuocgiaikhat,
        "Thức ăn truyền thống": styles.truyenthong
    };
    const [editingRow, setEditingRow] = useState(null);
    const [originalData, setOriginalData] = useState([]);
    const [changedCells, setChangedCells] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [tempDataState, setTempDataState] = useState({});
    const [openFilter, setOpenFilter] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Nhóm");
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [filterValues, setFilterValues] = useState({
        group: "",
        proteinType: ""
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tableData, setTableData] = useState([
        {
            name: "Thịt bò",
            group: "Thịt",
            proteinType: "Động Vật",
            Edible: "26",
            Energy: "15",
            E: "0",
            Water: "18"
        },
        {
            name: "Rau cải",
            group: "Rau",
            proteinType: "Thực vật",
            Edible: "90",
            Energy: "25",
            E: "0",
            Water: "80"
        }
    ]);

    const groupOptions = [
        "Nhóm",
        "Ngũ cốc & sản phẩm chế biến",
        "Khoai củ & sản phẩm",
        "Hạt, quả giàu protein/lipid",
        "Rau, quả, củ làm rau",
        "Quả chín",
        "Dầu, mỡ, bơ",
        "Thịt & sản phẩm",
        "Thủy sản & sản phẩm",
        "Trứng & sản phẩm",
        "Sữa & sản phẩm",
        "Đồ hộp",
        "Đồ ngọt (bánh, mứt...)",
        "Gia vị, nước chấm",
        "Nước giải khát",
        "Thức ăn truyền thống"
    ];
    const proteinTypeOptions = [
        "Nhóm Protein", "Thực vật", "Động Vật"
    ]
    // Load toàn bộ ảnh trong thư mục assets/images
    const images = import.meta.glob('../assets/images/*', { eager: true, import: 'default' });
    const getImage = (name) => images[`../assets/images/${name}`];
    const columns = [
        { key: "Edible", label: "Edible (%)" },
        { key: "Energy", label: "Energy (Kcal)" }, // 4*Protein + 9*Fat+ 4*Carbohydrate
        { key: "E", label: "E" },// Edible * Energy/100
        { key: "Water", label: "Water (g)" },
        { key: "Protein", label: "Protein (g)" },
        { key: "P", label: "P" },// Protein * Energy/100
        { key: "Fat", label: "Fat (g)" },
        { key: "L", label: "L" }, //Fat * Energy/100
        { key: "Carbohydrate", label: "Carbohydrate (g)" },//100 - Sum(Water+Protein+Fat+Ash)
        { key: "G", label: "G" }, //Carbohydrate * Energy/100
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
        { key: "Vitamin A -RAE", label: "Vitamin A -RAE (µg)" },//Retinol + b-carotene/12 + a-carotene/24 + b-cryptoxanthin/24
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
    const editRow = (rowIndex) => {
        setOriginalData(tableData.map(row => ({ ...row })));
        setEditingRow(rowIndex);
        // Reset tempDataState chỉ cho hàng mới
        const row = tableData[rowIndex];
        const tempRow = {};
        Object.keys(row).forEach(key => {
            tempRow[`${rowIndex}-${key}`] = {
                rowIndex,
                colKey: key,
                newValue: row[key]
            };
        });
        setTempDataState(tempRow); // <-- Reset, không merge vào state cũ
    };
    const deleteRow = (rowIndex) => {
        setTableData(prev => prev.filter((_, i) => i !== rowIndex));
    };
    const handleFilterChange = (filterType, value) => {
        setFilterValues(prev => ({
            ...prev,
            [filterType]: value
        }));
    };
    const applyFilters = () => {
        setIsFilterOpen(false);
    };

    // Hàm reset filter
    const resetFilters = () => {
        setFilterValues({
            group: "",
            proteinType: ""
        });
        setIsFilterOpen(false);
    };

    // Hàm filter dữ liệu
    const filteredData = tableData.filter(row => {
        return (
            (filterValues.group === "" || row.group === filterValues.group) &&
            (filterValues.proteinType === "" || row.proteinType === filterValues.proteinType)
        );
    });
    const handleChange = (e, rowIndex, colKey) => {
        const value = e.target.value;
        const cellKey = `${rowIndex}-${colKey}`;
        setTempDataState(prev => ({
            ...prev,
            [cellKey]: { ...prev[cellKey], newValue: value }
        }));
    };

    const handleKeyDown = (e, rowIndex) => {
        if (e.key === "Enter") {
            const updatedTable = [...tableData];
            // commit dữ liệu từ tempDataState
            Object.keys(tempDataState).forEach(cellKey => {
                const { rowIndex: rIndex, colKey, newValue } = tempDataState[cellKey];
                updatedTable[rIndex][colKey] = newValue;
            });

            // tính thay đổi
            let changes = [];
            updatedTable.forEach((row, rIndex) => {
                const oldRow = originalData[rIndex] || {};
                Object.keys(row).forEach(key => {
                    if (row[key] !== oldRow[key]) {
                        changes.push({
                            row: oldRow.name,
                            col: key,
                            oldValue: oldRow[key] ?? "",
                            newValue: row[key] ?? ""
                        });
                    }
                });
            });

            if (changes.length > 0) {
                setChangedCells(changes);
                setShowDialog(true);
            }

            setTableData(updatedTable);
            setEditingRow(null);
        }
    };

    const addRow = () => {
        const newRow = { name: "", group: groupOptions[0], proteinType: "", Edible: "", Energy: "", E: "", Water: "" };
        setTableData(prev => [...prev, newRow]);
        setEditingRow(tableData.length);
    };
    const columnGroups = [
        {
            group: "Thông tin chung",
            key: "general",
            columns: [
                { key: "Edible", label: "Edible (%)" },
                { key: "Energy", label: "Energy (Kcal)" },
                { key: "E", label: "E" },
                { key: "Water", label: "Water (g)" },
            ]
        },
        {
            group: "Main Nutrients (chất đa lượng)",
            key: "main_nutrients",
            columns: [
                { key: "Protein", label: "Protein (g)" },
                { key: "P", label: "P (?)" },
                { key: "Fat", label: "Fat (g)" },
                { key: "Carbohydrate", label: "Carbohydrate (g)" },
                { key: "G", label: "G (?)" },
                { key: "Fiber", label: "Fiber (g)" },
                { key: "Ash", label: "Ash (g)" },
            ]
        },
        {
            group: "Minerals (chất khoáng)",
            key: "minerals",
            columns: [
                { key: "Calci", label: "Calci (mg)" },
                { key: "Phosphorous", label: "Phosphorous (mg)" },
                { key: "Iron", label: "Iron (mg)" },
            ]
        }
    ];
    const [visibleColumns, setVisibleColumns] = useState(
        columnGroups.flatMap(group => group.columns.map(col => col.key))
    );

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

            {/* Controls */}
            <div className={styles.widgetControls}>
                <div className={styles.controlsLeft}>
                    <div className={styles.searchInput}>
                        <input type="text" placeholder="Tìm kiếm..." />
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
                    <button className={`${styles.btn} ${styles.btnPrimary}`}>Upload Excel</button>
                    <button
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={addRow}
                    >
                        <img src={getImage("add.svg")} alt="" className={styles.iconSm} />
                        <span>Add</span>
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
                    {tableData.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={styles.tableRow}
                            onDoubleClick={() => editRow(rowIndex)}
                        >
                            <div className={styles.tableCell}>
                                {editingRow === rowIndex ? (
                                    <input
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
