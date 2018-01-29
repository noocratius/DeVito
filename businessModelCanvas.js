/**
 * @fileoverview application bootstrap. SAGE2_App object is extended and its
 * core methods are overwriten, which are executed on on specific app lifecycle.
 *
 */

var businessModelCanvas = SAGE2_App.extend({

  init: function (data) {
    var _this = this;

    this.SAGE2Init('div', data);

    // create business model canvas model
    this.canvas = new BMCanvas.Canvas();

    // sticky note author
    this.author = new BMCanvas.User('guest');

    // enable sage to treat mouse events as sage pointer
    this.passSAGE2PointerAsMouseEvents = true;

    // extends the publish/subscribe pattern
    EventAggregator.call(this);

    // call controller operation depending on received events in canvas
    $(this.element).on('save', function (event, data) {
        // upadte sticky note if already exists an id
      if (data['post-it'].id)
        _this.updateStickyNote(data['post-it'].id);
      else
        _this.attachStickyNote(data['block-id'],
            data['post-it'], data['author']
        );

    }).on('edit-mode', function (event, id) {
        var postit = _this.canvas.getPostIt(id);
        _this.Attachment.fillNote(postit);

    }).on('delete', function (event, id) {
        _this.deleteStickyNote(id);
    });
  },

  draw: function (date) {

    // load canvas via SAGE2 broadcast call executing 'loadView' on completion
    this.applicationRPC({
      view: 'canvas',
      style: 'app'
    }, 'loadView', false);

  },

  event: function (type, position, user, data, date) {

    // track sticky note author every pointer press
    if (type == 'pointerPress')
      this.author.name = user.label;
  },

  quit: function () {
    // TODO -- remove styles inserted by broadcast call 'applicationRPC'
  },

  /**
   * Carrega uma view do canvas dentro do sage2, o método é chamado via
   * broadcast pelo framework onde é carregado seu html e estilo correspondente
   * que são então inseridos dentro do elemento DOM correspondente.
   *
   * FIXME -- improve events on canvas elements
   * FIXME -- style ement should have a id attribute for identification purpose
   * @this Element
   * @param {object} view - Encapsula os dados da chamada via broadcast
   * @param {string} view.content - Conteúdo em HTML do canvas
   * @param {string} view.style - Conteúdo da folha de estilo carregada
   * @return {undefined}
   */
  loadView: function (view) {
    var _this = this,
        styleSheet;

    // insere html no elemento dom do SAGE
    this.element.innerHTML = view.content;

    // cria elemento que incorpora folha de estilo e adiciona ao documento
    styleSheet = document.createElement('style');
    styleSheet.innerHTML = view.style;
    document.getElementsByTagName('head')[0].appendChild(styleSheet);

    // envia evento ao documento indicando que canvas foi carregado
    // $(document).trigger('view-loaded', { app: this, view: this.element });
    $(document).trigger('loaded.view', { app: this, view: this.element });

    new this.AttachmentBox({
      selector: '.add-widget'
    })
    .createWidgets()
    .open();

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
   * @return {undefined}
   */
  attachStickyNote: function (blockId, postit, author) {
    var stickyNoteAuthor = new BMCanvas.User(author.name);
    var stickyNote =
        new BMCanvas.PostIt(postit['note'],
            postit['color'],
            stickyNoteAuthor);

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
   * @return {undefined}
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
   * @return {undefined}
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
   * Carrega o post-it no canvas, no bloco especifico de acordo com o
   * identificador do post-it, passado como argumento. Para isso faz uso do
   * módulo PostIt, para anexar o lembrete no canvas.
   *
   * @param {object} view - Encapsula os dados passados via broadcast
   * @param {string} view.content - Elemento carregado
   * @param {string} view.data.id - Identificador do post-it anexado
   * @return {undefined}
   */
  loadStickyNote: function (view) {

    var stickyNote = this.canvas.getPostIt(view.data['id']);

    // sends canvas and sticky-note DOM elements and the sage app
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
