import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    axios.get("/api/account/profile", { withCredentials: true })
      .then(res => setAccount(res.data))
      .catch(() => setAccount(null));
  }, []);

  return (
    <AuthContext.Provider value={{ account, setAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
