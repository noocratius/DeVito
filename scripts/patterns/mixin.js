/**
 * @fileoverview defines a mixin pattern
 */

/**
 * @module patterns
 */
define(function () {

  /**
   * Augments a object with methods defined in extesion argument using the
   * respective prototype object to manipulate the objects
   *
   * @exports module:patterns/mixin
   * @param {object} object - object that will be extended
   * @param {object} extension - mixin object extends
   * @return {object} - object augmented
   */
  function mixin(object, extension) {

    for (var method in extension) {

      // check if object hasn't method to be extended
      if (!object.hasOwnProperty.call(object.prototype, method))
        object.prototype[method] = extension.prototype[method];
    }
    return object;
  }

  return mixin;

});
