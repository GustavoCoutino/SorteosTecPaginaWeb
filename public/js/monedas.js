function fechaFormato(dateString) {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("es-ES", options);
  return `Adquirido el ${formattedDate}`;
}

async function fetchSaldo() {
  try {
    const response = await fetch("/monedas-totales", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(
        "Hubo un error al obtener los datos de las transacciones"
      );
    }
    const data = await response.json();
    const monedas = document.querySelector("#cantidad-monedas");
    monedas.textContent = data.monedas;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchBoletos() {
  try {
    const response = await fetch("/boletos", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Hubo un error al obtener los datos de los boletos");
    }
    const boletos = await response.json();
    const contenedor = document.getElementById("addCardContainer");
    boletos.forEach((boleto) => {
      const botonCompra = document.createElement("button");
      botonCompra.textContent = `Comprar ${boleto.tipo} - ${boleto.costo} monedas`;
      botonCompra.className = "botonBo";
      botonCompra.id = boleto.boleto_id;
      botonCompra.onclick = async function () {
        try {
          const data = await fetch("/comprar-boleto", {
            method: "POST",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("auth-token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              boletoId: boleto.boleto_id,
              fecha: new Date().toISOString().slice(0, 19).replace("T", " "),
            }),
          });
          if (!data.ok) {
            alert("No hay monedas suficientes para comprar el boleto");
            location.reload();
          }
          const responseJson = await data.json();
          location.reload();
        } catch (error) {
          console.error("Compra error:", error);
          alert(error.message);
        }
      };
      contenedor.appendChild(botonCompra);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchBoletoPurchases() {
  try {
    const response = await fetch("/compra-boleto-info", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        "Hubo un error al obtener los datos de las compras de boletos"
      );
    }

    const boletoPurchases = await response.json();

    const boletosContainer = document.getElementById("boletosContainer");

    boletosContainer.innerHTML = "";

    if (boletoPurchases.length === 0) {
      boletosContainer.textContent = "No hay compras de boletos registradas.";
      return;
    }

    boletoPurchases.forEach((purchase) => {
      const purchaseDiv = document.createElement("div");
      const p1 = document.createElement("p");
      const p2 = document.createElement("p");
      p1.className = "p1";
      p2.className = "p2";
      p1.textContent = `Boleto: ${purchase.tipo}`;
      p2.textContent = `Costo: ${
        purchase.costo
      } monedas - Fecha: ${fechaFormato(purchase.fecha)}`;
      purchaseDiv.appendChild(p1);
      purchaseDiv.appendChild(p2);
      boletosContainer.appendChild(purchaseDiv);
    });
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar las compras de boletos: " + error.message);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  fetchSaldo(),
  fetchBoletos(),
  fetchBoletoPurchases()
);

document.getElementById("mostrarBoton").addEventListener("click", function () {
  var contenedor = document.getElementById("addCardContainer");
  contenedor.style.display = "block";
});

document.getElementById("cerrarBoton").addEventListener("click", function () {
  var contenedor = document.getElementById("addCardContainer");
  contenedor.style.display = "none";
});
