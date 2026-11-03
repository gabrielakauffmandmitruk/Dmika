
// ==================================================
// DMIKA - SISTEMA DE CONTROLE DE EQUIPAMENTOS
// ==================================================

const CHAVE_MOVIMENTACOES = "dmika_movimentacoes";

let movimentacoes = carregarArmazenamento();
let equipamentos = [];
let previaImportacao = [];

// ==================================================
// 1. ARMAZENAMENTO DOS DADOS
// ==================================================

function carregarArmazenamento() {
    try {
        return JSON.parse(
            localStorage.getItem(CHAVE_MOVIMENTACOES)
        ) || [];
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        return [];
    }
}

function salvarArmazenamento() {
    try {
        localStorage.setItem(
            CHAVE_MOVIMENTACOES,
            JSON.stringify(movimentacoes)
        );
        return true;
    } catch (erro) {
        console.error("Erro ao salvar:", erro);
        alert("Não foi possível salvar os dados neste navegador.");
        return false;
    }
}

// ==================================================
// 2. NAVEGAÇÃO ENTRE AS PÁGINAS
// ==================================================

window.mostrarPagina = function(pagina, botao) {
    document.querySelectorAll(".pagina").forEach(function(item) {
        item.classList.remove("ativa");
    });

    const selecionada = document.getElementById(pagina);

    if (!selecionada) {
        console.error("Página não encontrada:", pagina);
        return;
    }

    selecionada.classList.add("ativa");

    document.querySelectorAll(".menu-item").forEach(function(item) {
        item.classList.remove("ativo");
    });

    const botaoMenu = document.querySelector(
        '.menu-item[data-pagina="' + pagina + '"]'
    );

    if (botaoMenu) {
        botaoMenu.classList.add("ativo");
    }

    if (pagina === "equipamentos") {
        mostrarTodos();
    }

    if (pagina === "servidores") {
        renderizarServidores();
    }

    if (pagina === "historico") {
        renderizarHistorico();
    }
};

// ==================================================
// 3. TRATAMENTO DE INFORMAÇÕES
// ==================================================

function valorTexto(valor) {
    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor).trim();
}

function formatarData(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "";
    }

    if (valor instanceof Date && !isNaN(valor)) {
        return [
            String(valor.getDate()).padStart(2, "0"),
            String(valor.getMonth() + 1).padStart(2, "0"),
            valor.getFullYear()
        ].join("/");
    }

    if (typeof valor === "number" && window.XLSX) {
        const data = XLSX.SSF.parse_date_code(valor);

        if (data) {
            return [
                String(data.d).padStart(2, "0"),
                String(data.m).padStart(2, "0"),
                data.y
            ].join("/");
        }
    }

    return String(valor).trim();
}

function normalizarTexto(valor) {
    return valorTexto(valor)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
}

function identificarTipo(valor) {
    const tipo = normalizarTexto(valor);

    if (tipo.includes("RESTITUI") || tipo.includes("DEVOLU")) {
        return "RESTITUIÇÃO";
    }

    if (tipo.includes("RETIR")) {
        return "RETIRADA";
    }

    return "";
}

function converterDataParaNumero(valor) {
    const texto = valorTexto(valor);

    const brasileira = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (brasileira) {
        return new Date(
            Number(brasileira[3]),
            Number(brasileira[2]) - 1,
            Number(brasileira[1])
        ).getTime();
    }

    const data = new Date(texto);

    if (!isNaN(data.getTime())) {
        return data.getTime();
    }

    return null;
}

// ==================================================
// 4. IMPORTAÇÃO DA PLANILHA EXCEL
// ==================================================

window.lerPlanilha = async function() {
    const arquivo = document.getElementById("arquivoExcel").files[0];
    const mensagem = document.getElementById("mensagemImportacao");

    if (!arquivo) {
        alert("Selecione uma planilha primeiro.");
        return;
    }

    if (!window.XLSX) {
        alert("A biblioteca Excel não carregou. Verifique sua internet.");
        return;
    }

    try {
        mensagem.textContent = "Lendo planilha...";

        const dados = await arquivo.arrayBuffer();

        const pasta = XLSX.read(dados, {
            type: "array",
            cellDates: true
        });

        const primeiraAba = pasta.SheetNames[0];
        const planilha = pasta.Sheets[primeiraAba];

        const linhas = XLSX.utils.sheet_to_json(planilha, {
            header: 1,
            defval: "",
            raw: true
        });

        if (!linhas || linhas.length === 0) {
            alert("A planilha está vazia.");
            mensagem.textContent = "Planilha vazia.";
            return;
        }

        previaImportacao = [];

        let inicio = 0;

        const primeiraLinha = linhas[0].map(function(campo) {
            return normalizarTexto(campo);
        });

        if (
            primeiraLinha.some(campo =>
                campo.includes("SERVIDOR") ||
                campo.includes("PATRIM") ||
                campo.includes("MOVIMENTA")
            )
        ) {
            inicio = 1;
        }

        for (let i = inicio; i < linhas.length; i++) {
            const linha = linhas[i];

            const servidor = valorTexto(linha[0]);
            const patrimonio = valorTexto(linha[1]);
            const serie = valorTexto(linha[2]);
            const documento = valorTexto(linha[3]);
            const data = formatarData(linha[4]);
            const tipo = identificarTipo(linha[5]);

            if (
                !servidor &&
                !patrimonio &&
                !serie &&
                !documento &&
                !data &&
                !valorTexto(linha[5])
            ) {
                continue;
            }

            previaImportacao.push({
                servidor: servidor,
                patrimonio: patrimonio,
                serie: serie,
                documento: documento,
                data: data,
                tipo: tipo
            });
        }

        if (previaImportacao.length === 0) {
            alert("Nenhum registro encontrado.");
            mensagem.textContent = "Nenhum registro encontrado.";
            return;
        }

        mostrarPrevia();

        mensagem.textContent =
            arquivo.name + " selecionado com sucesso.";

    } catch (erro) {
        console.error("Erro na leitura:", erro);
        alert("Não foi possível ler a planilha.");
        mensagem.textContent = "Erro ao ler a planilha.";
    }
};

// ==================================================
// 5. PRÉVIA DA IMPORTAÇÃO
// ==================================================

function mostrarPrevia() {
    const area = document.getElementById("areaPrevia");
    const tabela = document.getElementById("tabelaPrevia");
    const resumo = document.getElementById("resumoImportacao");

    tabela.innerHTML = "";

    let validos = 0;
    let invalidos = 0;

    previaImportacao.forEach(function(item) {
        const linha = document.createElement("tr");

        const campos = [
            item.servidor,
            item.patrimonio,
            item.serie,
            item.documento,
            item.data,
            item.tipo || "TIPO NÃO RECONHECIDO"
        ];

        campos.forEach(function(valor) {
            const coluna = document.createElement("td");
            coluna.textContent = valor;
            linha.appendChild(coluna);
        });

        tabela.appendChild(linha);

        if (
            item.servidor &&
            item.patrimonio &&
            item.serie &&
            item.tipo &&
            item.data
        ) {
            validos++;
        } else {
            invalidos++;
        }
    });

    resumo.textContent =
        previaImportacao.length + " registro(s) encontrado(s). " +
        validos + " válido(s) e " +
        invalidos + " inválido(s).";

    document.getElementById("botaoConfirmar").disabled = validos === 0;

    area.style.display = "block";
}

// ==================================================
// 6. IDENTIFICAÇÃO DE DUPLICIDADES
// ==================================================

function chaveMovimentacao(item) {
    return [
        item.patrimonio,
        item.serie,
        item.documento,
        item.data,
        item.tipo
    ].map(valor => normalizarTexto(valor)).join("|");
}

// ==================================================
// 7. CONFIRMAR IMPORTAÇÃO
// ==================================================

window.confirmarImportacao = function() {
    const existentes = new Set(
        movimentacoes.map(chaveMovimentacao)
    );

    let importados = 0;
    let duplicados = 0;
    let invalidos = 0;

    previaImportacao.forEach(function(item) {
        if (
            !item.servidor ||
            !item.patrimonio ||
            !item.serie ||
            !item.tipo ||
            !item.data
        ) {
            invalidos++;
            return;
        }

        const chave = chaveMovimentacao(item);

        if (existentes.has(chave)) {
            duplicados++;
            return;
        }

        movimentacoes.push(item);
        existentes.add(chave);
        importados++;
    });

    if (importados === 0) {
        alert(
            "Nenhum registro novo foi importado.\n\n" +
            "Duplicados: " + duplicados +
            "\nInválidos: " + invalidos
        );
        return;
    }

    if (!salvarArmazenamento()) {
        movimentacoes = carregarArmazenamento();
        atualizarEquipamentos();
        return;
    }

    atualizarEquipamentos();

    alert(
        "Importação concluída!\n\n" +
        "Novos registros: " + importados +
        "\nDuplicados ignorados: " + duplicados +
        "\nRegistros inválidos: " + invalidos
    );

    cancelarImportacao();
    mostrarPagina("equipamentos");
};

// ==================================================
// 8. CANCELAR IMPORTAÇÃO
// ==================================================

window.cancelarImportacao = function() {
    previaImportacao = [];

    document.getElementById("arquivoExcel").value = "";
    document.getElementById("areaPrevia").style.display = "none";

    document.getElementById("mensagemImportacao").textContent =
        "Nenhuma planilha selecionada.";
};

// ==================================================
// 9. CADASTRO MANUAL DE EQUIPAMENTOS
// ==================================================

window.cadastrarManual = function() {
    const servidor = document.getElementById("manualServidor").value.trim();
    const patrimonio = document.getElementById("manualPatrimonio").value.trim();
    const serie = document.getElementById("manualSerie").value.trim();
    const documento = document.getElementById("manualDocumento").value.trim();
    const dataCampo = document.getElementById("manualData").value;
    const situacao = document.getElementById("manualSituacao").value;

    if (!patrimonio || !serie || !dataCampo) {
        alert("Preencha o patrimônio, a série e a data.");
        return;
    }

    if (situacao === "EM_USO" && !servidor) {
        alert("Informe o servidor responsável pelo equipamento.");
        return;
    }

    const patrimonioExistente = movimentacoes.some(function(item) {
        return normalizarTexto(item.patrimonio) === normalizarTexto(patrimonio);
    });

    if (patrimonioExistente) {
        alert("Esse patrimônio já possui registros no DMIKA.");
        return;
    }

    const novoRegistro = {
        servidor: servidor,
        patrimonio: patrimonio,
        serie: serie,
        documento: documento,
        data: dataCampo.split("-").reverse().join("/"),
        tipo: situacao === "DISPONIVEL" ? "CADASTRO" : "RETIRADA"
    };

    movimentacoes.push(novoRegistro);

    if (!salvarArmazenamento()) {
        movimentacoes.pop();
        return;
    }

    atualizarEquipamentos();

    alert("Equipamento cadastrado com sucesso!");

    document.getElementById("manualServidor").value = "";
    document.getElementById("manualPatrimonio").value = "";
    document.getElementById("manualSerie").value = "";
    document.getElementById("manualDocumento").value = "";
    document.getElementById("manualData").value = "";
    document.getElementById("manualSituacao").value = "DISPONIVEL";

    mostrarPagina("equipamentos");
};

// ==================================================
// 10. ORGANIZAR EQUIPAMENTOS
// ==================================================

function atualizarEquipamentos() {
    const grupos = {};

    movimentacoes.forEach(function(item, indice) {
        const identificador = item.patrimonio || item.serie;

        if (!identificador) return;

        const chave = normalizarTexto(identificador);

        if (!grupos[chave]) {
            grupos[chave] = {
                patrimonio: item.patrimonio,
                serie: item.serie,
                servidor: "",
                situacao: "Sem movimentação",
                movimentos: []
            };
        }

        grupos[chave].movimentos.push({
            ...item,
            ordem: indice
        });
    });

    equipamentos = Object.values(grupos).map(function(equipamento) {

        equipamento.movimentos.sort(function(a, b) {
            const dataA = converterDataParaNumero(a.data);
            const dataB = converterDataParaNumero(b.data);

            if (dataA !== null && dataB !== null && dataA !== dataB) {
                return dataA - dataB;
            }

            return a.ordem - b.ordem;
        });

        equipamento.movimentos.forEach(function(item) {

            if (item.tipo === "CADASTRO") {
                equipamento.servidor = "";
                equipamento.situacao = "Disponível";
            }

            if (item.tipo === "RETIRADA") {
                equipamento.servidor = item.servidor;
                equipamento.situacao = "Em uso";
            }

            if (item.tipo === "RESTITUIÇÃO") {
                equipamento.servidor = "";
                equipamento.situacao = "Disponível";
            }
        });

        return equipamento;
    });
}

// ==================================================
// 11. EXIBIR EQUIPAMENTOS
// ==================================================

function carregarTabela(lista) {
    const tabela = document.getElementById("resultadoTabela");
    const contador = document.getElementById("contador");

    tabela.innerHTML = "";

    lista.forEach(function(item) {
        const linha = document.createElement("tr");

        const valores = [
            item.servidor || "Disponível",
            item.serie,
            item.patrimonio,
            item.situacao
        ];

        valores.forEach(function(valor) {
            const coluna = document.createElement("td");
            coluna.textContent = valor || "";
            linha.appendChild(coluna);
        });

        tabela.appendChild(linha);
    });

    contador.textContent =
        lista.length +
        (lista.length === 1
            ? " equipamento encontrado"
            : " equipamentos encontrados");
}

window.mostrarTodos = function() {
    document.getElementById("busca").value = "";
    carregarTabela(equipamentos);
};

// ==================================================
// 12. PESQUISAR EQUIPAMENTOS
// ==================================================

window.pesquisar = function() {
    const termo = normalizarTexto(
        document.getElementById("busca").value
    );

    const resultado = equipamentos.filter(function(item) {
        return (
            normalizarTexto(item.servidor).includes(termo) ||
            normalizarTexto(item.serie).includes(termo) ||
            normalizarTexto(item.patrimonio).includes(termo)
        );
    });

    carregarTabela(resultado);
};

// ==================================================
// 13. LISTAR SERVIDORES
// ==================================================

window.renderizarServidores = function() {
    const area = document.getElementById("listaServidores");
    area.innerHTML = "";

    const nomes = [...new Set(
        movimentacoes
            .map(item => item.servidor)
            .filter(Boolean)
    )].sort();

    if (nomes.length === 0) {
        area.textContent = "Nenhum servidor encontrado.";
        return;
    }

    const tabela = document.createElement("table");
    const cabecalho = document.createElement("tr");

    ["Servidor", "Equipamentos em uso"].forEach(function(valor) {
        const th = document.createElement("th");
        th.textContent = valor;
        cabecalho.appendChild(th);
    });

    tabela.appendChild(cabecalho);

    nomes.forEach(function(nome) {
        const linha = document.createElement("tr");

        const quantidade = equipamentos.filter(function(item) {
            return item.servidor === nome &&
                item.situacao === "Em uso";
        }).length;

        [nome, quantidade].forEach(function(valor) {
            const coluna = document.createElement("td");
            coluna.textContent = valor;
            linha.appendChild(coluna);
        });

        tabela.appendChild(linha);
    });

    area.appendChild(tabela);
};

// ==================================================
// 14. HISTÓRICO DE MOVIMENTAÇÕES
// ==================================================

window.renderizarHistorico = function() {
    const tabela = document.getElementById("tabelaHistorico");
    const contador = document.getElementById("contadorHistorico");
    const campo = document.getElementById("buscaHistorico");

    const termo = normalizarTexto(campo.value);

    tabela.innerHTML = "";

    const lista = movimentacoes.filter(function(item) {
        return (
            normalizarTexto(item.servidor).includes(termo) ||
            normalizarTexto(item.patrimonio).includes(termo) ||
            normalizarTexto(item.serie).includes(termo) ||
            normalizarTexto(item.documento).includes(termo)
        );
    });

    lista.forEach(function(item) {
        const linha = document.createElement("tr");

        [
            item.servidor,
            item.patrimonio,
            item.serie,
            item.documento,
            item.data,
            item.tipo
        ].forEach(function(valor) {
            const coluna = document.createElement("td");
            coluna.textContent = valor || "";
            linha.appendChild(coluna);
        });

        tabela.appendChild(linha);
    });

    contador.textContent =
        lista.length + " movimentação(ões) encontrada(s).";
};

// ==================================================
// 15. INICIALIZAÇÃO DO DMIKA
// ==================================================

document.addEventListener("DOMContentLoaded", function() {
    atualizarEquipamentos();

    console.log("DMIKA iniciado com sucesso!");

    console.log("Movimentações carregadas:", movimentacoes.length);

    console.log("Equipamentos identificados:", equipamentos.length);
});
