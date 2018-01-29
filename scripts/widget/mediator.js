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

      my = my || {};

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

      this.app = data.app;
      this.open = _open;
      this.createWidgets = _createWidgets;

    };

  })(EventAggregator);

});
