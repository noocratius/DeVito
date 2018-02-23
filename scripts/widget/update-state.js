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
      'sage',
      './widget',
      './attachment-state',
      './alert'
    ],
      function($, sage, Widget, AttachmentState, alert){

  /**
   * Represents a state which attachment box can be when a new sticky-note is
   * being inserted
   * @constructor
   * @extends AttachmentState
   * @param {object} spec - specs to build the object uses in the inheritance
   * @param {StickyNote} spec.stickyNote - sticky-note to be updated
   * @param {object} my - shared secrets between inheritance
   * @return {UpdateState}
   */
  var _UpdateState = function _UpdateState(spec, my) {
    my = my || {};

    // extends attachment state and call its constructor
    AttachmentState.call(this, spec, my);

    /**
     * Opens the widget and set apropriated widgets
     * @override
     * @param {AttachmentBox} box - attachment box which can see its widgets
     * @return {this}
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
     * FIXME - verify for not changed properties
     * @override
     * @param {AttachmentBox} box - attachment box which can see its widgets
     * @return {this}
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

      //FIXME-- verify this code couple
      box.id = -1;

      // only update if data didn't change
      if (text != my.stickyNote.note || color != my.stickyNote.color) {

        // update sticky-note and sends event to sage app
        my.stickyNote.note = text;
        my.stickyNote.color = color;
        my.stickyNote.lastModified = new Date();
        sage.publish('update.sticky-note', {stickyNote: my.stickyNote});

      } else {
        // alert the user what happened
        alert.show('Sticky-note not updated: Data not changed')
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
   * @param {object} spec - specs to build the state object
   * @param {model.StickyNote} spec.stickyNote - sticky-note to work with state
   * @param {object} [my={}] - secrets shared between inheritance
   * @return {AttachmentState}
   */
  var _static = {
    getInstance: function (spec, my) {

      if (!_instance) {
        _instance = new _UpdateState(spec, my);
      }

      return _instance.setStickyNote(spec.stickyNote);
    }
  };

  return _static;

});
