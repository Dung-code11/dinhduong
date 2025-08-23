import axios from "axios";

const API_URL = "http://localhost:8080/api/user/ingredients";

export const getIngredients = () => axios.get(API_URL);

export const getIngredientById = (id) => axios.get(`${API_URL}/${id}`);

export const createIngredient = (data) => axios.post(API_URL, data);

export const updateIngredient = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteIngredient = (id) => axios.delete(`${API_URL}/${id}`);
