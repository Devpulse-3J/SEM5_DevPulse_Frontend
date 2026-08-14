import { PASSWORD_MIN_LENGTH } from "./constants";

/**
 * Client-side mirrors of the server's validation rules.
 *
 * These must match the backend exactly — no stricter, no looser. Stricter and
 * the user is blocked from a value the server would accept; looser and the
 * round trip is wasted. The server remains the authority: on a 400 the
 * `fieldErrors` it returns are rendered on the offending field.
 */

/** Matches the server's "valid email format" check. */
export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Please enter a valid email address";
  }
  return undefined;
}

/** Server rule: minimum 8 characters. */
export function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required";
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  return undefined;
}

/** Server rule: non-blank. */
export function validateFullName(value: string): string | undefined {
  if (!value.trim()) return "Full name is required";
  return undefined;
}

/** Only required when registering a company (isCompany: true). */
export function validateCompanyName(value: string): string | undefined {
  if (!value.trim()) return "Company name is required";
  return undefined;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export function validateLoginForm(values: {
  email: string;
  password: string;
}): LoginFormErrors | null {
  const errors: LoginFormErrors = {};
  const email = validateEmail(values.email);
  const password = validatePassword(values.password);
  if (email) errors.email = email;
  if (password) errors.password = password;
  return Object.keys(errors).length ? errors : null;
}

export interface RegisterFormErrors extends LoginFormErrors {
  fullName?: string;
  companyName?: string;
}

export function validateRegisterForm(values: {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
  isCompany?: boolean;
}): RegisterFormErrors | null {
  const errors: RegisterFormErrors = {};
  const email = validateEmail(values.email);
  const password = validatePassword(values.password);
  const fullName = validateFullName(values.fullName);
  if (email) errors.email = email;
  if (password) errors.password = password;
  if (fullName) errors.fullName = fullName;
  if (values.isCompany) {
    const companyName = validateCompanyName(values.companyName ?? "");
    if (companyName) errors.companyName = companyName;
  }
  return Object.keys(errors).length ? errors : null;
}
