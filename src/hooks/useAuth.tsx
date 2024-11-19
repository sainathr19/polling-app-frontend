/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import axiosInstance from "@/services/api.service";
import React, {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  Username: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  setIsAuthenticated: () => {},
  Username: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [Username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const verifyUser = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("auth/verify", {
        withCredentials: true,
      });
      
      if (res.status === 200 && res.data) {
        setIsAuthenticated(true);
        setUsername(res.data.username || res.data);
      } else {
        setIsAuthenticated(false);
        setUsername(null);
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUsername(null);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    verifyUser();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        loading, 
        setIsAuthenticated, 
        Username 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};