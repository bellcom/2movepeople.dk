jQuery(function ($) {
  'use strict';

  // Flexy header
  // flexy_header.init();

  // Sidr
  $('.slinky-menu')
    .find('ul, li, a')
    .removeClass();

  // Enable tooltips.
  $('[data-toggle="tooltip"]').tooltip();

  // Showcases.
  var slider = tns({
    container: '.showcases',
    items: 1,
    autoplay: true,
    autoplayHoverPause: true
  });

  var nextShowcaseButtons = document.querySelectorAll('.js-show-next-showcase');
  for(var nextInt = 0; nextInt < nextShowcaseButtons.length; nextInt++) {
    var nextShowcase = nextShowcaseButtons[nextInt];

    nextShowcase.addEventListener('click', function() {
      slider.goTo('next');
    });
  }

  var previousShowcaseButtons = document.querySelectorAll('.js-show-previous-showcase');
  for(var prevInt = 0; prevInt < previousShowcaseButtons.length; prevInt++) {
    var previousShowcase = previousShowcaseButtons[prevInt];

    previousShowcase.addEventListener('click', function() {
      slider.goTo('prev');
    });
  }
});
