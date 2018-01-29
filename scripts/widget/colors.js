/**
 * @fileoverview defines a colleague for sticky note attachment mediator
 */

jQuery(document).on('loaded.view', function (_, data) {
  'use strict';

  /**
   * @module widget
   */
  data.app.Colors = (function ($, Widget) {

    /**
     * Represents a widget colleague for attachment mediator
     *
     * @constructor
     * @extends Widget
     * @param {object} spec - spec to build the colors widget
     * @param {object} my - secrets shared between inheritance
     * @return {Colors}
     */
    return function Colors(spec, my) {
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
  })(jQuery, data.app.Widget);
})
