/**
 * @fileoverview define the interface for attachment state according to state
 * pattern
 */

/**
 * @module widget
 */
var AttachmentState = (function () {

  /**
   * Represents a state object for attachment mediator
   * @constructor
   * @param {object} spec - specs to build the state object
   * @param {BMCanvas.PostIt} spec.stickyNote - sticky-note to work with state
   * @param {object} [my={}] - secrets shared between inheritance
   * @return {AttachmentState}
   */
  var _AttachmentState = function _AttachmentState(spec, my) {
    my = my || {};

    // set protected variables
    my.stickyNote = spec.stickyNote;

    /**
     * Opens the widget and set apropriated widgets
     * @abstract
     * @param {AttachmentBox} box - attachment box which can see its widgets
     * @return {this}
     */
    var _open = function _open(box) { }

    /**
     * Closes the apropriated widgets and save the attachment
     * @abstract
     * @param {AttachmentBox} box - attachment box which can see its widgets
     * @return {this}
     */
    var _save = function _save(box) { }


    /**
     * sets sticky-note to be worked its state
     * @param {BMCanvas.PostIt} stickyNote
     * @return {this}
     */
    var _setStickyNote = function _setStickyNote(stickyNote) {
      my.stickyNote = stickyNote;

      return this;
    }

    // set public interface
    this.open = _open;
    this.save = _save;
    this.setStickyNote = _setStickyNote;

  }

  return _AttachmentState;
})();
