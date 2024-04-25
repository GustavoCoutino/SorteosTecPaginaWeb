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

  const amountInputDiv = document.createElement("div");
  amountInputDiv.className = "div_tarjeta";
  amountInputDiv.innerHTML = `
        <p class="TFormm">Cantidad</p>
        <input
          placeholder=""
          class="input_tarjetaG"
          type="number"
          id="amountInput"
          name="amountInput"
        />`;
  const cardsContainer = document.querySelector("#cardListContainer");
  cardsContainer.parentNode.insertBefore(amountInputDiv, cardsContainer);

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
                  <p class="p2">${hideCardNumber(
                    data.cuentas[i].num_tarjeta
                  )}</p>
                </div>
                <div class="ai-cen">
                  <input type="radio" name="selectedCard" value="${
                    data.cuentas[i].num_tarjeta
                  }">
                </div>
              </div>
            </div>
          </div>`;
    cardsContainer.appendChild(divInterior);
  }
}
async function agregarSaldo(event) {
  const selectedCardRadio = document.querySelector(
    'input[name="selectedCard"]:checked'
  );
  const amountInput = document.getElementById("amountInput");

  if (!selectedCardRadio) {
    alert("Por favor, selecciona una tarjeta.");
    return;
  }

  const numeroTarjeta = selectedCardRadio.value;
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    alert("Por favor, introduce una cantidad válida mayor a 0.");
    return;
  }

  const currentDate = new Date().toISOString().slice(0, 10);

  const token = localStorage.getItem("auth-token");

  const response = await fetch("/update-saldo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      numeroTarjeta: numeroTarjeta,
      fecha: currentDate,
      saldoAgregado: amount,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update saldo.");
  }

  const responseData = await response.json();
  alert("Saldo actualizado con éxito.");
  location.reload();
}
document.addEventListener("DOMContentLoaded", fetchCards);

document.getElementById("mostrarBoton").addEventListener("click", function () {
  var contenedor = document.getElementById("addSaldo");
  contenedor.style.display = "block";
});

document.getElementById("cerrarBoton").addEventListener("click", function () {
  var contenedor = document.getElementById("addSaldo");
  contenedor.style.display = "none";
});
