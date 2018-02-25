/**
 * @fileoverview defines a colleague for sticky note attachment mediator
 */

'use strict';

/**
 * @module widget
 */
define(['jquery', './widget'], function($, Widget){

  /**
   * Represents a widget colleague for attachment mediator, which treats
   * management of color selection on attachment box
   *
   * @class
   * @alias module:widget/colors
   * @extends module:widget/widget
   * @param {object} spec - spec to build the colors widget
   * @param {object} my - secrets shared between inheritance
   */
  function Colors(spec, my) {
    var _this;
    my = my || {};

    _this = this;

    // extends Widget object
    Widget.call(this, spec, my);

    my.$component.on('mouseenter', function () {
      $(this).addClass('selected');
    })
    .on('mouseout', function () {
      $(this).removeClass('selected');
    })
    .click(function (_) {
      _.stopPropagation();
      _this.notify('change.' + _this.getName(), {
        color: $(this).data('color')
      });
    });

  }

  return Colors;
});
