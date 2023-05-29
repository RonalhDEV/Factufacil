const url = "http://localhost:8080/api/login"
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var emailLog = document.getElementById("boxEmail").value;
  var passwordLog = document.getElementById("boxPassword").value;

  var logJson = {
    emailResidente: emailLog,
    claveResidente: passwordLog
  };

  fetch(`${url}/validar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(logJson)
  })
    .then(function (response) {
      if (response.ok) {
        return response.text();
      } else if (response.status === 404) {
        throw new Error("Usuario no encontrado");
      } else if (response.status === 401) {
        throw new Error("Credenciales inválidas");
      } else {
        throw new Error("Error en el servidor");
      }
    })
    .then(function (responseData) {
      window.location.href = "index.html";
    })
    .catch(function (error) {
      console.error(error);
      alert(error.message);
    });
});
