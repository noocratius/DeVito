/**
 * @fileoverview defines a colleague for sticky note attachment mediator
 */

'use strict';

/**
 * @module widget
 */
define(['./widget'], function(Widget){

  /**
   * Represents a box for editing purposes, normally represented by a input
   * element on the DOM. It is a colleague object for the
   * {@link module:widget/attachment-box} mediator
   *
   * @class
   * @alias module:widget/edit-box
   * @extends module:widget/widget
   * @param {object} spec - specs to build the object buy its inheritance
   * @param {object} my - shared secrets between inheritance
   */
  function EditBox(spec, my) {

    my = my || {};

    /** @private {string} color of box, also the sticky note */
    var _color;

    /** @private {string} text being edited */
    var _text;

    // extends Widget object
    Widget.call(this, spec, my);

    /**
     * sets the color of the box
     * @param {string} color - color to be set
     * @return {module:widget/edit-box}
     */
    var _setColor = function _setColor(color) {
      _color = color;
      my.$component.css('background-color', _color);

      return this;
    }

    /**
     * returns the color of the box
     * @return {module:widget/edit-box}
     */
    var _getColor = function _getColor() {
      return _color;
    }

    /**
     * sets the text in the box
     * @param {string} text - text to be set
     * @return {module:widget/edit-box}
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
      _text = my.$component.val();

      return _text;
    }

    // initializes color
    _setColor(my.$component.data('color'));

    // prevent bubble events by clicking
    my.$component.click(function (_) {
      _.stopPropagation();
    });

    this.setColor = _setColor;
    this.getColor = _getColor;
    this.setText = _setText;
    this.getText = _getText;

  };

  return EditBox;
});
