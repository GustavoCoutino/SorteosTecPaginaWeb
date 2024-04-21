async function updateSaldo(event, saldo) {
  event.preventDefault();
  const response = await fetch("/update-saldo", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("auth-token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      saldo: saldo,
    }),
  });
  if (!response.ok) {
    throw new Error("Hubo un error al actualizar el saldo");
  }
  location.reload();
}
