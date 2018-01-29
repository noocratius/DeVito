/**
 * @fileoverview defines a sticky-note widget which represents a sticky-note
 * attached to business model canvas
 */
jQuery(document).on('loaded.sticky-note', function (_, data) {
  'use strict';

  /**
   * @module widget
   */
  data.app.StickyNote = (function ($, Widget)) {

    /**
     * Represents a sticky-note widget
     *
     * @extends Widget
     * @param {object} spec - spec to build the sticky-note widget
     * @param {object} my - shared secrets between inheritance
     * @return {StickyNote}
     */
    return function StickyNote(spec, my) {
      var $editButton;

      my = my || {};

      Widget.call(this, spec, my);

      /** @private {string} sticky-note identifier*/
      var _id;

      /** @private {string} */
      var _color;

      /** @private {string} */
      var _text;

      // $editButton = $('.edit', my.$component);

    }
  })(jQuery, data.app.Widget);
});
