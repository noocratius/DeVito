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
    this.subscribe('new.sticky-note', function (data) {

      var group = this.sections.getSelected();
      this.attachStickyNote(group, data.stickyNote);

    })

      .subscribe('update.sticky-note', function (data) {

        this.updateStickyNote(data.stickyNote.id);
      })

      .subscribe('delete.sticky-note', function (data) {
        this.deleteStickyNote(data.id);
      })

      // edit mode entering on selecting a single sticky-note
      .subscribe('click.edit', function (data) {
        var _stickyNote = this.canvas.getPostIt(data.id);

        // set new box attachment state
        this.box.changeState(this.UpdateState.getInstance({
          stickyNote: _stickyNote
        })).open();
      })

      // event to canvas block element selected
      .subscribe('selected.canvas', function (data) {
        this.box.changeState(_this.NewState.getInstance()).open(data.id);
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
    $(document).trigger('loaded.view', { app: this, view: this.element });

    // create the attachment box to manages attachments new and updated
    this.box =
        new this.AttachmentBox({ selector: '.add-widget' }).createWidgets();

    this.sections = new this.CanvasGroup({
      mediator: this,
      selector: '.canvas-element',
      container: this.element,
      name: 'canvas-group'
    });
  },

  /**
   * Attach sticky-note to canvas
   *
   * @param {int} blockID - Identificador do bloco do canvas
   * @param {BMCanvas.PostIt} stickyNote - Sticky-note to be inserted
   * @return {undefined}
   */
  attachStickyNote: function (blockId, stickyNote) {

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

    if (stickyNote) {

      this.sections.updateStickyNote(stickyNote);
      this.Alert.show('Post-it modificado em \'' + stickyNote.block.name + '\'');
    } else {
      this.Alert.show('sticky-note doens\'t exists');
    }

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

    if (stickyNote) {

      // remove from canvas UI
      this.sections.removeStickyNote(stickyNote);

      // remove do canvas model
      this.canvas.deletePostIt(stickyNote);

      // alert the user about the ocurrency
      this.Alert.show('Post-it removido de  \'' + stickyNote.block.name + '\' com sucesso');

    } else {
      this.Alert.show('Sticky-note doesn\'t exist')
    }
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

    var stickyNote = this.canvas.getPostIt(view.data.id);

    // sends canvas and sticky-note DOM elements and the sage app to be loaded
    $(document).trigger('loaded.sticky-note', {
      element: $(view.content),
      app: this,
      view: this.element
    });

    // attach sticky-note to canvas ui
    this.sections.appendStickyNote(stickyNote);
    this.Alert.show('sticky-note attached in \'' + stickyNote.block.name + '\'');

  }

});
