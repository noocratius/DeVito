/**
 * @fileoverview defines widget module to be extended, also is a colleague for
 * mediator pattern.
 */

jQuery(document).on('loaded.view', function (_, data) {
  'use strict';

  /**
   * @module widget
   */
  data.app.Widget = (function ($) {

    /**
     * Constructs a widget object, which all colleagues' mediators should
     * inherits. Its name and jQuery object are build according to spec object
     * and sets into my object to be used by its inheritance
     *
     * @constructs
     * @param {object} spec - specs to build the widget object
     * @param {string} spec.name - widget name
     * @param {Mediator} spec.mediator - mediator to be notified by state change
     * @param {string} spec.selector - selector to build the widget with jQuery
     *    object constructor
     * @param {object} my - object to shared secrets in inheritance
     * @return {Widget}
     */
    return function Widget(spec, my) {
      var _mediator, _name;

      /** @protected {Mediator} */
      _mediator = spec.mediator;

      /** @private {string} a widget name */
      _name = spec.name;

      my = my || {};

      my.view = data.view;
      my.$component = $(spec.selector, spec.container);
      my.element = data.element || null;

      /**
       * returns the widget's name
       * @return {string}
       */
      var _getName = function _getName() {
        return _name;
      }

      /**
       * Notifies a topic to mediator using according to publish/subscribe
       * pattern
       *
       * @param {string} topic - event to be published
       * @param {*} [data] - data passed though notification
       * @return {this}
       */
      var _notify = function _notify(topic, data) {
        _mediator.publish(topic, data);
        return this;
      }

      /**
       * returns dom representation of widget
       * @return {Element}
       */
      var _getDOM = function _getDOM() {
        return my.$component.get(0);
      }

      this.getName = _getName;
      this.notify = _notify;
      this.getDOM = _getDOM;
    };
  })(jQuery);
});
