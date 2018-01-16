/**
 * Componente de alerta de mensagens
 */

 $(document).on('view-loaded', function () {

  /**
   * Módulo que alerta os usuários da aplicação
   *
   * @module Widget
   */
  window.Alert = (function ($) {

    var _alert = $('.alert');
    var _closeButton = $('.close', _alert);
    var _time = 3000; // tempo em segundos que o alerta deve desaparecer

    // fecha o alerta caso o botão de fechar tenha sido apertado
    _closeButton.on('click', function (event) {
      event.stopPropagation();
      _alert.fadeOut();
    });

    return {
      show: function (message) {
        $('.text', _alert).text(message);
        _alert.fadeIn();

        // remove o alerta quando se passar um tempo especificado
        setTimeout(function () {
          _alert.fadeOut();
        }, _time);
      }
    }
  })(jQuery);

});
