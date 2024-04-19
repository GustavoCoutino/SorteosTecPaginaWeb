function hideCardNumber(num_tarjeta) {
  return "**** " + String(num_tarjeta).slice(-4);
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
      <div class="divH">
        <div class="ai-cen">
          <p class="p1">Cuenta ${data.cuentas[i].banco}</p>
          <p class="p2">${hideCardNumber(data.cuentas[i].num_tarjeta)}</p>
        </div>
        <div class="ai-cen">
          <button class="botonE" onclick="borrarCard('${
            data.cuentas[i].num_tarjeta
          }')">Eliminar</button>
        </div>
      </div>`;
    divExterior.appendChild(divInterior);
  }
}

document.addEventListener("DOMContentLoaded", fetchCards);

async function crearCard(event) {
  event.preventDefault();
  const banco = document.querySelector("#banco").value;
  const num_tarjeta = document.querySelector("#numeroTarjeta").value;
  const cvv = document.querySelector("#cvvTarjeta").value;
  const tipo = document.querySelector("#tipo").value;
  console.log(banco, num_tarjeta, cvv, tipo);
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
