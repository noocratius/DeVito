/**
 * @fileoverview defines widget module to be extended, also is a colleague for
 * mediator pattern.
 */

'use strict';

/**
 * @module widget
 */
define(['jquery'], function($){

  /**
   * Constructs a widget object, which all colleagues' mediators should
   * inherits. Its name and jQuery object are build according to spec object
   * and sets into my object to be used by its inheritance
   *
   * @class
   * @alias module:widget/widget
   * @param {object} spec - specs to build the widget object
   * @param {object} spec.sage - sage app instance
   * @param {string} spec.name - widget name
   * @param {module:widget/mediator} spec.mediator - mediator to be notified by
   *    state change
   * @param {string} spec.selector - selector to build the widget with jQuery
   *    object constructor
   * @param {object} my - object to shared secrets in inheritance
   */
  function Widget(spec, my) {
    var _name;

    /** @protected {module:widget/mediator} */
    my.mediator = spec.mediator;

    /** @private {string} a widget name */
    _name = spec.name;

    my = my || {};

    my.$component = $(spec.selector, spec.container);
    my.element = spec.element || null;

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
     * @return {module:widget/mediator}
     */
    var _notify = function _notify(topic, data) {
      my.mediator.publish(topic, data);
      return this;
    }

    /**
     * returns dom representation of widget component
     * @return {Element}
     */
    var _getDOM = function _getDOM() {
      return my.$component.get(0);
    }

    this.getName = _getName;
    this.notify = _notify;
    this.getDOM = _getDOM;
  };

  return Widget;

});
