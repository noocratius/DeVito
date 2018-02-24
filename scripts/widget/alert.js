/**
 * @fileoverview defines a alert widget which shows messages to sage app
 */

'use strict';

/**
 * @module widget
 */
define(['jquery'], function ($) {

  /**
   * Represents a Alert class to show messages to users
   *
   * @param {object} spec - specs to build the alert widget
   * @param {object} spec.sage - sage app instance
   * @param {object} [my={}] - shared secrets between inheritance instances
   * @return {Alert}
   */
  function Alert(spec, my) {
    var $alert, $closeButton, $text, _time;

    /** @private {int} time in miliseconds which alerts should appers */
    _time = 3000;

    /** @private {jquery} jQuery object representing the alert */
    $alert = $('.alert', spec.sage.element);

    /** @private {jquery} jQuery object representing alert' close button */
    $closeButton = $('.close', $alert);

    /** @private {jquery} jQuery object representing text inside the alert */
    $text = $('.text', $alert);

    // closes the widget in case the widget is pressed
    $closeButton.on('click', function (_) {
      _.stopPropagation();
      $alert.fadeOut();
    });

    // closes the button in certain time
    $alert.on('close', function (_, time) {
      _.stopPropagation();

      setTimeout(function () {
        $closeButton.trigger('click');
      }, time);
    });

    /**
     * mostra a mensagem de alerta no canvas
     * TODO -- implement alert type
     * @param {string} message - message to show the users
     * @param {string} type - message type
     */
    var _show = function _show(message, type) {
      $text.text(message);
      $alert.fadeIn();
      $alert.trigger('close', _time);
    }

    /**
     * Fecha o alerta de acordo com o tempo especificado em milisegundos
     *
     * @param {int} time - Tempo, em milisegundos, que deve fechar o alerta
     */
    var _close = function _close(time) {
      var timeOut = time || 0;

      $alert.trigger('close', timeOut);
    }


    this.show = _show;
    this.close = _close;

  }

  return Alert;

});
