// import React, { createContext, useContext, useState, useCallback } from "react";

// interface User {
//   id: string;
//   username: string;
//   email: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (username: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);

//   if (!ctx) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }

//   return ctx;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

//   const [user, setUser] = useState<User | null>(null);

//   // LOGIN
//   const login = useCallback(async (email: string, password: string) => {

//     const response = await fetch(
//       "http://127.0.0.1:8000/api/accounts/login/",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ email, password }),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || "Login failed");
//     }

//     setUser(data);

//   }, []);

//   // SIGNUP
//   const signup = useCallback(async (
//     username: string,
//     email: string,
//     password: string
//   ) => {

//     const response = await fetch(
//       "http://127.0.0.1:8000/api/accounts/register/",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           username,
//           email,
//           password,
//         }),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || "Signup failed");
//     }

//     setUser(data);

//   }, []);

//   // LOGOUT
//   const logout = useCallback(() => {
//     setUser(null);
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         login,
//         signup,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
import React, { createContext, useContext, useState, useCallback } from "react";

const API_BASE = "http://127.0.0.1:8000/api";

interface User {
  id: string;
  username: string;
  email: string;
  isStaff: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("interview_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/accounts/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data.error || data.detail || "Login failed";
      throw new Error(message);
    }

    const loggedInUser: User = {
      id:       String(data.id),
      username: data.username,
      email:    data.email,
      isStaff:  data.is_staff || false,
    };

    setUser(loggedInUser);
    localStorage.setItem("interview_user", JSON.stringify(loggedInUser));
  }, []);

  const signup = useCallback(async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE}/accounts/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data.email?.[0]    ||
        data.username?.[0] ||
        data.password?.[0] ||
        data.detail        ||
        "Signup failed";
      throw new Error(message);
    }

    const newUser: User = {
      id:       String(data.id),
      username: data.username,
      email:    data.email,
      isStaff:  data.is_staff || false,
    };

    setUser(newUser);
    localStorage.setItem("interview_user", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("interview_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};