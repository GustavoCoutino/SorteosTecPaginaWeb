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
    const total = document.querySelector("#total-compras");
    if (data.compras.length === 0) {
      total.textContent = "0";
      const p = document.createElement("p");
      p.textContent = "No tienes compras aún";
      container.appendChild(p);
    } else {
      total.textContent = data.total;
    }
    for (let i = 0; i < data.compras.length; i++) {
      const div = document.createElement("div");
      div.className = "div_Gcompras";

      const divHorizontal = document.createElement("div");
      divHorizontal.className = "div_horizontal";

      const divGrande = document.createElement("div");
      divHorizontal.className = "div_compras";

      const divNormal = document.createElement("div");
      divNormal.className = "div_jus";

      const p1 = document.createElement("p");
      p1.className = "pTitulo";
      p1.textContent = data.compras[i].producto + ": " + data.compras[i].costo;

      const p2 = document.createElement("p");
      p2.className = "pFecha";
      p2.textContent = fechaFormato(data.compras[i].fecha);

      const img = document.createElement("img");
      img.className = "compra";

      if (data.compras[i].producto.includes("Corre Teus")) {
        img.src = "../Assets/escudoVerde.png";
      } else if (data.compras[i].producto.includes("Lanza Tec")) {
        img.src = "../Assets/escudoAzul.png";
      } else if (data.compras[i].producto.includes("Tower Defense")) {
        img.src = "../Assets/escudoPared.png";
      } else {
        img.src = "/public/Assets/maquina.png";
      }

      divNormal.appendChild(p1);
      divNormal.appendChild(p2);

      divHorizontal.appendChild(img);

      divHorizontal.appendChild(divNormal);
      divGrande.appendChild(divHorizontal);
      div.appendChild(divGrande);

      container.appendChild(div);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchTransacciones);
