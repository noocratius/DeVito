/**
 * @fileoverview defines a colleague for sticky note attachment mediator
 */

jQuery(document).on('loaded.view', function (_, data) {
  'use strict';

  /**
   * @module widget
   */
  data.app.Button = (function ($, Widget) {

    /**
     * Represents a button widget, a clickable ui element
     *
     * @constructor
     * @extends Widget
     * @param {object} spec - spec to build the colors widget
     * @param {object} my - secrets shared between inheritance
     * @return {Button}
     */
    return function Button(spec, my) {
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
  })(jQuery, data.app.Widget);
});
