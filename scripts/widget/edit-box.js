/**
 * @fileoverview defines a colleague for sticky note attachment mediator
 */

jQuery(document).on('loaded.view', function (_, data) {
  'use strict';

  /**
   * @module widget
   */
  data.app.EditBox = (function ($, Widget) {

    /**
     * Represents a box for editing purposes, normally represented by a input
     * element on the DOM. It's a colleague object for the AttachmentBox
     * mediator
     *
     * @constructor
     * @extends Widget
     * @param {object} spec - specs to build the object buy its inheritance
     * @param {object} my - shared secrets between inheritance
     * @return {EditBox}
     */
    return function EditBox(spec, my) {

      my = my || {};

      /** @private {string} color of box, also the sticky note */
      var _color;

      /** @private string text being edited */
      var _text = '';

      // extends Widget object
      Widget.call(this, spec, my);

      // prevent bubble events by clicking
      my.$component.click(function (_) {
        _.stopPropagation();
      });

      /**
       * sets the color of the box
       * @param {string} color - color to be set
       * @return {this}
       */
      var _setColor = function _setColor(color) {
        _color = color;
        my.$component.css('background-color', _color);
        return this;
      }

      /**
       * sets the text in the box
       * @param {string} text - text to be set
       * @return {this}
       */
      var _setText = function _setText(text) {
        _text = text;
        my.$component.val(_text);
        return this;
      }

      /**
       * returns the text in the box
       * @return {string}
       */
      var _getText = function _getText() {
        return _text;
      }

      this.setColor = _setColor;
      this.setText = _setText;
      this.getText = _getText;

    };
  })(jQuery, data.app.Widget);
});
