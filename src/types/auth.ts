export type SystemRole = "ADMIN" | "MANAGER" | "DEVELOPER" | "MEMBER";

export interface ProjectRole {
  projectId: number;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  companyId?: number;
  companyName?: string;
  isCompany?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  email: string;
  fullName: string;
  systemRole: SystemRole;
}

export interface UserProfileResponse {
  userId: number;
  email: string;
  fullName: string;
  systemRole: SystemRole;
  companyId?: number | null;
  companyName?: string | null;
  projectRoles: ProjectRole[];
}

export interface AuthErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}
