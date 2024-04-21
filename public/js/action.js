async function registerAction(event, action) {
  event.preventDefault();
  const date = new Date();
  const response = await fetch("/register-action", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("auth-token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: action,
      date: date,
    }),
  });
}
