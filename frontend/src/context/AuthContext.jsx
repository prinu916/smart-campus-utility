import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

const normalizeRole = (userData) => {
  if (!userData) return null;

  const email = typeof userData.email === "string" ? userData.email.toLowerCase() : "";
  const isAdminEmail = email.includes("admin");

  if (userData.role === "admin") return "admin";
  if (isAdminEmail) return "admin";
  if (userData.role === "student") return "student";

  return "student";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("scu_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("scu_user");
    const storedToken = localStorage.getItem("scu_token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch (error) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const persistSession = (response) => {
    const authToken = response.token;
    const currentUser = response.user;
    if (authToken && currentUser) {
      localStorage.setItem("scu_token", authToken);
      localStorage.setItem("scu_user", JSON.stringify(currentUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      setToken(authToken);
      setUser(currentUser);
    }
  };

  const login = async (email, password, adminCode = "") => {
    const { data } = await api.post("/auth/login", { email, password, adminCode });
    const responseData = data && data.user ? data : { token: data?.token, user: data?.user || data };
    persistSession(responseData);
    return responseData;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("scu_token");
    localStorage.removeItem("scu_user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedUser) => {
    const mergedUser = updatedUser && typeof updatedUser === "object"
      ? { ...(user || {}), ...updatedUser }
      : user;

    setUser(mergedUser);
    if (mergedUser) {
      localStorage.setItem("scu_user", JSON.stringify(mergedUser));
    }
  };

  const getDashboardPath = (userData) => {
    return normalizeRole(userData) === "admin" ? "/admin/dashboard" : "/dashboard";
  };

  const role = normalizeRole(user);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAuthenticated: !!user, isAdmin: role === "admin", isStudent: role === "student", getDashboardPath }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;