import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { firebaseAuth } from '../config/firebase';
import { api, AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../services/api';
import type {
  AuthResponse,
  AuthUser,
  DataResponse,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth';
import { AuthContext, type AuthContextValue } from './auth-context';

const readCachedUser = (): AuthUser | null => {
  const value = localStorage.getItem(AUTH_USER_KEY);
  if (value === null) return null;
  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readCachedUser);
  const [isLoading, setIsLoading] = useState(true);

  const saveSession = (response: AuthResponse) => {
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('mealmind:unauthorized', handleUnauthorized);
    const restoreSession = async (firebaseUser: FirebaseUser | null) => {
      try {
        if (localStorage.getItem(AUTH_TOKEN_KEY) !== null) {
          const { data } = await api.get<DataResponse<AuthUser>>('/auth/me');
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data));
          setUser(data.data);
        } else if (firebaseUser !== null) {
          const idToken = await firebaseUser.getIdToken();
          const { data } = await api.post<AuthResponse>('/auth/google', { idToken });
          saveSession(data);
        } else {
          setUser(null);
        }
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (firebaseAuth === undefined) {
      void restoreSession(null);
      return () => window.removeEventListener('mealmind:unauthorized', handleUnauthorized);
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      void restoreSession(firebaseUser);
    });
    return () => { unsubscribe(); window.removeEventListener('mealmind:unauthorized', handleUnauthorized); };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (credentials: LoginCredentials) => {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        saveSession(data);
      },
      register: async (credentials: RegisterCredentials) => {
        const { data } = await api.post<AuthResponse>('/auth/register', credentials);
        saveSession(data);
      },
      loginWithGoogle: async () => {
        if (firebaseAuth === undefined) throw new Error('Firebase is not configured');
        const result = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
        const idToken = await result.user.getIdToken();
        const { data } = await api.post<AuthResponse>('/auth/google', { idToken });
        saveSession(data);
      },
      logout: async () => {
        if (firebaseAuth !== undefined) await signOut(firebaseAuth);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setUser(null);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
