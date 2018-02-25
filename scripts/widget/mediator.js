/**
 * @fileoverview defines mediator interface that listen to events from its
 * colleagues specified in Widget module
 */

'use strict';

/**
 * @module widget
 */
define(['patterns/event-aggregator'], function (EventAggregator) {

  /**
   * Constructor defines virtual members that all mediator must implement
   * and extends publish/subscribe pattern to listen its colleagues change'
   * states
   *
   * @class
   * @alias module:widget/mediator
   * @extends module:patterns/event-aggregator
   * @param {object} [spec] - specification to build the mediators
   * @param {object} [spec.sage] - sage app instance
   * @param {object} [my={}] - shared secrets between extended mediators
   */
  function Mediator(spec, my) {
    var _this;
    my = my || {};

    _this = this;

    // extends EventAggregator pattern
    EventAggregator.call(this);

    /**
     * Open the widget mediator and start the colleagues management
     * @abstract
     * @return {module:widget/mediator}
     */
    var _open = function _open() { }

    /**
     * Creates necessary colleagues (widgets) for the mediator to manages
     * @abstract
     * @return {module:widget/mediator}
     */
    var _createWidgets = function _createWidgets() { }

    /**
     * Defines a getter method for widget element. So receiving a object,
     * named widget, which is used to define in its inheritance the widgets.
     * also defining the getters.
     * @this {module:widget/mediator} the mediator object
     * @example usage of method getter
     *   my.getter({
     *    'closeButton': _closeButton,
     *    'removeButton': _removeButton,
     *    'details': _details,
     *    'colors': _colors,
     *     'editBox': _editBox
     *   });
     *
     * //@protected
     * @param {object} widget - specs to build the getters
     */
    var _getter = function _getter(widgets) {

      my.widgets = widgets;

      for (var property in my.widgets) {
        // define the getter pattern @example getPropertyName
        var getterName =
            'get' + property.charAt(0).toUpperCase() + property.substr(1);

        // bind property name to the actual iteration item
        (function (property) {
          _this[getterName] = function () {
            return my.widgets[property];
          }
        })(property);
      }
    }

    // define protected interface
    my.getter = _getter;

    // defines its public interface
    this.sage = spec.sage;
    this.open = _open;
    this.createWidgets = _createWidgets;

  };

  return Mediator;
});
