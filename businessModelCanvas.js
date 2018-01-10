/**
 *
 */

var businessModelCanvas = SAGE2_App.extend({

  init: function (data) {
    this.SAGE2Init('div', data);

    // cria o business model Canvas
    this.canvas = new BMCanvas.Canvas();

    // autor da anotação
    this.author = new BMCanvas.User('guest');

    // habilidade tratar eventos do SAGE2 normalmente
    this.passSAGE2PointerAsMouseEvents = true;


    // cria a interface de usuário do SAGE2
    this.controls.addTextInput({id: "AttachNote", caption: "add"});
    // this.controls.addButton({type:"plus", identifier: "AttachPostIt", position: 4});
    this.controls.finishedAddingControls();
  },

  load: function (date) {

  },

  draw: function (date) {

    // chama a função que carrega o app no SAGE2
    this.applicationRPC({
      view: 'canvas',
      style: 'app',
      script: 'components/widget'
    }, 'loadView', false);

  },

  startResize: function (date) {
    console.log("método 'startResize' chamado");
  },

  startMove: function (date) {
    console.log("método 'startMove' chamado");
  },

  event: function (type, position, user, data, date) {
    this.author.name = user.label;

    if (type == 'widgetEvent') {

    // se o tipo do evento for de adição de post-it
    // carregue o post-it no canvas
    } else if (type == "pointerMove") {

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
    var _this;

    // insere html dentro do elemento
    this.element.innerHTML = view.content;
    // cria elemento para incorporar a folha de estilos
    style = document.createElement('style');
    style.innerHTML = view.style;
    document.getElementsByTagName('head')[0].appendChild(style);
    // executa o script carregado
    eval(view.script);


    $('.canvas-element').on('click', function () {
      Widget.open($(this).data('id'));
    });

    _this = this;
    $(this.element).on('save', function (event, data) {
      _this.attachStickyNote(data['block-id'], data['post-it']);

    });

  },

  /**
   * Anexa um post-it ao canvas
   *
   * @param {int} blockID - Identificador do bloco do canvas
   * @param {BMCanvas.PostIt} postIt - Post-It a ser anexado
   */
  attachStickyNote: function (blockId, postIt) {

    var stickyNote = new BMCanvas.PostIt(postIt['note'], postIt['color'], this.author);

    this.canvas.attachStickyNote(blockId, stickyNote);

    // adiciona post-it ao bloco do canvas
    this.applicationRPC({
      view: 'post-it',
      data: {
        'post-it-id': stickyNote.id
      }
    }, 'loadPostIt', false);

  },

  /**
   * carrega o post-it no canvas, no bloco especifico de acordo com o id do post-it
   *
   * @param {object} view - Encapsula os dados passados via broadcast
   * @param {string} view.content - Elemento carregado
   * @param {string} view.data.postItId - Identificador do post-it anexado
   */
  loadPostIt: function (view) {

    var postItDOM = $(view.content);
    var postIt = this.canvas.getPostIt(view.data['post-it-id']);

    // preenche os dados na view do post-it
    postItDOM.text(postIt.note);
    postItDOM.css('background-color', postIt.color);

    // anexa o post-it ao bloco do canvas correspondente
    var block = $(".canvas-element[data-id = '" + postIt.block.id + "']")
    $('.canvas-body-element', block).append(postItDOM);

  }

});
