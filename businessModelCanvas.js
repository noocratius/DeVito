/**
 *
 */

var businessModelCanvas = SAGE2_App.extend({

  init: function (data) {
    this.SAGE2Init('div', data);

    console.log(this);
    // cria o business model Canvas
    this.canvas = new BMCanvas.Canvas();

    // habilidade tratar eventos do SAGE2 normalmente
    this.passSAGE2PointerAsMouseEvents = true;

    // cria a interface de usuário do SAGE2
    // this.controls.addTextInput({defaultText: "", id: "AttachNote", caption: "add"});
    // this.controls.addButton({type:"plus", identifier: "AttachPostIt", position: 4});
    // this.controls.finishedAddingControls();
  },

  load: function (date) {
    console.log("método 'load' chamado");
  },

  draw: function (date) {

    // chama a função que carrega o app no SAGE2
    this.applicationRPC({
      view: 'canvas',
      style: 'app',
      script: 'app'
    }, 'loadView', false);
  },

  startResize: function (date) {
    console.log("método 'startResize' chamado");
  },

  startMove: function (date) {
    console.log("método 'startMove' chamado");
  },

  event: function (type, position, user, data, date) {
    console.log(arguments);

    if (type == 'widgetEvent') {
      console.log(arguments);
      // - descobre id do bloco em que foi chamado o evento
      // - se o texto inserido não estiver vazio
      // - insere o lembrete no bloco identificado
    } else if (type == "pointerMove") {
      console.log(arguments);
    }
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

    $('.canvas-element').dblclick(function (e) {
      $(this).css('background', 'red');
      console.log('duplo', e);
    });

    document.getElementsByClassName('canvas-element')[0].addEventListener('dblclick', function (e) {
      console.log(e);
      this.style.background = red;
    });
  },

});
