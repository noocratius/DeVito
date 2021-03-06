/**
 * @fileoverview defines a mediator. Widget Box for sticky note attachment
 * options
 * @todo document events fired properly
 */

'use strict';

/**
 * @module widget
 */
define(
    [
      'jquery',
      'model/sticky-note',
      './mediator',
      './new-state',
      './alert',
      './button',
      './colors',
      './detail-box',
      './edit-box'
    ],
      function(
          $, StickyNote, Mediator, NewState, alert, Button, Colors,
              DetailBox, EditBox
      ){

        /**
         * Represents a Mediator object, which extends Mediator, which manages
         * all its widgets of attachment box
         *
         * @extends module:widget/Mediator
         * @class
         * @alias module:widget/attachment-box
         *
         * @param {object} spec - spec to build the mediator
         * @param {module:widget/attachment-state} [spec.state=NewState] -
         *    specify the initial box' state
         * @param {string} spec.selector - a selector, in css style, to build
         *    the mediator object specified by html template
         * @param {object} [my={}] - shared secrets between inheritance
         */
        function AttachmentBox(spec, my) {
          var _this, _state, _id;

          my = my || {};

          // extends mediator class
          Mediator.call(this, spec, my);

          /** @private {AttachmentState} box state according to state pattern */
          _state = spec.state || new NewState.getInstance({
            stickyNote: new StickyNote()
          });

          /** @private {int} identifier of sticky-note currently being used */
          _id = -1;

          my.view = this.sage.element;
          my.$component = $(spec.selector, my.view);

          _this = this;

          /**
           * open the widget according to current state
           * @return {module:widget/attachment-box}
           */
          var _open = function _open() {
            new alert({sage: this.sage}).close();
            _state.open(this);

            return this;
          };

          /**
           * show the attachmento box mediator using the jQuery object to show
           * its component
           * @return {module:widget/attachment-box}
           */
          var _show = function _show() {
            my.$component.show();
            return this;
          }

          /**
           * Creates the widgets and subscribe on states changes and fire events
           * to sage app to respond to
           *
           * @return {module:widget/attachment-box}
           */
          var _createWidgets = function _createWidgets() {
            var closeButton, removeButton, editBox, details, colors;

            // create the widgets
            closeButton = new Button({
              mediator: this,
              name: 'close',
              selector: '.close',
              container: my.$component
            });

            removeButton = new Button({
              mediator: this,
              name: 'remove',
              selector: '.details > .remove',
              container: my.$component
            });

            details = new DetailBox({
              mediator: this,
              name: 'details',
              selector: '.details',
              container: my.$component
            });

            colors = new Colors({
              mediator: this,
              name: 'color',
              selector: '.colors-options .color',
              container: my.$component
            });

            editBox = new EditBox({
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

              // alert the user widget was closed
              new alert({sage: this.sage}).show('Sticky-note closed, nothing was saved');
            })
              .subscribe('click.remove', function () {
                this.publish('click.close');
                this.sage.publish('delete.sticky-note', {id: this.id});
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
           * close the component which attachment box belongs to
           * @return {module:widget/attachment-box}
           */
          var _close = function _close() {
            my.$component.hide();
            return this;
          }

          /**
           * saves the sticky-note or update if the text is not empty
           * @todo FIXME - only saves if text it not empty
           * @return {module:widget/attachment-box}
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
              new alert({sage: this.sage}).show('Can\'t save empty note.');
            }

            return this;
          }

          /**
           * change the attachment state and return its reference
           * @param {module:widget/attachment-state} state - new state to be set
           * @return {module:widget/attachment-box}
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

        return AttachmentBox;
      }
);
