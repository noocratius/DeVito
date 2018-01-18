/**
 *
 */

jQuery(document).on('view-loaded', function (event, data) {

  /**
   * Módulo que alerta mensagens para os usuários
   *
   * @module widget
   */
  data.app.Alert = (function ($) {
    var _view = $(data.view);
    var _alert = $('.alert', _view);
    var _closeButton = $('.close', _alert);
    var _text = $('.text', _alert);
    var _time = 3000; // tempo em milisegundos que o alerta deve desaparecer

    // fecha o alerta caso o botão de fechar tenha sido apertado
    _closeButton.on('click', function (event) {
      event.stopPropagation();
      _alert.fadeOut();
    });

    // fecha o alerta no tempo especificado
    _alert.on('close', function (event, time) {
      event.stopPropagation();
      setTimeout(function () {
        _closeButton.trigger('click');
      }, time);
    });

    return {

      /**
       * mostra a mensagem de alerta no canvas
       *
       * @param {string} message - Mensagem a ser exibida
       */
      show: function (message) {
        _text.text(message);
        _alert.fadeIn();
        _alert.trigger('close', _time);
      },

      /**
       * Fecha o alerta de acordo com o tempo especificado em milisegundos
       *
       * @param {int} time - Tempo, em milisegundos, que deve fechar o alerta
       */
      close: function (time) {
        var timeOut = time || 0;

        _alert.trigger('close', timeOut);
      }
    }
  })(jQuery);

});
