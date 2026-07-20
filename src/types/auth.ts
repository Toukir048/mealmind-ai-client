export interface AuthUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'user' | 'admin';
  authProvider: 'local' | 'google';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  data: { user: AuthUser; token: string };
}

export interface DataResponse<T> {
  data: T;
}
