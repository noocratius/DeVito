/**
 * @fileoverview application bootstrap. SAGE2_App object is extended and its
 * core methods are overwritten, and are executed in specific app lifecycle.
 *
 */

/**
 * Represents a sage business model canvas app extending SAGE frameworking
 * and overriden its methods according to apropriated app lifecycle
 *
 * @class
 * @override
 * @extends module:patterns/event-aggregator
 *
 */
var businessModelCanvas = SAGE2_App.extend({

  /**
   * called when the application initialize, it should call #SAGE2Init
   * @alias businessModelCanvas#init
   * @param {object} data - data is an object with initialization parameters,
   *    such as x, y, width, height, and date
   */
  init: function (data) {
    var _this = this;

    this.SAGE2Init('div', data);

    // configure require.js for script loading, setting up base url and libs
    require.config({
      baseUrl: this.resrcPath + 'scripts',
      paths: {
        jquery: 'libs/jquery-3.3.1.min',
        showdown: 'libs/showdownjs-showdown-ce5e16b/dist/showdown.min'
      }
    });

    /** @module sage */
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

            // set sticky-note' author
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

                // set new box' attachment state
                this.box.changeState(UpdateState.getInstance({
                  stickyNote: _stickyNote
                })).open();
              })

              // call when canvas block element is selected
              .subscribe('selected.canvas', function (data) {
                this.box.changeState(NewState.getInstance()).open(data.id);
              });

              _this
                .subscribe('dragstart', function (data) {
                  this.draggableStickyNote = data.widget;
                })
                .subscribe('dragend', function (data) {
                  this.draggableStickyNote = null;
                })

        });


  },

  /**
   * call each time wish to draw something. See more in
   * {@link https://bitbucket.org/sage2/sage2/wiki/SAGE2%20Application%20API}
   * @alias businessModelCanvas#draw
   */
  draw: function (date) {

    // load canvas via SAGE2 broadcast call executing 'loadView' on completion
    this.applicationRPC({
      view: 'canvas',
      style: 'app'
    }, 'loadView', false);

  },

  /**
   * call each time a event is fired. See more in
   * {@link https://bitbucket.org/sage2/sage2/wiki/SAGE2%20Application%20API}
   *
   * @alias businessModelCanvas#event
   */
  event: function (type, position, user, data, date) {

    // track sticky note author every pointer press
    if (type === 'pointerPress')
      this.author.name = user.label;

    // start a drag operation
    if (this.draggableStickyNote && type === 'pointerPress') {
      this.dragging = true;

    } else if (type === 'pointerMove' && this.dragging) {
      console.log(position);
      this.draggableStickyNote.left = position.x;
      this.draggableStickyNote.top = position.y;

    } else if (type === 'pointerRelease' && (data.button == 'left')) {
      this.dragging = false;
    }
  },

  /**
   * call when the app sage terminates
   * @alias businessModelCanvas#quit
   */
  quit: function () {
    // TODO -- remove styles inserted by broadcast call 'applicationRPC'
  },

  /**
   * Load a view inside SAGE app, using this.element.
   * {@link businessModelCanvas#loadView} is called via broadcast call through
   * sage framework calling applicationRPC where {@link module:plugin} is called
   * and load its html and stylesheet which then are inserted into SAGE app.
   *
   * @todo FIXME - style element should have a id attribute for identification
   *    purpose
   *
   * @alias businessModelCanvas#loadView
   * @param {object} view - encapsulates data called via broadcast call
   *    defined by applicationRPC
   * @param {string} view.content - html content of canvas html
   * @param {string} view.style - stylesheet content loaded by
   *    {@link module:plugin}
   */
  loadView: function (view) {
    var _this = this,
        styleSheet;

    // insert a html canvas page on sage dom element
    this.element.innerHTML = view.content;

    // creates a element which incorporates a stylesheet and append to sage
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
   * Attach sticky-note to canvas model and dom
   *
   * @alias businessModelCanvas#attachStickyNote
   * @param {int} blockID - group canvas identifier
   * @param {StickyNote} stickyNote - sticky-note to be inserted
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
   * Updates sticky-note data on model and in UI
   *
   * @alias businessModelCanvas#updateStickyNote
   * @param {int} id - sticky-note identifierIdentificador do post-it
   */
  updateStickyNote: function (id) {

    var stickyNote = this.canvas.getPostIt(id),
        _this = this;

    require(['widget/alert'], function (alert) {
      var alertBox = new alert({
        sage: _this
      });

      // if sticky-note exists update the ui and alert the user or otherwise
      if (stickyNote) {
        _this.sections.updateStickyNote(stickyNote);
        alertBox.show('Sticky-note modified in \'' + stickyNote.block.name + '\'');
      } else {
        alertBox.show('sticky-note doens\'t exists');
      }

      // alert the user about sticky-note mofidication
      alertBox.show('Sticky-note modified in \'' + stickyNote.block.name + '\'');

    });

  },

  /**
   * remove a sticky-note from canvas specified by its id. It's removed from ui
   * and canvas model
   * @alias businessModelCanvas#deleteStickyNote
   * @param {int} id - sticky-note identifier
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
