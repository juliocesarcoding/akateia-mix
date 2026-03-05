export function logout() {
 if (typeof window !== "undefined") {
  localStorage.removeItem("auth_token");
 }

 window.location.href = "/login";
}
