export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  nickname: string;
  roles: string[];
  birthdate?: string;
  imgProfile?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: number;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  nickname: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: number;
}
