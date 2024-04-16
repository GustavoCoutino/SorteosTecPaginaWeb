function logout() {
  localStorage.removeItem("auth-token");
  window.location.href = "index.html";
}
