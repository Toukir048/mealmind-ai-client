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
import type { AuthResponse, AuthUser, DataResponse } from '../types/auth';
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

  useEffect(() => {
    const restoreSession = async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser !== null) {
          const idToken = await firebaseUser.getIdToken();
          const { data } = await api.post<AuthResponse>('/auth/google', { idToken });
          localStorage.setItem(AUTH_TOKEN_KEY, data.data.token);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
          setUser(data.data.user);
        } else if (localStorage.getItem(AUTH_TOKEN_KEY) !== null) {
          const { data } = await api.get<DataResponse<AuthUser>>('/auth/me');
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.data));
          setUser(data.data);
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
      return undefined;
    }
    return onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      void restoreSession(firebaseUser);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      loginWithGoogle: async () => {
        if (firebaseAuth === undefined) throw new Error('Firebase is not configured');
        await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
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
