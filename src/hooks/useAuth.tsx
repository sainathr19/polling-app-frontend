/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import axiosInstance from "@/services/api.service";
import React, {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  setIsAuthenticated : Dispatch<SetStateAction<boolean>>
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated : false,
  loading : false,
  setIsAuthenticated : ()=>{}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("auth/verify", {
          withCredentials: true,
        });
        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);
  useEffect(()=>{
    console.log("Auth Status : ",isAuthenticated);
  },[isAuthenticated])

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading ,setIsAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
};
