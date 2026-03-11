export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: number;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: number;
}
