
  /**
   * Retorna a propriedade css sem unidade
   *
   * @param {string} property - Propriedade em unidades usadas pelo stylesheet
   */
  var unitlessAttr = function(property) {
    return property.match(/\d+/)[0];
  }

  $.when( $.ready ).then(function () {

    // objeto que lida com business model canvas
    var $canvas, $upper, $bottom, lineHeight, upperHeight, bottomHeight, headerHeight, buttonHeight;

    $canvas = $('.business-model-canvas');

    lineHeight = unitlessAttr($canvas.css('lineHeight'));
    $upper = $('.upper-column');
    $bottom = $('.bottom-column');

    upperHeight = unitlessAttr($upper.css('height'));
    bottomHeight = unitlessAttr($bottom.css('height'));
    headerHeight = Number(unitlessAttr($('.canvas-element h1', $upper).css('height')));
    var extraHeight = headerHeight;

    $('.canvas-element > .canvas-body-element', $upper).css('height', upperHeight/2 - extraHeight);
    $('.canvas-column > .canvas-body-element', $upper).css('height', upperHeight - extraHeight);
    $('.canvas-body-element', $bottom).css('height', bottomHeight - extraHeight);

    $(window).resize(function () {

      upperHeight = unitlessAttr($upper.css('height'));
      bottomHeight = unitlessAttr($bottom.css('height'));

      $('.canvas-element .canvas-body-element', $upper).css('height', upperHeight/2 - extraHeight);
      $('.canvas-column.canvas-element .canvas-body-element', $upper).css('height', upperHeight - extraHeight);
      $('.bottom-column .canvas-body-element').css('height', bottomHeight - extraHeight);

    });

    // adiciona comportamento para fechar/abrir janela de adição de post-it's
    $('.canvas-element-add-button').click(function (){ $('.add-widget').fadeIn(200); })
    $('.add-widget .post-it').click(function(e){ e.stopPropagation(); })
    $('.add-widget').click(function(e){ $(this).fadeOut(200); })
  });
