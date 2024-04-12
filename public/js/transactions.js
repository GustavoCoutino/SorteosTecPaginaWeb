function fechaFormato(dateString) {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("es-ES", options);
  return `Adquirido el ${formattedDate}`;
}

async function fetchTransacciones() {
  try {
    const response = await fetch("/wallet-info", {
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
    const container = document.querySelector(".div-pequeño");
    for (let i = 0; i < data.compras.length; i++) {
      const div = document.createElement("div");
      div.className = "divH";
      const innerDiv = document.createElement("div");
      const p1 = document.createElement("p");
      p1.className = "p1";
      p1.textContent = data.compras[i].producto + ": " + data.compras[i].costo;
      const p2 = document.createElement("p");
      p2.className = "p2";
      p2.textContent = fechaFormato(data.compras[i].fecha);
      innerDiv.appendChild(p1);
      innerDiv.appendChild(p2);
      div.appendChild(innerDiv);
      container.appendChild(div);
    }
    const total = document.querySelector("#total-compras");
    total.textContent = data.total;
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchTransacciones);
