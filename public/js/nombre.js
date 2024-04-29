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

function formatCurrentDate() {
  let date = new Date();

  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let hours = ("0" + date.getHours()).slice(-2);
  let minutes = ("0" + date.getMinutes()).slice(-2);
  let seconds = ("0" + date.getSeconds()).slice(-2);

  let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

function logout() {
  localStorage.removeItem("auth-token");
  window.location.href = "index.html";
}

document.querySelectorAll(".gameButton").forEach((button) => {
  button.addEventListener("click", function () {
    const productoId = this.getAttribute("data-producto-id");
    const gameName = this.getAttribute("data-game-name");
    const url = this.getAttribute("data-game-url");
    const contenedor = document.getElementById("addCardContainer");
    contenedor.style.display = "block";
    contenedor.style.zIndex = "1000";

    document.getElementById("nombreJuegoParrafo").textContent =
      "Selected Game: " +
      this.querySelector(".nomjuego_v, .nomjuego_g, .nomjuego_a").textContent;

    document.getElementById("realizarCompra").onclick = function () {
      makePurchase(productoId, gameName, url);
    };
  });
});

document.getElementById("cerrarBoton").addEventListener("click", function () {
  var contenedor = document.getElementById("addCardContainer");
  contenedor.style.display = "none";
});

async function makePurchase(productoId, nombreJuego, url) {
  const response = await fetch("/buy-access", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("auth-token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productoId,
      fecha: formatCurrentDate(),
      nombreJuego,
    }),
  });
  if (response.ok) {
    alert("Compra realizada con éxito");
    window.location = url;
  } else {
    alert("No hay saldo suficiente para realizar la compra");
  }
}
