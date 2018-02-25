/**
 * @fileoverview defines a single canvas block
 */

'use strict';

/**
 * @module model
 */
define(function () {
  /**
   * Represents a single canvas block, one of nine defined by business canvas
   * model
   *
   * @class
   * @alias module:model/canvas-element
   *
   * @param {int} id - block identifier
   * @param {string} name - block name
   */
  function CanvasElement(id, name) {
    this.id = id;
    this.name = name;
    this.postIts = new Array();
  }

  /**
   * attach a sticky-note to block canvas, at the end
   *
   * @param {module:model/sticky-note} note - sticky-note to be attached
   */
  CanvasElement.prototype.attachPostIt = function(note) {
    this.postIts.push(note);
    note.block = this;
  };

  /**
   * returns a sticky-note according to its identifier or null case it doens't
   * exits
   *
   * @param {int} id - sticky-note identifier
   * @return {(module:model/sticky-note | null)}
   */
  CanvasElement.prototype.getPostIt = function (id) {
    for (var postIt of this.postIts) {
      if (postIt.id == id) return postIt;
    }

    return null;
  }

  /**
   * remove a sticky-note from block by its identifier
   *
   * @param {int} id - sticky-note identifier
   */
  CanvasElement.prototype.deletePostIt = function (id) {

    // read sticky-note position
    for (var i = 0; i < this.postIts.length; i++) {
      if (this.postIts[i].id == id) {
        this.postIts.splice(i, 1);
      }
    }
  }

  return CanvasElement;
});
