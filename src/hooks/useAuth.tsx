import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  session: null;
  user: null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading] = useState(false);

  const signOut = async () => {
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider
      value={{ session: null, user: null, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
