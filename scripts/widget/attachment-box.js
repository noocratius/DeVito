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
     * @param {string} spec.selector - a selector, in css style, to build the
     *    mediator object defined by the template html object
     * @param {object} [my={}] - shared secrets between inheritance
     * @return {AttachmentBox}
     */
    return function AttachmentBox(spec, my) {
      var _block, _id, _mode, _this;
      var _closeButton, _removeButton, _editBox, _details, _colors;

      my = my || {};

      Mediator.call(this, spec, my);

      my.view = data.view;
      my.$component = $(spec.selector, my.view);

      _this = this;

      /**
       * Open the widget
       * @param {(PostIt | undefined)} stickyNote - sticky note to be open
       * @return {this}
       */
      var _open = function _open(stickyNote) {
        // _mo  de = (typeof stickyNote == BMCanvas.PostIt) ? MODE.EDIT : MODE.NEW
        my.$component.show();

        return this;
      };

      /**
       * Creates the widgets and subscribe to its state changes
       * @return {this}
       */
      var _createWidgets = function _createWidgets() {

        // create the widgets
        _closeButton = new this.app.Button({
          mediator: this,
          name: 'close',
          selector: '.close',
          container: my.$component
        });

        _removeButton = new this.app.Button({
          mediator: this,
          name: 'remove',
          selector: '.details > .remove',
          container: my.$component
        });

        _details = new this.app.DetailBox({
          mediator: this,
          name: 'details',
          selector: '.details',
          container: my.$component
        });

        _colors = new this.app.Colors({
          mediator: this,
          name: 'color',
          selector: '.colors-options .color',
          container: my.$component
        });

        _editBox = new this.app.EditBox({
          mediator: this,
          name: 'editbox',
          selector: '.post-it',
          container: my.$component
        })

        // subscribe to events the mediator should operantes on
        this.subscribe('click.close', 'cancel');

        this.subscribe('click.remove', function () {
          this.publish('click.close');
          this.app.deleteStickyNote(id);
        });

        this.subscribe('change.color', function (data) {
          _editBox.setColor(data.color);
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
        _editBox.setText('');
        _details.close();

        my.$component.hide();

        // reseta os valores

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

      this.open = _open;
      this.createWidgets = _createWidgets;
      this.cancel = _cancel;
      this.save = _save;

    };
  })(jQuery, data.app.Mediator);
});
