

let pedido = "Leia a foto deste comprovante e responda em UMA linha, sem escrever mais nada, com 4 pedaços separados por |. Primeiro pedaço: o emoji da categoria, o nome do estabelecimento e depois cada item comprado com seu valor, um por linha. Segundo pedaço: o total pago, só o número, com ponto e sempre com duas casas decimais. Terceiro pedaço: informe somente a forma de pagamento: Crédito, Débito ou PIX. Quarto pedaço: se for cartão de crédito e houver parcelas, informe o número de parcelas e o valor de cada parcela. Se for cartão de crédito à vista, informe À vista. Se for PIX ou Débito, informe somente À vista. Se não for possível identificar a forma de pagamento ou o parcelamento no comprovante, informe Não informado. Não invente nenhuma informação. As categorias são: 🛒 Mercado, 🚗 Transporte, 🍔 Comida, 💊 Saúde, 🎉 Lazer, 🏠 Casa, 💸 Outros. Exemplo: 🍔 Padaria Pão QuentePão — R$ 5,00Leite — R$ 4,50|150.00|Crédito|3x de R$ 50,00";



let total = 0;
let comprovantesLidos = 0;

   
 async  function lerfoto() { 
    let foto = document.querySelector(".foto").files[0];

         // chamada Assincrona
         // Estou pegando a Informação e estou enviando a IA para me devolver a resposta
    let resposta = await puter.ai.chat(pedido, foto)

    //Pegar a resposta da IA e filtrar para mostrar na tela
    let texto = resposta.
    message.content
    let partes = texto.split("|")

    // colocar o texto na tela
    document.querySelector(".lista-de-comprovantes").innerHTML += `
     <div class="comprovante">${texto}
          <div class="itens">${partes[0]}</div>

          <div class="forma-pagamento">Forma de pagamento: ${partes[2]}</div>

          <div class="parcelas"> Parcelamento: ${partes[3]} </div>
          
          <div class="total-nota">Total da nota: R$ ${partes[1]}</div>
          
          
     </div>
 
    `
    total += Number(partes[1]);
    document.querySelector(".total-gasto").innerHTML = "R$" + total.toFixed(2)
     
    comprovantesLidos++;
    document.querySelector(".lidos").innerHTML = "comprovantes lidos: " + comprovantesLidos;
    
    

}