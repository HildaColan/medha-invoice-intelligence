const AUTH_KEY = "medha_auth";

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === "1";
}

export function login(): void {
  localStorage.setItem(AUTH_KEY, "1");
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}
