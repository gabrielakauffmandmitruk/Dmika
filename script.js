
const equipamentos = [
    {
        servidor: "ANA ",
        material: "Ultrabook Vaio",
        numeroSerie: "89693074R",
        patrimonio: "2024018048"
    },
    {
        servidor: "BRUNO ",
        material: "Servidor HP ProLiant DL380",
        numeroSerie: "HP-7842A",
        patrimonio: "2019029241"
    },
    {
        servidor: "CAROLINA ",
        material: "Storage Synology RS2423+",
        numeroSerie: "SY-5567N",
        patrimonio: "2022057214"
    },
    {
        servidor: "EDUARDO ",
        material: "Servidor Lenovo ThinkSystem",
        numeroSerie: "LN-01349",
        patrimonio: "2022057137"
    },
    {
        servidor: "LUIZ ",
        material: "Firewall Fortinet 100F",
        numeroSerie: "PE0FBHM3",
        patrimonio: "2026036354"
    },
    {
        servidor: "FRANCISCO ",
        material: "Impressora Multifuncional Ricoh",
        numeroSerie: "89693215S",
        patrimonio: "2024018167"
    },
    {
        servidor: "KELMANN ",
        material: "Notebook Dell Latitude 7440",
        numeroSerie: "DL-91022",
        patrimonio: "2019029321"
    },
    {
        servidor: "VINÍCIUS",
        material: "Switch Cisco Catalyst 9300",
        numeroSerie: "CS-23488",
        patrimonio: "2019069858"
    }
];

// Abre uma página do sistema
function mostrarPagina(pagina, botao) {

    document.querySelectorAll(".pagina").forEach(item => {
        item.classList.remove("ativa");
    });

    document.getElementById(pagina).classList.add("ativa");

    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.remove("ativo");
    });

    if (botao) {
        botao.classList.add("ativo");
    } else {
        const botoes = document.querySelectorAll(".menu-item");

        botoes.forEach(item => {
            if (item.getAttribute("onclick").includes(pagina)) {
                item.classList.add("ativo");
            }
        });
    }

    if (pagina === "equipamentos") {
        mostrarTodos();
    }
}

// Monta a tabela
function carregarTabela(lista) {

    const tabela = document.getElementById("resultadoTabela");
    const contador = document.getElementById("contador");

    tabela.innerHTML = "";

    lista.forEach(item => {

        const linha = document.createElement("tr");

        [
            item.servidor,
            item.material,
            item.numeroSerie,
            item.patrimonio
        ].forEach(valor => {

            const coluna = document.createElement("td");
            coluna.textContent = valor;
            linha.appendChild(coluna);

        });

        tabela.appendChild(linha);
    });

    contador.textContent =
        lista.length + (lista.length === 1
            ? " equipamento encontrado"
            : " equipamentos encontrados");
}

// Pesquisa automática
function pesquisar() {

    const termo = document
        .getElementById("busca")
        .value
        .trim()
        .toLowerCase();

    const resultado = equipamentos.filter(item =>
        item.servidor.toLowerCase().includes(termo) ||
        item.material.toLowerCase().includes(termo) ||
        item.numeroSerie.toLowerCase().includes(termo) ||
        item.patrimonio.toLowerCase().includes(termo)
    );

    carregarTabela(resultado);
}

// Mostra todos os equipamentos
function mostrarTodos() {

    document.getElementById("busca").value = "";

    carregarTabela(equipamentos);
}
