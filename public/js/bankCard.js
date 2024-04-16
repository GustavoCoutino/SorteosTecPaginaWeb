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
  const divExterior = document.querySelector(".div-pequeño");
  for (let i = 0; i < data.cuentas.length; i++) {
    const divInterior = document.createElement("div");
    divInterior.innerHTML = `<div class="divH">
    <div class="ai-cen">
      <p class="p1">Cuenta ${data.cuentas[i].banco}</p>
      <p class="p2">${hideCardNumber(data.cuentas[i].num_tarjeta)}</p>
    </div>`;
    divExterior.appendChild(divInterior);
  }
}

document.addEventListener("DOMContentLoaded", fetchCards);
