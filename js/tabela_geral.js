let fii_user = [];
let fii_table = [];

async function carregarDadosUser(url){
  await fetch(url)
          .then(resp => resp.json())
          .then(json => fii_user = json);
  carregarDadosFundos();
}

async function carregarDadosFundos(){
  for (let fii of fii_user){
    let json = await fetch(`https://api-simple-flask.herokuapp.com/api/${fii.nome}`)
                    .then(resp => resp.json());
    fii_table.push(json);  
  }
  exibirTabela();
}

carregarDadosUser("json/fii.json");

function exibirTabela(){ 
  let limite_percentual = 0.6;
  let total_cotas = 0;
  let total_investido = 0;
  let total_proventos = 0;
  let provento = 0;
  let data_base = 0;
  let data_pagamento = 0;
  let percentual = 0;
  let preco_medio = 0;

  for (let fii of fii_user){
    let dados_fii = fii_table.find((item) => item.fundo.indexOf(fii.nome.toUpperCase()) > -1);

    let dadosRendimento = dados_fii.proximoRendimento.rendimento == "-" ? dados_fii.ultimoRendimento : dados_fii.proximoRendimento
    provento = dadosRendimento.rendimento;
    data_base = dadosRendimento.dataBase;
    data_pagamento = dadosRendimento.dataPag;

    total_proventos += provento * fii.qtde;
    total_investido += fii.totalgasto;
    total_cotas += fii.qtde;
    percentual = (provento * 100 / dados_fii.valorAtual).toFixed(2);
    preco_medio = fii.totalgasto / fii.qtde;

    document.querySelector("table").innerHTML += `
      <tr class ="${percentual >= limite_percentual ? 'positivo' : 'negativo'}">
        <td>${dados_fii.fundo}</td>
        <td>${dados_fii.setor}</td>
        <td>${data_base}</td>
        <td>${data_pagamento}</td>
        <td>R$ ${provento}</td>
        <td>R$ ${dados_fii.valorAtual}</td>
        <td>${fii.qtde}</td>
        <td>R$ ${fii.totalgasto}</td>
        <td>R$ ${preco_medio.toFixed(2)}</td>
        <td>${percentual}%</td>
        <td>${dados_fii.dividendYield}%</td>
        <td>R$ ${dados_fii.rendimentoMedio24M.toFixed(2)}</td>
      </tr>
    `;
  }

  document.querySelector("table").innerHTML += `
    <tr class = 'fundo_total'>
      <td colspan = '4'>Total Geral</td>
      <td>R$ ${total_proventos.toFixed(2)}</td>
      <td>-</td>
      <td>${total_cotas}</td>
      <td>R$ ${total_investido.toFixed(2)}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
  `;

  document.getElementById("loading").style.display = "none";
}