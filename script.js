

let pedido = "Leia a foto deste comprovante e responda em UMA ÚNICA LINHA, sem explicações e sem texto adicional.A resposta DEVE ter exatamente 7 partes, separadas pelo caractere |, nesta ordem:1.Categoria2.Estabelecimento 3. Itens 4. Total 5. Forma de pagamento 6. Parcelamento 7. Data e horário REGRAS:1. Categoria: informe somente uma destas opções, exatamente como escrita: Mercado, Transporte, Comida, Saúde, Lazer, Casa ou Outros.Não use emojis.2. Estabelecimento: informe somente o nome do estabelecimento.3. Itens: informe os produtos comprados e seus valores. Separe os itens usando vírgula ou ponto e vírgula. NÃO use o caractere | nos itens.4. Total: informe somente o valor numérico, usando ponto e duas casas decimais. Exemplo: 150.00.5. Forma de pagamento: informe somente Crédito, Débito ou PIX. Se não for possível identificar, informe Não informado.6. Parcelamento:* Cartão de crédito parcelado: informe, por exemplo, 3x de R$ 50,00.* Cartão de crédito à vista: À vista.* PIX: À vista.* Débito: À vista.* Se não for possível identificar: Não informado.7. Data e horário: informe no formato DD/MM/AAAA - HH:MM.Se a data ou o horário não estiverem visíveis ou não puderem ser identificados, informe Não informado.NÃO INVENTE INFORMAÇÕES.NÃO coloque | dentro de nenhum campo.EXEMPLO DE RESPOSTA CORRETA:Comida|Padaria Pão Quente|Pão - R$ 5,00; Leite - R$ 4,50|9.50|PIX|À vista|10/08/2026 - 14:35";



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
   
 async  function lerfoto() {  
     let foto = document.querySelector(".foto").files[0];
     
     if (!foto) {
        return;
     }  

       document.querySelector(".carregando").style.display = "block";
         // chamada Assincrona
          // Estou pegando a Informação e estou enviando a IA para me devolver a resposta
     let resposta = await puter.ai.chat(pedido, foto)

     //Pegar a resposta da IA e filtrar para mostrar na tela
     let texto = resposta.message.content;
     console.log("RESPOSTA DA IA:", texto);

    let partes = texto.split("|");
   
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

    let valor = Number(
        partes[3]
            .replace("R$", "")
            .replace(",", ".")
            .trim()
    );

    let pagamento = partes[4];
    let parcelas = partes[5];
    let dataHorario = partes[6];

    if (isNaN(valor)) {
        document.querySelector(".carregando").style.display = "none";

        alert("O valor do comprovante não foi identificado corretamente.");

        return;
 }

    categorias[categoria] += valor;
 
    for (let categoria in categorias) {
    let classe = categoria
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase(); 

    document.querySelector("." + classe).innerHTML =
        "R$ " + categorias[categoria].toFixed(2);
    }

     // colocar o texto na tela
    document.querySelector(".lista-de-comprovantes").innerHTML += `
    <div class="comprovante" data-categoria="${categoria}" data-valor="${valor}">

        <div class="cabecalho-comprovante">
            <div class="nome-estabelecimento">
                ${estabelecimento}
            </div>
        </div>

        <div class="informacoes-comprovante">
               <div class="itens">
                    ${itens}
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
                📅 ${dataHorario}
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

    total += valor;
    document.querySelector(".total-gasto").innerHTML = "R$" + total.toFixed(2)
     
    comprovantesLidos++;
     document.querySelector(".lidos").innerHTML =
     comprovantesLidos;

     salvarDados();
    
     document.querySelector(".carregando").style.display = "none";

    
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

    document.querySelector(".lidos").innerHTML =
     comprovantesLidos;

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
    const data = new Date();

    document.querySelector(".mes-atual").innerHTML =
    data.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
});


    
function iniciarVoz() {

    async function processarVoz(texto) {

    console.log("Texto enviado para IA:", texto);
    let pedido = `
    Você é um assistente financeiro.

    Analise o texto abaixo e extraia as informações do gasto.

    Texto:
    ${texto}

    Responda EXATAMENTE neste formato:

    categoria | estabelecimento | itens | valor | forma de pagamento | parcelas | data e horário

    Regras:

    - Categoria deve ser exatamente uma destas:
    Mercado, Transporte, Comida, Saúde, Lazer, Casa ou Outros.
    - Identifique o estabelecimento quando ele for informado.
    - Identifique os itens quando forem informados.
    - O valor deve ser somente o valor numérico.
    - A forma de pagamento pode ser Crédito, Débito ou PIX.
    - Se a forma de pagamento não for informada, responda "Não informado".
    - Se as parcelas não forem informadas, responda "Não informado".
    - Se a data e horário não forem informados, responda "Não informado".
    - Nunca invente informações.
    - Retorne somente uma linha.
    `;

    try {

      let resposta = await puter.ai.chat(pedido);

    let texto = resposta.message.content;

    console.log("RESPOSTA DA IA:", texto);

    let partes = texto.split("|");

    if (partes.length !== 7) {

    console.log("Resposta recebida:", texto);

    alert("Não foi possível interpretar o gasto.");

    return;
}

    console.log("PARTES:", partes);

    let categoria = normalizarCategoria(partes[0]);

    let estabelecimento = partes[1];
    let itens = partes[2];

    let valor = Number(
        partes[3]
        .replace("R$", "")
        .replace(",", ".")
        .trim()
);

    let pagamento = partes[4];
    let parcelas = partes[5];
    let dataHorario = partes[6];

    if (isNaN(valor)) {

    alert("O valor não foi identificado corretamente.");

    return;
}

    categorias[categoria] += valor;


    // Atualizar categorias
    for (let categoria in categorias) {

    let classe = categoria
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    document.querySelector("." + classe).innerHTML =
        "R$ " + categorias[categoria].toFixed(2);
}


    // Criar comprovante
    document.querySelector(".lista-de-comprovantes").innerHTML += `
    <div class="comprovante" data-categoria="${categoria}" data-valor="${valor}">

        <div class="cabecalho-comprovante">
            <div class="nome-estabelecimento">
                ${estabelecimento}
            </div>
        </div>

        <div class="informacoes-comprovante">

            <div class="itens">
                ${itens}
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
                📅 ${dataHorario}
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

    // Atualizar total
    total += valor;

    document.querySelector(".total-gasto").innerHTML =
        "R$" + total.toFixed(2);

    // Atualizar contador
    comprovantesLidos++;

    document.querySelector(".lidos").innerHTML =
        comprovantesLidos;

    salvarDados();

    } catch (erro) {

        console.log("Erro ao enviar para IA:", erro);

        alert("Erro ao processar o gasto.");
    }

    }
        
    const reconhecimento = new webkitSpeechRecognition();

    reconhecimento.lang = "pt-BR";
    reconhecimento.continuous = false;
    reconhecimento.interimResults = true;

    reconhecimento.start();

    reconhecimento.onstart = function () {
        console.log(" Pode falar...");
    };

    reconhecimento.onresult = function (evento) {

        let texto = "";

        for (let i = 0; i < evento.results.length; i++) {
            texto += evento.results[i][0].transcript;
        }

        console.log("Texto:", texto);

       if (evento.results[evento.results.length - 1].isFinal) {
    processarVoz(texto);
}
    };

    reconhecimento.onerror = function (erro) {
        console.log("Erro no reconhecimento:", erro);
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
}

    function adicionarGastoManual() {

    let estabelecimento = document.querySelector(".estabelecimento-manual").value;
    let valor = Number(document.querySelector(".valor-manual").value);
    let categoria = normalizarCategoria(document.querySelector(".categoria-manual").value);
    let pagamento = document.querySelector(".pagamento-manual").value;
    let parcelas =
    document.querySelector(".parcelas-manual").value;

    if (!valor || valor <= 0) {
        alert("Digite um valor válido.");
        return;
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
}
    
    function salvarDados() {

    localStorage.setItem("total", total);

    localStorage.setItem(
        "comprovantesLidos",
        comprovantesLidos
    );

    localStorage.setItem(
        "categorias",
        JSON.stringify(categorias)
    );

    localStorage.setItem(
        "comprovantes",
        document.querySelector(".lista-de-comprovantes").innerHTML
    );
}
 
    function carregarDados() {

    const totalSalvo = localStorage.getItem("total");
    const comprovantesSalvos =
        localStorage.getItem("comprovantesLidos");

    const categoriasSalvas =
        localStorage.getItem("categorias");

    const comprovantesHTML =
        localStorage.getItem("comprovantes");

    if (totalSalvo !== null) {
        total = Number(totalSalvo);
    }

    if (comprovantesSalvos !== null) {
        comprovantesLidos = Number(comprovantesSalvos);
    }

    if (categoriasSalvas !== null) {
        categorias = JSON.parse(categoriasSalvas);
    }

    if (comprovantesHTML !== null) {

        document.querySelector(
            ".lista-de-comprovantes"
        ).innerHTML = comprovantesHTML;
    }

    document.querySelector(".total-gasto").innerHTML =
        "R$" + total.toFixed(2);

    document.querySelector(".lidos").innerHTML =
        comprovantesLidos;

    for (let categoria in categorias) {

        let classe = categoria
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        const elemento =
            document.querySelector("." + classe);

        if (elemento) {

            elemento.innerHTML =
                "R$ " + categorias[categoria].toFixed(2);
        }
    }
}
       carregarDados();