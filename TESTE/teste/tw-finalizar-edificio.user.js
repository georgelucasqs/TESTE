// ==UserScript==
// @name         TW – Finalizar Edifício
// @namespace    tw.georgelucasqs
// @version      0.0.2
// @description  Upa edifícios automaticamente no TribalWars (base original: Marcos v.s Marques)
// @author       Lucas & GPT
// @match        https://br*.tribalwars.com.br/game.php*screen=main*
// @match        https://pt*.tribalwars.com.pt/game.php*screen=main*
// @updateURL    https://raw.githubusercontent.com/georgelucasqs/TESTE/main/TESTE/teste/tw-finalizar-edificio.user.meta.js
// @downloadURL  https://raw.githubusercontent.com/georgelucasqs/TESTE/main/TESTE/teste/tw-finalizar-edificio.user.js
// @homepageURL  https://github.com/georgelucasqs/TESTE
// @supportURL   https://github.com/georgelucasqs/TESTE/issues
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @icon         https://i.imgur.com/7WgHTT8.gif
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

/*##############################################
Lógica inicial baseada em “Os 5 primeiros dias – Modo Novato”teamomayara
https://forum.tribalwars.com.br/index.php?threads/os-5-primeiros-dias-modo-novato.334845/#post-3677800
##############################################*/

//*************************** CONFIGURAÇÃO ***************************//
// Tempo de espera mínimo e máximo entre ações (ms)
const Min_Tempo_Espera = 800000;
const Max_Tempo_Espera = 900000;

// Etapa_1: Upar automaticamente a série de edifícios
const Etapa = "Etapa_1";

// true = respeita ordem fixa | false = constrói assim que estiver disponível
const Construcao_Edificios_Ordem = true;
//*************************** /CONFIGURAÇÃO ***************************//

// Constantes (NÃO ALTERAR)
const VISUALIZACAO_GERAL = "OVERVIEW_VIEW";
const EDIFICIO_PRINCIPAL = "HEADQUARTERS_VIEW";

(function () {
  'use strict';
  console.log("-- Script do Tribal Wars ativado --");

  if (Etapa === "Etapa_1") {
    executarEtapa1();
  }
})();

// Etapa 1: Construção
function executarEtapa1() {
  const estado = getEvoluirVilas();
  console.log("Estado:", estado);

  if (estado === EDIFICIO_PRINCIPAL) {
    setInterval(function () {
      // Construir qualquer edifício custeável, se possível
      ProximaConstrucao();
    }, 1000);
  } else if (estado === VISUALIZACAO_GERAL) {
    // Visualização Geral
    document.getElementById("l_main").children[0].children[0].click();
  }
}

// Completar grátis quando faltar < 3 min e confirmar missão
setInterval(function () {
  const tr = $('[id="buildqueue"]').find('tr').eq(1);
  if (tr.length) {
    const text = tr.find('td').eq(1).find('span').eq(0).text().replace(/\s+/g, "");
    const timeSplit = text.split(':').map(Number);
    if (timeSplit.length === 3) {
      const secs = timeSplit[0] * 3600 + timeSplit[1] * 60 + timeSplit[2];
      if (secs < 180) {
        console.log("Completar Grátis");
        const a = tr.find('td').eq(2).find('a').eq(2);
        if (a.length) a[0].click();
      }
    }
  }
  // Missão concluída
  $('.btn.btn-confirm-yes').click();
}, 500);

// Delay randômico + navegação básica
const delay = Math.floor(Math.random() * (Max_Tempo_Espera - Min_Tempo_Espera) + Min_Tempo_Espera); // <-- corrigido
setTimeout(function () {
  const estado2 = getEvoluirVilas();
  console.log("Estado (timeout):", estado2);
  if (estado2 === EDIFICIO_PRINCIPAL) {
    ProximaConstrucao();
  } else if (estado2 === VISUALIZACAO_GERAL) {
    document.getElementById("l_main").children[0].children[0].click();
  }
}, delay);

// Helpers
function getEvoluirVilas() {
  const currentUrl = window.location.href;
  if (currentUrl.includes('overview')) {
    return VISUALIZACAO_GERAL;
  } else if (currentUrl.includes('screen=main')) {
    return EDIFICIO_PRINCIPAL;
  }
  return EDIFICIO_PRINCIPAL;
}

function ProximaConstrucao() {
  const btn = getConstrucaoProximoEdificio();
  if (btn) {
    btn.click();
    console.log("Clique em:", btn.id || btn);
  }
}

function getConstrucaoProximoEdificio() {
  const botoes = document.getElementsByClassName("btn btn-build");
  const serie = getConstrucaoEdificiosSerie();
  let alvo;

  while (!alvo && serie.length > 0) {
    const idProximo = serie.shift();
    if (Object.prototype.hasOwnProperty.call(botoes, idProximo)) {
      const el = document.getElementById(idProximo);
      const visivel = el && (el.offsetWidth > 0 || el.offsetHeight > 0);
      if (visivel) alvo = el;
      if (Construcao_Edificios_Ordem) break;
    }
  }
  return alvo;
}

// Defina aqui a sequência de prioridade (IDs dos botões "Construir")
function getConstrucaoEdificiosSerie() {
  const Sequencia_Construcao = [
    // Exemplo de IDs (ajuste conforme o HTML do mundo/skin):
    // "main_buildlink_farm",
    // "main_buildlink_barracks",
    // "main_buildlink_wall",
  ];
  return Sequencia_Construcao;
}

// Comandos futuros para referência:
// document.getElementsByClassName('order_feature btn btn-btr btn-instant-free')[0]?.click();
// document.getElementsByClassName('btn btn-confirm-yes')[0]?.click();
