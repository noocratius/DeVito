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

    // Realiza operações no canvas dependendo do evento recebido
    $(this.element)
      .on('save', function (event, data) {
        // atualiza o post-it caso ele já exista
        if (data['post-it'].id)
          _this.updateStickyNote(data['post-it'].id);
        else
          _this.attachStickyNote(data['block-id'], data['post-it'], data['author']);
      })
      .on('edit-mode', function (event, id) {
        var postit = _this.canvas.getPostIt(id);
        _this.Attachment.fillNote(postit);
      })
      .on('delete', function (event, id) {
        _this.deleteStickyNote(id);
      });
  },

  draw: function (date) {

    // carrega o canvas dentro do SAGE por uma chamada via broadcast
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


  quit: function () {
    // @TODO remover estilos e documento dom inserido
  },

  /**
   * Carrega uma view do canvas dentro do sage2, o método é chamado via broadcast
   * pelo framework onde é carregado seu html e estilo correspondente que são
   * então inseridos dentro do elemento DOM correspondente.
   *
   * @todo melhorar evento do bloco do canvas
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
    $(document).trigger('view-loaded', {
      app: this,
      view: this.element
    });

    var _this = this;
    $('.canvas-element', _this.element).on('click', function () {

      _this.Attachment.open({
        'block-id': $(this).data('id'),
        'author': _this.author
      });
    });

  },

  /**
   * Anexa um post-it ao canvas
   *
   * @param {int} blockID - Identificador do bloco do canvas
   * @param {BMCanvas.PostIt} postit - Post-It a ser anexado
   * @param {BMCanvas.User} author - Criador do post-it
   */
  attachStickyNote: function (blockId, postit, author) {
    var stickyNoteAuthor = new BMCanvas.User(author.name);
    var stickyNote = new BMCanvas.PostIt(postit['note'], postit['color'], stickyNoteAuthor);

    this.canvas.attachStickyNote(blockId, stickyNote);

    // adiciona post-it ao bloco do canvas, via broadcast
    this.applicationRPC({
      view: 'post-it',
      data: { 'id': stickyNote.id }
    }, 'loadStickyNote', false);

  },


  /**
   * Atualiza os dados de um post-it na view correspondete
   *
   * @param {int} id - Identificador do post-it
   */
  updateStickyNote: function (id) {

    var stickyNote = this.canvas.getPostIt(id);

    this.Attachment.updatePostIt(stickyNote);
    this.PostIt.update(stickyNote);

    // envia mensagem dzendo que post-it foi modificado
    this.Alert.show('Post-it modificado em \'' + stickyNote.block.name + '\'');

  },

  /**
   * Remove um post-it do canvas dado pelo identificador. O post-it é
   * do canvas e do modelo, em this.canvas.
   *
   * @param {int} id - Identificador do post-it
   */
  deleteStickyNote: function (id) {

    var stickyNote = this.canvas.getPostIt(id);

    this.PostIt.remove(stickyNote);

    // remove do canvas
    this.canvas.deletePostIt(stickyNote);

    // envia alerta dizendo que o lembrete foi removido
    this.Alert.show('Post-it removido de  \'' + stickyNote.block.name + '\' com sucesso');
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
    $(document).trigger('postit-loaded', {
      app: this,
      view: this.element,
      postit: $(view.content)
    });

    // delega ao módulo PostIt para anexar o post-it
    this.PostIt.attach(stickyNote);

    this.Alert.show('Post-it anexado em \'' + stickyNote.block.name + '\'');

  }

});
