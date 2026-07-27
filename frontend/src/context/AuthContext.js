import React, { createContext, useState, useContext } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // =====================================================
  // LOGIN
  // =====================================================
  const login = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // =====================================================
  // LOGOUT
  // =====================================================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const hasRole = (role, allowedRoles = []) => {
    return allowedRoles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
