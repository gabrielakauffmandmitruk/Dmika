const equipamentos = [
  {
    servidor: "ANA MARINA DE CASTRO",
    material: "Ultrabook Vaio",
    numeroSerie: "89693074R",
    patrimonio: "2024018048"
  },
  {
    servidor: "BRUNO PIMENTEL NYKIEL",
    material: "Servidor HP ProLiant DL380",
    numeroSerie: "HP-7842A",
    patrimonio: "2019029241"
  },
  {
    servidor: "VINÍCIUS PEREIRA DE MEDEIROS",
    material: "Switch Cisco Catalyst 9300",
    numeroSerie: "CS-23488",
    patrimonio: "2019069858"
  }
];

function carregarTabela(lista) {
  const tabela = document.getElementById("resultadoTabela");

  tabela.innerHTML = "";

  lista.forEach(item => {
    const linha = `
      <tr>
        <td>${item.servidor}</td>
        <td>${item.material}</td>
        <td>${item.numeroSerie}</td>
        <td>${item.patrimonio}</td>
      </tr>
    `;

    tabela.innerHTML += linha;
  });
}

function pesquisar() {
  const termo = document
    .getElementById("busca")
    .value
    .toLowerCase();

  const resultado = equipamentos.filter(item =>
    item.servidor.toLowerCase().includes(termo) ||
    item.material.toLowerCase().includes(termo) ||
    item.numeroSerie.toLowerCase().includes(termo) ||
    item.patrimonio.toLowerCase().includes(termo)
  );

  carregarTabela(resultado);
}

carregarTabela(equipamentos);
