// ==UserScript==
// @name         FINALIZAR EDIFICIO
// @namespace    tw.lucas
// @version      0.0.2
// @description  Upa edifícios automaticamente no TribalWars
// @match        https://br*.tribalwars.com.br/game.php*screen=main*
// @match        https://pt*.tribalwars.com.pt/game.php*screen=main*
// @updateURL    https://raw.githubusercontent.com/georgelucasqs/TESTE/main/TESTE/teste/tw-finalizar-edificio.user.meta.js
// @downloadURL  https://raw.githubusercontent.com/georgelucasqs/TESTE/main/TESTE/teste/tw-finalizar-edificio.user.js
// @homepageURL  https://github.com/georgelucasqs/TESTE
// @supportURL   https://github.com/georgelucasqs/TESTE/issues
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==


/*##############################################

Logica inicial de Programação obtida, atraves de um tutorial
      Denominado "Os 5 primeiros dias - Modo Novato"
              Imagens Também do Mesmo
                 Autoria : senson

https://forum.tribalwars.com.br/index.php?threads/os-5-primeiros-dias-modo-novato.334845/#post-3677800

##############################################*/


//*************************** CONFIGURAÇÃO ***************************//
// Escolha Tempo de espera mínimo e máximo entre ações (em milissegundos)
const Min_Tempo_Espera= 800000;
const Max_Tempo_Espera = 900000;

// Etapa_1: Upar O bot automaticamente em Série Edificios
const Etapa = "Etapa_1";

// Escolha se você deseja que o bot enfileire os edifícios na ordem definida (= true) ou
// assim que um prédio estiver disponível para a fila de construção (= false)
const Construção_Edificios_Ordem = true;


//*************************** /CONFIGURAÇÃO ***************************//

// Constantes (NÃO DEVE SER ALTERADAS)
const Visualização_Geral = "OVERVIEW_VIEW";
const Edificio_Principal = "HEADQUARTERS_VIEW";

(function() {
    'use strict';

    console.log("-- Script do Tribal Wars ativado --");

    if (Etapa == "Etapa_1"){
        executarEtapa1();
    }

})();

// Etapa 1: Construção
function executarEtapa1(){
    let Evoluir_vilas = getEvoluir_vilas();
    console.log(Evoluir_vilas);
    if (Evoluir_vilas == Edificio_Principal){
        setInterval(function(){
            // construir qualquer edificio custeável, se possível
            Proxima_Construção();
        }, 1000);
    }
    else if (Evoluir_vilas == Visualização_Geral){
        // Visualização Geral PG
        document.getElementById("l_main").children[0].children[0].click();
    }

}
setInterval(function(){


    var text="";
    var tr=$('[id="buildqueue"]').find('tr').eq(1);

    text=tr.find('td').eq(1).find('span').eq(0).text().split(" ").join("").split("\n").join("");
    var timeSplit=text.split(':');

  if(timeSplit[0]*60*60+timeSplit[1]*60+timeSplit[2]*1<3*60){
      console.log("Completar Grátis");
      tr.find('td').eq(2).find('a').eq(2).click();

  }
    //missao concluida
    $('[class="btn btn-confirm-yes"]').click();



},500);


    let delay = Math.floor(Math.random() * (Max_Tempo_Espera - Max_Tempo_Espera) + Min_Tempo_Espera);

    // Ação do processo
    let Evoluir_vilas = getEvoluir_vilas();
    console.log(Evoluir_vilas);
    setTimeout(function(){
        if (Evoluir_vilas == Edificio_Principal){

            // construir qualquer edificio custeável, se possível
            Proxima_Construção();

        }
        else if (Evoluir_vilas == Visualização_Geral){
            // Visualização Geral Pag
            document.getElementById("l_main").children[0].children[0].click();

        }
    }, delay);

function getEvoluir_vilas(){
    let currentUrl = window.location.href;
    if (currentUrl.endsWith('Visualização Geral')){
        return Visualização_Geral;
    }
    else if (currentUrl.endsWith('main')){
        return Edificio_Principal;
    }
}

function Proxima_Construção(){
    let Construção_proximo_edificio = getConstrução_proximo_edificio();
    if (Construção_proximo_edificio !== undefined){
        Construção_proximo_edificio.click();
        console.log("Clicked on " + Construção_proximo_edificio);
    }
}

function getConstrução_proximo_edificio() {
    let Clicar_Upar_Edificos = document.getElementsByClassName("btn btn-build");
    let Construção_Edifcios_Serie = getConstrução_Edifcios_Serie();
    let instituir;
    while(instituir === undefined && Construção_Edifcios_Serie.length > 0){
        var proximo = Construção_Edifcios_Serie.shift();
        if (Clicar_Upar_Edificos.hasOwnProperty(proximo)){
            let próximo_edifício = document.getElementById(proximo);
            var Visivel = próximo_edifício.offsetWidth > 0 || próximo_edifício.offsetHeight > 0;
            if (Visivel){
                instituir = próximo_edifício;
            }
            if (Construção_Edificios_Ordem){
                break;
            }
        }
    }
    return instituir;
}

function getConstrução_Edifcios_Serie() {
    var Sequência_Construção = [];


    return Sequência_Construção;

}

// Comandos Futuros a serem introduzidos
//javascript: document.getElementsByClassName('order_feature btn btn-btr btn-instant-free')[0].click();
//javascript: document.getElementsByClassName('btn btn-confirm-yes')[0].click()




