import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../css/FoodTable.module.css";

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

// categoryAPI
const categoryAPI = {
  getCategories: () => API.get("superadmin/category/"),
  getCategory: (id) => API.get(`superadmin/category/${id}`),
  createCategory: (data) => API.post("superadmin/category/", data),
  updateCategory: (id, data) => API.put(`superadmin/category/${id}`, data),
  deleteCategory: (id) => API.delete(`superadmin/category/${id}`),
};

export default function CategoryTable() {
  const images = import.meta.glob('../assets/images/*', { eager: true, import: 'default' });
  const getImage = (name) => images[`../assets/images/${name}`];
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [tempData, setTempData] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [changedCells, setChangedCells] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Dữ liệu mẫu để test khi API không hoạt động
  const sampleData = [
    { id: 1, categoryName: "Thịt" },
    { id: 2, categoryName: "Cá" },
    { id: 3, categoryName: "Rau củ" },
    { id: 4, categoryName: "Trái cây" },
    { id: 5, categoryName: "Đồ uống" }
  ];

  // Fetch data on component mount
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getCategories();
      let categories = response.data;

      if (categories && Array.isArray(categories)) {
        const categoriesWithFakeId = categories.map((item, index) => ({
          id: item.id,                       // ✅ id thật từ backend
          categoryName: item.categoryName,
          fakeId: index + 1                  // ✅ id giả để render
        }));
        setTableData(categoriesWithFakeId);
      } else {
        const categoriesWithFakeId = sampleData.map((item, index) => ({
          id: item.id,
          categoryName: item.categoryName,
          fakeId: index + 1
        }));
        setTableData(categoriesWithFakeId);
      }


      setError(null);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu: " + (err.response?.data?.message || err.message));
      console.error("Fetch error:", err);

      // fallback dữ liệu mẫu
      const categoriesWithFakeId = sampleData.map((item, index) => ({
        ...item,
        fakeId: index + 1
      }));
      setTableData(categoriesWithFakeId);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCategories();
  }, []);

  const editRow = (rowIndex) => {
    const row = tableData[rowIndex];
    setOriginalData({ ...originalData, [rowIndex]: { ...row } });
    setEditingRow(rowIndex);
    setTempData({ ...tempData, [rowIndex]: { ...row } });
  };

  const cancelEdit = (rowIndex) => {
    if (!tableData[rowIndex].categoryName) {
      // Nếu là hàng mới chưa có ID, xóa nó
      const newData = tableData.filter((_, i) => i !== rowIndex);
      setTableData(newData);
    }
    setEditingRow(null);
    setTempData({ ...tempData, [rowIndex]: null });
  };

  const deleteRow = async (rowIndex) => {
    const row = tableData[rowIndex];
    if (window.confirm(`Bạn có chắc muốn xóa "${row.categoryName}"?`)) {
      try {
        if (row.id) {
          await categoryAPI.deleteCategory(row.id);
        }
        const newData = tableData.filter((_, i) => i !== rowIndex);
        setTableData(newData);
      } catch (err) {
        setError("Lỗi khi xóa: " + (err.response?.data?.message || err.message));
        console.error("Delete error:", err);
      }
    }
  };

  const handleChange = (e, rowIndex, field) => {
    const value = e.target.value;
    setTempData({
      ...tempData,
      [rowIndex]: {
        ...tempData[rowIndex],
        [field]: value
      }
    });
  };

  const handleKeyDown = (e, rowIndex) => {
    if (e.key === "Enter") {
      saveRow(rowIndex);
    } else if (e.key === "Escape") {
      cancelEdit(rowIndex);
    }
  };

  const saveRow = async (rowIndex) => {
  const updatedRow = tempData[rowIndex];
  const originalRow = originalData[rowIndex] || {};

  const changes = [];
  if (updatedRow.categoryName !== originalRow.categoryName) {
    changes.push({
      row: originalRow.categoryName || "New Row",
      col: "categoryName",
      oldValue: originalRow.categoryName || "",
      newValue: updatedRow.categoryName
    });
  }

  if (changes.length > 0) {
    setChangedCells(changes);
    try {
      if (updatedRow.id) {
        // ✅ Có id thật -> Update
        const response = await categoryAPI.updateCategory(updatedRow.id, { categoryName: updatedRow.categoryName });
        const newRow = {
          ...updatedRow,
          id: response.data.id,         // id thật backend trả về
          fakeId: updatedRow.fakeId
        };

        const newData = [...tableData];
        newData[rowIndex] = newRow;
        setTableData(newData);
        setOriginalData(prev => ({ ...prev, [rowIndex]: newRow }));
        setTempData(prev => ({ ...prev, [rowIndex]: newRow }));

      } else {
        // ✅ Chưa có id thật -> Create mới
        const response = await categoryAPI.createCategory({ categoryName: updatedRow.categoryName });
        const newRow = {
          ...updatedRow,
          id: response.data.id,        // lấy id thật từ backend
          fakeId: updatedRow.fakeId    // giữ nguyên fakeId
        };

        const newData = [...tableData];
        newData[rowIndex] = newRow;
        setTableData(newData);
        setOriginalData(prev => ({ ...prev, [rowIndex]: newRow }));
        setTempData(prev => ({ ...prev, [rowIndex]: newRow }));
      }

      setShowDialog(true);
    } catch (err) {
      setError("Lỗi khi lưu: " + (err.response?.data?.message || err.message));
      console.error("Save error:", err);

      if (originalData[rowIndex]) {
        const newData = [...tableData];
        newData[rowIndex] = { ...originalData[rowIndex] };
        setTableData(newData);
      }
    }
  }

  setEditingRow(null);
};




  const addRow = () => {
    const maxFakeId = tableData.length > 0
      ? Math.max(...tableData.map(item => item.fakeId || 0))
      : 0;

    const newRow = { id: null, fakeId: maxFakeId + 1, categoryName: "" };

    setTableData(prev => {
      const newData = [...prev, newRow];
      const newIndex = newData.length - 1;

      setEditingRow(newIndex);
      setTempData(prevTemp => ({
        ...prevTemp,
        [newIndex]: { ...newRow }
      }));
      setOriginalData(prevOriginal => ({
        ...prevOriginal,
        [newIndex]: { ...newRow }
      }));

      return newData;
    });
  };


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Lọc dữ liệu dựa trên searchTerm
  const filteredData = tableData.filter(item =>
    (item.categoryName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;

  return (
    <div>
      {/* Header */}
      <header className={styles.siteHeader}>
        <h1 className={styles.siteTitle}>Bảng Danh Mục</h1>
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

      <div className={styles.tableWrapper}>
        <div className={styles.categoryTable}>
          <div className={`${styles.tableRow} ${styles.tableHeader}`}>
            <div className={styles.tableCell}>ID</div>
            <div className={styles.tableCell}>Tên danh mục</div>
            <div className={styles.tableCell}>Hành động</div>
          </div>

          {filteredData.map((row, rowIndex) => (
            <div
              key={row.id ? `id-${row.id}` : `fake-${row.fakeId}`}
              className={styles.tableRow}
              onDoubleClick={() => !editingRow && editRow(rowIndex)}
            >
              {/* Cột ID */}
              <div className={styles.tableCell}>
                {row.fakeId || "-"}
              </div>


              {/* Cột Tên danh mục */}
              <div className={styles.tableCell}>
                {editingRow === rowIndex ? (
                  <input
                    value={tempData[rowIndex]?.categoryName || ""}
                    onChange={e => handleChange(e, rowIndex, "categoryName")}
                    onKeyDown={e => handleKeyDown(e, rowIndex)}
                    autoFocus
                  />
                ) : row.categoryName}
              </div>

              {/* Cột Hành động */}
              <div className={styles.tableCell}>
                {editingRow === rowIndex ? (
                  <>
                    <button onClick={() => saveRow(rowIndex)}>💾</button>
                    <button onClick={() => cancelEdit(rowIndex)}>❌</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => editRow(rowIndex)}>✏️</button>
                    <button onClick={() => deleteRow(rowIndex)}>🗑️</button>
                  </>
                )}
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