/**
 * Bootstrap da aplicação. Todo o framework do SAGE2 inicializa extendendo
 * uma aplicação SAGE2_App. Cada função é executada em um momento da execução
 * da aplicação
 *
 */

var businessModelCanvas = SAGE2_App.extend({

  init: function (data) {
    this.SAGE2Init('div', data);

    // cria o módulo business model canvas
    this.canvas = new BMCanvas.Canvas();

    // modelo dos autores das anotações
    this.author = new BMCanvas.User('guest');

    // habilidade tratar eventos do SAGE2 como eventos DOM
    this.passSAGE2PointerAsMouseEvents = true;


    var _this = this;

    // salva uma anotação no canvas
    $(this.element).on('save', function (event, data) {
      // atualiza o post-it caso ele já exista
      if (data['post-it'].id)
        _this.updateStickyNote(data['post-it'].id);
      else
        _this.attachStickyNote(data['block-id'], data['post-it'], data['author']);

    })
    // edita um post-it do canvas
    .on('edit', function (event, noteIdentifier) {
      _this.editSickyNote(noteIdentifier);
    })
    // remove um post-it do canvas
    .on('delete', function (event, noteIdentifier) {
      _this.deleteStickyNote(noteIdentifier);
    });
  },

  draw: function (date) {

    // carrega o canvas dentro do SAGE
    this.applicationRPC({
      view: 'canvas',
      style: 'app'
    }, 'loadView', false);

  },

  event: function (type, position, user, data, date) {

    // rastreia o autor das anotações sempre que houver um clique no canvas
    if (type == 'pointerPress')
      this.author.name = user.label;
  },

  /**
   * Carrega uma view do canvas dentro do sage2, o método é chamado via broadcast
   * pelo framework onde é carregado seu html e estilo correspondente que são
   * então inseridos dentro do elemento DOM correspondente.
   *
   * @param {object} view - Encapsula os dados da chamada via broadcast
   * @param {string} view.content - Conteúdo em HTML do canvas
   * @param {string} view.style - Conteúdo da folha de estilo carregada
   */
  loadView: function (view) {
    var style;

    // insere html no elemento dom do SAGE
    this.element.innerHTML = view.content;

    // cria elemento que incorpora folha de estilo e adiciona ao documento
    style = document.createElement('style');
    style.innerHTML = view.style;
    document.getElementsByTagName('head')[0].appendChild(style);

    // envia evento ao documento indicando que canvas foi carregado
    $(document).trigger('view-loaded', this.element);

    var _this = this;
    $('.canvas-element').on('click', function () {
      Attachment.open({
        'block-id': $(this).data('id'),
        'author': _this.author
      });
    });

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

    // adiciona post-it ao bloco do canvas, via broadcast
    this.applicationRPC({
      view: 'post-it',
      data: {
        'id': stickyNote.id
      }
    }, 'loadStickyNote', false);

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
    widgetDetails.show();

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
   * carrega o post-it no canvas, no bloco especifico de acordo com o identificador
   * do post-it, passado como argumento. Para isso faz uso do módulo PostIt,
   * para anexar o lembrete no canvas.
   *
   * @param {object} view - Encapsula os dados passados via broadcast
   * @param {string} view.content - Elemento carregado
   * @param {string} view.data.id - Identificador do post-it anexado
   */
  loadStickyNote: function (view) {

    var stickyNote = this.canvas.getPostIt(view.data['id']);

    // envia o elemento DOM da view para o evento que carrega o widget de post-its
    $(document).trigger('postit-loaded', $(view.content));

    // delega ao módulo PostIt para anexar o post-it
    PostIt.attach(stickyNote);

    Alert.show('Post-it anexado em \'' + stickyNote.block.name + '\'');

  }

});
