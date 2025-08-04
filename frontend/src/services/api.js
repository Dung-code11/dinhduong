const API_BASE = "http://localhost:8080/api/auth";

export const loginUser = async (data) => {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include" // 👈 BẮT BUỘC nếu backend allowCredentials
    });
    if (!res.ok) throw new Error("Login failed");
    return await res.json();
};

export const registerUser = async (data) => {
    const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include" // 👈 THÊM DÒNG NÀY
    });
    if (!res.ok) throw new Error("Register failed");
    return await res.json();
};