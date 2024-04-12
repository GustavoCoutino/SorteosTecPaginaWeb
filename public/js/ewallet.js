async function fetchSaldo() {
  try {
    const response = await fetch("/saldo-total", {
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
    const saldo = document.querySelector("#cantidad-monedas");
    saldo.textContent = data.saldo;
  } catch (error) {
    console.error("Error:", error);
  }
}
document.addEventListener("DOMContentLoaded", fetchSaldo);
