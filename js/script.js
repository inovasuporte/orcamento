window.onload = () => {
  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split("T")[0];
  document.getElementById("dataAtual").value = dataFormatada;

  const validade = new Date(hoje);
  validade.setDate(validade.getDate() + 7);
  const validadeFormatada = validade.toISOString().split("T")[0];
  document.getElementById("validade").value = validadeFormatada;

  // Geração automática do número do orçamento no formato ORC-YYYYMMDD01
  const numeroOrcamento = `ORC-${hoje.getFullYear()}${('0' + (hoje.getMonth() + 1)).slice(-2)}${('0' + hoje.getDate()).slice(-2)}01`;
  document.getElementById("numeroOrcamento").value = numeroOrcamento;
};

function formatarMoeda(input) {
  let valor = input.value.replace(/\D/g, "");
  valor = (parseFloat(valor) / 100).toFixed(2);
  input.value = valor.replace(".", ",");
}

function calcularLinha(elemento) {
  const linha = elemento.closest("tr");
  const qtd = parseFloat(linha.querySelector(".qtd").value || 0);
  const unitario = parseFloat(linha.querySelector(".unitario").value.replace(",", ".") || 0);
  const total = qtd * unitario;

  linha.querySelector(".total").value = total.toFixed(2).replace(".", ",");
  calcularTotais();
}

function calcularTotais() {
  const totais = document.querySelectorAll(".total");
  let soma = 0;

  totais.forEach(input => {
    const valor = parseFloat(input.value.replace(",", ".") || 0);
    soma += valor;
  });

  document.getElementById("valorTotal").value = soma.toFixed(2).replace(".", ",");

  const desconto = soma * 0.97;
  document.getElementById("valorVista").value = desconto.toFixed(2).replace(".", ",");

  calcularParcelado();
}

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

function calcularParcelado() {
  const total = parseFloat((document.getElementById("valorTotal").value || "0").replace(",", "."));
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

  document.getElementById("valorParcelado").value = `${parcelas}x de R$ ${valorParcela.toFixed(2).replace(".", ",")} (Total: R$ ${totalComJuros.toFixed(2).replace(".", ",")})`;
}

function gerarOrcamento() {
  // Aqui você ainda coleta os dados caso queira usar futuramente
  const numeroOrcamento = document.getElementById("numeroOrcamento").value;
  const dataAtual = document.getElementById("dataAtual").value;
  const validade = document.getElementById("validade").value;
  const elaboradoPor = document.getElementById("elaboradoPor").value;
  const empresa = document.getElementById("empresa").value;
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const valorTotal = document.getElementById("valorTotal").value;
  const valorVista = document.getElementById("valorVista").value;
  const valorParcelado = document.getElementById("valorParcelado").value;

  // Se desejar, você pode validar campos obrigatórios aqui
  if (!nome || !telefone || !numeroOrcamento || document.querySelectorAll("#corpoTabelaItens tr").length === 0) {
    alert("Preencha os dados do cliente e adicione ao menos um item.");
    return;
  }

  // Abre a janela de impressão (permitindo salvar como PDF ou imprimir direto)
  window.print();
  // Depois de gerar o orçamento, redirecionar para a página de confirmação
  window.location.href = "./confirmacao.html";
}
