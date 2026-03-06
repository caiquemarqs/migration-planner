export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  planId?: string;
  demoMode: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
