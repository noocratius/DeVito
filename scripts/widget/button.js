/**
 * @fileoverview defines a colleague for sticky note attachment mediator
 */

'use strict';

/**
 * @module widget
 */
define(['./widget'], function(Widget){

  /**
   * Represents a button widget, a clickable ui element
   *
   * @class
   * @alias module:widget/button
   * @extends module:widget/widget
   * @param {object} spec - spec to build the colors widget
   * @param {object} my - secrets shared between inheritance
   */
  function Button(spec, my) {
    my = my || {};

    // extends Widget object
    Widget.call(this, spec, my);

    var _this = this;

    // notify mediator on object changed
    my.$component.on('click', function (_) {
      _.stopPropagation();
      _this.notify('click.' + _this.getName());
    });
  };

  return Button;

});
