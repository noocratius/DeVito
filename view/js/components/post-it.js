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
  })

  .click(function () {
    var id = $(this).data('id');
    $(this).trigger('edit', id);
  });

})(jQuery);
