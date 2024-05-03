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

  if (
    nombre === "" ||
    email === "" ||
    contraseña === "" ||
    telefono === "" ||
    estado === "" ||
    ciudad === "" ||
    apellido_materno === "" ||
    apellido_paterno === "" ||
    telefono === ""
  ) {
    document.getElementById("error").innerText =
      "Todos los campos son obligatorios";
    return;
  }

  if (telefono.length > 10 || telefono.length < 10) {
    document.getElementById("error").innerText =
      "El número de teléfono debe de contener 10 dígitos";
    return;
  }

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
    window.location.href = "InicioSesion.html";
  }
}

async function crearUsuarioAdmin(event) {
  event.preventDefault();

  const perfil = document.getElementById("perfil").value;

  if (perfil === "Administrador") {
    crearAdmindAdmin(event);
  } else if (perfil === "Usuario") {
    crearUsuariodAdmin(event);
  }
}

async function crearUsuariodAdmin(event) {
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

  if (
    nombre === "" ||
    email === "" ||
    contraseña === "" ||
    telefono === "" ||
    estado === "" ||
    ciudad === "" ||
    apellido_materno === "" ||
    apellido_paterno === ""
  ) {
    document.getElementById("error").innerText =
      "Todos los campos son obligatorios";
    return;
  }

  if (telefono.length > 10 || telefono.length < 10) {
    document.getElementById("error").innerText =
      "El número de teléfono debe de contener 10 dígitos";
    return;
  }

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
    window.location.href = "Estadisticas.html";
  }
}

async function crearAdmindAdmin(event) {
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

  if (telefono.length > 10 || telefono.length < 10) {
    document.getElementById("error").innerText =
      "El número de teléfono debe de contener 10 dígitos";
    return;
  }

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
  const response = await fetch("http://localhost:3001/signin-admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoUsuario),
  });

  const data = await response.json();
  if (data.success) {
    window.location.href = "Estadisticas.html";
  }
}

function togglePasswordVisibility() {
  var passwordInput = document.getElementById("contraseña");
  var toggleIcon = document.getElementById("togglePassword");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

var estadosMexico = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Estado de México",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
];

var selectEstado = document.getElementById("estado");

estadosMexico.forEach(function (estado) {
  var option = document.createElement("option");
  option.value = estado;
  option.text = estado;
  selectEstado.appendChild(option);
});

var perfilesCuenta = ["Usuario", "Administrador"];

var selectPerfil = document.getElementById("perfil");

perfilesCuenta.forEach(function (perfil) {
  var option = document.createElement("option");
  option.value = perfil;
  option.text = perfil;
  selectPerfil.appendChild(option);
});
