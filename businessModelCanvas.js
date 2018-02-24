/**
 * @fileoverview application bootstrap. SAGE2_App object is extended and its
 * core methods are overwriten, which are executed on on specific app lifecycle.
 *
 */

var businessModelCanvas = SAGE2_App.extend({

  init: function (data) {
    var _this = this;

    this.SAGE2Init('div', data);

    // configure require.js for script loading, setting up base url
    require.config({
      baseUrl: this.resrcPath + 'scripts',
      paths: {
        jquery: 'libs/jquery-3.3.1.min',
        showdown: 'libs/showdownjs-showdown-ce5e16b/dist/showdown.min'
      }
    });

    // define sage as a module
    define('sage', this);

    // enable sage to treat mouse events as sage pointer
    this.passSAGE2PointerAsMouseEvents = true;

    require(
        [
          'model/canvas',
          'model/user',
          'patterns/event-aggregator',
          'widget/new-state',
          'widget/update-state'
        ],
          function (Canvas, User, EventAggregator, NewState, UpdateState) {

            // create business model canvas model
            _this.canvas = new Canvas();

            // set sticky note author
            _this.author = new User('guest');

            // extends the publish/subscribe pattern on sage app
            EventAggregator.call(_this);

            // call controller operation depending on received events in canvas
            _this.subscribe('new.sticky-note', function (data) {

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
                this.box.changeState(UpdateState.getInstance({
                  stickyNote: _stickyNote
                })).open();
              })

              // event to canvas block element selected
              .subscribe('selected.canvas', function (data) {
                this.box.changeState(NewState.getInstance()).open(data.id);
              });

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
   * FIXME -- style element should have a id attribute for identification purpose
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


    // create the attachment box to manages attachments new and updated
    require(
      [
        'widget/attachment-box',
        'widget/canvas-group'
      ],
        function (AttachmentBox, CanvasGroup) {
          _this.box =
              new AttachmentBox({
                selector: '.add-widget',
                sage: _this
              }).createWidgets();

          _this.sections = new CanvasGroup({
            mediator: _this,
            selector: '.canvas-element',
            container: _this.element,
            name: 'canvas-group'
          });
        }
    );

  },

  /**
   * Attach sticky-note to canvas
   *
   * @param {int} blockID - Group identifier of canvas
   * @param {StickyNote} stickyNote - Sticky-note to be inserted
   * @return {undefined}
   */
  attachStickyNote: function (blockId, stickyNote) {

    this.canvas.attachStickyNote(blockId, stickyNote);

    // attach sticky-note to canvas ui
    this.sections.appendStickyNote(stickyNote);

    var _this = this;
    require(['widget/alert'], function (alert) {
      new alert({sage: _this}).show('sticky-note attached in \'' + stickyNote.block.name + '\'');
    });

  },


  /**
   * Atualiza os dados de um post-it na view correspondete
   *
   * @param {int} id - Identificador do post-it
   * @return {undefined}
   */
  updateStickyNote: function (id) {

    var stickyNote = this.canvas.getPostIt(id),
        _this = this;

    require(['widget/alert'], function (alert) {
      var alertBox = new alert({
        sage: _this
      });

      if (stickyNote) {
        _this.sections.updateStickyNote(stickyNote);
        alertBox.show('Sticky-note modified in \'' + stickyNote.block.name + '\'');
      } else {
        alertBox.show('sticky-note doens\'t exists');
      }

      // envia mensagem dzendo que post-it foi modificado
      alertBox.show('Sticky-note modified in \'' + stickyNote.block.name + '\'');

    });

  },

  /**
   * Remove um post-it do canvas dado pelo identificador. O post-it é
   * do canvas e do modelo, em this.canvas.
   *
   * @param {int} id - Identificador do post-it
   * @return {undefined}
   */
  deleteStickyNote: function (id) {

    var stickyNote = this.canvas.getPostIt(id),
        _this = this;

    require(['widget/alert'], function (alert) {
      var alertBox = new alert({
        sage: _this
      });

      if (stickyNote) {

        // remove from canvas UI
        _this.sections.removeStickyNote(stickyNote);

        // remove do canvas model
        _this.canvas.deletePostIt(stickyNote);

        // alert the user about the ocurrency
        alertBox.show('sticky-note removed from  \'' +
            stickyNote.block.name + '\' sucessfully');

      } else {
        alertBox.show('Sticky-note doesn\'t exist');
      }
    });

  },

});
