/**
 * @fileoverview define the interface for attachment state according to state
 * pattern
 */

/**
 * @module widget
 */
define(function(){

  /**
   * Represents a state object for attachment mediator
   * @class
   * @alias module:widget/attachment-state
   * @param {object} spec - specs to build the state object
   * @param {module:model/sticky-note} spec.stickyNote - sticky-note to work with state
   * @param {object} [my={}] - secrets shared between inheritance
   */
  function AttachmentState(spec, my) {
    my = my || {};

    // set protected variables
    my.stickyNote = spec.stickyNote;

    /**
     * opens the widget and set apropriated widgets
     * @abstract
     * @param {module:widget/attachment-box} box - attachment box which can see
     *    its widgets
     * @return {module:widget/attachment-state}
     */
    var _open = function _open(box) { }

    /**
     * Closes the apropriated widgets and save the attachment
     * @abstract
     * @param {module:widget/attachment-box} box - attachment box which can see
     *    its widgets
     * @return {module:widget/attachment-state}
     */
    var _save = function _save(box) { }


    /**
     * sets sticky-note to be worked its state
     * @param {module:model/sticky-note} stickyNote
     * @return {module:widget/attachment-state}
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

  return AttachmentState;
});
