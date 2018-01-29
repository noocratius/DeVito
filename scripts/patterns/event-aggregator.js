/**
 * @fileoverview defines publish/subscribe pattern into a aggregator object
 */

/**
 * @module patterns
 */
var EventAggregator = (function () {

  /**
   * Constructor that extends into aggregator the publish/subscribe pattern and
   * uses Mixin module to do so
   *
   * @constructor
   * @param {object} aggregator - aggregator which extends the pattern
   * @return {EventAggregator}
   */
  return function EventAggregator(aggregator) {

    /**
     * topics registered in aggregator
     * @private object
     */
    var _registry = {};

    /**
     * Publish a topic and send some data, of any type, to the handlers
     * specified by the topic and execute them
     *
     * @param {string} string - topic to be published by aggregator
     * @param {*} [data] - data passed through callback by subscribe method
     * @return {this}
     */
    var _publish = function _publish(topic, data) {
      var func, i;
      if (_registry.hasOwnProperty(topic)) {
        handlers = _registry[topic];

        for (i = 0; i < handlers.length; i++) {
          callback = handlers[i];

          if (typeof callback == 'string') {
            callback = this[callback];
          }

          callback.call(this, data);
        }
      }

      return this;
    }

    /**
     * Registry a topic with a handler which could be a string to be searched
     * on the object methods or a handler to be called when the topic happens
     *
     * @callback handler
     * @param {string} topic - topic to subscribe
     * @param {(handler | string)} handler - handler to be executed
     * @return {this}
     */
    var _subscribe = function _subscribe(topic, handler) {

      if (_registry.hasOwnProperty(topic)) {
        _registry[topic].push(handler);
      } else {
        _registry[topic] = [handler];
      }

      return this;
    }

    /**
     * Unregister a handler in a topic, a handler can be a string or a handler
     * reference.
     *
     * @callback handler
     * @param {string} topic - topico to subscribe
     * @param {(handler | string)} handler - handler to be unsubscribe
     * @return {this}
     */
    var _unsubscribe = function _unsubscribe(topic, handler) {
      if (_registry.hasOwnProperty(topic)) {
        _registry[topic] = _registry.filter(function (callback) {
          return handler !== callback;
        });
      }

      return this;
    }

    // defines the public methods into class
    this.publish = _publish
    this.subscribe = _subscribe;
    this.unsubscribe = _unsubscribe;

  };
})(Mixin);
