/**
 * Módulo que lida dos post-it's
 */

/**
 * Componente de post-it
 *
 * @module PostIt
 */
var PostIt = (function ($) {
  var _postIt = $('.post-it');
  var edit = '.edit';

  // mostra e esconde o botão de edição enquanto aponta para o componente
  _postIt.on('mouseenter', function () {
    $(edit, this).css('visibility', 'visible');
  })
  .on('mouseleave', function () {
    $(edit, this).css('visibility', 'hidden');
  });

  // envia evento de edição caso o botão tenha de edição tenha sido pressionado
  $(edit, _postIt).click(function () {

    // identificador do post-it
    var id = $(this).parent('.post-it').data('id');
    // envia o evento de edição
    $(this).trigger('edit', id);
  });

})(jQuery);
