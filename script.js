
// ==========================================
// DMIKA - Sistema de Consulta de Cautelas de TI
// ==========================================

// Lista inicial de equipamentos para testes.
// Depois poderemos substituir esses dados pela planilha.
let equipamentos = [
  {
    servidor: "SERVIDOR DE TESTE 01",
    material: "Notebook Dell",
    numeroSerie: "DELL-001",
    patrimonio: "2024000001"
  },
  {
    servidor: "SERVIDOR DE TESTE 02",
    material: "Monitor LG",
    numeroSerie: "LG-002",
    patrimonio: "2024000002"
  },
  {
    servidor: "SERVIDOR DE TESTE 03",
    material: "Teclado",
    numeroSerie: "TEC-003",
    patrimonio: "2024000003"
  }
];

// ==========================================
// NAVEGAÇÃO ENTRE AS TELAS
// ==========================================

window.mostrarPagina = function(pagina, botao) {
  // Esconde todas as páginas
  document.querySelectorAll(".pagina").forEach(function(item) {
    item.classList.remove("ativa");
  });

  // Mostra a página escolhida
  const paginaSelecionada = document.getElementById(pagina);

  if (paginaSelecionada) {
    paginaSelecionada.classList.add("ativa");
  } else {
    console.error("Página não encontrada:", pagina);
    return;
  }

  // Atualiza o botão selecionado no menu
  document.querySelectorAll(".menu-item").forEach(function(item) {
    item.classList.remove("ativo");
  });

  if (botao) {
    botao.classList.add("ativo");
  }

  // Ao abrir equipamentos, mostra a lista completa
  if (pagina === "equipamentos") {
    mostrarTodos();
  }
};

// ==========================================
// CARREGAR TABELA DE EQUIPAMENTOS
// ==========================================

window.carregarTabela = function(lista) {
  const tabela = document.getElementById("resultadoTabela");
  const contador = document.getElementById("contador");

  if (!tabela) {
    console.error("Não encontrei a tabela resultadoTabela no HTML.");
    return;
  }

  tabela.innerHTML = "";

  lista.forEach(function(item) {
    const linha = document.createElement("tr");

    const valores = [
      item.servidor,
      item.material,
      item.numeroSerie,
      item.patrimonio
    ];

    valores.forEach(function(valor) {
      const coluna = document.createElement("td");
      coluna.textContent = valor || "";
      linha.appendChild(coluna);
    });

    tabela.appendChild(linha);
  });

  if (contador) {
    contador.textContent =
      lista.length +
      (lista.length === 1
        ? " equipamento encontrado"
        : " equipamentos encontrados");
  }
};

// ==========================================
// PESQUISAR EQUIPAMENTOS
// ==========================================

window.pesquisar = function() {
  const campoBusca = document.getElementById("busca");

  if (!campoBusca) {
    console.error("Campo de pesquisa não encontrado.");
    return;
  }

  const termo = campoBusca.value.trim().toLowerCase();

  const resultado = equipamentos.filter(function(item) {
    return (
      String(item.servidor).toLowerCase().includes(termo) ||
      String(item.material).toLowerCase().includes(termo) ||
      String(item.numeroSerie).toLowerCase().includes(termo) ||
      String(item.patrimonio).toLowerCase().includes(termo)
    );
  });

  carregarTabela(resultado);
};

// ==========================================
// MOSTRAR TODOS OS EQUIPAMENTOS
// ==========================================

window.mostrarTodos = function() {
  const campoBusca = document.getElementById("busca");

  if (campoBusca) {
    campoBusca.value = "";
  }

  carregarTabela(equipamentos);
};

// ==========================================
// INICIALIZAÇÃO DO SISTEMA
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
  console.log("DMIKA carregado com sucesso!");

  // Deixa a página inicial visível
  const inicio = document.getElementById("inicio");

  if (inicio) {
    document.querySelectorAll(".pagina").forEach(function(item) {
      item.classList.remove("ativa");
    });

    inicio.classList.add("ativa");
  }
});
