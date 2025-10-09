"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

type StoredUser = {
  email: string;
  password: string;
  accountName: string;
};

type User = Pick<StoredUser, "email" | "accountName">;

type SignUpInput = {
  email: string;
  password: string;
  accountName: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signUp: (input: SignUpInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
};

const USERS_KEY = "sagora.users";
const SESSION_KEY = "sagora.session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(USERS_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is StoredUser => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.email === "string" &&
        typeof item.password === "string" &&
        typeof item.accountName === "string"
      );
    });
  } catch (error) {
    console.error("Impossible de lire les utilisateurs enregistrés", error);
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function persistSession(user: User | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function readSession(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.email === "string" &&
      typeof parsed.accountName === "string"
    ) {
      return { email: parsed.email, accountName: parsed.accountName };
    }

    return null;
  } catch (error) {
    console.error("Impossible de lire la session sauvegardée", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = readSession();

    if (session) {
      setUser(session);
    }

    setLoading(false);
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    if (typeof window === "undefined") {
      throw new Error("La création de compte est uniquement disponible côté client.");
    }

    const email = input.email.trim().toLowerCase();
    const accountName = input.accountName.trim();
    const password = input.password.trim();

    if (!email || !email.includes("@")) {
      throw new Error("Merci d'indiquer une adresse email valide.");
    }

    if (accountName.length < 2) {
      throw new Error("Le nom du compte doit contenir au moins 2 caractères.");
    }

    if (password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
    }

    const existingUsers = readUsers();

    if (existingUsers.some((stored) => stored.email === email)) {
      throw new Error("Un compte existe déjà avec cette adresse email.");
    }

    const newUser: StoredUser = {
      email,
      password,
      accountName
    };

    const updatedUsers = [...existingUsers, newUser];

    writeUsers(updatedUsers);

    const sessionUser: User = { email, accountName };

    persistSession(sessionUser);
    setUser(sessionUser);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    if (typeof window === "undefined") {
      throw new Error("La connexion est uniquement disponible côté client.");
    }

    const email = input.email.trim().toLowerCase();
    const password = input.password.trim();

    if (!email || !password) {
      throw new Error("Merci de renseigner votre email et votre mot de passe.");
    }

    const existingUsers = readUsers();

    const match = existingUsers.find((stored) => stored.email === email);

    if (!match) {
      throw new Error("Aucun compte n'est associé à cette adresse email.");
    }

    if (match.password !== password) {
      throw new Error("Le mot de passe est incorrect.");
    }

    const sessionUser: User = { email: match.email, accountName: match.accountName };

    persistSession(sessionUser);
    setUser(sessionUser);
  }, []);

  const logout = useCallback(() => {
    persistSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp,
      login,
      logout
    }),
    [user, loading, signUp, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }

  return context;
}
