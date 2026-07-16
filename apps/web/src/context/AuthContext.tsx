import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "../lib/api";
import type {
  User,
  AuthContextType,
  LoginData,
  RegisterData,
} from "../index/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get<User>("/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error("Session check failed", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post<User>("/auth/register", data);
      setUser(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.post<User>("/auth/login", data);
      setUser(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
