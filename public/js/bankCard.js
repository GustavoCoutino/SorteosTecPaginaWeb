function hideCardNumber(num_tarjeta) {
  return "**** **** **** " + String(num_tarjeta).slice(-4);
}

async function fetchCards() {
  const response = await fetch("/payment-data", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("auth-token"),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Hubo un error al obtener los datos de las tarjetas");
  }
  const data = await response.json();
  const h3 = document.querySelector("#saldo");
  h3.textContent = data.saldo;
  const divExterior = document.querySelector("#cardListContainer");
  for (let i = 0; i < data.cuentas.length; i++) {
    const divInterior = document.createElement("div");
    divInterior.innerHTML = `
    <div class="tarjeta_fijo">
      <div class="div_centrado">
        <div class="div_horizontal">
          <div>
            <img class="tarjeta" src="${
              data.cuentas[i].tipo === "Crédito"
                ? "Assets/tarjetaMorada.png"
                : "Assets/tarjetaNegra.png"
            }">
          </div>
          <div class="div_datosT">
            <p class="p1">Cuenta ${data.cuentas[i].banco}</p>
            <p class="p2">${hideCardNumber(data.cuentas[i].num_tarjeta)}</p>
          </div>
          <div class="ai-cen">
            <button class="botonET" onclick="confirmCard('${
              data.cuentas[i].num_tarjeta
            }')">Eliminar</button>
          </div>
        </div>
      </div>
    </div>`;
    divExterior.appendChild(divInterior);
  }
}

async function fetchCardP() {
  const response = await fetch("/payment-data", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("auth-token"),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Hubo un error al obtener los datos de las tarjetas");
  }
  const data = await response.json();
  const h3 = document.querySelector("#saldo");
  h3.textContent = data.saldo;
  const divExterior = document.querySelector("#CardListPay");
  for (let i = 0; i < data.cuentas.length; i++) {
    const divInterior = document.createElement("div");
    divInterior.innerHTML = `
    <option>
      <div class="tarjeta_fijo">
        <div class="div_centrado">
          <div>
            <img class="tarjeta" src="${
              data.cuentas[i].tipo === "Crédito"
                ? "Assets/tarjetaMorada.png"
                : "Assets/tarjetaNegra.png"
            }">
            <p class="p1">Cuenta ${data.cuentas[i].banco}</p>
            <p class="p2">${hideCardNumber(data.cuentas[i].num_tarjeta)}</p>
          </div>
        </div>
      </div>
    </option>`;
    divExterior.appendChild(divInterior);
  }
}

document.addEventListener("DOMContentLoaded", fetchCards);
document.addEventListener("DOMContentLoaded", fetchCardP);

async function crearCard(event) {
  event.preventDefault();
  const banco = document.querySelector("#banco").value;
  const num_tarjeta = document.querySelector("#numeroTarjeta").value;
  const cvv = document.querySelector("#cvvTarjeta").value;
  const tipo = document.querySelector("#tipo").value;
  console.log(banco, num_tarjeta, cvv, tipo);
  if (banco === "" || num_tarjeta === "" || cvv === "" || tipo === "") {
    alert("Por favor, llena todos los campos");
    return;
  }
  if (num_tarjeta.length !== 16) {
    alert("El número de tarjeta debe tener 16 dígitos");
    return;
  }
  if (cvv.length !== 3) {
    alert("El CVV debe tener 3 dígitos");
    return;
  }
  const response = await fetch("/add-card", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("auth-token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      banco: banco,
      numero: num_tarjeta,
      cvv: cvv,
      tipo: tipo,
    }),
  });
  if (!response.ok) {
    throw new Error("Hubo un error al crear la tarjeta");
  }
  location.reload();
}

async function confirmCard(num_tarjeta) {
  const confirmarEliminar = document.getElementById("confirmarEliminar");
  confirmarEliminar.style.display = "block";

  const cancelarBtn = document.getElementById("cancelarEliminar");
  cancelarBtn.addEventListener("click", () => {
    confirmarEliminar.style.display = "none";
  });

  const confirmarEliminarBtn = document.getElementById("confirmarEliminarBtn");
  confirmarEliminarBtn.addEventListener("click", async () => {
    confirmarEliminar.style.display = "none";
    await borrarCard(num_tarjeta);
  });
}
async function borrarCard(num_tarjeta) {
  const response = await fetch("/delete-card", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("auth-token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ numero: num_tarjeta }),
  });
  if (!response.ok) {
    throw new Error("Hubo un error al borrar la tarjeta");
  }
  location.reload();
}

var tipo = ["Crédito", "Débito"];

var selectTarjeta = document.getElementById("tipo");

tipo.forEach(function (tipo) {
  var option = document.createElement("option");
  option.value = tipo;
  option.text = tipo;
  selectTarjeta.appendChild(option);
});
