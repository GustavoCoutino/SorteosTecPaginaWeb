async function categorizarUsuario(event) {
  event.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const password = document.querySelector('input[type="password"]').value;
  console.log(usuario, password);

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
  console.log("response", response);
  const data = await response.json();
  if (data.error) {
    document.getElementById("error").innerText = data.error;
  } else {
    if (data.role == "usuario") {
      window.location.href = "Juegos.html";
    } else if (data.role) {
      window.location.href = "Estadisticas.html";
    }
  }
}

function validarCorreo(correo) {
  const expresion = /\S+@\S+\.\S+/;
  return expresion.test(correo);
}

function formatCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

async function crearUsuario(event) {
  event.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("correo").value;
  const contraseña = document.getElementById("contraseña").value;
  const telefono = document.getElementById("telefono").value;
  const estado = document.getElementById("estado").value;
  const ciudad = document.getElementById("ciudad").value;
  const apellido_materno = document.getElementById("apellido_materno").value;
  const apellido_paterno = document.getElementById("apellido_paterno").value;
  const fecha_registro = formatCurrentDate();

  console.log(
    nombre,
    email,
    contraseña,
    telefono,
    estado,
    ciudad,
    apellido_materno,
    apellido_paterno,
    fecha_registro
  );

  const nuevoUsuario = {
    nombre: nombre,
    email: email,
    password: contraseña,
    telefono: telefono,
    estado: estado,
    ciudad: ciudad,
    apellido_materno: apellido_materno,
    apellido_paterno: apellido_paterno,
    fecha_registro: fecha_registro,
  };
  const response = await fetch("http://localhost:3001/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoUsuario),
  });

  const data = await response.json();
  if (data.success) {
    window.location.href = "Perfil.html";
  }
}
