document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("auth-token");
  if (token) {
    identificarRol(token);
  }
});

async function identificarRol(token) {
  const response = await fetch("http://localhost:3001/es-admin", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await response.json();
  if (data.esAdmin) {
    window.location.href = "Estadisticas.html";
  } else {
    window.location.href = "Juegos.html";
  }
}

async function categorizarUsuario(event) {
  event.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  if (usuario === "" || password === "") {
    document.getElementById("error").innerText =
      "Por favor, llena todos los campos";
    return;
  }

  if (!validarCorreo(usuario)) {
    document.getElementById("error").innerText = "Correo inválido";
    return;
  }

  const response = await fetch("http://localhost:3001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario: usuario,
      contraseña: password,
    }),
  });
  const data = await response.json();
  if (data.error) {
    document.getElementById("error").innerText = data.error;
  } else if (data.role === 0) {
    localStorage.setItem("auth-token", data.token);
    window.location.href = "Juegos.html";
  } else if (data.role == 1) {
    localStorage.setItem("auth-token", data.token);
    window.location.href = "Estadisticas.html";
  } else {
    document.getElementById("error").innerText = data.message;
  }
}

function validarCorreo(correo) {
  const expresion = /\S+@\S+\.\S+/;
  return expresion.test(correo);
}
