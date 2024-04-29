function hideCardNumber(num_tarjeta) {
  return "**** **** **** " + String(num_tarjeta).slice(-4);
}

function fechaFormato(dateString) {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("es-ES", options);
  return `${formattedDate}`;
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

async function getMovimientos() {
  const response = await fetch("/cargas-saldo", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("auth-token"),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Hubo un error al obtener los datos de los movimientos");
  }
  const data = await response.json();
  const divExterior = document.getElementById("movementsContainer");
  for (let i = 0; i < data.cargas[0].length; i++) {
    const imagen = document.createElement("img");
    imagen.src = "./../Assets/walletMoneda.png";
    imagen.classList.add("compra");

    const divInterior = document.createElement("div");
    divInterior.classList.add("div_gris");

    const div_horizontal = document.createElement("div");
    div_horizontal.classList.add("div_horizontall");

    const div_cont = document.createElement("div");
    div_horizontal.classList.add("div_vertical");

    const saldo = document.createElement("p");
    saldo.classList.add("saldo");
    saldo.textContent = `Recarga: $${data.cargas[0][i].saldoAgregado} mxn `;
    const fecha = document.createElement("p");
    fecha.classList.add("extra");
    fecha.textContent = `Fecha: ${fechaFormato(data.cargas[0][i].fecha)}`;
    const tarjeta = document.createElement("p");
    tarjeta.classList.add("extra");
    tarjeta.textContent = `Tarjeta: ${hideCardNumber(
      data.cargas[0][i].numeroTarjeta
    )}`;

    div_cont.appendChild(saldo);
    div_cont.appendChild(fecha);
    div_cont.appendChild(tarjeta);

    div_horizontal.appendChild(imagen);
    div_horizontal.appendChild(div_cont);

    divInterior.appendChild(div_horizontal);

    divExterior.appendChild(divInterior);
  }
}

document.addEventListener("DOMContentLoaded", getMovimientos);

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
