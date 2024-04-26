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

function validarCorreo(correo) {
  const expresion = /\S+@\S+\.\S+/;
  return expresion.test(correo);
}

async function fetchEmailExists(email) {
  const response = await fetch("http://localhost:3001/email-exists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  });

  const data = await response.json();
  return data.exists[0].length > 0;
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
    apellido_paterno === ""
  ) {
    alert("Por favor, llena todos los campos");
  }

  if (!validarCorreo(email)) {
    alert("Correo inválido");
    return;
  }

  const emailExists = await fetchEmailExists(email);
  if (emailExists) {
    alert("El correo ya está registrado");
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

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("contraseña");
  const toggleIcon = document.getElementById("togglePassword");

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
