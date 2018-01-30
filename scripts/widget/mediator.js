/**
 * @fileoverview defines mediator interface that listen to events from its
 * colleagues specified in Widget module
 */

jQuery(document).on('loaded.view', function (_, data) {
  'use strict';

  /**
   * @module widget
   */
  data.app.Mediator = (function () {

    /**
     * Constructor defines virtual members that all mediator must implement
     * and extends publish/subscribe pattern to listen its colleagues change'
     * states
     *
     * @constructor
     * @extends EventAggregator
     * @param {object} [spec] - specification to build the mediators
     * @param {object} [my={}] - shared secrets between extended mediators
     * @return {Mediator}
     */
    return function Mediator(spec, my) {
      var _this;
      my = my || {};

      _this = this;

      // extends EventAggregator pattern
      EventAggregator.call(this);

      /**
       * Open the widget mediator and start the colleagues management
       * @abstract
       * @return {this}
       */
      var _open = function _open() { }

      /**
       * Creates necessary colleagues (widgets) for the mediator to manages
       * @abstract
       * @return {this}
       */
      var _createWidgets = function _createWidgets() { }

      /**
       * Defines a getter method for widget element. So receiving a object,
       * named widget, which is used to define in its inheritance the widgets.
       * also defining the getters.
       * @this represents the mediator object
       * @example usage of method getter
       *            my.getter({
       *              'closeButton': _closeButton,
       *              'removeButton': _removeButton,
       *              'details': _details,
       *              'colors': _colors,
       *              'editBox': _editBox
       *            });
       *
       * @protected
       * @param {object} widget - specs to build the getters
       * @return {}
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
      this.app = data.app;
      this.open = _open;
      this.createWidgets = _createWidgets;

    };

  })(EventAggregator);

});
