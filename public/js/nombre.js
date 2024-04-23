async function fetchUsuarioEmail() {
  try {
    const response = await fetch("/user-info", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Hubo un error al obtener los datos del usuario");
    }

    const data = await response.json();

    document.querySelector(".nombreUsuario").textContent = data.nombre;
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchUsuarioEmail);

function logout() {
  localStorage.removeItem("auth-token");
  window.location.href = "index.html";
}
