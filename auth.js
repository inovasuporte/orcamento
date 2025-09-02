function login(event) {
  event.preventDefault();
  const senha = document.getElementById("senha").value;

  if (senha === "inova123") {
    sessionStorage.setItem("acessoLiberado", true);
    window.location.href = "index.html";
  } else {
    alert("Senha incorreta!");
  }
}

function verificarAcesso() {
  if (!sessionStorage.getItem("acessoLiberado")) {
    window.location.href = "login.html";
  }
}
