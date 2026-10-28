const equipamentos = [
  {
    servidor: "ANA MARINA DE CASTRO",
    material: "Ultrabook Vaio",
    numeroSerie: "89693074R",
    patrimonio: "2024018048",
    setor: "STI",
    status: "Acautelado"
  },
  {
    servidor: "BRUNO PIMENTEL NYKIEL",
    material: "Servidor HP ProLiant DL380",
    numeroSerie: "HP-7842A",
    patrimonio: "2019029241",
    setor: "STI",
    status: "Acautelado"
  },
  {
    servidor: "CAROLINA NIKOLUK SCACHETTI DE MELLO",
    material: "Storage Synology RS2423+",
    numeroSerie: "SY-5567N",
    patrimonio: "2022057214",
    setor: "STI",
    status: "Acautelado"
  },
  {
    servidor: "EDUARDO GERALDO DOS SANTOS",
    material: "Servidor Lenovo ThinkSystem",
    numeroSerie: "LN-01349",
    patrimonio: "2022057137",
    setor: "STI",
    status: "Acautelado"
  },
  {
    servidor: "LUIZ CARLOS FARIA TORRES",
    material: "Firewall Fortinet 100F",
    numeroSerie: "PE0FBHM3",
    patrimonio: "2026036354",
    setor: "STI",
    status: "Acautelado"
  },
  {
    servidor: "FRANCISCO APARECIDO SARANTTO DE PAULA NETO",
    material: "Impressora Multifuncional Ricoh",
    numeroSerie: "89693215S",
    patrimonio: "2024018167",
    setor: "STI",
    status: "Acautelado"
  },
  {
    servidor: "KELMANN OLIVEIRA FREITAS",
    material: "Notebook Dell Latitude 7440",
    numeroSerie: "DL-91022",
    patrimonio: "2019029321",
    setor: "STI",
    status: "Acautelado"
  },
  {
    servidor: "VINÍCIUS PEREIRA DE MEDEIROS",
    material: "Switch Cisco Catalyst 9300",
    numeroSerie: "CS-23488",
    patrimonio: "2019069858",
    setor: "STI",
    status: "Acautelado"
  }
];

const campoBusca = document.getElementById("campoBusca");
const campoBuscaSelect = document.getElementById("campoBuscaSelect");
const botaoBuscar = document.getElementById("btnBuscar");
const botaoLimpar = document.getElementById("btnLimpar");
const resultadoInfo = document.getElementById("resultadoInfo");
const tbody = document.querySelector("#resultadoTabela tbody");

function normalizarTexto(texto) {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function renderizarTabela(lista) {
  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-message">
          Nenhum equipamento encontrado para a busca informada.
        </td>
      </tr>
    `;

    resultadoInfo.textContent = "0 resultados";
    return;
  }

  lista.forEach((equipamento) => {
    const linha = document.createElement("tr");

    const statusClass = equipamento.status
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

    linha.innerHTML = `
      <td>${equipamento.servidor}</td>
      <td>${equipamento.material}</td>
      <td>${equipamento.numeroSerie}</td>
      <td>${equipamento.patrimonio}</td>
      <td>${equipamento.setor}</td>
      <td>
        <span class="status ${statusClass}">${equipamento.status}</span>
      </td>
    `;

    tbody.appendChild(linha);
  });

  resultadoInfo.textContent = `Exibindo ${lista.length} de ${equipamentos.length} resultados`;
}

function buscarEquipamentos() {
  const termoBusca = normalizarTexto(campoBusca.value);
  const campoSelecionado = campoBuscaSelect.value;

  if (!termoBusca) {
    renderizarTabela(equipamentos);
    return;
  }

  const resultados = equipamentos.filter((equipamento) => {
    const camposParaPesquisar =
      campoSelecionado === "todos"
        ? [
            equipamento.servidor,
            equipamento.material,
            equipamento.numeroSerie,
            equipamento.patrimonio
          ]
        : [equipamento[campoSelecionado]];

    return camposParaPesquisar.some((valor) =>
      normalizarTexto(valor).includes(termoBusca)
    );
  });

  renderizarTabela(resultados);
}

botaoBuscar.addEventListener("click", buscarEquipamentos);

campoBusca.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    buscarEquipamentos();
  }
});

botaoLimpar.addEventListener("click", () => {
  campoBusca.value = "";
  campoBuscaSelect.value = "todos";
  renderizarTabela(equipamentos);
  campoBusca.focus();
});

renderizarTabela(equipamentos);
