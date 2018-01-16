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


    var _this = this;

    // salva uma anotação no canvas
    $(this.element).on('save', function (event, data) {
      // atualiza o post-it caso ele já exista
      if (data['post-it'].id)
        _this.updateStickyNote(data['post-it'].id);
      else
        _this.attachStickyNote(data['block-id'], data['post-it'], data['author']);

    })
    // edita um post-it do canvas com um identificador passado
    .on('edit', function (event, noteIdentifier) {
      _this.editSickyNote(noteIdentifier);
    })
    // remove um post-it do canvas
    .on('delete', function (event, noteIdentifier) {
      _this.deleteStickyNote(noteIdentifier);
    });
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

  event: function (type, position, user, data, date) {

    if (type == 'widgetEvent') {

    // se o tipo do evento for de adição de post-it
    // carregue o post-it no canvas
    } else if (type == "pointerMove") {

    } else if (type == 'pointerPress') {
      this.author.name = user.label;
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


    var _this = this;
    $('.canvas-element').on('click', function () {
      Widget.open({
        'block-id': $(this).data('id'),
        'author': _this.author
      });
    });

    $(document).trigger('view-loaded');

  },

  /**
   * Anexa um post-it ao canvas
   *
   * @param {int} blockID - Identificador do bloco do canvas
   * @param {BMCanvas.PostIt} postIt - Post-It a ser anexado
   * @param {BMCanvas.User} author - Criador do post-it
   */
  attachStickyNote: function (blockId, postIt, author) {
    var stickyNoteAuthor = new BMCanvas.User(author.name);
    var stickyNote = new BMCanvas.PostIt(postIt['note'], postIt['color'], stickyNoteAuthor);

    this.canvas.attachStickyNote(blockId, stickyNote);

    // adiciona post-it ao bloco do canvas
    this.applicationRPC({
      view: 'post-it',
      script: 'components/post-it',
      data: {
        'post-it-id': stickyNote.id
      }
    }, 'loadPostIt', false);

  },

  /**
   * Modifica dados da anotação preenchendo o widget
   *
   * @param {int} id - Identificador do post-it
   */
  editSickyNote: function (id) {
    var editWidget, widgetDetails, widgetNote;
    var postIt;

    editWidget = $('.add-widget', this.element);
    widgetDetails = $('.details', editWidget);
    widgetNote = $('.post-it', editWidget);

    postIt = this.canvas.getPostIt(id);

    // define identificador da anotação sendo editada
    editWidget.data('note-id', postIt.id);

    // preenche os dados do widget
    widgetNote.val(postIt.note);
    editWidget.trigger('change-color', postIt.color);

    $('.author', widgetDetails).text(postIt.author.name);

    // formata a data
    var dateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    var createdAt = dateTimeFormat.format(postIt.createdAt);
    var lastModified = dateTimeFormat.format(postIt.lastModified);

    $('.created-at', widgetDetails).text(createdAt);
    $('.last-modified', widgetDetails).text(lastModified);

  },

  /**
   * Atualiza os dados de um post-it na view correspondete
   *
   * @param {int} id - Identificador do post-it
   */
  updateStickyNote: function (id) {
    var postIt, postItDOM, editWidget, postitWidget, detailsWidget;

    postIt = this.canvas.getPostIt(id);
    editWidget = $('.add-widget', this.element);
    postitWidget = $('.post-it', editWidget);
    detailsWidget = $('.details', editWidget);

    // atualiza o valor de última modificação
    postIt.lastModified = new Date();
    postIt.color = postitWidget.css('background-color');
    postIt.note = postitWidget.val();

    // apaga o elemento e esconde os detalhes
    postitWidget.val('');
    editWidget.data('note-id', null);
    detailsWidget.hide();


    // lê o elemento na view do post-it
    postItDOM = $('.canvas-element .post-it').filter(function () {
      return $(this).data('id') == id;
    });

    // atualiza os valores
    postItDOM.css('background-color', postIt.color);
    $('.text', postItDOM).text(postIt.note);

    // envia mensagem dzendo que post-it foi modificado
    Alert.show('Post-it modificado em \'' + postIt.block.name + '\'');

  },

  /**
   * Remove um post-it do canvas dado pelo identificador passado
   *
   * A remoção é realizada em duas etapas, o lembrete no respectivo canvas é
   * removido e no modelo de canvas dado por this.canvas também é removido
   *
   * @param {int} id - Identificador do post-it
   */
  deleteStickyNote: function (id) {
    var postit;

    postit = this.canvas.getPostIt(id);

    // remove o post-it do bloco de canvas
    $('.canvas-element .post-it').filter(function () {
      return $(this).data('id') == id;
    })
    .remove();

    // remove do canvas
    this.canvas.deletePostIt(postit);

    // envia alerta dizendo que o lembrete foi removido
    Alert.show('Post-it removido de  \'' + postit.block.name + '\' com sucesso');
  },

  /**
   * carrega o post-it no canvas, no bloco especifico de acordo com o id do post-it
   *
   * @param {object} view - Encapsula os dados passados via broadcast
   * @param {string} view.content - Elemento carregado
   * @param {string} view.data.postItId - Identificador do post-it anexado
   * @param {string} view.script - Script do Componente
   */
  loadPostIt: function (view) {

    var postItDOM = $(view.content);
    var postIt = this.canvas.getPostIt(view.data['post-it-id']);

    // preenche os dados na view do post-it
    postItDOM.data('id', postIt.id);
    $('.text', postItDOM).text(postIt.note);
    postItDOM.css('background-color', postIt.color);

    // anexa o post-it ao bloco do canvas correspondente
    var block = $(".canvas-element[data-id = '" + postIt.block.id + "']")
    $('.canvas-body-element', block).append(postItDOM);

    eval(view.script);

    Alert.show('Post-it anexado em \'' + postIt.block.name + '\'');

  }

});
