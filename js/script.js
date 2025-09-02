window.onload = () => {
  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split("T")[0];
  document.getElementById("dataAtual").value = dataFormatada;

  const validade = new Date(hoje);
  validade.setDate(validade.getDate() + 7);
  const validadeFormatada = validade.toISOString().split("T")[0];
  document.getElementById("validade").value = validadeFormatada;

  const numeroOrcamento = `ORC-${hoje.getFullYear()}${('0' + (hoje.getMonth() + 1)).slice(-2)}${('0' + hoje.getDate()).slice(-2)}01`;
  document.getElementById("numeroOrcamento").value = numeroOrcamento;
};

// Formata como moeda com R$
function formatarMoeda(input) {
  let valor = input.value.replace(/\D/g, "");
  valor = (parseFloat(valor) / 100).toFixed(2);
  input.value = `R$ ${valor.replace(".", ",")}`;
}

// Formata o telefone
function formatarTelefone(input) {
  let valor = input.value.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);

  if (valor.length <= 10) {
    valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }

  input.value = valor;
}

// Cálculo por linha
function calcularLinha(elemento) {
  const linha = elemento.closest("tr");
  const qtd = parseFloat(linha.querySelector(".qtd").value || 0);
  const unitarioStr = linha.querySelector(".unitario").value.replace("R$", "").trim();
  const unitario = parseFloat(unitarioStr.replace(",", ".") || 0);
  const total = qtd * unitario;

  linha.querySelector(".total").value = `R$ ${total.toFixed(2).replace(".", ",")}`;
  calcularTotais();
}

// Totais e desconto
function calcularTotais() {
  const totais = document.querySelectorAll(".total");
  let soma = 0;

  totais.forEach(input => {
    const valor = parseFloat(input.value.replace("R$", "").replace(",", ".") || 0);
    soma += valor;
  });

  document.getElementById("valorTotal").value = `R$ ${soma.toFixed(2).replace(".", ",")}`;

  const desconto = soma * 0.97;
  document.getElementById("valorVista").value = `R$ ${desconto.toFixed(2).replace(".", ",")}`;

  calcularParcelado();
}

// Adiciona item
function adicionarItem() {
  const tabela = document.getElementById("corpoTabelaItens");
  const novaLinha = document.createElement("tr");

  novaLinha.innerHTML = `
    <td><input type="number" min="1" class="qtd" onchange="calcularLinha(this)" /></td>
    <td><input type="text" class="descricao" /></td>
    <td><input type="text" class="unitario" oninput="formatarMoeda(this); calcularLinha(this)" /></td>
    <td><input type="text" class="total" readonly /></td>
  `;

  tabela.appendChild(novaLinha);
}

// Parcelamento com juros
function calcularParcelado() {
  const totalStr = document.getElementById("valorTotal").value.replace("R$", "").trim();
  const total = parseFloat(totalStr.replace(",", ".") || 0);
  const parcelas = parseInt(document.getElementById("parcelas").value);
  if (!parcelas || parcelas < 2) {
    document.getElementById("valorParcelado").value = "";
    return;
  }

  const jurosTabela = {
    2: 0.02, 3: 0.03, 4: 0.04, 5: 0.05,
    6: 0.06, 7: 0.07, 8: 0.08, 9: 0.09,
    10: 0.10, 11: 0.11, 12: 0.12
  };

  const juros = jurosTabela[parcelas] || 0;
  const totalComJuros = total * (1 + juros);
  const valorParcela = totalComJuros / parcelas;

  document.getElementById("valorParcelado").value =
    `${parcelas}x de R$ ${valorParcela.toFixed(2).replace(".", ",")} (Total: R$ ${totalComJuros.toFixed(2).replace(".", ",")})`;
}

// Gera visualização e impressão
function gerarOrcamento() {
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const numeroOrcamento = document.getElementById("numeroOrcamento").value;

  if (!nome || !telefone || !numeroOrcamento || document.querySelectorAll("#corpoTabelaItens tr").length === 0) {
    alert("Preencha os dados do cliente e adicione ao menos um item.");
    return;
  }

  const tabelaItens = document.querySelectorAll("#corpoTabelaItens tr");
  let htmlItens = "<h3>Itens do Orçamento</h3>";

  tabelaItens.forEach(tr => {
    const qtd = tr.querySelector(".qtd")?.value || "0";
    const descricao = tr.querySelector(".descricao")?.value || "";
    const unitario = tr.querySelector(".unitario")?.value || "R$ 0,00";
    const total = tr.querySelector(".total")?.value || "R$ 0,00";

    htmlItens += `
      <p><strong>Quantidade:</strong> ${qtd} | 
         <strong>Produto:</strong> ${descricao} | 
         <strong>Unitário:</strong> ${unitario} | 
         <strong>Total:</strong> ${total}</p>
    `;
  });

  const totalFinal = document.getElementById("valorTotal").value;
  const vistaFinal = document.getElementById("valorVista").value;
  const parceladoFinal = document.getElementById("valorParcelado").value;

  htmlItens += `
    <p><strong>Total:</strong> ${totalFinal}</p>
    <p><strong>À vista (PIX):</strong> ${vistaFinal}</p>
    ${parceladoFinal ? `<p><strong>Parcelado:</strong> ${parceladoFinal}</p>` : ""}
  `;

  document.getElementById("itens-formatados-impressao").innerHTML = htmlItens;

  window.print();

  setTimeout(() => {
    window.location.href = "./confirmacao.html";
  }, 1000);
}
