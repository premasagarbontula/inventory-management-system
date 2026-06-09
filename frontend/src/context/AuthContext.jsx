import { useState, createContext, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null, loading: true });

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await API.get("/users/me");
        setAuth({ user: data, loading: false });
      } catch (error) {
        console.error(error);
        setAuth({ user: null, loading: false });
      }
    }
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
