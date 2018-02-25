/**
 * @fileoverview Represents a canvas model
 */

'use strict';

/**
 * @module model
 */
define(['./canvas-element'], function (CanvasElement) {

  /**
   * Represents a business model canvas
   *
   * @class
   * @alias module:model/canvas
   *
   * @param {string} title - canvas title
   * @param {string} description - canvas description
   * @return {module:model/canvas}
   */
  function Canvas(title, description) {
    this.title = title || '';
    this.description = description || '';
    this.createdAt = new Date();
    this.lastModified = new Date();

    // inicializa os blocos do canvas
    this.canvasElements = new Array(9);

    // cria os elementos do canvas
    this.canvasElements[0] = new CanvasElement(1, 'Key Partners');
    this.canvasElements[1] = new CanvasElement(2, 'Key Activities');
    this.canvasElements[2] = new CanvasElement(3, 'Key Resources');
    this.canvasElements[3] = new CanvasElement(4, 'Value Propositions');
    this.canvasElements[4] = new CanvasElement(5, 'Customer Relationships');
    this.canvasElements[5] = new CanvasElement(6, 'Channels');
    this.canvasElements[6] = new CanvasElement(7, 'Customer Segments');
    this.canvasElements[7] = new CanvasElement(8, 'Cost Structure');
    this.canvasElements[8] = new CanvasElement(9, 'Revenue Streams');
  }

  /**
   * Attach a sticky-note to canvas block, passing a block id and sticky-note
   * you wish to attach
   *
   * @param {int} blockIdentifier - block identifier which will be attached
   * @param {module:model/sticky-note} postIt - sticky-note to be attached
   * @return {module:model/canvas}
   */
  Canvas.prototype.attachStickyNote = function (blockIdentifier, note) {
    if (blockIdentifier > 0 && blockIdentifier <= this.canvasElements.length) {
      this.canvasElements[blockIdentifier - 1].attachPostIt(note);
    }

    return this;
  };

  /**
   * returns a sticky-note according to its identifier or null in case is not
   * founded
   *
   * @param {int} id - sticky-note' identifier to be looked for
   * @return {(module:model/sticky-note | null)} sticky-note founded
   */
  Canvas.prototype.getPostIt = function (id) {
    var postIt = null;
    for (var block of this.canvasElements) {

      if ((postIt = block.getPostIt(id)) != null)
        return postIt;
    }

    return postIt;
  }

  /**
   * remove a sticky-note by its identifier
   *
   * @param {module:model/sticky-note} postit - sticky-note' identifier
   * @return {module:model/canvas}
   */
  Canvas.prototype.deletePostIt = function (postit) {
    this.canvasElements[postit.block.id - 1].deletePostIt(postit.id);

    return this;
  }

  return Canvas;
})
