

let pedido = "Leia a foto deste comprovante e responda em UMA ÚNICA LINHA, sem explicações e sem texto adicional.A resposta DEVE ter exatamente 7 partes, separadas pelo caractere |, nesta ordem:1.Categoria2.Estabelecimento 3. Itens 4. Total 5. Forma de pagamento 6. Parcelamento 7. Data e horário REGRAS:1. Categoria: informe somente uma destas opções, exatamente como escrita: Mercado, Transporte, Comida, Saúde, Lazer, Casa ou Outros.Não use emojis.2. Estabelecimento: informe somente o nome do estabelecimento.3. Itens: informe os produtos comprados e seus valores. Separe os itens usando vírgula ou ponto e vírgula. NÃO use o caractere | nos itens.4. Total: informe somente o valor numérico, usando ponto e duas casas decimais. Exemplo: 150.00.5. Forma de pagamento: informe somente Crédito, Débito ou PIX. Se não for possível identificar, informe Não informado.6. Parcelamento:* Cartão de crédito parcelado: informe, por exemplo, 3x de R$ 50,00.* Cartão de crédito à vista: À vista.* PIX: À vista.* Débito: À vista.* Se não for possível identificar: Não informado.7. Data e horário: informe no formato DD/MM/AAAA - HH:MM.Se a data ou o horário não estiverem visíveis ou não puderem ser identificados, informe Não informado.NÃO INVENTE INFORMAÇÕES.NÃO coloque | dentro de nenhum campo.EXEMPLO DE RESPOSTA CORRETA:Comida|Padaria Pão Quente|Pão - R$ 5,00; Leite - R$ 4,50|9.50|PIX|À vista|10/08/2026 - 14:35";

const firebaseConfig = {
  apiKey: "AIzaSyDc-Hzw9t0a1AHedAhvPqdxbOr7-3snCcA",
  authDomain: "controle-de-gasto-foto.firebaseapp.com",
  storageBucket: "controle-de-gasto-foto.firebasestorage.app",
  projectId: "controle-de-gasto-foto",
  messagingSenderId: "756967715290",
  appId: "1:756967715290:web:646297a2e9e6f69de150e3",
  measurementId: "G-RVCZCE76JM"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let usuarioAtual = null;

function injetarEstilosLogin() {
    if (document.getElementById("estilos-login-gasto")) return;

    const style = document.createElement("style");
    style.id = "estilos-login-gasto";
    style.textContent = `
        .tela-login-overlay {
            position: fixed; inset: 0;
            background: #f5f7fa;
            display: flex; align-items: center; justify-content: center;
            z-index: 10000; padding: 16px;
        }
        .caixa-login input {
            display: block;
            width: 100%; padding: 10px; margin-top: 10px;
            border: 1px solid #ccc; border-radius: 8px;
            font-size: 12px; box-sizing: border-box;
        }

        }
        .caixa-login h2 { margin: 0 0 16px 0; font-size: 20px; }
        .caixa-login input {
            width: 100%; padding: 12px; margin-top: 10px;
            border: 1px solid #ccc; border-radius: 8px;
            font-size: 15px; box-sizing: border-box;
        }
        .caixa-login button {
            width: 100%; padding: 15px; margin-top: 14px;
            border: none; border-radius: 8px; font-weight: 700;
            cursor: pointer; font-size: 15px;
        }
        .btn-entrar-login { background: #2461d6; color: #fff; }
        .btn-criar-conta-login { background: #dad8d8b3; color: #333; margin-top: 8px; }
        .erro-login { color: #d6453d; font-size: 13px; margin-top: 10px; min-height: 16px; }

        .campo-senha-login { position: relative; margin-top: 10px; }
        .campo-senha-login input { margin-top: 0; padding-right: 44px; }
        .caixa-login .btn-olho-senha {
        position: absolute; right: 6px; top: 50%;
        transform: translateY(-50%);
        width: 34px; height: 34px; margin-top: 0; padding: 0;
        display: flex; align-items: center; justify-content: center;
        background: transparent; color: #8a96a3;
        border-radius: 8px;
        transition: color 0.2s ease, background 0.2s ease;
        }
        .caixa-login .btn-olho-senha:hover {
            opacity: 0.8;
            color: #274845; background: #eef5f3;
        }
        .caixa-login .btn-olho-senha:active {
            transform: translateY(-50%) scale(0.92);
        }
    `;
    document.head.appendChild(style);
}

function mostrarTelaLogin() {
    injetarEstilosLogin();

    document.querySelectorAll(".tela-login-overlay").forEach(e => e.remove());

    const tela = document.createElement("div");
    tela.className = "tela-login-overlay";

    tela.innerHTML = `
        <div class="caixa-login">
            <h2>Gasto na Foto</h2>
            <input type="email" class="login-email" placeholder="Seu email">
            <div class="campo-senha-login">
            <input type="password" class="login-senha" placeholder="Sua senha">
            <button type="button" class="btn-olho-senha"  title="Mostrar senha">👁️</button>
        </div>
            <button type="button" class="btn-entrar-login">Entrar</button>
            <button type="button" class="btn-criar-conta-login">Criar conta nova</button>
            <div class="erro-login"></div>
        </div>
    `;

    document.body.appendChild(tela);

    const campoEmail = tela.querySelector(".login-email");
    const campoSenha = tela.querySelector(".login-senha");
    const divErro = tela.querySelector(".erro-login");
    const botaoOlho = tela.querySelector(".btn-olho-senha");

    botaoOlho.addEventListener("click", () => {
    if (campoSenha.type === "password") {
        campoSenha.type = "text";
        botaoOlho.innerHTML = ICONE_OLHO_RISCADO;
        botaoOlho.title = "Esconder senha";
    } else {
        campoSenha.type = "password";
        botaoOlho.innerHTML = ICONE_OLHO;
        botaoOlho.title = "Mostrar senha";
    }
});

    tela.querySelector(".btn-entrar-login").addEventListener("click", async () => {
        divErro.innerHTML = "";
        try {
            await auth.signInWithEmailAndPassword(campoEmail.value, campoSenha.value);
        } catch (erro) {
            divErro.innerHTML = traduzirErroLogin(erro);
        }
    });

    tela.querySelector(".btn-criar-conta-login").addEventListener("click", async () => {
        divErro.innerHTML = "";
        try {
            await auth.createUserWithEmailAndPassword(campoEmail.value, campoSenha.value);
        } catch (erro) {
            divErro.innerHTML = traduzirErroLogin(erro);
        }
    });
}

function traduzirErroLogin(erro) {
    console.log("Erro de login:", erro);

    if (erro.code === "auth/invalid-email") return "Email inválido.";
    if (erro.code === "auth/missing-password") return "Digite uma senha.";
    if (erro.code === "auth/weak-password") return "Senha muito fraca (mínimo 6 caracteres).";
    if (erro.code === "auth/email-already-in-use") return "Esse email já tem uma conta.";
    if (erro.code === "auth/invalid-credential") return "Email ou senha incorretos.";

    return "Erro ao fazer login. Tente novamente.";
}

let total = 0;
let comprovantesLidos = 0;
let categorias = {
    Mercado: 0,
    Transporte: 0,
    Comida: 0,
    Saúde: 0,
    Lazer: 0,
    Casa: 0,
    Outros: 0
};

function normalizarCategoria(categoria) {

    categoria = categoria
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();

    if (categoria.includes("mercado")) {
        return "Mercado";
    }

    if (categoria.includes("transporte")) {
        return "Transporte";
    }

    if (categoria.includes("comida") || categoria.includes("aliment")) {
        return "Comida";
    }

    if (categoria.includes("saude")) {
        return "Saúde";
    }

    if (categoria.includes("lazer")) {
        return "Lazer";
    }

    if (categoria.includes("casa")) {
        return "Casa";
    }

    return "Outros";
}

function converterValorBR(texto) {
    let limpo = String(texto).replace(/R\$/gi, "").trim();

    if (limpo.includes(",") && limpo.includes(".")) {
        limpo = limpo.replace(/\./g, "").replace(",", ".");
    } else if (limpo.includes(",")) {
        limpo = limpo.replace(",", ".");
    }

    return Number(limpo);
}

// ---------------------------------------------------------------
// NOVO: função central para converter valores no padrão brasileiro
// Resolve o bug de valores como "1.234,56" virarem NaN ou errados
// ---------------------------------------------------------------
function converterValorBR(texto) {
    let limpo = String(texto).replace(/R\$/gi, "").trim();

    if (limpo.includes(",") && limpo.includes(".")) {
        // ponto = separador de milhar, vírgula = decimal -> "1.234,56"
        limpo = limpo.replace(/\./g, "").replace(",", ".");
    } else if (limpo.includes(",")) {
        // só vírgula -> "50,00"
        limpo = limpo.replace(",", ".");
    }
    // se só tiver ponto, já está no formato certo (ex: "50.00")

    return Number(limpo);
}

function mostrarErroDeConexao(erro) {
    console.log("Erro detalhado:", erro);

    if (!navigator.onLine) {
        alert("Você está sem internet. Conecte-se e tente novamente.");
        return;
    }

    alert("Não foi possível processar o gasto agora. Tente novamente em instantes.");
}


// NOVO: extrai a linha válida da resposta da IA, mesmo que venha
// com texto extra antes/depois, markdown ou quebras de linha
// ---------------------------------------------------------------
function extrairPartesDaResposta(texto) {
    let linhas = texto.trim().split("\n").map(l => l.trim()).filter(Boolean);
    let linhaValida = linhas.find(l => l.split("|").length === 7);

    let base = linhaValida || texto;
    return base.split("|").map(p => p.trim());
}

function injetarEstilosModalGasto() {
    if (document.getElementById("estilos-modal-gasto")) return;

    const style = document.createElement("style");
    style.id = "estilos-modal-gasto";
    style.textContent = `
        .modal-overlay-gasto {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.55);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999; padding: 16px;
        }
        .modal-conteudo-gasto {
            background: #fff; border-radius: 12px; padding: 20px;
            width: 100%; max-width: 380px; max-height: 90vh;
            overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        }
        .modal-conteudo-gasto h3 { margin: 0 0 14px 0; font-size: 18px; }
        .modal-conteudo-gasto label {
            display: block; font-size: 13px; font-weight: 600;
            margin-top: 10px; margin-bottom: 4px; color: #333;
        }
        .modal-conteudo-gasto input, .modal-conteudo-gasto select {
            width: 100%; padding: 8px 10px; border: 1px solid #ccc;
            border-radius: 8px; font-size: 14px; box-sizing: border-box;
        }
        .modal-botoes-gasto { display: flex; gap: 10px; margin-top: 20px; }
        .modal-botoes-gasto button {
            flex: 1; padding: 10px; border: none; border-radius: 8px;
            font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .btn-cancelar-gasto { background: #eee; color: #333; }
        .btn-confirmar-gasto { background: #2e7d32; color: #fff; }
    `;
    document.head.appendChild(style);
}

function confirmarGasto(dados) {
    injetarEstilosModalGasto();

    return new Promise((resolve) => {
        document.querySelectorAll(".modal-overlay-gasto").forEach(m => m.remove());

        const categoriasDisponiveis = Object.keys(categorias);
        const formasPagamento = ["Crédito", "Débito", "PIX", "Não informado"];

        const modal = document.createElement("div");
        modal.className = "modal-overlay-gasto";

        modal.innerHTML = `
            <div class="modal-conteudo-gasto">
                <h3>Confere os dados do gasto</h3>

                <label>Categoria</label>
                <select class="conf-categoria">
                    ${categoriasDisponiveis.map(c =>
                        `<option value="${c}" ${c === dados.categoria ? "selected" : ""}>${c}</option>`
                    ).join("")}
                </select>

                <label>Estabelecimento</label>
                <input type="text" class="conf-estabelecimento" value="${dados.estabelecimento}">

                <label>Itens</label>
                <input type="text" class="conf-itens" value="${dados.itens}">

                <label>Valor (R$)</label>
                <input type="number" step="0.01" class="conf-valor" value="${dados.valor}">

                <label>Forma de pagamento</label>
                <select class="conf-pagamento">
                    ${formasPagamento.map(p =>
                        `<option value="${p}" ${p === dados.pagamento ? "selected" : ""}>${p}</option>`
                    ).join("")}
                </select>

                <label>Parcelas</label>
                <input type="text" class="conf-parcelas" value="${dados.parcelas}">

                <label>Data e horário</label>
                <input type="text" class="conf-data" value="${dados.dataHorario}">

                <div class="modal-botoes-gasto">
                    <button type="button" class="btn-cancelar-gasto">Cancelar</button>
                    <button type="button" class="btn-confirmar-gasto">Confirmar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector(".btn-cancelar-gasto").addEventListener("click", () => {
            modal.remove();
            resolve(null);
        });

        modal.querySelector(".btn-confirmar-gasto").addEventListener("click", () => {
            const valorEditado = converterValorBR(modal.querySelector(".conf-valor").value);

            if (isNaN(valorEditado)) {
                alert("Informe um valor válido antes de confirmar.");
                return;
            }

            const dadosEditados = {
                categoria: modal.querySelector(".conf-categoria").value,
                estabelecimento: modal.querySelector(".conf-estabelecimento").value.trim() || "Não informado",
                itens: modal.querySelector(".conf-itens").value.trim() || "Não informado",
                valor: valorEditado,
                pagamento: modal.querySelector(".conf-pagamento").value,
                parcelas: modal.querySelector(".conf-parcelas").value.trim() || "Não informado",
                dataHorario: modal.querySelector(".conf-data").value.trim() || "Não informado"
            };

            modal.remove();
            resolve(dadosEditados);
        });
    });
}

function registrarGasto(dados) {
      if (!dados.timestampRegistro) {
        dados.timestampRegistro = Date.now();
    }
    
    categorias[dados.categoria] += dados.valor;

    document.querySelector(".lista-de-comprovantes").innerHTML += `
    <div class="comprovante" data-categoria="${dados.categoria}" data-valor="${dados.valor}" data-dados="${btoa(unescape(encodeURIComponent(JSON.stringify(dados))))}">
        <div class="cabecalho-comprovante">
            <div class="etiqueta-categoria">${dados.categoria}</div>
            <div class="nome-estabelecimento">${dados.estabelecimento}</div>
        </div>
        <div class="informacoes-comprovante">
            <div class="itens">${dados.itens}</div>
            <div class="forma-pagamento">💳 Pagamento: <strong>${dados.pagamento}</strong></div>
            <div class="parcelas">📦 Parcelamento: <strong>${dados.parcelas}</strong></div>
            <div class="data-horario">📅 ${dados.dataHorario}</div>
        </div>
        <div class="total-nota">Total da nota: <strong>R$ ${dados.valor.toFixed(2)}</strong></div>
        <button class="botao-editar" onclick="editarComprovante(this)">✏️ Editar</button>
        <button class="botao-excluir" onclick="excluirComprovante(this)">🗑️ Excluir</button>
    </div>
`;

    total += dados.valor;
    document.querySelector(".total-gasto").innerHTML = "R$" + total.toFixed(2);

    comprovantesLidos++;
    document.querySelector(".lidos").innerHTML = comprovantesLidos;

    atualizarCategorias();

    salvarDados();
}


async function lerfoto() {
        try {
         
    let foto = document.querySelector(".foto").files[0];

    if (!foto) {
        return;
    }

    document.querySelector(".carregando").style.display = "block";

    let pedido = montarPedidoFoto();

    // chamada Assincrona
    // Estou pegando a Informação e estou enviando a IA para me devolver a resposta
    let resposta = await puter.ai.chat(pedido, foto);

    // Pegar a resposta da IA e filtrar para mostrar na tela ok
    let texto = resposta.message.content;
    console.log("RESPOSTA DA IA:", texto);

    let partes = extrairPartesDaResposta(texto);

    if (partes.length !== 7) {
        console.log("ERRO: resposta da IA está em formato incorreto");
        console.log("Resposta recebida:", texto);

        document.querySelector(".carregando").style.display = "none";

        alert("Não foi possível interpretar o comprovante. Tente novamente.");

        return;
    }

    console.log("PARTES:", partes);

    let categoria = normalizarCategoria(partes[0]);
    console.log("CATEGORIA:", categoria);

    let estabelecimento = partes[1];
    let itens = partes[2];

    let valor = converterValorBR(partes[3]);

    let pagamento = partes[4];
    let parcelas = partes[5];
    let dataHorario = partes[6];

    if (isNaN(valor)) {
        document.querySelector(".carregando").style.display = "none";

        alert("O valor do comprovante não foi identificado corretamente.");

        return;
    }
        let dados = {
        categoria: categoria,
        estabelecimento: estabelecimento && estabelecimento.trim() !== "" ? estabelecimento.trim() : "Não informado",
        itens: itens,
        valor: valor,
        pagamento: pagamento,
        parcelas: parcelas,
        dataHorario: dataHorario
    };


    document.querySelector(".carregando").style.display = "none";

    let dadosConfirmados = await confirmarGasto(dados);

    if (!dadosConfirmados) {
        return; // usuário cancelou
    }
    
       registrarGasto(dadosConfirmados);

    } catch (erro) {
        mostrarErroDeConexao(erro);
    } finally {
        document.querySelector(".carregando").style.display = "none";
    }
}
   

// Botão Excluir
function excluirComprovante(botao) {

    const comprovante = botao.parentElement;

    // Pegar categoria e valor guardados na div
    const categoria = comprovante.dataset.categoria;
    const valor = Number(comprovante.dataset.valor);

    // Diminuir da categoria
    categorias[categoria] -= valor;

    // Diminuir do total geral
    total -= valor;

    // Remover comprovante da tela
    comprovante.remove();

    // Atualizar total geral
    document.querySelector(".total-gasto").innerHTML =
        "R$ " + total.toFixed(2);

    // Atualizar quantidade de comprovantes
    comprovantesLidos =
        document.querySelectorAll(".comprovante").length;

    document.querySelector(".lidos").innerHTML = comprovantesLidos;

    // Atualizar todas as categorias
    for (let categoria in categorias) {

        let classe = categoria
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        document.querySelector("." + classe).innerHTML =
            "R$ " + categorias[categoria].toFixed(2);
    }
    salvarDados();
}

  async function editarComprovante(botao) {

    const comprovante = botao.parentElement;

    // Recupera os dados completos que guardamos escondidos no card
    const dadosAtuais = JSON.parse(
        decodeURIComponent(escape(atob(comprovante.dataset.dados)))
    );

    // Abre o mesmo modal de confirmação, já preenchido
    const dadosEditados = await confirmarGasto(dadosAtuais);

    if (!dadosEditados) {
        return; // usuário cancelou a edição
    }

    // Primeiro, desfaz o valor antigo dos totais e categorias
    categorias[dadosAtuais.categoria] -= dadosAtuais.valor;
    total -= dadosAtuais.valor;

    // Depois, aplica os novos valores
    categorias[dadosEditados.categoria] += dadosEditados.valor;
    total += dadosEditados.valor;

    atualizarCategorias();
    document.querySelector(".total-gasto").innerHTML = "R$" + total.toFixed(2);

    // Atualiza o card na tela com os novos dados
    comprovante.dataset.categoria = dadosEditados.categoria;
    comprovante.dataset.valor = dadosEditados.valor;
    comprovante.dataset.dados = btoa(unescape(encodeURIComponent(JSON.stringify(dadosEditados))));
    
    comprovante.querySelector(".etiqueta-categoria").innerHTML = dadosEditados.categoria;
    comprovante.querySelector(".nome-estabelecimento").innerHTML = dadosEditados.estabelecimento;
    comprovante.querySelector(".itens").innerHTML = dadosEditados.itens;
    comprovante.querySelector(".forma-pagamento").innerHTML =
        `💳 Pagamento: <strong>${dadosEditados.pagamento}</strong>`;
    comprovante.querySelector(".parcelas").innerHTML =
        `📦 Parcelamento: <strong>${dadosEditados.parcelas}</strong>`;
    comprovante.querySelector(".data-horario").innerHTML = `📅 ${dadosEditados.dataHorario}`;
    comprovante.querySelector(".total-nota").innerHTML =
        `Total da nota: <strong>R$ ${dadosEditados.valor.toFixed(2)}</strong>`;

    salvarDados();
}

const data = new Date();

document.querySelector(".mes-atual").innerHTML =
    data.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
    });

// ---------------------------------------------------------------
// NOVO: prompt usado na foto extraído para uma função própria,
// já reforçando "responda em uma única linha, sem texto extra"
// ---------------------------------------------------------------
function montarPedidoFoto() {
    return `
    Você é um assistente financeiro.

    Analise a imagem do comprovante/nota fiscal enviada e extraia as informações do gasto.

    Responda EXATAMENTE neste formato, em UMA ÚNICA LINHA,
    sem explicações, sem markdown, sem texto antes ou depois:

    categoria | estabelecimento | itens | valor | forma de pagamento | parcelas | data e horário

    Regras:

    - Categoria deve ser exatamente uma destas:
    Mercado, Transporte, Comida, Saúde, Lazer, Casa ou Outros.

    - Identifique o estabelecimento quando ele for informado.

    - Identifique os itens quando forem informados.

    - O valor deve ser somente o valor numérico, no formato brasileiro
    (ex: 1234,56 para mil duzentos e trinta e quatro reais e cinquenta e seis centavos).

    - A forma de pagamento deve ser exatamente uma destas:
    Crédito, Débito, PIX ou Não informado.

    - Se as parcelas não forem informadas, responda:
    Não informado

    - Se a data e horário não forem informados, responda:
    Não informado

    - Nunca invente informações.

    - Retorne somente uma linha.
    `;
}

function iniciarVoz() {

    async function processarVoz(texto) {

        console.log("Texto enviado para IA:", texto);

        let pedido = `
    Você é um assistente financeiro.

    Analise o texto abaixo e extraia as informações do gasto.

    Texto:

    ${texto}

    Responda EXATAMENTE neste formato, em UMA ÚNICA LINHA,
    sem explicações, sem markdown, sem texto antes ou depois:

    categoria | estabelecimento | itens | valor | forma de pagamento | parcelas | data e horário

    Regras:

     - Categoria deve ser exatamente uma destas:
    Mercado, Transporte, Comida, Saúde, Lazer, Casa ou Outros.

    - Identifique o estabelecimento quando ele for informado.

    - Identifique os itens quando forem informados.

    - O valor deve ser somente o valor numérico, no formato brasileiro
    (ex: 1234,56 para mil duzentos e trinta e quatro reais e cinquenta e seis centavos).

    - A forma de pagamento deve ser exatamente uma destas:
    Crédito, Débito, PIX ou Não informado.

    - Se o usuário disser "pix", "no pix", "paguei no pix" ou "foi no pix", responda exatamente:
    PIX

    - Se o usuário disser "crédito" ou "cartão de crédito" ou "no crédito", responda:
    Crédito

    - Se o usuário disser "débito" ou "cartão de débito", responda:
    Débito

    - Se a forma de pagamento não for informada, responda:
    Não informado

    - Se o usuário mencionar qualquer uma destas formas de parcelamento,
    extraia o número de parcelas:
    "em X vezes", "dividido em X", "parcelado em X", "parcelei em X",
    "Xx", "X parcelas".

    Exemplos:
    "em duas vezes" -> 2
    "dividido em 3" -> 3
    "4x" -> 4

    - Responda as parcelas apenas com o número (ex: "2"), nunca com a palavra "vezes" junto.

    - Só responda "Não informado" nas parcelas se realmente nenhuma
    quantidade de parcelas for mencionada no texto.

    - Se a data e horário não forem informados, responda:
    Não informado

    - Nunca invente informações.

    - Retorne somente uma linha.

    Exemplo:

    Texto: "gastei cinquenta reais no mercado guanabara no crédito em duas vezes"

    Resposta correta:
    Mercado | Mercado Guanabara | Não informado | 50,00 | Crédito | 2 | Não informado
    `;

        // NOVO: mostrar o indicador de carregamento também na voz
        document.querySelector(".carregando").style.display = "block";

        try {

            let resposta = await puter.ai.chat(pedido);

            let textoResposta = resposta.message.content;

            console.log("RESPOSTA DA IA:", textoResposta);

            let partes = extrairPartesDaResposta(textoResposta);

            if (partes.length !== 7) {

                console.log("Resposta recebida:", textoResposta);

                alert("Não foi possível interpretar o gasto.");

                document.querySelector(".carregando").style.display = "none";

                return;
            }

            console.log("PARTES:", partes);

            let categoria = normalizarCategoria(partes[0]);

            let estabelecimento = partes[1];
            let itens = partes[2];

            let valor = converterValorBR(partes[3]);

            let pagamento = partes[4];
            let parcelas = partes[5];
            let dataHorario = partes[6];

            if (isNaN(valor)) {

                alert("O valor não foi identificado corretamente.");

                document.querySelector(".carregando").style.display = "none";

                return;
            }
         
                  let dados = {
          categoria: categoria,
          estabelecimento: estabelecimento && estabelecimento.trim() !== "" ? estabelecimento.trim() : "Não informado",
          itens: itens,
          valor: valor,
          pagamento: pagamento,
          parcelas: parcelas,
          dataHorario: dataHorario
      };

      let dadosConfirmados = await confirmarGasto(dados);

      if (!dadosConfirmados) {
          return; // usuário cancelou
      }

      registrarGasto(dadosConfirmados);


        } catch (erro) {
            
              mostrarErroDeConexao(erro);

        } finally {

            // NOVO: garante que o indicador de carregamento sempre some,
            // mesmo se der erro
            document.querySelector(".carregando").style.display = "none";
        }
    }

    const reconhecimento = new webkitSpeechRecognition();

    reconhecimento.lang = "pt-BR";
    reconhecimento.continuous = false;
    reconhecimento.interimResults = true;

    reconhecimento.start();

    reconhecimento.onstart = function () {
        console.log("Pode falar...");
    };

    reconhecimento.onresult = function (evento) {

        let texto = "";

        // CORRIGIDO: adiciona espaço entre os pedaços de transcrição
        // para não grudar palavras (ex: "cinquenta reaisno mercado")
       
        for (let i = 0; i < evento.results.length; i++) {
        texto += evento.results[i][0].transcript + " ";
        }
        texto = texto.trim();
        console.log("Texto:", texto);

        if (evento.results[evento.results.length - 1].isFinal) {
            processarVoz(texto);
        }
    };

    reconhecimento.onerror = function (erro) {
        console.log("Erro no reconhecimento:", erro);

        document.querySelector(".carregando").style.display = "none";
    };

}

function atualizarCategorias() {

    for (let c in categorias) {

        let classe = c
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        document.querySelector("." + classe).innerHTML =
            "R$ " + categorias[c].toFixed(2);
    }
            atualizarOpcoesDeMes();
         desenharGraficoCategorias();
}

function recalcularTotaisDosComprovantes() {

    const categoriasRecalculadas = {
        Mercado: 0,
        Transporte: 0,
        Comida: 0,
        Saúde: 0,
        Lazer: 0,
        Casa: 0,
        Outros: 0
    };

    let totalRecalculado = 0;

    document.querySelectorAll(".comprovante").forEach(card => {
        const categoria = card.dataset.categoria;
        const valor = Number(card.dataset.valor);

        if (categoriasRecalculadas[categoria] !== undefined && !isNaN(valor)) {
            categoriasRecalculadas[categoria] += valor;
            totalRecalculado += valor;
        }
    });

    categorias = categoriasRecalculadas;
    total = totalRecalculado;

    atualizarCategorias();
    document.querySelector(".total-gasto").innerHTML = "R$" + total.toFixed(2);

    salvarDados();

    console.log("Totais recalculados:", categorias, "Total:", total);
}

let graficoCategorias = null;
let totalCentralGrafico = 0;

const pluginTextoCentral = {
    id: "textoCentral",
    afterDraw(chart) {

        const { ctx, chartArea } = chart;

        if (!chartArea) return;

        const centroX = (chartArea.left + chartArea.right) / 2;
        const centroY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "#17212b";
        ctx.fillText("R$ " +  totalCentralGrafico.toFixed(2), centroX, centroY - 8);

        ctx.font = "13px Arial";
        ctx.fillStyle = "#8a96a3";
        ctx.fillText("Total gasto", centroX, centroY + 14);

        ctx.restore();
    }
};


function desenharGraficoCategorias   (categoriasParaExibir, totalParaExibir) {

    const canvas = document.getElementById("grafico-categorias");

    if (!canvas) {
        return;
    }

    // Se não vier nada específico, usa os dados globais (comportamento padrão)
    const dadosCategorias = categoriasParaExibir || categorias;
    const totalExibido = totalParaExibir !== undefined ? totalParaExibir : total;

    totalCentralGrafico = totalExibido;

    const nomes = Object.keys(dadosCategorias);
    const valores = Object.values(dadosCategorias);
    // Se já existe um gráfico desenhado antes, destrói ele primeiro
    // (senão o Chart.js desenha um gráfico em cima do outro)
    if (graficoCategorias) {
        graficoCategorias.destroy();
    }

           graficoCategorias = new Chart(canvas, {
        type: "doughnut",
        plugins: [pluginTextoCentral],
        data: {
            labels: nomes,
            datasets: [{
                data: valores,
                backgroundColor: [
                    "#274845", "#2461d6", "#d6453d",
                    "#e8a33d", "#8a5fd6", "#2e7d32", "#8a96a3"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}


function adicionarGastoManual() {

    let estabelecimento = document.querySelector(".estabelecimento-manual").value;
    let valor = converterValorBR(document.querySelector(".valor-manual").value);
    let categoria = normalizarCategoria(document.querySelector(".categoria-manual").value);
    let pagamento = document.querySelector(".pagamento-manual").value;
    let parcelas = document.querySelector(".parcelas-manual").value;

    if (isNaN(valor)) {
        alert("Informe um valor válido.");
        return;
    }

    if (pagamento !== "Crédito") {
        parcelas = "Não informado";
    }

    categorias[categoria] += valor;
    total += valor;
    comprovantesLidos++;

    document.querySelector(".lista-de-comprovantes").innerHTML += `
        <div class="comprovante" data-categoria="${categoria}" data-valor="${valor}">

            <div class="cabecalho-comprovante">
                <div class="nome-estabelecimento">
                    ${estabelecimento || "Gasto manual"}
                </div>
            </div>

            <div class="informacoes-comprovante">

                <div class="itens">
                    Gasto registrado manualmente
                </div>

                <div class="forma-pagamento">
                    💳 Pagamento:
                    <strong>${pagamento}</strong>
                </div>

                <div class="parcelas">
                  📦 Parcelamento:
                   <strong>${parcelas}</strong>
                </div>

                <div class="data-horario">
                    📅 ${new Date().toLocaleDateString("pt-BR")}
                </div>

            </div>

            <div class="total-nota">
                Total da nota:
                <strong>R$ ${valor.toFixed(2)}</strong>
            </div>

            <button class="botao-excluir" onclick="excluirComprovante(this)">
                🗑️ Excluir
            </button>

        </div>
    `;

    document.querySelector(".total-gasto").innerHTML =
        "R$ " + total.toFixed(2);

    document.querySelector(".lidos").innerHTML =
        comprovantesLidos;

    atualizarCategorias();

    salvarDados();

    document.querySelector(".estabelecimento-manual").value = "";
    document.querySelector(".valor-manual").value = "";
    document.querySelector(".categoria-manual").selectedIndex = 0;
    document.querySelector(".pagamento-manual").selectedIndex = 0;
}

document.querySelector(".pagamento-manual").addEventListener("change", function () {

    const parcelamento = document.querySelector(".campo-parcelamento");
    const parcelas = document.querySelector(".parcelas-manual");

    if (this.value === "Crédito") {

        parcelamento.style.display = "flex";

    } else {

        parcelamento.style.display = "none";
        parcelas.value = "Não informado";

    }

});

async function salvarDados() {

    if (!usuarioAtual) {
        return; // ninguém logado, não tem onde salvar
    }

    try {
        await db.collection("usuarios").doc(usuarioAtual.uid).set({
            total: total,
            comprovantesLidos: comprovantesLidos,
            categorias: categorias,
            comprovantesHTML: document.querySelector(".lista-de-comprovantes").innerHTML
        });

    } catch (erro) {
        console.log("Erro ao salvar no Firestore:", erro);
    }
}

async function carregarDados() {

    if (!usuarioAtual) {
        return;
    }

    try {
        const documento = await db.collection("usuarios").doc(usuarioAtual.uid).get();

        if (documento.exists) {

            const dadosSalvos = documento.data();

            total = dadosSalvos.total || 0;
            comprovantesLidos = dadosSalvos.comprovantesLidos || 0;
            categorias = dadosSalvos.categorias || {
                Mercado: 0,
                Transporte: 0,
                Comida: 0,
                Saúde: 0,
                Lazer: 0,
                Casa: 0,
                Outros: 0
            };

            document.querySelector(".lista-de-comprovantes").innerHTML =
                dadosSalvos.comprovantesHTML || "";

               recalcularTotaisDosComprovantes();

        } else {
            // Usuário novo, sem dados salvos ainda — começa zerado
            total = 0;
            comprovantesLidos = 0;
            categorias = {
                Mercado: 0,
                Transporte: 0,
                Comida: 0,
                Saúde: 0,
                Lazer: 0,
                Casa: 0,
                Outros: 0
            };
        }

        document.querySelector(".total-gasto").innerHTML = "R$" + total.toFixed(2);
        document.querySelector(".lidos").innerHTML = comprovantesLidos;

        for (let categoria in categorias) {
            let classe = categoria
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

            const elemento = document.querySelector("." + classe);

            if (elemento) {
                elemento.innerHTML = "R$ " + categorias[categoria].toFixed(2);
            }
        }

     } catch (erro) {
         console.log("Erro ao carregar do Firestore:", erro);
        alert("Não foi possível carregar seus dados. Verifique sua internet.");
    }
}


auth.onAuthStateChanged(function (usuario) {

    if (usuario) {
        usuarioAtual = usuario;

        document.querySelectorAll(".tela-login-overlay").forEach(e => e.remove());

        criarBotaoLogout();
        criarSeletorDeMes();
        carregarDados();

    } else {
        usuarioAtual = null;
        removerBotaoLogout();
        mostrarTelaLogin();
    }
});

function criarBotaoLogout() {

    if (document.getElementById("botao-logout-gasto")) {
        return; // já existe, não duplicar
    }

    const botao = document.createElement("button");
    botao.id = "botao-logout-gasto";
    botao.innerHTML = " > Sair";

    botao.style.cssText = `
        position: fixed;
        top: 14px;
        right: 10px;
        z-index: 9998;
        padding: 8px 11px;
        border: 1px solid #f2d2d0;
        border-radius: 10px;
        background: #fff7f6;
        color: #e33f36;
        font-family: inherit;
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
    `;

    botao.addEventListener("click", async () => {
        const confirmar = confirm("Tem certeza que quer sair da conta?");

        if (confirmar) {
            await auth.signOut();
        }
    });

    document.body.appendChild(botao);
}

function criarSeletorDeMes() {

    if (document.getElementById("seletor-mes-gasto")) {
        return; // já existe, não duplicar
    }

    const select = document.createElement("select");
    select.id = "seletor-mes-gasto";

    select.style.cssText = `
        display: block;
        margin: 16px auto;
        padding: 8px 14px;
        border: 1px solid #dfe6eb;
        border-radius: 10px;
        font-family: inherit;
        font-size: 0.9rem;
        background: #f9fafb;
        color: #17212b;
    `;

    // Opção "Todos" sempre disponível
    select.innerHTML = `<option value="todos">Todos os meses</option>`;

    // Insere logo antes da lista de comprovantes
    const lista = document.querySelector(".lista-de-comprovantes");
    lista.parentElement.insertBefore(select, lista);

    select.addEventListener("change", function () {
        aplicarFiltroDeMes(this.value);
    });
}

function atualizarOpcoesDeMes() {

    const select = document.getElementById("seletor-mes-gasto");
    if (!select) return;

    const valorSelecionadoAntes = select.value;

    const mesesEncontrados = new Set();

    document.querySelectorAll(".comprovante").forEach(card => {

        if (!card.dataset.dados) {
            return; // card antigo sem essa informação, ignora
        }

        let dados;
        try {
            dados = JSON.parse(
                decodeURIComponent(escape(atob(card.dataset.dados)))
            );
        } catch (erro) {
            return; // dado corrompido ou inválido, ignora
        }

        if (dados.timestampRegistro) {
            const data = new Date(dados.timestampRegistro);
            const chave = data.getFullYear() + "-" + String(data.getMonth() + 1).padStart(2, "0");
            mesesEncontrados.add(chave);
        }
    });

    // Ordena do mais recente para o mais antigo
    const mesesOrdenados = Array.from(mesesEncontrados).sort().reverse();

    const nomesDosMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    select.innerHTML = `<option value="todos">Todos os meses</option>`;

    mesesOrdenados.forEach(chave => {
        const [ano, mes] = chave.split("-");
        const nomeMes = nomesDosMeses[Number(mes) - 1];

        select.innerHTML += `<option value="${chave}">${nomeMes} de ${ano}</option>`;
    });

    // Tenta manter a seleção que o usuário já tinha feito
    if ([...select.options].some(o => o.value === valorSelecionadoAntes)) {
        select.value = valorSelecionadoAntes;
    }
}

function aplicarFiltroDeMes(mesEscolhido) {

    const cards = document.querySelectorAll(".comprovante");

    // Começamos os totais filtrados zerados
    const categoriasFiltradas = {
        Mercado: 0,
        Transporte: 0,
        Comida: 0,
        Saúde: 0,
        Lazer: 0,
        Casa: 0,
        Outros: 0
    };
    let totalFiltrado = 0;

        cards.forEach(card => {

        if (!card.dataset.dados) {
            card.style.display = "block"; // sem info, mostra por segurança
            return;
        }

        let dados;
        try {
            dados = JSON.parse(
                decodeURIComponent(escape(atob(card.dataset.dados)))
            );
        } catch (erro) {
            card.style.display = "block";
            return;
        }

        let pertenceAoMes = true;

        if (mesEscolhido !== "todos" && dados.timestampRegistro) {
            const data = new Date(dados.timestampRegistro);
            const chaveDoCard = data.getFullYear() + "-" + String(data.getMonth() + 1).padStart(2, "0");
            pertenceAoMes = (chaveDoCard === mesEscolhido);
        }

        if (pertenceAoMes) {
            card.style.display = "block";
            categoriasFiltradas[dados.categoria] += dados.valor;
            totalFiltrado += dados.valor;
        } else {
            card.style.display = "none";
        }
    });

    // Atualiza os números na tela com os totais FILTRADOS
    document.querySelector(".total-gasto").innerHTML = "R$" + totalFiltrado.toFixed(2);

    for (let categoria in categoriasFiltradas) {
        let classe = categoria
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        const elemento = document.querySelector("." + classe);

        if (elemento) {
            elemento.innerHTML = "R$ " + categoriasFiltradas[categoria].toFixed(2);
        }
    }

    // Redesenha o gráfico só com os dados filtrados
    desenharGraficoCategorias(categoriasFiltradas, totalFiltrado);
}

function removerBotaoLogout() {
    const botao = document.getElementById("botao-logout-gasto");
    if (botao) {
        botao.remove();
    }
}