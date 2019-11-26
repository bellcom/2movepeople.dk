jQuery(function ($) {
  'use strict';

  // Flexy header
  // flexy_header.init();

  $('.sidr-toggle--right').sidr({
    name: 'sidr-main',
    displace: false,
    side: 'right',
    renaming: false,
    body: '.layout__wrapper',
    source: '.sidr-source-provider'
  });

  // Enable tooltips.
  $('[data-toggle="tooltip"]').tooltip();
});


