/**
 * @fileoverview defines a state subclass according to state pattern
 */

'use strict';

/**
 * @module widget
 */
define(
    [
      'jquery',
      './widget',
      './attachment-state',
      './alert'
    ],
      function($, Widget, AttachmentState, alert){

  /**
   * Represents a state which attachment box can be when a new sticky-note is
   * being inserted
   * @class
   * @alias module:widget/update-state
   * @extends module:widget/attachment-state
   * @param {object} spec - specs to build the object uses in the inheritance
   * @param {module:widget/sticky-note} spec.stickyNote - sticky-note to be
   *    updated
   * @param {object} my - shared secrets between inheritance
   */
  var _UpdateState = function _UpdateState(spec, my) {
    my = my || {};

    // extends attachment state and call its constructor
    AttachmentState.call(this, spec, my);

    /**
     * Opens the widget and set apropriated widgets
     * @override
     * @param {module:widget/attachment-box} box - attachment box which can see
     *    its widgets
     * @return {module:widget/update-state}
     */
    var _open = function _open(box) {
      box.show();

      // fill edti box widget
      box.getEditBox()
          .setText(my.stickyNote.note).setColor(my.stickyNote.color);

      // fill detail box widget
      box.getDetails()
          .show()
          .setAuthor(my.stickyNote.author.name)
          .setCreatedAt(my.stickyNote.createdAt)
          .setLastModified(my.stickyNote.lastModified);

      // set sitcky-note' id in mediator
      box.id = my.stickyNote.id;

      return this;
    }

    /**
     * Closes the apropriated widgets and save the attachment
     * @todo FIXME - verify for particular nor changed properties
     * @override
     * @param {module:widget/attachment-box} box - attachment box which can see
     *    its widgets
     * @return {module:widget/update-state}
     */
    var _save = function _save(box) {
      var text, color;

      text = box.getEditBox().getText();
      color = box.getEditBox().getColor();

      // close and empty the edit box
      box.close();

      box.getEditBox()
          .setText('');

      // closes the detail box
      box.getDetails()
          .close();

      //FIXME-- verify this code coupling
      box.id = -1;

      // only update if data didn't change
      if (text != my.stickyNote.note || color != my.stickyNote.color) {

        // update sticky-note and sends event to sage app
        my.stickyNote.note = text;
        my.stickyNote.color = color;
        my.stickyNote.lastModified = new Date();
        box.sage.publish('update.sticky-note', {stickyNote: my.stickyNote});

      } else {
        // alert the user what happened
        new alert({sage: box.sage}).show('Sticky-note not updated: Data not changed')
      }

      return this;
    }

    // set public interface
    this.open = _open;
    this.save = _save;

  };


  // singleton instance
  var _instance;

  /**
   * returns the singleton object for state lazyly initiation
   *
   * @exports module:widget/update-state
   * @param {object} spec - specs to build the state object
   * @param {module:model/sticky-note} spec.stickyNote - sticky-note to work with state
   * @param {object} [my={}] - secrets shared between inheritance
   * @return {module:widget/attachment-state}
   */
  var _static = {

    /**
     * returns a singleton of {@link module:widget/update-state}
     * @param {object} spec - specs to build update-state
     * @param {object} my - shared secrets between inheritance
     * @return {module:widget/update-state}
     */
    getInstance: function (spec, my) {

      if (!_instance) {
        _instance = new _UpdateState(spec, my);
      }

      return _instance.setStickyNote(spec.stickyNote);
    }
  };

  return _static;

});
