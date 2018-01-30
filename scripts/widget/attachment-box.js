/**
 * @fileoverview defines a mediator. Widget Box for sticky note attachment
 */

jQuery(document).on('loaded.view', function (_, data) {
  'use strict';

  /**
   * @module widget
   */
  data.app.AttachmentBox = (function ($, Mediator) {

    /**
     * Represents a Mediator object, which extends Mediator, which manages all
     * its widgets of attachment box
     *
     * @extends Mediator
     * @param {object} spec - spec to build the mediator
     * @param {AttachmentState} [spec.state=NewState] - specify the initial
     *    box' state
     * @param {string} spec.selector - a selector, in css style, to build the
     *    mediator object defined by the template html object
     * @param {object} [my={}] - shared secrets between inheritance
     * @return {AttachmentBox}
     */
    return function AttachmentBox(spec, my) {
      var _this, _state;

      my = my || {};

      Mediator.call(this, spec, my);

      /** @private {AttachmentState} box state according to state pattern */
      _state = spec.state || new NewState();

      my.view = data.view;
      my.$component = $(spec.selector, my.view);

      _this = this;

      /**
       * Open the widget according to some state
       * @param {AttachmentState} state - attachment state
       * @return {this}
       */
      var _open = function _open(stickyNote) {
        my.$component.show();

        return this;
      };

      /**
       * Creates the widgets and subscribe to its state changes
       * @return {this}
       */
      var _createWidgets = function _createWidgets() {
        var closeButton, removeButton, editBox, details, colors;

        // create the widgets
        closeButton = new this.app.Button({
          mediator: this,
          name: 'close',
          selector: '.close',
          container: my.$component
        });

        removeButton = new this.app.Button({
          mediator: this,
          name: 'remove',
          selector: '.details > .remove',
          container: my.$component
        });

        details = new this.app.DetailBox({
          mediator: this,
          name: 'details',
          selector: '.details',
          container: my.$component
        });

        colors = new this.app.Colors({
          mediator: this,
          name: 'color',
          selector: '.colors-options .color',
          container: my.$component
        });

        editBox = new this.app.EditBox({
          mediator: this,
          name: 'editbox',
          selector: '.post-it',
          container: my.$component
        });

        // define getter method for widgets
        my.getter({
          'closeButton': closeButton,
          'removeButton': removeButton,
          'details': details,
          'colors': colors,
          'editBox': editBox
        });

        // subscribe to events the mediator should operantes on
        this.subscribe('click.close', 'cancel');

        this.subscribe('click.remove', function () {
          this.publish('click.close');
          this.app.deleteStickyNote(id);
        });

        this.subscribe('change.color', function (data) {
          this.getEditBox().setColor(data.color);
        });

        this.subscribe('save', 'save');

        // save the widget' data when clicks inside container
        my.$component.click(function (_) {
          _.stopPropagation();
          _this.publish('save');
        });

        return this;
      }

      // inscreve em um evento quando entrar em modo edição
      // desinscreve quando salvar
      // e quando entrar em modo de novo elemento então salva como um novo

      /**
       * Empty all the data inserted in the widget and closes it and the details
       * box.
       * @return {this}
       */
      var _cancel = function _cancel() {
        this.getEditBox().setText('');
        this.getDetails().close();

        my.$component.hide();

        return this;
      }

      /**
       * saves the post-it or update if the text is not empty
       * @return {this}
       */
      var _save = function _save() {
        this.cancel();

        return this;
      }

      /**
       * change the attachment state
       * @param {AttachmentState} state - new state to be set
       * @return {this}
       */
      var _changeState = function _changeState(state) {
        _state = state;
      }

      this.open = _open;
      this.createWidgets = _createWidgets;
      this.cancel = _cancel;
      this.save = _save;
      this.changeState = _changeState;

    };
  })(jQuery, data.app.Mediator);
});
