/**
 *
 */

var businessModelCanvas = SAGE2_App.extend({

  init: function (data) {
    this.SAGE2Init('div', data);

    console.log(data);

    // cria o business model Canvas
    


    // chama a função que carrega o app no SAGE2
    this.applicationRPC({
      view: 'canvas',
      style: 'app',
      script: 'app'
    }, 'loadView', false);

    // trata os eventos SAGE2Pointer como um evento normal do Javascript
    this.passSAGE2PointerAsMouseEvents = true;
  },

  load: function (date) {
    console.log("método 'load' chamado");
  },

  draw: function (date) {

  },

  startResize: function (date) {
    console.log("método 'startResize' chamado");
  },

  startMove: function (date) {
    console.log("método 'startMove' chamado");
  },

  event: function (type, position, user, data, date) {
    console.log("método 'event' chamado");
  },

  quit: function () {
    console.log("método 'quit' chamado");
  },

  /**
   * Carrega uma view dentro de um elemento DOM
   *
   * @todo verificar outra forma de carregar script sem usar eval
   *
   * @param {object} view - Encapsula os dados da chamada via broadcast
   * @param {string} view.content - Conteúdo em HTML
   * @param {string} view.script - Script da view
   * @param {string} view.style - Elemento DOM contendo a folha de estilo
   */
  loadView: function (view) {

    var style;

    // insere html dentro do elemento
    this.element.innerHTML = view.content;
    // cria elemento para incorporar a folha de estilos
    style = document.createElement('style');
    style.innerHTML = view.style;
    document.getElementsByTagName('head')[0].appendChild(style);
    // executa o script carregado
    eval(view.script);
  },

});
