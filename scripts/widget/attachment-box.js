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
      var _this, _state, _id;

      my = my || {};

      Mediator.call(this, spec, my);

      /** @private {AttachmentState} box state according to state pattern */
      _state = spec.state || new data.app.NewState.getInstance({
        stickyNote: BMCanvas.PostIt()
      });

      /** @private {int} identifier of sticky-note currently being used */
      _id = -1;

      /** @public {int} identifier of block element being edited */
      this.block = -1;

      my.view = data.view;
      my.$component = $(spec.selector, my.view);

      _this = this;

      /**
       * Open the widget according to current state
       * @return {this}
       */
      var _open = function _open(block) {
        this.block = block || -1;
        _state.open(this);

        return this;
      };

      /**
       * show the attachmento box mediator using the jQuery object to show its
       * component
       * @return {this}
       */
      var _show = function _show() {
        my.$component.show();
        return this;
      }

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
        this.subscribe('click.close', function () {
          this.getEditBox().setText('');
          this.getDetails().close();
          this.close();
        })
          .subscribe('click.remove', function () {
            this.publish('click.close');
            this.app.publish('delete.sticky-note', {id: this.id});
          })
          .subscribe('change.color', function (data) {
            this.getEditBox().setColor(data.color);
          })
          .subscribe('save', 'save');

        // save the widget' data when clicks inside container
        my.$component.click(function (_) {
          _.stopPropagation();
          _this.publish('save');
        });

        return this;
      }

      /**
       * Close the component which attachment box belongs to and cancel the data
       * @return {this}
       */
      var _close = function _close() {
        my.$component.hide();
        return this;
      }

      /**
       * saves the post-it or update if the text is not empty
       * FIXME - only saves if text it not empty
       * @return {this}
       */
      var _save = function _save() {

        // save only non empty note
        if (this.getEditBox().getText()) {
          _state.save(this);
        } else {
          // closes the widget and its details if it's open
          this.close();
          this.getDetails().close();

          // alert the user about saving empty note
          this.app.Alert.show('Can\'t save empty note.');
        }

        return this;
      }

      /**
       * change the attachment state
       * @param {AttachmentState} state - new state to be set
       * @return {this}
       */
      var _changeState = function _changeState(state) {
        _state = state;

        return this;
      }


      this.id = _id;
      this.open = _open;
      this.show = _show;
      this.createWidgets = _createWidgets;
      this.close = _close;
      this.save = _save;
      this.changeState = _changeState;

    };
  })(jQuery, data.app.Mediator);
});
