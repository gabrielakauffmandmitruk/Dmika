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
    servidor: "CAROLINA NIKOLUK SCACHETTI DE MELLO",
    material: "Storage Synology RS2423+",
    numeroSerie: "SY-5567N",
    patrimonio: "2022057214"
  },
  {
    servidor: "EDUARDO GERALDO DOS SANTOS",
    material: "Servidor Lenovo ThinkSystem",
    numeroSerie: "LN-01349",
    patrimonio: "2022057137"
  },
  {
    servidor: "LUIZ CARLOS FARIA TORRES",
    material: "Firewall Fortinet 100F",
    numeroSerie: "PE0FBHM3",
    patrimonio: "2026036354"
  },
  {
    servidor: "FRANCISCO APARECIDO SARANTTO DE PAULA NETO",
    material: "Impressora Multifuncional Ricoh",
    numeroSerie: "89693215S",
    patrimonio: "2024018167"
  },
  {
    servidor: "KELMANN OLIVEIRA FREITAS",
    material: "Notebook Dell Latitude 7440",
    numeroSerie: "DL-91022",
    patrimonio: "2019029321"
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
    tabela.innerHTML += `
      <tr>
        <td>${item.servidor}</td>
        <td>${item.material}</td>
        <td>
