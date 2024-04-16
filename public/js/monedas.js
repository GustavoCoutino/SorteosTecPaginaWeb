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
    if (data.monedas === null) {
      monedas.textContent = "0";
    } else {
      monedas.textContent = data.monedas;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
document.addEventListener("DOMContentLoaded", fetchSaldo);
