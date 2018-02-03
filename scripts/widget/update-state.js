/**
 * @fileoverview defines a state subclass according to state pattern
 */

jQuery(document).on('loaded.view', function (_, data) {
  'use strict';

  /**
   * @module widget
   */
  data.app.UpdateState = (function ($, Widget) {

    /**
     * Represents a state which attachment box can be when a new sticky-note is
     * being inserted
     * @constructor
     * @extends AttachmentState
     * @param {object} spec - specs to build the object uses in the inheritance
     * @param {BMCanvas} spec.stickyNote - sticky-note to be updated
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
        box.close();

        box.getEditBox()
            .setText('');

        // closes the detail box
        box.getDetails()
            .close();

        //FIXME-- verify this code couple
        box.id = -1;

        // set last updated time
        my.stickyNote.lastModified = new Date();

        console.log(box);
        box.app.publish('update.sticky-note', {stickyNote: my.stickyNote});

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
     * @param {BMCanvas.PostIt} spec.stickyNote - sticky-note to work with state
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

  })(jQuery, data.app.Widget);
});
