'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * Bootstrap v3.4.1 (https://getbootstrap.com/)
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery');
}

+function ($) {
  'use strict';

  var version = $.fn.jquery.split(' ')[0].split('.');
  if (version[0] < 2 && version[1] < 9 || version[0] == 1 && version[1] == 9 && version[2] < 1 || version[0] > 3) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4');
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: https://modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap');

    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] };
      }
    }

    return false; // explicit for ie8 (  ._.)
  }

  // https://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false;
    var $el = this;
    $(this).one('bsTransitionEnd', function () {
      called = true;
    });
    var callback = function callback() {
      if (!called) $($el).trigger($.support.transition.end);
    };
    setTimeout(callback, duration);
    return this;
  };

  $(function () {
    $.support.transition = transitionEnd();

    if (!$.support.transition) return;

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function handle(e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
      }
    };
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]';
  var Alert = function Alert(el) {
    $(el).on('click', dismiss, this.close);
  };

  Alert.VERSION = '3.4.1';

  Alert.TRANSITION_DURATION = 150;

  Alert.prototype.close = function (e) {
    var $this = $(this);
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    selector = selector === '#' ? [] : selector;
    var $parent = $(document).find(selector);

    if (e) e.preventDefault();

    if (!$parent.length) {
      $parent = $this.closest('.alert');
    }

    $parent.trigger(e = $.Event('close.bs.alert'));

    if (e.isDefaultPrevented()) return;

    $parent.removeClass('in');

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove();
    }

    $.support.transition && $parent.hasClass('fade') ? $parent.one('bsTransitionEnd', removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement();
  };

  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.alert');

      if (!data) $this.data('bs.alert', data = new Alert(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.alert;

  $.fn.alert = Plugin;
  $.fn.alert.Constructor = Alert;

  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old;
    return this;
  };

  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close);
}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function Button(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Button.DEFAULTS, options);
    this.isLoading = false;
  };

  Button.VERSION = '3.4.1';

  Button.DEFAULTS = {
    loadingText: 'loading...'
  };

  Button.prototype.setState = function (state) {
    var d = 'disabled';
    var $el = this.$element;
    var val = $el.is('input') ? 'val' : 'html';
    var data = $el.data();

    state += 'Text';

    if (data.resetText == null) $el.data('resetText', $el[val]());

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state]);

      if (state == 'loadingText') {
        this.isLoading = true;
        $el.addClass(d).attr(d, d).prop(d, true);
      } else if (this.isLoading) {
        this.isLoading = false;
        $el.removeClass(d).removeAttr(d).prop(d, false);
      }
    }, this), 0);
  };

  Button.prototype.toggle = function () {
    var changed = true;
    var $parent = this.$element.closest('[data-toggle="buttons"]');

    if ($parent.length) {
      var $input = this.$element.find('input');
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false;
        $parent.find('.active').removeClass('active');
        this.$element.addClass('active');
      } else if ($input.prop('type') == 'checkbox') {
        if ($input.prop('checked') !== this.$element.hasClass('active')) changed = false;
        this.$element.toggleClass('active');
      }
      $input.prop('checked', this.$element.hasClass('active'));
      if (changed) $input.trigger('change');
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
      this.$element.toggleClass('active');
    }
  };

  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.button');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.button', data = new Button(this, options));

      if (option == 'toggle') data.toggle();else if (option) data.setState(option);
    });
  }

  var old = $.fn.button;

  $.fn.button = Plugin;
  $.fn.button.Constructor = Button;

  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old;
    return this;
  };

  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target).closest('.btn');
    Plugin.call($btn, 'toggle');
    if (!$(e.target).is('input[type="radio"], input[type="checkbox"]')) {
      // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
      e.preventDefault();
      // The target component still receive the focus
      if ($btn.is('input,button')) $btn.trigger('focus');else $btn.find('input:visible,button:visible').first().trigger('focus');
    }
  }).on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type));
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function Carousel(element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find('.carousel-indicators');
    this.options = options;
    this.paused = null;
    this.sliding = null;
    this.interval = null;
    this.$active = null;
    this.$items = null;

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this));

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element.on('mouseenter.bs.carousel', $.proxy(this.pause, this)).on('mouseleave.bs.carousel', $.proxy(this.cycle, this));
  };

  Carousel.VERSION = '3.4.1';

  Carousel.TRANSITION_DURATION = 600;

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  };

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    switch (e.which) {
      case 37:
        this.prev();break;
      case 39:
        this.next();break;
      default:
        return;
    }

    e.preventDefault();
  };

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false);

    this.interval && clearInterval(this.interval);

    this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

    return this;
  };

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item');
    return this.$items.index(item || this.$active);
  };

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active);
    var willWrap = direction == 'prev' && activeIndex === 0 || direction == 'next' && activeIndex == this.$items.length - 1;
    if (willWrap && !this.options.wrap) return active;
    var delta = direction == 'prev' ? -1 : 1;
    var itemIndex = (activeIndex + delta) % this.$items.length;
    return this.$items.eq(itemIndex);
  };

  Carousel.prototype.to = function (pos) {
    var that = this;
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));

    if (pos > this.$items.length - 1 || pos < 0) return;

    if (this.sliding) return this.$element.one('slid.bs.carousel', function () {
      that.to(pos);
    }); // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle();

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
  };

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true);

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end);
      this.cycle(true);
    }

    this.interval = clearInterval(this.interval);

    return this;
  };

  Carousel.prototype.next = function () {
    if (this.sliding) return;
    return this.slide('next');
  };

  Carousel.prototype.prev = function () {
    if (this.sliding) return;
    return this.slide('prev');
  };

  Carousel.prototype.slide = function (type, next) {
    var $active = this.$element.find('.item.active');
    var $next = next || this.getItemForDirection(type, $active);
    var isCycling = this.interval;
    var direction = type == 'next' ? 'left' : 'right';
    var that = this;

    if ($next.hasClass('active')) return this.sliding = false;

    var relatedTarget = $next[0];
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    });
    this.$element.trigger(slideEvent);
    if (slideEvent.isDefaultPrevented()) return;

    this.sliding = true;

    isCycling && this.pause();

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active');
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
      $nextIndicator && $nextIndicator.addClass('active');
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type);
      if ((typeof $next === 'undefined' ? 'undefined' : _typeof($next)) === 'object' && $next.length) {
        $next[0].offsetWidth; // force reflow
      }
      $active.addClass(direction);
      $next.addClass(direction);
      $active.one('bsTransitionEnd', function () {
        $next.removeClass([type, direction].join(' ')).addClass('active');
        $active.removeClass(['active', direction].join(' '));
        that.sliding = false;
        setTimeout(function () {
          that.$element.trigger(slidEvent);
        }, 0);
      }).emulateTransitionEnd(Carousel.TRANSITION_DURATION);
    } else {
      $active.removeClass('active');
      $next.addClass('active');
      this.sliding = false;
      this.$element.trigger(slidEvent);
    }

    isCycling && this.cycle();

    return this;
  };

  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.carousel');
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);
      var action = typeof option == 'string' ? option : options.slide;

      if (!data) $this.data('bs.carousel', data = new Carousel(this, options));
      if (typeof option == 'number') data.to(option);else if (action) data[action]();else if (options.interval) data.pause().cycle();
    });
  }

  var old = $.fn.carousel;

  $.fn.carousel = Plugin;
  $.fn.carousel.Constructor = Carousel;

  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };

  // CAROUSEL DATA-API
  // =================

  var clickHandler = function clickHandler(e) {
    var $this = $(this);
    var href = $this.attr('href');
    if (href) {
      href = href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7
    }

    var target = $this.attr('data-target') || href;
    var $target = $(document).find(target);

    if (!$target.hasClass('carousel')) return;

    var options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr('data-slide-to');
    if (slideIndex) options.interval = false;

    Plugin.call($target, options);

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex);
    }

    e.preventDefault();
  };

  $(document).on('click.bs.carousel.data-api', '[data-slide]', clickHandler).on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler);

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this);
      Plugin.call($carousel, $carousel.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function Collapse(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Collapse.DEFAULTS, options);
    this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' + '[data-toggle="collapse"][data-target="#' + element.id + '"]');
    this.transitioning = null;

    if (this.options.parent) {
      this.$parent = this.getParent();
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger);
    }

    if (this.options.toggle) this.toggle();
  };

  Collapse.VERSION = '3.4.1';

  Collapse.TRANSITION_DURATION = 350;

  Collapse.DEFAULTS = {
    toggle: true
  };

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height';
  };

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return;

    var activesData;
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse');
      if (activesData && activesData.transitioning) return;
    }

    var startEvent = $.Event('show.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    if (actives && actives.length) {
      Plugin.call(actives, 'hide');
      activesData || actives.data('bs.collapse', null);
    }

    var dimension = this.dimension();

    this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded', true);

    this.$trigger.removeClass('collapsed').attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function complete() {
      this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('');
      this.transitioning = 0;
      this.$element.trigger('shown.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    var scrollSize = $.camelCase(['scroll', dimension].join('-'));

    this.$element.one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
  };

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return;

    var startEvent = $.Event('hide.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    var dimension = this.dimension();

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

    this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded', false);

    this.$trigger.addClass('collapsed').attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function complete() {
      this.transitioning = 0;
      this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    this.$element[dimension](0).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);
  };

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']();
  };

  Collapse.prototype.getParent = function () {
    return $(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function (i, element) {
      var $element = $(element);
      this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
    }, this)).end();
  };

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in');

    $element.attr('aria-expanded', isOpen);
    $trigger.toggleClass('collapsed', !isOpen).attr('aria-expanded', isOpen);
  };

  function getTargetFromTrigger($trigger) {
    var href;
    var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    return $(document).find(target);
  }

  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.collapse');
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
      if (!data) $this.data('bs.collapse', data = new Collapse(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.collapse;

  $.fn.collapse = Plugin;
  $.fn.collapse.Constructor = Collapse;

  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };

  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this = $(this);

    if (!$this.attr('data-target')) e.preventDefault();

    var $target = getTargetFromTrigger($this);
    var data = $target.data('bs.collapse');
    var option = data ? 'toggle' : $this.data();

    Plugin.call($target, option);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop';
  var toggle = '[data-toggle="dropdown"]';
  var Dropdown = function Dropdown(element) {
    $(element).on('click.bs.dropdown', this.toggle);
  };

  Dropdown.VERSION = '3.4.1';

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = selector !== '#' ? $(document).find(selector) : null;

    return $parent && $parent.length ? $parent : $this.parent();
  }

  function clearMenus(e) {
    if (e && e.which === 3) return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $this = $(this);
      var $parent = getParent($this);
      var relatedTarget = { relatedTarget: this };

      if (!$parent.hasClass('open')) return;

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.attr('aria-expanded', 'false');
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget));
    });
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    clearMenus();

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
      }

      var relatedTarget = { relatedTarget: this };
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.trigger('focus').attr('aria-expanded', 'true');

      $parent.toggleClass('open').trigger($.Event('shown.bs.dropdown', relatedTarget));
    }

    return false;
  };

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

    var $this = $(this);

    e.preventDefault();
    e.stopPropagation();

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus');
      return $this.trigger('click');
    }

    var desc = ' li:not(.disabled):visible a';
    var $items = $parent.find('.dropdown-menu' + desc);

    if (!$items.length) return;

    var index = $items.index(e.target);

    if (e.which == 38 && index > 0) index--; // up
    if (e.which == 40 && index < $items.length - 1) index++; // down
    if (!~index) index = 0;

    $items.eq(index).trigger('focus');
  };

  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.dropdown');

      if (!data) $this.data('bs.dropdown', data = new Dropdown(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.dropdown;

  $.fn.dropdown = Plugin;
  $.fn.dropdown.Constructor = Dropdown;

  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };

  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
    e.stopPropagation();
  }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#modals
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function Modal(element, options) {
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(element);
    this.$dialog = this.$element.find('.modal-dialog');
    this.$backdrop = null;
    this.isShown = null;
    this.originalBodyPad = null;
    this.scrollbarWidth = 0;
    this.ignoreBackdropClick = false;
    this.fixedContent = '.navbar-fixed-top, .navbar-fixed-bottom';

    if (this.options.remote) {
      this.$element.find('.modal-content').load(this.options.remote, $.proxy(function () {
        this.$element.trigger('loaded.bs.modal');
      }, this));
    }
  };

  Modal.VERSION = '3.4.1';

  Modal.TRANSITION_DURATION = 300;
  Modal.BACKDROP_TRANSITION_DURATION = 150;

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  };

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget);
  };

  Modal.prototype.show = function (_relatedTarget) {
    var that = this;
    var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

    this.$element.trigger(e);

    if (this.isShown || e.isDefaultPrevented()) return;

    this.isShown = true;

    this.checkScrollbar();
    this.setScrollbar();
    this.$body.addClass('modal-open');

    this.escape();
    this.resize();

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
      });
    });

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade');

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body); // don't move modals dom position
      }

      that.$element.show().scrollTop(0);

      that.adjustDialog();

      if (transition) {
        that.$element[0].offsetWidth; // force reflow
      }

      that.$element.addClass('in');

      that.enforceFocus();

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });

      transition ? that.$dialog // wait for modal to slide in
      .one('bsTransitionEnd', function () {
        that.$element.trigger('focus').trigger(e);
      }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e);
    });
  };

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault();

    e = $.Event('hide.bs.modal');

    this.$element.trigger(e);

    if (!this.isShown || e.isDefaultPrevented()) return;

    this.isShown = false;

    this.escape();
    this.resize();

    $(document).off('focusin.bs.modal');

    this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal');

    this.$dialog.off('mousedown.dismiss.bs.modal');

    $.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
  };

  Modal.prototype.enforceFocus = function () {
    $(document).off('focusin.bs.modal') // guard against infinite focus loop
    .on('focusin.bs.modal', $.proxy(function (e) {
      if (document !== e.target && this.$element[0] !== e.target && !this.$element.has(e.target).length) {
        this.$element.trigger('focus');
      }
    }, this));
  };

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide();
      }, this));
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal');
    }
  };

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
    } else {
      $(window).off('resize.bs.modal');
    }
  };

  Modal.prototype.hideModal = function () {
    var that = this;
    this.$element.hide();
    this.backdrop(function () {
      that.$body.removeClass('modal-open');
      that.resetAdjustments();
      that.resetScrollbar();
      that.$element.trigger('hidden.bs.modal');
    });
  };

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  };

  Modal.prototype.backdrop = function (callback) {
    var that = this;
    var animate = this.$element.hasClass('fade') ? 'fade' : '';

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;

      this.$backdrop = $(document.createElement('div')).addClass('modal-backdrop ' + animate).appendTo(this.$body);

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false;
          return;
        }
        if (e.target !== e.currentTarget) return;
        this.options.backdrop == 'static' ? this.$element[0].focus() : this.hide();
      }, this));

      if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

      this.$backdrop.addClass('in');

      if (!callback) return;

      doAnimate ? this.$backdrop.one('bsTransitionEnd', callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback();
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');

      var callbackRemove = function callbackRemove() {
        that.removeBackdrop();
        callback && callback();
      };
      $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one('bsTransitionEnd', callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove();
    } else if (callback) {
      callback();
    }
  };

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog();
  };

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    });
  };

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    });
  };

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
      // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    this.scrollbarWidth = this.measureScrollbar();
  };

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt(this.$body.css('padding-right') || 0, 10);
    this.originalBodyPad = document.body.style.paddingRight || '';
    var scrollbarWidth = this.scrollbarWidth;
    if (this.bodyIsOverflowing) {
      this.$body.css('padding-right', bodyPad + scrollbarWidth);
      $(this.fixedContent).each(function (index, element) {
        var actualPadding = element.style.paddingRight;
        var calculatedPadding = $(element).css('padding-right');
        $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + scrollbarWidth + 'px');
      });
    }
  };

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad);
    $(this.fixedContent).each(function (index, element) {
      var padding = $(element).data('padding-right');
      $(element).removeData('padding-right');
      element.style.paddingRight = padding ? padding : '';
    });
  };

  Modal.prototype.measureScrollbar = function () {
    // thx walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth;
  };

  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.modal');
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data) $this.data('bs.modal', data = new Modal(this, options));
      if (typeof option == 'string') data[option](_relatedTarget);else if (options.show) data.show(_relatedTarget);
    });
  }

  var old = $.fn.modal;

  $.fn.modal = Plugin;
  $.fn.modal.Constructor = Modal;

  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };

  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    var target = $this.attr('data-target') || href && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    var $target = $(document).find(target);
    var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

    if ($this.is('a')) e.preventDefault();

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus');
      });
    });
    Plugin.call($target, option, this);
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];

  var uriAttrs = ['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'];

  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;

  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []

    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
     */
  };var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;

  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  function allowedAttribute(attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase();

    if ($.inArray(attrName, allowedAttributeList) !== -1) {
      if ($.inArray(attrName, uriAttrs) !== -1) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
      }

      return true;
    }

    var regExp = $(allowedAttributeList).filter(function (index, value) {
      return value instanceof RegExp;
    });

    // Check if a regular expression validates the attribute.
    for (var i = 0, l = regExp.length; i < l; i++) {
      if (attrName.match(regExp[i])) {
        return true;
      }
    }

    return false;
  }

  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    // IE 8 and below don't support createHTMLDocument
    if (!document.implementation || !document.implementation.createHTMLDocument) {
      return unsafeHtml;
    }

    var createdDocument = document.implementation.createHTMLDocument('sanitization');
    createdDocument.body.innerHTML = unsafeHtml;

    var whitelistKeys = $.map(whiteList, function (el, i) {
      return i;
    });
    var elements = $(createdDocument.body).find('*');

    for (var i = 0, len = elements.length; i < len; i++) {
      var el = elements[i];
      var elName = el.nodeName.toLowerCase();

      if ($.inArray(elName, whitelistKeys) === -1) {
        el.parentNode.removeChild(el);

        continue;
      }

      var attributeList = $.map(el.attributes, function (el) {
        return el;
      });
      var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);

      for (var j = 0, len2 = attributeList.length; j < len2; j++) {
        if (!allowedAttribute(attributeList[j], whitelistedAttributes)) {
          el.removeAttribute(attributeList[j].nodeName);
        }
      }
    }

    return createdDocument.body.innerHTML;
  }

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function Tooltip(element, options) {
    this.type = null;
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.hoverState = null;
    this.$element = null;
    this.inState = null;

    this.init('tooltip', element, options);
  };

  Tooltip.VERSION = '3.4.1';

  Tooltip.TRANSITION_DURATION = 150;

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    },
    sanitize: true,
    sanitizeFn: null,
    whiteList: DefaultWhitelist
  };

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled = true;
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.$viewport = this.options.viewport && $(document).find($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
    this.inState = { click: false, hover: false, focus: false };

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!');
    }

    var triggers = this.options.trigger.split(' ');

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i];

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
      } else if (trigger != 'manual') {
        var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
      }
    }

    this.options.selector ? this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' }) : this.fixTitle();
  };

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS;
  };

  Tooltip.prototype.getOptions = function (options) {
    var dataAttributes = this.$element.data();

    for (var dataAttr in dataAttributes) {
      if (dataAttributes.hasOwnProperty(dataAttr) && $.inArray(dataAttr, DISALLOWED_ATTRIBUTES) !== -1) {
        delete dataAttributes[dataAttr];
      }
    }

    options = $.extend({}, this.getDefaults(), dataAttributes, options);

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      };
    }

    if (options.sanitize) {
      options.template = sanitizeHtml(options.template, options.whiteList, options.sanitizeFn);
    }

    return options;
  };

  Tooltip.prototype.getDelegateOptions = function () {
    var options = {};
    var defaults = this.getDefaults();

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value;
    });

    return options;
  };

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true;
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in';
      return;
    }

    clearTimeout(self.timeout);

    self.hoverState = 'in';

    if (!self.options.delay || !self.options.delay.show) return self.show();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show();
    }, self.options.delay.show);
  };

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true;
    }

    return false;
  };

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false;
    }

    if (self.isInStateTrue()) return;

    clearTimeout(self.timeout);

    self.hoverState = 'out';

    if (!self.options.delay || !self.options.delay.hide) return self.hide();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide();
    }, self.options.delay.hide);
  };

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type);

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
      if (e.isDefaultPrevented() || !inDom) return;
      var that = this;

      var $tip = this.tip();

      var tipId = this.getUID(this.type);

      this.setContent();
      $tip.attr('id', tipId);
      this.$element.attr('aria-describedby', tipId);

      if (this.options.animation) $tip.addClass('fade');

      var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;

      var autoToken = /\s?auto?\s?/i;
      var autoPlace = autoToken.test(placement);
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

      $tip.detach().css({ top: 0, left: 0, display: 'block' }).addClass(placement).data('bs.' + this.type, this);

      this.options.container ? $tip.appendTo($(document).find(this.options.container)) : $tip.insertAfter(this.$element);
      this.$element.trigger('inserted.bs.' + this.type);

      var pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;

      if (autoPlace) {
        var orgPlacement = placement;
        var viewportDim = this.getPosition(this.$viewport);

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' : placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' : placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' : placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' : placement;

        $tip.removeClass(orgPlacement).addClass(placement);
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

      this.applyPlacement(calculatedOffset, placement);

      var complete = function complete() {
        var prevHoverState = that.hoverState;
        that.$element.trigger('shown.bs.' + that.type);
        that.hoverState = null;

        if (prevHoverState == 'out') that.leave(that);
      };

      $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
    }
  };

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip = this.tip();
    var width = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10);
    var marginLeft = parseInt($tip.css('margin-left'), 10);

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop)) marginTop = 0;
    if (isNaN(marginLeft)) marginLeft = 0;

    offset.top += marginTop;
    offset.left += marginLeft;

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function using(props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        });
      }
    }, offset), 0);

    $tip.addClass('in');

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight;
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

    if (delta.left) offset.left += delta.left;else offset.top += delta.top;

    var isVertical = /top|bottom/.test(placement);
    var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

    $tip.offset(offset);
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
  };

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow().css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%').css(isVertical ? 'top' : 'left', '');
  };

  Tooltip.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();

    if (this.options.html) {
      if (this.options.sanitize) {
        title = sanitizeHtml(title, this.options.whiteList, this.options.sanitizeFn);
      }

      $tip.find('.tooltip-inner').html(title);
    } else {
      $tip.find('.tooltip-inner').text(title);
    }

    $tip.removeClass('fade in top bottom left right');
  };

  Tooltip.prototype.hide = function (callback) {
    var that = this;
    var $tip = $(this.$tip);
    var e = $.Event('hide.bs.' + this.type);

    function complete() {
      if (that.hoverState != 'in') $tip.detach();
      if (that.$element) {
        // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element.removeAttr('aria-describedby').trigger('hidden.bs.' + that.type);
      }
      callback && callback();
    }

    this.$element.trigger(e);

    if (e.isDefaultPrevented()) return;

    $tip.removeClass('in');

    $.support.transition && $tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();

    this.hoverState = null;

    return this;
  };

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element;
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
    }
  };

  Tooltip.prototype.hasContent = function () {
    return this.getTitle();
  };

  Tooltip.prototype.getPosition = function ($element) {
    $element = $element || this.$element;

    var el = $element[0];
    var isBody = el.tagName == 'BODY';

    var elRect = el.getBoundingClientRect();
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement;
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset = isBody ? { top: 0, left: 0 } : isSvg ? null : $element.offset();
    var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

    return $.extend({}, elRect, scroll, outerDims, elOffset);
  };

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
    /* placement == 'right' */{ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
  };

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 };
    if (!this.$viewport) return delta;

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
    var viewportDimensions = this.getPosition(this.$viewport);

    if (/right|left/.test(placement)) {
      var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
      if (topEdgeOffset < viewportDimensions.top) {
        // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset;
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
        // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
      }
    } else {
      var leftEdgeOffset = pos.left - viewportPadding;
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
      if (leftEdgeOffset < viewportDimensions.left) {
        // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset;
      } else if (rightEdgeOffset > viewportDimensions.right) {
        // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
      }
    }

    return delta;
  };

  Tooltip.prototype.getTitle = function () {
    var title;
    var $e = this.$element;
    var o = this.options;

    title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

    return title;
  };

  Tooltip.prototype.getUID = function (prefix) {
    do {
      prefix += ~~(Math.random() * 1000000);
    } while (document.getElementById(prefix));
    return prefix;
  };

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template);
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!');
      }
    }
    return this.$tip;
  };

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
  };

  Tooltip.prototype.enable = function () {
    this.enabled = true;
  };

  Tooltip.prototype.disable = function () {
    this.enabled = false;
  };

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  };

  Tooltip.prototype.toggle = function (e) {
    var self = this;
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type);
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data('bs.' + this.type, self);
      }
    }

    if (e) {
      self.inState.click = !self.inState.click;
      if (self.isInStateTrue()) self.enter(self);else self.leave(self);
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
    }
  };

  Tooltip.prototype.destroy = function () {
    var that = this;
    clearTimeout(this.timeout);
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type);
      if (that.$tip) {
        that.$tip.detach();
      }
      that.$tip = null;
      that.$arrow = null;
      that.$viewport = null;
      that.$element = null;
    });
  };

  Tooltip.prototype.sanitizeHtml = function (unsafeHtml) {
    return sanitizeHtml(unsafeHtml, this.options.whiteList, this.options.sanitizeFn);
  };

  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tooltip');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.tooltip', data = new Tooltip(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tooltip;

  $.fn.tooltip = Plugin;
  $.fn.tooltip.Constructor = Tooltip;

  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };
}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function Popover(element, options) {
    this.init('popover', element, options);
  };

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

  Popover.VERSION = '3.4.1';

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });

  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

  Popover.prototype.constructor = Popover;

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS;
  };

  Popover.prototype.setContent = function () {
    var $tip = this.tip();
    var title = this.getTitle();
    var content = this.getContent();

    if (this.options.html) {
      var typeContent = typeof content === 'undefined' ? 'undefined' : _typeof(content);

      if (this.options.sanitize) {
        title = this.sanitizeHtml(title);

        if (typeContent === 'string') {
          content = this.sanitizeHtml(content);
        }
      }

      $tip.find('.popover-title').html(title);
      $tip.find('.popover-content').children().detach().end()[typeContent === 'string' ? 'html' : 'append'](content);
    } else {
      $tip.find('.popover-title').text(title);
      $tip.find('.popover-content').children().detach().end().text(content);
    }

    $tip.removeClass('fade top bottom left right in');

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
  };

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent();
  };

  Popover.prototype.getContent = function () {
    var $e = this.$element;
    var o = this.options;

    return $e.attr('data-content') || (typeof o.content == 'function' ? o.content.call($e[0]) : o.content);
  };

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow');
  };

  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.popover');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.popover', data = new Popover(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.popover;

  $.fn.popover = Plugin;
  $.fn.popover.Constructor = Popover;

  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };
}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body = $(document.body);
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element);
    this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
    this.selector = (this.options.target || '') + ' .nav li > a';
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this));
    this.refresh();
    this.process();
  }

  ScrollSpy.VERSION = '3.4.1';

  ScrollSpy.DEFAULTS = {
    offset: 10
  };

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
  };

  ScrollSpy.prototype.refresh = function () {
    var that = this;
    var offsetMethod = 'offset';
    var offsetBase = 0;

    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position';
      offsetBase = this.$scrollElement.scrollTop();
    }

    this.$body.find(this.selector).map(function () {
      var $el = $(this);
      var href = $el.data('target') || $el.attr('href');
      var $href = /^#./.test(href) && $(href);

      return $href && $href.length && $href.is(':visible') && [[$href[offsetMethod]().top + offsetBase, href]] || null;
    }).sort(function (a, b) {
      return a[0] - b[0];
    }).each(function () {
      that.offsets.push(this[0]);
      that.targets.push(this[1]);
    });
  };

  ScrollSpy.prototype.process = function () {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
    var scrollHeight = this.getScrollHeight();
    var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
    var offsets = this.offsets;
    var targets = this.targets;
    var activeTarget = this.activeTarget;
    var i;

    if (this.scrollHeight != scrollHeight) {
      this.refresh();
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null;
      return this.clear();
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i] && scrollTop >= offsets[i] && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) && this.activate(targets[i]);
    }
  };

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target;

    this.clear();

    var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';

    var active = $(selector).parents('li').addClass('active');

    if (active.parent('.dropdown-menu').length) {
      active = active.closest('li.dropdown').addClass('active');
    }

    active.trigger('activate.bs.scrollspy');
  };

  ScrollSpy.prototype.clear = function () {
    $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active');
  };

  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.scrollspy');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.scrollspy', data = new ScrollSpy(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.scrollspy;

  $.fn.scrollspy = Plugin;
  $.fn.scrollspy.Constructor = ScrollSpy;

  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old;
    return this;
  };

  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this);
      Plugin.call($spy, $spy.data());
    });
  });
}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function Tab(element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element);
    // jscs:enable requireDollarBeforejQueryAssignment
  };

  Tab.VERSION = '3.4.1';

  Tab.TRANSITION_DURATION = 150;

  Tab.prototype.show = function () {
    var $this = this.element;
    var $ul = $this.closest('ul:not(.dropdown-menu)');
    var selector = $this.data('target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return;

    var $previous = $ul.find('.active:last a');
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    });
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    });

    $previous.trigger(hideEvent);
    $this.trigger(showEvent);

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

    var $target = $(document).find(selector);

    this.activate($this.closest('li'), $ul);
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      });
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      });
    });
  };

  Tab.prototype.activate = function (element, container, callback) {
    var $active = container.find('> .active');
    var transition = callback && $.support.transition && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);

    function next() {
      $active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', false);

      element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded', true);

      if (transition) {
        element[0].offsetWidth; // reflow for transition
        element.addClass('in');
      } else {
        element.removeClass('fade');
      }

      if (element.parent('.dropdown-menu').length) {
        element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', true);
      }

      callback && callback();
    }

    $active.length && transition ? $active.one('bsTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next();

    $active.removeClass('in');
  };

  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.tab');

      if (!data) $this.data('bs.tab', data = new Tab(this));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.tab;

  $.fn.tab = Plugin;
  $.fn.tab.Constructor = Tab;

  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };

  // TAB DATA-API
  // ============

  var clickHandler = function clickHandler(e) {
    e.preventDefault();
    Plugin.call($(this), 'show');
  };

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler).on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler);
}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#affix
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function Affix(element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options);

    var target = this.options.target === Affix.DEFAULTS.target ? $(this.options.target) : $(document).find(this.options.target);

    this.$target = target.on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this));

    this.$element = $(element);
    this.affixed = null;
    this.unpin = null;
    this.pinnedOffset = null;

    this.checkPosition();
  };

  Affix.VERSION = '3.4.1';

  Affix.RESET = 'affix affix-top affix-bottom';

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  };

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    var targetHeight = this.$target.height();

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false;

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : 'bottom';
      return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : 'bottom';
    }

    var initializing = this.affixed == null;
    var colliderTop = initializing ? scrollTop : position.top;
    var colliderHeight = initializing ? targetHeight : height;

    if (offsetTop != null && scrollTop <= offsetTop) return 'top';
    if (offsetBottom != null && colliderTop + colliderHeight >= scrollHeight - offsetBottom) return 'bottom';

    return false;
  };

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.$element.removeClass(Affix.RESET).addClass('affix');
    var scrollTop = this.$target.scrollTop();
    var position = this.$element.offset();
    return this.pinnedOffset = position.top - scrollTop;
  };

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1);
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return;

    var height = this.$element.height();
    var offset = this.options.offset;
    var offsetTop = offset.top;
    var offsetBottom = offset.bottom;
    var scrollHeight = Math.max($(document).height(), $(document.body).height());

    if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) != 'object') offsetBottom = offsetTop = offset;
    if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element);
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element);

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '');

      var affixType = 'affix' + (affix ? '-' + affix : '');
      var e = $.Event(affixType + '.bs.affix');

      this.$element.trigger(e);

      if (e.isDefaultPrevented()) return;

      this.affixed = affix;
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null;

      this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix', 'affixed') + '.bs.affix');
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      });
    }
  };

  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.affix');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.affix', data = new Affix(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.affix;

  $.fn.affix = Plugin;
  $.fn.affix.Constructor = Affix;

  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this;
  };

  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this);
      var data = $spy.data();

      data.offset = data.offset || {};

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
      if (data.offsetTop != null) data.offset.top = data.offsetTop;

      Plugin.call($spy, data);
    });
  });
}(jQuery);
'use strict';

// |--------------------------------------------------------------------------
// | Flexy header
// |--------------------------------------------------------------------------
// |
// | This jQuery script is written by
// |
// | Morten Nissen
// | hjemmesidekongen.dk
// |

var flexy_header = function ($) {
    'use strict';

    var pub = {},
        $header_static = $('.flexy-header--static'),
        $header_sticky = $('.flexy-header--sticky'),
        options = {
        update_interval: 100,
        tolerance: {
            upward: 20,
            downward: 10
        },
        offset: _get_offset_from_elements_bottom($header_static),
        classes: {
            pinned: "flexy-header--pinned",
            unpinned: "flexy-header--unpinned"
        }
    },
        was_scrolled = false,
        last_distance_from_top = 0;

    /**
     * Instantiate
     */
    pub.init = function (options) {
        registerEventHandlers();
        registerBootEventHandlers();
    };

    /**
     * Register boot event handlers
     */
    function registerBootEventHandlers() {
        $header_sticky.addClass(options.classes.unpinned);

        setInterval(function () {

            if (was_scrolled) {
                document_was_scrolled();

                was_scrolled = false;
            }
        }, options.update_interval);
    }

    /**
     * Register event handlers
     */
    function registerEventHandlers() {
        $(window).scroll(function (event) {
            was_scrolled = true;
        });
    }

    /**
     * Get offset from element bottom
     */
    function _get_offset_from_elements_bottom($element) {
        var element_height = $element.outerHeight(true),
            element_offset = $element.offset().top;

        return element_height + element_offset;
    }

    /**
     * Document was scrolled
     */
    function document_was_scrolled() {
        var current_distance_from_top = $(window).scrollTop();

        // If past offset
        if (current_distance_from_top >= options.offset) {

            // Downwards scroll
            if (current_distance_from_top > last_distance_from_top) {

                // Obey the downward tolerance
                if (Math.abs(current_distance_from_top - last_distance_from_top) <= options.tolerance.downward) {
                    return;
                }

                $header_sticky.removeClass(options.classes.pinned).addClass(options.classes.unpinned);
            }

            // Upwards scroll
            else {

                    // Obey the upward tolerance
                    if (Math.abs(current_distance_from_top - last_distance_from_top) <= options.tolerance.upward) {
                        return;
                    }

                    // We are not scrolled past the document which is possible on the Mac
                    if (current_distance_from_top + $(window).height() < $(document).height()) {
                        $header_sticky.removeClass(options.classes.unpinned).addClass(options.classes.pinned);
                    }
                }
        }

        // Not past offset
        else {
                $header_sticky.removeClass(options.classes.pinned).addClass(options.classes.unpinned);
            }

        last_distance_from_top = current_distance_from_top;
    }

    return pub;
}(jQuery);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
  var AjaxMonitor,
      Bar,
      DocumentMonitor,
      ElementMonitor,
      ElementTracker,
      EventLagMonitor,
      Evented,
      Events,
      NoTargetError,
      Pace,
      RequestIntercept,
      SOURCE_KEYS,
      Scaler,
      SocketRequestTracker,
      XHRRequestTracker,
      animation,
      avgAmplitude,
      bar,
      cancelAnimation,
      cancelAnimationFrame,
      defaultOptions,
      _extend,
      extendNative,
      getFromDOM,
      getIntercept,
      handlePushState,
      ignoreStack,
      init,
      now,
      options,
      requestAnimationFrame,
      result,
      runAnimation,
      scalers,
      shouldIgnoreURL,
      shouldTrack,
      source,
      sources,
      uniScaler,
      _WebSocket,
      _XDomainRequest,
      _XMLHttpRequest,
      _i,
      _intercept,
      _len,
      _pushState,
      _ref,
      _ref1,
      _replaceState,
      __slice = [].slice,
      __hasProp = {}.hasOwnProperty,
      __extends = function __extends(child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key)) child[key] = parent[key];
    }function ctor() {
      this.constructor = child;
    }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
  },
      __indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i;
    }return -1;
  };

  defaultOptions = {
    catchupTime: 100,
    initialRate: .03,
    minTime: 250,
    ghostTime: 100,
    maxProgressPerFrame: 20,
    easeFactor: 1.25,
    startOnPageLoad: true,
    restartOnPushState: true,
    restartOnRequestAfter: 500,
    target: 'body',
    elements: {
      checkInterval: 100,
      selectors: ['body']
    },
    eventLag: {
      minSamples: 10,
      sampleCount: 3,
      lagThreshold: 3
    },
    ajax: {
      trackMethods: ['GET'],
      trackWebSockets: true,
      ignoreURLs: []
    }
  };

  now = function now() {
    var _ref;
    return (_ref = typeof performance !== "undefined" && performance !== null ? typeof performance.now === "function" ? performance.now() : void 0 : void 0) != null ? _ref : +new Date();
  };

  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  if (requestAnimationFrame == null) {
    requestAnimationFrame = function requestAnimationFrame(fn) {
      return setTimeout(fn, 50);
    };
    cancelAnimationFrame = function cancelAnimationFrame(id) {
      return clearTimeout(id);
    };
  }

  runAnimation = function runAnimation(fn) {
    var last, _tick;
    last = now();
    _tick = function tick() {
      var diff;
      diff = now() - last;
      if (diff >= 33) {
        last = now();
        return fn(diff, function () {
          return requestAnimationFrame(_tick);
        });
      } else {
        return setTimeout(_tick, 33 - diff);
      }
    };
    return _tick();
  };

  result = function result() {
    var args, key, obj;
    obj = arguments[0], key = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (typeof obj[key] === 'function') {
      return obj[key].apply(obj, args);
    } else {
      return obj[key];
    }
  };

  _extend = function extend() {
    var key, out, source, sources, val, _i, _len;
    out = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      if (source) {
        for (key in source) {
          if (!__hasProp.call(source, key)) continue;
          val = source[key];
          if (out[key] != null && _typeof(out[key]) === 'object' && val != null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
            _extend(out[key], val);
          } else {
            out[key] = val;
          }
        }
      }
    }
    return out;
  };

  avgAmplitude = function avgAmplitude(arr) {
    var count, sum, v, _i, _len;
    sum = count = 0;
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      v = arr[_i];
      sum += Math.abs(v);
      count++;
    }
    return sum / count;
  };

  getFromDOM = function getFromDOM(key, json) {
    var data, e, el;
    if (key == null) {
      key = 'options';
    }
    if (json == null) {
      json = true;
    }
    el = document.querySelector("[data-pace-" + key + "]");
    if (!el) {
      return;
    }
    data = el.getAttribute("data-pace-" + key);
    if (!json) {
      return data;
    }
    try {
      return JSON.parse(data);
    } catch (_error) {
      e = _error;
      return typeof console !== "undefined" && console !== null ? console.error("Error parsing inline pace options", e) : void 0;
    }
  };

  Evented = function () {
    function Evented() {}

    Evented.prototype.on = function (event, handler, ctx, once) {
      var _base;
      if (once == null) {
        once = false;
      }
      if (this.bindings == null) {
        this.bindings = {};
      }
      if ((_base = this.bindings)[event] == null) {
        _base[event] = [];
      }
      return this.bindings[event].push({
        handler: handler,
        ctx: ctx,
        once: once
      });
    };

    Evented.prototype.once = function (event, handler, ctx) {
      return this.on(event, handler, ctx, true);
    };

    Evented.prototype.off = function (event, handler) {
      var i, _ref, _results;
      if (((_ref = this.bindings) != null ? _ref[event] : void 0) == null) {
        return;
      }
      if (handler == null) {
        return delete this.bindings[event];
      } else {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          if (this.bindings[event][i].handler === handler) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    Evented.prototype.trigger = function () {
      var args, ctx, event, handler, i, once, _ref, _ref1, _results;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if ((_ref = this.bindings) != null ? _ref[event] : void 0) {
        i = 0;
        _results = [];
        while (i < this.bindings[event].length) {
          _ref1 = this.bindings[event][i], handler = _ref1.handler, ctx = _ref1.ctx, once = _ref1.once;
          handler.apply(ctx != null ? ctx : this, args);
          if (once) {
            _results.push(this.bindings[event].splice(i, 1));
          } else {
            _results.push(i++);
          }
        }
        return _results;
      }
    };

    return Evented;
  }();

  Pace = window.Pace || {};

  window.Pace = Pace;

  _extend(Pace, Evented.prototype);

  options = Pace.options = _extend({}, defaultOptions, window.paceOptions, getFromDOM());

  _ref = ['ajax', 'document', 'eventLag', 'elements'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    source = _ref[_i];
    if (options[source] === true) {
      options[source] = defaultOptions[source];
    }
  }

  NoTargetError = function (_super) {
    __extends(NoTargetError, _super);

    function NoTargetError() {
      _ref1 = NoTargetError.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    return NoTargetError;
  }(Error);

  Bar = function () {
    function Bar() {
      this.progress = 0;
    }

    Bar.prototype.getElement = function () {
      var targetElement;
      if (this.el == null) {
        targetElement = document.querySelector(options.target);
        if (!targetElement) {
          throw new NoTargetError();
        }
        this.el = document.createElement('div');
        this.el.className = "pace pace-active";
        document.body.className = document.body.className.replace(/pace-done/g, '');
        document.body.className += ' pace-running';
        this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>';
        if (targetElement.firstChild != null) {
          targetElement.insertBefore(this.el, targetElement.firstChild);
        } else {
          targetElement.appendChild(this.el);
        }
      }
      return this.el;
    };

    Bar.prototype.finish = function () {
      var el;
      el = this.getElement();
      el.className = el.className.replace('pace-active', '');
      el.className += ' pace-inactive';
      document.body.className = document.body.className.replace('pace-running', '');
      return document.body.className += ' pace-done';
    };

    Bar.prototype.update = function (prog) {
      this.progress = prog;
      return this.render();
    };

    Bar.prototype.destroy = function () {
      try {
        this.getElement().parentNode.removeChild(this.getElement());
      } catch (_error) {
        NoTargetError = _error;
      }
      return this.el = void 0;
    };

    Bar.prototype.render = function () {
      var el, key, progressStr, transform, _j, _len1, _ref2;
      if (document.querySelector(options.target) == null) {
        return false;
      }
      el = this.getElement();
      transform = "translate3d(" + this.progress + "%, 0, 0)";
      _ref2 = ['webkitTransform', 'msTransform', 'transform'];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        key = _ref2[_j];
        el.children[0].style[key] = transform;
      }
      if (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) {
        el.children[0].setAttribute('data-progress-text', "" + (this.progress | 0) + "%");
        if (this.progress >= 100) {
          progressStr = '99';
        } else {
          progressStr = this.progress < 10 ? "0" : "";
          progressStr += this.progress | 0;
        }
        el.children[0].setAttribute('data-progress', "" + progressStr);
      }
      return this.lastRenderedProgress = this.progress;
    };

    Bar.prototype.done = function () {
      return this.progress >= 100;
    };

    return Bar;
  }();

  Events = function () {
    function Events() {
      this.bindings = {};
    }

    Events.prototype.trigger = function (name, val) {
      var binding, _j, _len1, _ref2, _results;
      if (this.bindings[name] != null) {
        _ref2 = this.bindings[name];
        _results = [];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          binding = _ref2[_j];
          _results.push(binding.call(this, val));
        }
        return _results;
      }
    };

    Events.prototype.on = function (name, fn) {
      var _base;
      if ((_base = this.bindings)[name] == null) {
        _base[name] = [];
      }
      return this.bindings[name].push(fn);
    };

    return Events;
  }();

  _XMLHttpRequest = window.XMLHttpRequest;

  _XDomainRequest = window.XDomainRequest;

  _WebSocket = window.WebSocket;

  extendNative = function extendNative(to, from) {
    var e, key, _results;
    _results = [];
    for (key in from.prototype) {
      try {
        if (to[key] == null && typeof from[key] !== 'function') {
          if (typeof Object.defineProperty === 'function') {
            _results.push(Object.defineProperty(to, key, {
              get: function get() {
                return from.prototype[key];
              },
              configurable: true,
              enumerable: true
            }));
          } else {
            _results.push(to[key] = from.prototype[key]);
          }
        } else {
          _results.push(void 0);
        }
      } catch (_error) {
        e = _error;
      }
    }
    return _results;
  };

  ignoreStack = [];

  Pace.ignore = function () {
    var args, fn, ret;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    ignoreStack.unshift('ignore');
    ret = fn.apply(null, args);
    ignoreStack.shift();
    return ret;
  };

  Pace.track = function () {
    var args, fn, ret;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    ignoreStack.unshift('track');
    ret = fn.apply(null, args);
    ignoreStack.shift();
    return ret;
  };

  shouldTrack = function shouldTrack(method) {
    var _ref2;
    if (method == null) {
      method = 'GET';
    }
    if (ignoreStack[0] === 'track') {
      return 'force';
    }
    if (!ignoreStack.length && options.ajax) {
      if (method === 'socket' && options.ajax.trackWebSockets) {
        return true;
      } else if (_ref2 = method.toUpperCase(), __indexOf.call(options.ajax.trackMethods, _ref2) >= 0) {
        return true;
      }
    }
    return false;
  };

  RequestIntercept = function (_super) {
    __extends(RequestIntercept, _super);

    function RequestIntercept() {
      var monitorXHR,
          _this = this;
      RequestIntercept.__super__.constructor.apply(this, arguments);
      monitorXHR = function monitorXHR(req) {
        var _open;
        _open = req.open;
        return req.open = function (type, url, async) {
          if (shouldTrack(type)) {
            _this.trigger('request', {
              type: type,
              url: url,
              request: req
            });
          }
          return _open.apply(req, arguments);
        };
      };
      window.XMLHttpRequest = function (flags) {
        var req;
        req = new _XMLHttpRequest(flags);
        monitorXHR(req);
        return req;
      };
      try {
        extendNative(window.XMLHttpRequest, _XMLHttpRequest);
      } catch (_error) {}
      if (_XDomainRequest != null) {
        window.XDomainRequest = function () {
          var req;
          req = new _XDomainRequest();
          monitorXHR(req);
          return req;
        };
        try {
          extendNative(window.XDomainRequest, _XDomainRequest);
        } catch (_error) {}
      }
      if (_WebSocket != null && options.ajax.trackWebSockets) {
        window.WebSocket = function (url, protocols) {
          var req;
          if (protocols != null) {
            req = new _WebSocket(url, protocols);
          } else {
            req = new _WebSocket(url);
          }
          if (shouldTrack('socket')) {
            _this.trigger('request', {
              type: 'socket',
              url: url,
              protocols: protocols,
              request: req
            });
          }
          return req;
        };
        try {
          extendNative(window.WebSocket, _WebSocket);
        } catch (_error) {}
      }
    }

    return RequestIntercept;
  }(Events);

  _intercept = null;

  getIntercept = function getIntercept() {
    if (_intercept == null) {
      _intercept = new RequestIntercept();
    }
    return _intercept;
  };

  shouldIgnoreURL = function shouldIgnoreURL(url) {
    var pattern, _j, _len1, _ref2;
    _ref2 = options.ajax.ignoreURLs;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      pattern = _ref2[_j];
      if (typeof pattern === 'string') {
        if (url.indexOf(pattern) !== -1) {
          return true;
        }
      } else {
        if (pattern.test(url)) {
          return true;
        }
      }
    }
    return false;
  };

  getIntercept().on('request', function (_arg) {
    var after, args, request, type, url;
    type = _arg.type, request = _arg.request, url = _arg.url;
    if (shouldIgnoreURL(url)) {
      return;
    }
    if (!Pace.running && (options.restartOnRequestAfter !== false || shouldTrack(type) === 'force')) {
      args = arguments;
      after = options.restartOnRequestAfter || 0;
      if (typeof after === 'boolean') {
        after = 0;
      }
      return setTimeout(function () {
        var stillActive, _j, _len1, _ref2, _ref3, _results;
        if (type === 'socket') {
          stillActive = request.readyState < 2;
        } else {
          stillActive = 0 < (_ref2 = request.readyState) && _ref2 < 4;
        }
        if (stillActive) {
          Pace.restart();
          _ref3 = Pace.sources;
          _results = [];
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            source = _ref3[_j];
            if (source instanceof AjaxMonitor) {
              source.watch.apply(source, args);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      }, after);
    }
  });

  AjaxMonitor = function () {
    function AjaxMonitor() {
      var _this = this;
      this.elements = [];
      getIntercept().on('request', function () {
        return _this.watch.apply(_this, arguments);
      });
    }

    AjaxMonitor.prototype.watch = function (_arg) {
      var request, tracker, type, url;
      type = _arg.type, request = _arg.request, url = _arg.url;
      if (shouldIgnoreURL(url)) {
        return;
      }
      if (type === 'socket') {
        tracker = new SocketRequestTracker(request);
      } else {
        tracker = new XHRRequestTracker(request);
      }
      return this.elements.push(tracker);
    };

    return AjaxMonitor;
  }();

  XHRRequestTracker = function () {
    function XHRRequestTracker(request) {
      var event,
          size,
          _j,
          _len1,
          _onreadystatechange,
          _ref2,
          _this = this;
      this.progress = 0;
      if (window.ProgressEvent != null) {
        size = null;
        request.addEventListener('progress', function (evt) {
          if (evt.lengthComputable) {
            return _this.progress = 100 * evt.loaded / evt.total;
          } else {
            return _this.progress = _this.progress + (100 - _this.progress) / 2;
          }
        }, false);
        _ref2 = ['load', 'abort', 'timeout', 'error'];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          event = _ref2[_j];
          request.addEventListener(event, function () {
            return _this.progress = 100;
          }, false);
        }
      } else {
        _onreadystatechange = request.onreadystatechange;
        request.onreadystatechange = function () {
          var _ref3;
          if ((_ref3 = request.readyState) === 0 || _ref3 === 4) {
            _this.progress = 100;
          } else if (request.readyState === 3) {
            _this.progress = 50;
          }
          return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
        };
      }
    }

    return XHRRequestTracker;
  }();

  SocketRequestTracker = function () {
    function SocketRequestTracker(request) {
      var event,
          _j,
          _len1,
          _ref2,
          _this = this;
      this.progress = 0;
      _ref2 = ['error', 'open'];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        event = _ref2[_j];
        request.addEventListener(event, function () {
          return _this.progress = 100;
        }, false);
      }
    }

    return SocketRequestTracker;
  }();

  ElementMonitor = function () {
    function ElementMonitor(options) {
      var selector, _j, _len1, _ref2;
      if (options == null) {
        options = {};
      }
      this.elements = [];
      if (options.selectors == null) {
        options.selectors = [];
      }
      _ref2 = options.selectors;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        selector = _ref2[_j];
        this.elements.push(new ElementTracker(selector));
      }
    }

    return ElementMonitor;
  }();

  ElementTracker = function () {
    function ElementTracker(selector) {
      this.selector = selector;
      this.progress = 0;
      this.check();
    }

    ElementTracker.prototype.check = function () {
      var _this = this;
      if (document.querySelector(this.selector)) {
        return this.done();
      } else {
        return setTimeout(function () {
          return _this.check();
        }, options.elements.checkInterval);
      }
    };

    ElementTracker.prototype.done = function () {
      return this.progress = 100;
    };

    return ElementTracker;
  }();

  DocumentMonitor = function () {
    DocumentMonitor.prototype.states = {
      loading: 0,
      interactive: 50,
      complete: 100
    };

    function DocumentMonitor() {
      var _onreadystatechange,
          _ref2,
          _this = this;
      this.progress = (_ref2 = this.states[document.readyState]) != null ? _ref2 : 100;
      _onreadystatechange = document.onreadystatechange;
      document.onreadystatechange = function () {
        if (_this.states[document.readyState] != null) {
          _this.progress = _this.states[document.readyState];
        }
        return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
      };
    }

    return DocumentMonitor;
  }();

  EventLagMonitor = function () {
    function EventLagMonitor() {
      var avg,
          interval,
          last,
          points,
          samples,
          _this = this;
      this.progress = 0;
      avg = 0;
      samples = [];
      points = 0;
      last = now();
      interval = setInterval(function () {
        var diff;
        diff = now() - last - 50;
        last = now();
        samples.push(diff);
        if (samples.length > options.eventLag.sampleCount) {
          samples.shift();
        }
        avg = avgAmplitude(samples);
        if (++points >= options.eventLag.minSamples && avg < options.eventLag.lagThreshold) {
          _this.progress = 100;
          return clearInterval(interval);
        } else {
          return _this.progress = 100 * (3 / (avg + 3));
        }
      }, 50);
    }

    return EventLagMonitor;
  }();

  Scaler = function () {
    function Scaler(source) {
      this.source = source;
      this.last = this.sinceLastUpdate = 0;
      this.rate = options.initialRate;
      this.catchup = 0;
      this.progress = this.lastProgress = 0;
      if (this.source != null) {
        this.progress = result(this.source, 'progress');
      }
    }

    Scaler.prototype.tick = function (frameTime, val) {
      var scaling;
      if (val == null) {
        val = result(this.source, 'progress');
      }
      if (val >= 100) {
        this.done = true;
      }
      if (val === this.last) {
        this.sinceLastUpdate += frameTime;
      } else {
        if (this.sinceLastUpdate) {
          this.rate = (val - this.last) / this.sinceLastUpdate;
        }
        this.catchup = (val - this.progress) / options.catchupTime;
        this.sinceLastUpdate = 0;
        this.last = val;
      }
      if (val > this.progress) {
        this.progress += this.catchup * frameTime;
      }
      scaling = 1 - Math.pow(this.progress / 100, options.easeFactor);
      this.progress += scaling * this.rate * frameTime;
      this.progress = Math.min(this.lastProgress + options.maxProgressPerFrame, this.progress);
      this.progress = Math.max(0, this.progress);
      this.progress = Math.min(100, this.progress);
      this.lastProgress = this.progress;
      return this.progress;
    };

    return Scaler;
  }();

  sources = null;

  scalers = null;

  bar = null;

  uniScaler = null;

  animation = null;

  cancelAnimation = null;

  Pace.running = false;

  handlePushState = function handlePushState() {
    if (options.restartOnPushState) {
      return Pace.restart();
    }
  };

  if (window.history.pushState != null) {
    _pushState = window.history.pushState;
    window.history.pushState = function () {
      handlePushState();
      return _pushState.apply(window.history, arguments);
    };
  }

  if (window.history.replaceState != null) {
    _replaceState = window.history.replaceState;
    window.history.replaceState = function () {
      handlePushState();
      return _replaceState.apply(window.history, arguments);
    };
  }

  SOURCE_KEYS = {
    ajax: AjaxMonitor,
    elements: ElementMonitor,
    document: DocumentMonitor,
    eventLag: EventLagMonitor
  };

  (init = function init() {
    var type, _j, _k, _len1, _len2, _ref2, _ref3, _ref4;
    Pace.sources = sources = [];
    _ref2 = ['ajax', 'elements', 'document', 'eventLag'];
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      type = _ref2[_j];
      if (options[type] !== false) {
        sources.push(new SOURCE_KEYS[type](options[type]));
      }
    }
    _ref4 = (_ref3 = options.extraSources) != null ? _ref3 : [];
    for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
      source = _ref4[_k];
      sources.push(new source(options));
    }
    Pace.bar = bar = new Bar();
    scalers = [];
    return uniScaler = new Scaler();
  })();

  Pace.stop = function () {
    Pace.trigger('stop');
    Pace.running = false;
    bar.destroy();
    cancelAnimation = true;
    if (animation != null) {
      if (typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(animation);
      }
      animation = null;
    }
    return init();
  };

  Pace.restart = function () {
    Pace.trigger('restart');
    Pace.stop();
    return Pace.start();
  };

  Pace.go = function () {
    var start;
    Pace.running = true;
    bar.render();
    start = now();
    cancelAnimation = false;
    return animation = runAnimation(function (frameTime, enqueueNextFrame) {
      var avg, count, done, element, elements, i, j, remaining, scaler, scalerList, sum, _j, _k, _len1, _len2, _ref2;
      remaining = 100 - bar.progress;
      count = sum = 0;
      done = true;
      for (i = _j = 0, _len1 = sources.length; _j < _len1; i = ++_j) {
        source = sources[i];
        scalerList = scalers[i] != null ? scalers[i] : scalers[i] = [];
        elements = (_ref2 = source.elements) != null ? _ref2 : [source];
        for (j = _k = 0, _len2 = elements.length; _k < _len2; j = ++_k) {
          element = elements[j];
          scaler = scalerList[j] != null ? scalerList[j] : scalerList[j] = new Scaler(element);
          done &= scaler.done;
          if (scaler.done) {
            continue;
          }
          count++;
          sum += scaler.tick(frameTime);
        }
      }
      avg = sum / count;
      bar.update(uniScaler.tick(frameTime, avg));
      if (bar.done() || done || cancelAnimation) {
        bar.update(100);
        Pace.trigger('done');
        return setTimeout(function () {
          bar.finish();
          Pace.running = false;
          return Pace.trigger('hide');
        }, Math.max(options.ghostTime, Math.max(options.minTime - (now() - start), 0)));
      } else {
        return enqueueNextFrame();
      }
    });
  };

  Pace.start = function (_options) {
    _extend(options, _options);
    Pace.running = true;
    try {
      bar.render();
    } catch (_error) {
      NoTargetError = _error;
    }
    if (!document.querySelector('.pace')) {
      return setTimeout(Pace.start, 50);
    } else {
      Pace.trigger('start');
      return Pace.go();
    }
  };

  if (typeof define === 'function' && define.amd) {
    define(['pace'], function () {
      return Pace;
    });
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = Pace;
  } else {
    if (options.startOnPageLoad) {
      Pace.start();
    }
  }
}).call(undefined);
"use strict";

!function (e) {
  var t;e.fn.slinky = function (a) {
    var s = e.extend({ label: "Back", title: !1, speed: 300, resize: !0 }, a),
        i = e(this),
        n = i.children().first();i.addClass("slinky-menu");var r = function r(e, t) {
      var a = Math.round(parseInt(n.get(0).style.left)) || 0;n.css("left", a - 100 * e + "%"), "function" == typeof t && setTimeout(t, s.speed);
    },
        l = function l(e) {
      i.height(e.outerHeight());
    },
        d = function d(e) {
      i.css("transition-duration", e + "ms"), n.css("transition-duration", e + "ms");
    };if (d(s.speed), e("a + ul", i).prev().addClass("next"), e("li > ul", i).prepend('<li class="header">'), s.title === !0 && e("li > ul", i).each(function () {
      var t = e(this).parent().find("a").first().text(),
          a = e("<h2>").text(t);e("> .header", this).append(a);
    }), s.title || s.label !== !0) {
      var o = e("<a>").text(s.label).prop("href", "#").addClass("back");e(".header", i).append(o);
    } else e("li > ul", i).each(function () {
      var t = e(this).parent().find("a").first().text(),
          a = e("<a>").text(t).prop("href", "#").addClass("back");e("> .header", this).append(a);
    });e("a", i).on("click", function (a) {
      if (!(t + s.speed > Date.now())) {
        t = Date.now();var n = e(this);/#/.test(this.href) && a.preventDefault(), n.hasClass("next") ? (i.find(".active").removeClass("active"), n.next().show().addClass("active"), r(1), s.resize && l(n.next())) : n.hasClass("back") && (r(-1, function () {
          i.find(".active").removeClass("active"), n.parent().parent().hide().parentsUntil(i, "ul").first().addClass("active");
        }), s.resize && l(n.parent().parent().parentsUntil(i, "ul")));
      }
    }), this.jump = function (t, a) {
      t = e(t);var n = i.find(".active");n = n.length > 0 ? n.parentsUntil(i, "ul").length : 0, i.find("ul").removeClass("active").hide();var o = t.parentsUntil(i, "ul");o.show(), t.show().addClass("active"), a === !1 && d(0), r(o.length - n), s.resize && l(t), a === !1 && d(s.speed);
    }, this.home = function (t) {
      t === !1 && d(0);var a = i.find(".active"),
          n = a.parentsUntil(i, "li").length;n > 0 && (r(-n, function () {
        a.removeClass("active");
      }), s.resize && l(e(a.parentsUntil(i, "li").get(n - 1)).parent())), t === !1 && d(s.speed);
    }, this.destroy = function () {
      e(".header", i).remove(), e("a", i).removeClass("next").off("click"), i.removeClass("slinky-menu").css("transition-duration", ""), n.css("transition-duration", "");
    };var c = i.find(".active");return c.length > 0 && (c.removeClass("active"), this.jump(c, !1)), this;
  };
}(jQuery);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var tns = function () {
  // Object.keys
  if (!Object.keys) {
    Object.keys = function (object) {
      var keys = [];
      for (var name in object) {
        if (Object.prototype.hasOwnProperty.call(object, name)) {
          keys.push(name);
        }
      }
      return keys;
    };
  }

  // ChildNode.remove
  if (!("remove" in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  var win = window;

  var raf = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || function (cb) {
    return setTimeout(cb, 16);
  };

  var win$1 = window;

  var caf = win$1.cancelAnimationFrame || win$1.mozCancelAnimationFrame || function (id) {
    clearTimeout(id);
  };

  function extend() {
    var obj,
        name,
        copy,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length;

    for (; i < length; i++) {
      if ((obj = arguments[i]) !== null) {
        for (name in obj) {
          copy = obj[name];

          if (target === copy) {
            continue;
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }

  function checkStorageValue(value) {
    return ['true', 'false'].indexOf(value) >= 0 ? JSON.parse(value) : value;
  }

  function setLocalStorage(storage, key, value, access) {
    if (access) {
      try {
        storage.setItem(key, value);
      } catch (e) {}
    }
    return value;
  }

  function getSlideId() {
    var id = window.tnsId;
    window.tnsId = !id ? 1 : id + 1;

    return 'tns' + window.tnsId;
  }

  function getBody() {
    var doc = document,
        body = doc.body;

    if (!body) {
      body = doc.createElement('body');
      body.fake = true;
    }

    return body;
  }

  var docElement = document.documentElement;

  function setFakeBody(body) {
    var docOverflow = '';
    if (body.fake) {
      docOverflow = docElement.style.overflow;
      //avoid crashing IE8, if background image is used
      body.style.background = '';
      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
      body.style.overflow = docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    return docOverflow;
  }

  function resetFakeBody(body, docOverflow) {
    if (body.fake) {
      body.remove();
      docElement.style.overflow = docOverflow;
      // Trigger layout so kinetic scrolling isn't disabled in iOS6+
      // eslint-disable-next-line
      docElement.offsetHeight;
    }
  }

  // get css-calc 

  function calc() {
    var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        div = doc.createElement('div'),
        result = false;

    body.appendChild(div);
    try {
      var str = '(10px * 10)',
          vals = ['calc' + str, '-moz-calc' + str, '-webkit-calc' + str],
          val;
      for (var i = 0; i < 3; i++) {
        val = vals[i];
        div.style.width = val;
        if (div.offsetWidth === 100) {
          result = val.replace(str, '');
          break;
        }
      }
    } catch (e) {}

    body.fake ? resetFakeBody(body, docOverflow) : div.remove();

    return result;
  }

  // get subpixel support value

  function percentageLayout() {
    // check subpixel layout supporting
    var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        wrapper = doc.createElement('div'),
        outer = doc.createElement('div'),
        str = '',
        count = 70,
        perPage = 3,
        supported = false;

    wrapper.className = "tns-t-subp2";
    outer.className = "tns-t-ct";

    for (var i = 0; i < count; i++) {
      str += '<div></div>';
    }

    outer.innerHTML = str;
    wrapper.appendChild(outer);
    body.appendChild(wrapper);

    supported = Math.abs(wrapper.getBoundingClientRect().left - outer.children[count - perPage].getBoundingClientRect().left) < 2;

    body.fake ? resetFakeBody(body, docOverflow) : wrapper.remove();

    return supported;
  }

  function mediaquerySupport() {
    var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        div = doc.createElement('div'),
        style = doc.createElement('style'),
        rule = '@media all and (min-width:1px){.tns-mq-test{position:absolute}}',
        position;

    style.type = 'text/css';
    div.className = 'tns-mq-test';

    body.appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(doc.createTextNode(rule));
    }

    position = window.getComputedStyle ? window.getComputedStyle(div).position : div.currentStyle['position'];

    body.fake ? resetFakeBody(body, docOverflow) : div.remove();

    return position === "absolute";
  }

  // create and append style sheet
  function createStyleSheet(media) {
    // Create the <style> tag
    var style = document.createElement("style");
    // style.setAttribute("type", "text/css");

    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute("media", "screen")
    // style.setAttribute("media", "only screen and (max-width : 1024px)")
    if (media) {
      style.setAttribute("media", media);
    }

    // WebKit hack :(
    // style.appendChild(document.createTextNode(""));

    // Add the <style> element to the page
    document.querySelector('head').appendChild(style);

    return style.sheet ? style.sheet : style.styleSheet;
  }

  // cross browsers addRule method
  function addCSSRule(sheet, selector, rules, index) {
    // return raf(function() {
    'insertRule' in sheet ? sheet.insertRule(selector + '{' + rules + '}', index) : sheet.addRule(selector, rules, index);
    // });
  }

  // cross browsers addRule method
  function removeCSSRule(sheet, index) {
    // return raf(function() {
    'deleteRule' in sheet ? sheet.deleteRule(index) : sheet.removeRule(index);
    // });
  }

  function getCssRulesLength(sheet) {
    var rule = 'insertRule' in sheet ? sheet.cssRules : sheet.rules;
    return rule.length;
  }

  function toDegree(y, x) {
    return Math.atan2(y, x) * (180 / Math.PI);
  }

  function getTouchDirection(angle, range) {
    var direction = false,
        gap = Math.abs(90 - Math.abs(angle));

    if (gap >= 90 - range) {
      direction = 'horizontal';
    } else if (gap <= range) {
      direction = 'vertical';
    }

    return direction;
  }

  // https://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
  function forEach(arr, callback, scope) {
    for (var i = 0, l = arr.length; i < l; i++) {
      callback.call(scope, arr[i], i);
    }
  }

  var classListSupport = 'classList' in document.createElement('_');

  var hasClass = classListSupport ? function (el, str) {
    return el.classList.contains(str);
  } : function (el, str) {
    return el.className.indexOf(str) >= 0;
  };

  var addClass = classListSupport ? function (el, str) {
    if (!hasClass(el, str)) {
      el.classList.add(str);
    }
  } : function (el, str) {
    if (!hasClass(el, str)) {
      el.className += ' ' + str;
    }
  };

  var removeClass = classListSupport ? function (el, str) {
    if (hasClass(el, str)) {
      el.classList.remove(str);
    }
  } : function (el, str) {
    if (hasClass(el, str)) {
      el.className = el.className.replace(str, '');
    }
  };

  function hasAttr(el, attr) {
    return el.hasAttribute(attr);
  }

  function getAttr(el, attr) {
    return el.getAttribute(attr);
  }

  function isNodeList(el) {
    // Only NodeList has the "item()" function
    return typeof el.item !== "undefined";
  }

  function setAttrs(els, attrs) {
    els = isNodeList(els) || els instanceof Array ? els : [els];
    if (Object.prototype.toString.call(attrs) !== '[object Object]') {
      return;
    }

    for (var i = els.length; i--;) {
      for (var key in attrs) {
        els[i].setAttribute(key, attrs[key]);
      }
    }
  }

  function removeAttrs(els, attrs) {
    els = isNodeList(els) || els instanceof Array ? els : [els];
    attrs = attrs instanceof Array ? attrs : [attrs];

    var attrLength = attrs.length;
    for (var i = els.length; i--;) {
      for (var j = attrLength; j--;) {
        els[i].removeAttribute(attrs[j]);
      }
    }
  }

  function arrayFromNodeList(nl) {
    var arr = [];
    for (var i = 0, l = nl.length; i < l; i++) {
      arr.push(nl[i]);
    }
    return arr;
  }

  function hideElement(el, forceHide) {
    if (el.style.display !== 'none') {
      el.style.display = 'none';
    }
  }

  function showElement(el, forceHide) {
    if (el.style.display === 'none') {
      el.style.display = '';
    }
  }

  function isVisible(el) {
    return window.getComputedStyle(el).display !== 'none';
  }

  function whichProperty(props) {
    if (typeof props === 'string') {
      var arr = [props],
          Props = props.charAt(0).toUpperCase() + props.substr(1),
          prefixes = ['Webkit', 'Moz', 'ms', 'O'];

      prefixes.forEach(function (prefix) {
        if (prefix !== 'ms' || props === 'transform') {
          arr.push(prefix + Props);
        }
      });

      props = arr;
    }

    var el = document.createElement('fakeelement'),
        len = props.length;
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      if (el.style[prop] !== undefined) {
        return prop;
      }
    }

    return false; // explicit for ie9-
  }

  function has3DTransforms(tf) {
    if (!tf) {
      return false;
    }
    if (!window.getComputedStyle) {
      return false;
    }

    var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        el = doc.createElement('p'),
        has3d,
        cssTF = tf.length > 9 ? '-' + tf.slice(0, -9).toLowerCase() + '-' : '';

    cssTF += 'transform';

    // Add it to the body to get the computed style
    body.insertBefore(el, null);

    el.style[tf] = 'translate3d(1px,1px,1px)';
    has3d = window.getComputedStyle(el).getPropertyValue(cssTF);

    body.fake ? resetFakeBody(body, docOverflow) : el.remove();

    return has3d !== undefined && has3d.length > 0 && has3d !== "none";
  }

  // get transitionend, animationend based on transitionDuration
  // @propin: string
  // @propOut: string, first-letter uppercase
  // Usage: getEndProperty('WebkitTransitionDuration', 'Transition') => webkitTransitionEnd
  function getEndProperty(propIn, propOut) {
    var endProp = false;
    if (/^Webkit/.test(propIn)) {
      endProp = 'webkit' + propOut + 'End';
    } else if (/^O/.test(propIn)) {
      endProp = 'o' + propOut + 'End';
    } else if (propIn) {
      endProp = propOut.toLowerCase() + 'end';
    }
    return endProp;
  }

  // Test via a getter in the options object to see if the passive property is accessed
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function get() {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {}
  var passiveOption = supportsPassive ? { passive: true } : false;

  function addEvents(el, obj, preventScrolling) {
    for (var prop in obj) {
      var option = ['touchstart', 'touchmove'].indexOf(prop) >= 0 && !preventScrolling ? passiveOption : false;
      el.addEventListener(prop, obj[prop], option);
    }
  }

  function removeEvents(el, obj) {
    for (var prop in obj) {
      var option = ['touchstart', 'touchmove'].indexOf(prop) >= 0 ? passiveOption : false;
      el.removeEventListener(prop, obj[prop], option);
    }
  }

  function Events() {
    return {
      topics: {},
      on: function on(eventName, fn) {
        this.topics[eventName] = this.topics[eventName] || [];
        this.topics[eventName].push(fn);
      },
      off: function off(eventName, fn) {
        if (this.topics[eventName]) {
          for (var i = 0; i < this.topics[eventName].length; i++) {
            if (this.topics[eventName][i] === fn) {
              this.topics[eventName].splice(i, 1);
              break;
            }
          }
        }
      },
      emit: function emit(eventName, data) {
        data.type = eventName;
        if (this.topics[eventName]) {
          this.topics[eventName].forEach(function (fn) {
            fn(data, eventName);
          });
        }
      }
    };
  }

  function jsTransform(element, attr, prefix, postfix, to, duration, callback) {
    var tick = Math.min(duration, 10),
        unit = to.indexOf('%') >= 0 ? '%' : 'px',
        to = to.replace(unit, ''),
        from = Number(element.style[attr].replace(prefix, '').replace(postfix, '').replace(unit, '')),
        positionTick = (to - from) / duration * tick,
        running;

    setTimeout(moveElement, tick);
    function moveElement() {
      duration -= tick;
      from += positionTick;
      element.style[attr] = prefix + from + unit + postfix;
      if (duration > 0) {
        setTimeout(moveElement, tick);
      } else {
        callback();
      }
    }
  }

  var tns = function tns(options) {
    options = extend({
      container: '.slider',
      mode: 'carousel',
      axis: 'horizontal',
      items: 1,
      gutter: 0,
      edgePadding: 0,
      fixedWidth: false,
      autoWidth: false,
      viewportMax: false,
      slideBy: 1,
      center: false,
      controls: true,
      controlsPosition: 'top',
      controlsText: ['prev', 'next'],
      controlsContainer: false,
      prevButton: false,
      nextButton: false,
      nav: true,
      navPosition: 'top',
      navContainer: false,
      navAsThumbnails: false,
      arrowKeys: false,
      speed: 300,
      autoplay: false,
      autoplayPosition: 'top',
      autoplayTimeout: 5000,
      autoplayDirection: 'forward',
      autoplayText: ['start', 'stop'],
      autoplayHoverPause: false,
      autoplayButton: false,
      autoplayButtonOutput: true,
      autoplayResetOnVisibility: true,
      animateIn: 'tns-fadeIn',
      animateOut: 'tns-fadeOut',
      animateNormal: 'tns-normal',
      animateDelay: false,
      loop: true,
      rewind: false,
      autoHeight: false,
      responsive: false,
      lazyload: false,
      lazyloadSelector: '.tns-lazy-img',
      touch: true,
      mouseDrag: false,
      swipeAngle: 15,
      nested: false,
      preventActionWhenRunning: false,
      preventScrollOnTouch: false,
      freezable: true,
      onInit: false,
      useLocalStorage: true
    }, options || {});

    var doc = document,
        win = window,
        KEYS = {
      ENTER: 13,
      SPACE: 32,
      LEFT: 37,
      RIGHT: 39
    },
        tnsStorage = {},
        localStorageAccess = options.useLocalStorage;

    if (localStorageAccess) {
      // check browser version and local storage access
      var browserInfo = navigator.userAgent;
      var uid = new Date();

      try {
        tnsStorage = win.localStorage;
        if (tnsStorage) {
          tnsStorage.setItem(uid, uid);
          localStorageAccess = tnsStorage.getItem(uid) == uid;
          tnsStorage.removeItem(uid);
        } else {
          localStorageAccess = false;
        }
        if (!localStorageAccess) {
          tnsStorage = {};
        }
      } catch (e) {
        localStorageAccess = false;
      }

      if (localStorageAccess) {
        // remove storage when browser version changes
        if (tnsStorage['tnsApp'] && tnsStorage['tnsApp'] !== browserInfo) {
          ['tC', 'tPL', 'tMQ', 'tTf', 't3D', 'tTDu', 'tTDe', 'tADu', 'tADe', 'tTE', 'tAE'].forEach(function (item) {
            tnsStorage.removeItem(item);
          });
        }
        // update browserInfo
        localStorage['tnsApp'] = browserInfo;
      }
    }

    var CALC = tnsStorage['tC'] ? checkStorageValue(tnsStorage['tC']) : setLocalStorage(tnsStorage, 'tC', calc(), localStorageAccess),
        PERCENTAGELAYOUT = tnsStorage['tPL'] ? checkStorageValue(tnsStorage['tPL']) : setLocalStorage(tnsStorage, 'tPL', percentageLayout(), localStorageAccess),
        CSSMQ = tnsStorage['tMQ'] ? checkStorageValue(tnsStorage['tMQ']) : setLocalStorage(tnsStorage, 'tMQ', mediaquerySupport(), localStorageAccess),
        TRANSFORM = tnsStorage['tTf'] ? checkStorageValue(tnsStorage['tTf']) : setLocalStorage(tnsStorage, 'tTf', whichProperty('transform'), localStorageAccess),
        HAS3DTRANSFORMS = tnsStorage['t3D'] ? checkStorageValue(tnsStorage['t3D']) : setLocalStorage(tnsStorage, 't3D', has3DTransforms(TRANSFORM), localStorageAccess),
        TRANSITIONDURATION = tnsStorage['tTDu'] ? checkStorageValue(tnsStorage['tTDu']) : setLocalStorage(tnsStorage, 'tTDu', whichProperty('transitionDuration'), localStorageAccess),
        TRANSITIONDELAY = tnsStorage['tTDe'] ? checkStorageValue(tnsStorage['tTDe']) : setLocalStorage(tnsStorage, 'tTDe', whichProperty('transitionDelay'), localStorageAccess),
        ANIMATIONDURATION = tnsStorage['tADu'] ? checkStorageValue(tnsStorage['tADu']) : setLocalStorage(tnsStorage, 'tADu', whichProperty('animationDuration'), localStorageAccess),
        ANIMATIONDELAY = tnsStorage['tADe'] ? checkStorageValue(tnsStorage['tADe']) : setLocalStorage(tnsStorage, 'tADe', whichProperty('animationDelay'), localStorageAccess),
        TRANSITIONEND = tnsStorage['tTE'] ? checkStorageValue(tnsStorage['tTE']) : setLocalStorage(tnsStorage, 'tTE', getEndProperty(TRANSITIONDURATION, 'Transition'), localStorageAccess),
        ANIMATIONEND = tnsStorage['tAE'] ? checkStorageValue(tnsStorage['tAE']) : setLocalStorage(tnsStorage, 'tAE', getEndProperty(ANIMATIONDURATION, 'Animation'), localStorageAccess);

    // get element nodes from selectors
    var supportConsoleWarn = win.console && typeof win.console.warn === "function",
        tnsList = ['container', 'controlsContainer', 'prevButton', 'nextButton', 'navContainer', 'autoplayButton'],
        optionsElements = {};

    tnsList.forEach(function (item) {
      if (typeof options[item] === 'string') {
        var str = options[item],
            el = doc.querySelector(str);
        optionsElements[item] = str;

        if (el && el.nodeName) {
          options[item] = el;
        } else {
          if (supportConsoleWarn) {
            console.warn('Can\'t find', options[item]);
          }
          return;
        }
      }
    });

    // make sure at least 1 slide
    if (options.container.children.length < 1) {
      if (supportConsoleWarn) {
        console.warn('No slides found in', options.container);
      }
      return;
    }

    // update options
    var responsive = options.responsive,
        nested = options.nested,
        carousel = options.mode === 'carousel' ? true : false;

    if (responsive) {
      // apply responsive[0] to options and remove it
      if (0 in responsive) {
        options = extend(options, responsive[0]);
        delete responsive[0];
      }

      var responsiveTem = {};
      for (var key in responsive) {
        var val = responsive[key];
        // update responsive
        // from: 300: 2
        // to: 
        //   300: { 
        //     items: 2 
        //   } 
        val = typeof val === 'number' ? { items: val } : val;
        responsiveTem[key] = val;
      }
      responsive = responsiveTem;
      responsiveTem = null;
    }

    // update options
    function updateOptions(obj) {
      for (var key in obj) {
        if (!carousel) {
          if (key === 'slideBy') {
            obj[key] = 'page';
          }
          if (key === 'edgePadding') {
            obj[key] = false;
          }
          if (key === 'autoHeight') {
            obj[key] = false;
          }
        }

        // update responsive options
        if (key === 'responsive') {
          updateOptions(obj[key]);
        }
      }
    }
    if (!carousel) {
      updateOptions(options);
    }

    // === define and set variables ===
    if (!carousel) {
      options.axis = 'horizontal';
      options.slideBy = 'page';
      options.edgePadding = false;

      var animateIn = options.animateIn,
          animateOut = options.animateOut,
          animateDelay = options.animateDelay,
          animateNormal = options.animateNormal;
    }

    var horizontal = options.axis === 'horizontal' ? true : false,
        outerWrapper = doc.createElement('div'),
        innerWrapper = doc.createElement('div'),
        middleWrapper,
        container = options.container,
        containerParent = container.parentNode,
        containerHTML = container.outerHTML,
        slideItems = container.children,
        slideCount = slideItems.length,
        breakpointZone,
        windowWidth = getWindowWidth(),
        isOn = false;
    if (responsive) {
      setBreakpointZone();
    }
    if (carousel) {
      container.className += ' tns-vpfix';
    }

    // fixedWidth: viewport > rightBoundary > indexMax
    var autoWidth = options.autoWidth,
        fixedWidth = getOption('fixedWidth'),
        edgePadding = getOption('edgePadding'),
        gutter = getOption('gutter'),
        viewport = getViewportWidth(),
        center = getOption('center'),
        items = !autoWidth ? Math.floor(getOption('items')) : 1,
        slideBy = getOption('slideBy'),
        viewportMax = options.viewportMax || options.fixedWidthViewportWidth,
        arrowKeys = getOption('arrowKeys'),
        speed = getOption('speed'),
        rewind = options.rewind,
        loop = rewind ? false : options.loop,
        autoHeight = getOption('autoHeight'),
        controls = getOption('controls'),
        controlsText = getOption('controlsText'),
        nav = getOption('nav'),
        touch = getOption('touch'),
        mouseDrag = getOption('mouseDrag'),
        autoplay = getOption('autoplay'),
        autoplayTimeout = getOption('autoplayTimeout'),
        autoplayText = getOption('autoplayText'),
        autoplayHoverPause = getOption('autoplayHoverPause'),
        autoplayResetOnVisibility = getOption('autoplayResetOnVisibility'),
        sheet = createStyleSheet(),
        lazyload = options.lazyload,
        lazyloadSelector = options.lazyloadSelector,
        slidePositions,
        // collection of slide positions
    slideItemsOut = [],
        cloneCount = loop ? getCloneCountForLoop() : 0,
        slideCountNew = !carousel ? slideCount + cloneCount : slideCount + cloneCount * 2,
        hasRightDeadZone = (fixedWidth || autoWidth) && !loop ? true : false,
        rightBoundary = fixedWidth ? getRightBoundary() : null,
        updateIndexBeforeTransform = !carousel || !loop ? true : false,

    // transform
    transformAttr = horizontal ? 'left' : 'top',
        transformPrefix = '',
        transformPostfix = '',

    // index
    getIndexMax = function () {
      if (fixedWidth) {
        return function () {
          return center && !loop ? slideCount - 1 : Math.ceil(-rightBoundary / (fixedWidth + gutter));
        };
      } else if (autoWidth) {
        return function () {
          for (var i = slideCountNew; i--;) {
            if (slidePositions[i] >= -rightBoundary) {
              return i;
            }
          }
        };
      } else {
        return function () {
          if (center && carousel && !loop) {
            return slideCount - 1;
          } else {
            return loop || carousel ? Math.max(0, slideCountNew - Math.ceil(items)) : slideCountNew - 1;
          }
        };
      }
    }(),
        index = getStartIndex(getOption('startIndex')),
        indexCached = index,
        displayIndex = getCurrentSlide(),
        indexMin = 0,
        indexMax = !autoWidth ? getIndexMax() : null,

    // resize
    resizeTimer,
        preventActionWhenRunning = options.preventActionWhenRunning,
        swipeAngle = options.swipeAngle,
        moveDirectionExpected = swipeAngle ? '?' : true,
        running = false,
        onInit = options.onInit,
        events = new Events(),

    // id, class
    newContainerClasses = ' tns-slider tns-' + options.mode,
        slideId = container.id || getSlideId(),
        disable = getOption('disable'),
        disabled = false,
        freezable = options.freezable,
        freeze = freezable && !autoWidth ? getFreeze() : false,
        frozen = false,
        controlsEvents = {
      'click': onControlsClick,
      'keydown': onControlsKeydown
    },
        navEvents = {
      'click': onNavClick,
      'keydown': onNavKeydown
    },
        hoverEvents = {
      'mouseover': mouseoverPause,
      'mouseout': mouseoutRestart
    },
        visibilityEvent = { 'visibilitychange': onVisibilityChange },
        docmentKeydownEvent = { 'keydown': onDocumentKeydown },
        touchEvents = {
      'touchstart': onPanStart,
      'touchmove': onPanMove,
      'touchend': onPanEnd,
      'touchcancel': onPanEnd
    },
        dragEvents = {
      'mousedown': onPanStart,
      'mousemove': onPanMove,
      'mouseup': onPanEnd,
      'mouseleave': onPanEnd
    },
        hasControls = hasOption('controls'),
        hasNav = hasOption('nav'),
        navAsThumbnails = autoWidth ? true : options.navAsThumbnails,
        hasAutoplay = hasOption('autoplay'),
        hasTouch = hasOption('touch'),
        hasMouseDrag = hasOption('mouseDrag'),
        slideActiveClass = 'tns-slide-active',
        imgCompleteClass = 'tns-complete',
        imgEvents = {
      'load': onImgLoaded,
      'error': onImgFailed
    },
        imgsComplete,
        liveregionCurrent,
        preventScroll = options.preventScrollOnTouch === 'force' ? true : false;

    // controls
    if (hasControls) {
      var controlsContainer = options.controlsContainer,
          controlsContainerHTML = options.controlsContainer ? options.controlsContainer.outerHTML : '',
          prevButton = options.prevButton,
          nextButton = options.nextButton,
          prevButtonHTML = options.prevButton ? options.prevButton.outerHTML : '',
          nextButtonHTML = options.nextButton ? options.nextButton.outerHTML : '',
          prevIsButton,
          nextIsButton;
    }

    // nav
    if (hasNav) {
      var navContainer = options.navContainer,
          navContainerHTML = options.navContainer ? options.navContainer.outerHTML : '',
          navItems,
          pages = autoWidth ? slideCount : getPages(),
          pagesCached = 0,
          navClicked = -1,
          navCurrentIndex = getCurrentNavIndex(),
          navCurrentIndexCached = navCurrentIndex,
          navActiveClass = 'tns-nav-active',
          navStr = 'Carousel Page ',
          navStrCurrent = ' (Current Slide)';
    }

    // autoplay
    if (hasAutoplay) {
      var autoplayDirection = options.autoplayDirection === 'forward' ? 1 : -1,
          autoplayButton = options.autoplayButton,
          autoplayButtonHTML = options.autoplayButton ? options.autoplayButton.outerHTML : '',
          autoplayHtmlStrings = ['<span class=\'tns-visually-hidden\'>', ' animation</span>'],
          autoplayTimer,
          animating,
          autoplayHoverPaused,
          autoplayUserPaused,
          autoplayVisibilityPaused;
    }

    if (hasTouch || hasMouseDrag) {
      var initPosition = {},
          lastPosition = {},
          translateInit,
          disX,
          disY,
          panStart = false,
          rafIndex,
          getDist = horizontal ? function (a, b) {
        return a.x - b.x;
      } : function (a, b) {
        return a.y - b.y;
      };
    }

    // disable slider when slidecount <= items
    if (!autoWidth) {
      resetVariblesWhenDisable(disable || freeze);
    }

    if (TRANSFORM) {
      transformAttr = TRANSFORM;
      transformPrefix = 'translate';

      if (HAS3DTRANSFORMS) {
        transformPrefix += horizontal ? '3d(' : '3d(0px, ';
        transformPostfix = horizontal ? ', 0px, 0px)' : ', 0px)';
      } else {
        transformPrefix += horizontal ? 'X(' : 'Y(';
        transformPostfix = ')';
      }
    }

    if (carousel) {
      container.className = container.className.replace('tns-vpfix', '');
    }
    initStructure();
    initSheet();
    initSliderTransform();

    // === COMMON FUNCTIONS === //
    function resetVariblesWhenDisable(condition) {
      if (condition) {
        controls = nav = touch = mouseDrag = arrowKeys = autoplay = autoplayHoverPause = autoplayResetOnVisibility = false;
      }
    }

    function getCurrentSlide() {
      var tem = carousel ? index - cloneCount : index;
      while (tem < 0) {
        tem += slideCount;
      }
      return tem % slideCount + 1;
    }

    function getStartIndex(ind) {
      ind = ind ? Math.max(0, Math.min(loop ? slideCount - 1 : slideCount - items, ind)) : 0;
      return carousel ? ind + cloneCount : ind;
    }

    function getAbsIndex(i) {
      if (i == null) {
        i = index;
      }

      if (carousel) {
        i -= cloneCount;
      }
      while (i < 0) {
        i += slideCount;
      }

      return Math.floor(i % slideCount);
    }

    function getCurrentNavIndex() {
      var absIndex = getAbsIndex(),
          result;

      result = navAsThumbnails ? absIndex : fixedWidth || autoWidth ? Math.ceil((absIndex + 1) * pages / slideCount - 1) : Math.floor(absIndex / items);

      // set active nav to the last one when reaches the right edge
      if (!loop && carousel && index === indexMax) {
        result = pages - 1;
      }

      return result;
    }

    function getItemsMax() {
      // fixedWidth or autoWidth while viewportMax is not available
      if (autoWidth || fixedWidth && !viewportMax) {
        return slideCount - 1;
        // most cases
      } else {
        var str = fixedWidth ? 'fixedWidth' : 'items',
            arr = [];

        if (fixedWidth || options[str] < slideCount) {
          arr.push(options[str]);
        }

        if (responsive) {
          for (var bp in responsive) {
            var tem = responsive[bp][str];
            if (tem && (fixedWidth || tem < slideCount)) {
              arr.push(tem);
            }
          }
        }

        if (!arr.length) {
          arr.push(0);
        }

        return Math.ceil(fixedWidth ? viewportMax / Math.min.apply(null, arr) : Math.max.apply(null, arr));
      }
    }

    function getCloneCountForLoop() {
      var itemsMax = getItemsMax(),
          result = carousel ? Math.ceil((itemsMax * 5 - slideCount) / 2) : itemsMax * 4 - slideCount;
      result = Math.max(itemsMax, result);

      return hasOption('edgePadding') ? result + 1 : result;
    }

    function getWindowWidth() {
      return win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth;
    }

    function getInsertPosition(pos) {
      return pos === 'top' ? 'afterbegin' : 'beforeend';
    }

    function getClientWidth(el) {
      var div = doc.createElement('div'),
          rect,
          width;
      el.appendChild(div);
      rect = div.getBoundingClientRect();
      width = rect.right - rect.left;
      div.remove();
      return width || getClientWidth(el.parentNode);
    }

    function getViewportWidth() {
      var gap = edgePadding ? edgePadding * 2 - gutter : 0;
      return getClientWidth(containerParent) - gap;
    }

    function hasOption(item) {
      if (options[item]) {
        return true;
      } else {
        if (responsive) {
          for (var bp in responsive) {
            if (responsive[bp][item]) {
              return true;
            }
          }
        }
        return false;
      }
    }

    // get option:
    // fixed width: viewport, fixedWidth, gutter => items
    // others: window width => all variables
    // all: items => slideBy
    function getOption(item, ww) {
      if (ww == null) {
        ww = windowWidth;
      }

      if (item === 'items' && fixedWidth) {
        return Math.floor((viewport + gutter) / (fixedWidth + gutter)) || 1;
      } else {
        var result = options[item];

        if (responsive) {
          for (var bp in responsive) {
            // bp: convert string to number
            if (ww >= parseInt(bp)) {
              if (item in responsive[bp]) {
                result = responsive[bp][item];
              }
            }
          }
        }

        if (item === 'slideBy' && result === 'page') {
          result = getOption('items');
        }
        if (!carousel && (item === 'slideBy' || item === 'items')) {
          result = Math.floor(result);
        }

        return result;
      }
    }

    function getSlideMarginLeft(i) {
      return CALC ? CALC + '(' + i * 100 + '% / ' + slideCountNew + ')' : i * 100 / slideCountNew + '%';
    }

    function getInnerWrapperStyles(edgePaddingTem, gutterTem, fixedWidthTem, speedTem, autoHeightBP) {
      var str = '';

      if (edgePaddingTem !== undefined) {
        var gap = edgePaddingTem;
        if (gutterTem) {
          gap -= gutterTem;
        }
        str = horizontal ? 'margin: 0 ' + gap + 'px 0 ' + edgePaddingTem + 'px;' : 'margin: ' + edgePaddingTem + 'px 0 ' + gap + 'px 0;';
      } else if (gutterTem && !fixedWidthTem) {
        var gutterTemUnit = '-' + gutterTem + 'px',
            dir = horizontal ? gutterTemUnit + ' 0 0' : '0 ' + gutterTemUnit + ' 0';
        str = 'margin: 0 ' + dir + ';';
      }

      if (!carousel && autoHeightBP && TRANSITIONDURATION && speedTem) {
        str += getTransitionDurationStyle(speedTem);
      }
      return str;
    }

    function getContainerWidth(fixedWidthTem, gutterTem, itemsTem) {
      if (fixedWidthTem) {
        return (fixedWidthTem + gutterTem) * slideCountNew + 'px';
      } else {
        return CALC ? CALC + '(' + slideCountNew * 100 + '% / ' + itemsTem + ')' : slideCountNew * 100 / itemsTem + '%';
      }
    }

    function getSlideWidthStyle(fixedWidthTem, gutterTem, itemsTem) {
      var width;

      if (fixedWidthTem) {
        width = fixedWidthTem + gutterTem + 'px';
      } else {
        if (!carousel) {
          itemsTem = Math.floor(itemsTem);
        }
        var dividend = carousel ? slideCountNew : itemsTem;
        width = CALC ? CALC + '(100% / ' + dividend + ')' : 100 / dividend + '%';
      }

      width = 'width:' + width;

      // inner slider: overwrite outer slider styles
      return nested !== 'inner' ? width + ';' : width + ' !important;';
    }

    function getSlideGutterStyle(gutterTem) {
      var str = '';

      // gutter maybe interger || 0
      // so can't use 'if (gutter)'
      if (gutterTem !== false) {
        var prop = horizontal ? 'padding-' : 'margin-',
            dir = horizontal ? 'right' : 'bottom';
        str = prop + dir + ': ' + gutterTem + 'px;';
      }

      return str;
    }

    function getCSSPrefix(name, num) {
      var prefix = name.substring(0, name.length - num).toLowerCase();
      if (prefix) {
        prefix = '-' + prefix + '-';
      }

      return prefix;
    }

    function getTransitionDurationStyle(speed) {
      return getCSSPrefix(TRANSITIONDURATION, 18) + 'transition-duration:' + speed / 1000 + 's;';
    }

    function getAnimationDurationStyle(speed) {
      return getCSSPrefix(ANIMATIONDURATION, 17) + 'animation-duration:' + speed / 1000 + 's;';
    }

    function initStructure() {
      var classOuter = 'tns-outer',
          classInner = 'tns-inner',
          hasGutter = hasOption('gutter');

      outerWrapper.className = classOuter;
      innerWrapper.className = classInner;
      outerWrapper.id = slideId + '-ow';
      innerWrapper.id = slideId + '-iw';

      // set container properties
      if (container.id === '') {
        container.id = slideId;
      }
      newContainerClasses += PERCENTAGELAYOUT || autoWidth ? ' tns-subpixel' : ' tns-no-subpixel';
      newContainerClasses += CALC ? ' tns-calc' : ' tns-no-calc';
      if (autoWidth) {
        newContainerClasses += ' tns-autowidth';
      }
      newContainerClasses += ' tns-' + options.axis;
      container.className += newContainerClasses;

      // add constrain layer for carousel
      if (carousel) {
        middleWrapper = doc.createElement('div');
        middleWrapper.id = slideId + '-mw';
        middleWrapper.className = 'tns-ovh';

        outerWrapper.appendChild(middleWrapper);
        middleWrapper.appendChild(innerWrapper);
      } else {
        outerWrapper.appendChild(innerWrapper);
      }

      if (autoHeight) {
        var wp = middleWrapper ? middleWrapper : innerWrapper;
        wp.className += ' tns-ah';
      }

      containerParent.insertBefore(outerWrapper, container);
      innerWrapper.appendChild(container);

      // add id, class, aria attributes 
      // before clone slides
      forEach(slideItems, function (item, i) {
        addClass(item, 'tns-item');
        if (!item.id) {
          item.id = slideId + '-item' + i;
        }
        if (!carousel && animateNormal) {
          addClass(item, animateNormal);
        }
        setAttrs(item, {
          'aria-hidden': 'true',
          'tabindex': '-1'
        });
      });

      // ## clone slides
      // carousel: n + slides + n
      // gallery:      slides + n
      if (cloneCount) {
        var fragmentBefore = doc.createDocumentFragment(),
            fragmentAfter = doc.createDocumentFragment();

        for (var j = cloneCount; j--;) {
          var num = j % slideCount,
              cloneFirst = slideItems[num].cloneNode(true);
          removeAttrs(cloneFirst, 'id');
          fragmentAfter.insertBefore(cloneFirst, fragmentAfter.firstChild);

          if (carousel) {
            var cloneLast = slideItems[slideCount - 1 - num].cloneNode(true);
            removeAttrs(cloneLast, 'id');
            fragmentBefore.appendChild(cloneLast);
          }
        }

        container.insertBefore(fragmentBefore, container.firstChild);
        container.appendChild(fragmentAfter);
        slideItems = container.children;
      }
    }

    function initSliderTransform() {
      // ## images loaded/failed
      if (hasOption('autoHeight') || autoWidth || !horizontal) {
        var imgs = container.querySelectorAll('img');

        // add complete class if all images are loaded/failed
        forEach(imgs, function (img) {
          var src = img.src;

          if (src && src.indexOf('data:image') < 0) {
            addEvents(img, imgEvents);
            img.src = '';
            img.src = src;
            addClass(img, 'loading');
          } else if (!lazyload) {
            imgLoaded(img);
          }
        });

        // All imgs are completed
        raf(function () {
          imgsLoadedCheck(arrayFromNodeList(imgs), function () {
            imgsComplete = true;
          });
        });

        // Check imgs in window only for auto height
        if (!autoWidth && horizontal) {
          imgs = getImageArray(index, Math.min(index + items - 1, slideCountNew - 1));
        }

        lazyload ? initSliderTransformStyleCheck() : raf(function () {
          imgsLoadedCheck(arrayFromNodeList(imgs), initSliderTransformStyleCheck);
        });
      } else {
        // set container transform property
        if (carousel) {
          doContainerTransformSilent();
        }

        // update slider tools and events
        initTools();
        initEvents();
      }
    }

    function initSliderTransformStyleCheck() {
      if (autoWidth) {
        // check styles application
        var num = loop ? index : slideCount - 1;
        (function stylesApplicationCheck() {
          slideItems[num - 1].getBoundingClientRect().right.toFixed(2) === slideItems[num].getBoundingClientRect().left.toFixed(2) ? initSliderTransformCore() : setTimeout(function () {
            stylesApplicationCheck();
          }, 16);
        })();
      } else {
        initSliderTransformCore();
      }
    }

    function initSliderTransformCore() {
      // run Fn()s which are rely on image loading
      if (!horizontal || autoWidth) {
        setSlidePositions();

        if (autoWidth) {
          rightBoundary = getRightBoundary();
          if (freezable) {
            freeze = getFreeze();
          }
          indexMax = getIndexMax(); // <= slidePositions, rightBoundary <=
          resetVariblesWhenDisable(disable || freeze);
        } else {
          updateContentWrapperHeight();
        }
      }

      // set container transform property
      if (carousel) {
        doContainerTransformSilent();
      }

      // update slider tools and events
      initTools();
      initEvents();
    }

    function initSheet() {
      // gallery:
      // set animation classes and left value for gallery slider
      if (!carousel) {
        for (var i = index, l = index + Math.min(slideCount, items); i < l; i++) {
          var item = slideItems[i];
          item.style.left = (i - index) * 100 / items + '%';
          addClass(item, animateIn);
          removeClass(item, animateNormal);
        }
      }

      // #### LAYOUT

      // ## INLINE-BLOCK VS FLOAT

      // ## PercentageLayout:
      // slides: inline-block
      // remove blank space between slides by set font-size: 0

      // ## Non PercentageLayout:
      // slides: float
      //         margin-right: -100%
      //         margin-left: ~

      // Resource: https://docs.google.com/spreadsheets/d/147up245wwTXeQYve3BRSAD4oVcvQmuGsFteJOeA5xNQ/edit?usp=sharing
      if (horizontal) {
        if (PERCENTAGELAYOUT || autoWidth) {
          addCSSRule(sheet, '#' + slideId + ' > .tns-item', 'font-size:' + win.getComputedStyle(slideItems[0]).fontSize + ';', getCssRulesLength(sheet));
          addCSSRule(sheet, '#' + slideId, 'font-size:0;', getCssRulesLength(sheet));
        } else if (carousel) {
          forEach(slideItems, function (slide, i) {
            slide.style.marginLeft = getSlideMarginLeft(i);
          });
        }
      }

      // ## BASIC STYLES
      if (CSSMQ) {
        // middle wrapper style
        if (TRANSITIONDURATION) {
          var str = middleWrapper && options.autoHeight ? getTransitionDurationStyle(options.speed) : '';
          addCSSRule(sheet, '#' + slideId + '-mw', str, getCssRulesLength(sheet));
        }

        // inner wrapper styles
        str = getInnerWrapperStyles(options.edgePadding, options.gutter, options.fixedWidth, options.speed, options.autoHeight);
        addCSSRule(sheet, '#' + slideId + '-iw', str, getCssRulesLength(sheet));

        // container styles
        if (carousel) {
          str = horizontal && !autoWidth ? 'width:' + getContainerWidth(options.fixedWidth, options.gutter, options.items) + ';' : '';
          if (TRANSITIONDURATION) {
            str += getTransitionDurationStyle(speed);
          }
          addCSSRule(sheet, '#' + slideId, str, getCssRulesLength(sheet));
        }

        // slide styles
        str = horizontal && !autoWidth ? getSlideWidthStyle(options.fixedWidth, options.gutter, options.items) : '';
        if (options.gutter) {
          str += getSlideGutterStyle(options.gutter);
        }
        // set gallery items transition-duration
        if (!carousel) {
          if (TRANSITIONDURATION) {
            str += getTransitionDurationStyle(speed);
          }
          if (ANIMATIONDURATION) {
            str += getAnimationDurationStyle(speed);
          }
        }
        if (str) {
          addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet));
        }

        // non CSS mediaqueries: IE8
        // ## update inner wrapper, container, slides if needed
        // set inline styles for inner wrapper & container
        // insert stylesheet (one line) for slides only (since slides are many)
      } else {
        // middle wrapper styles
        update_carousel_transition_duration();

        // inner wrapper styles
        innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, autoHeight);

        // container styles
        if (carousel && horizontal && !autoWidth) {
          container.style.width = getContainerWidth(fixedWidth, gutter, items);
        }

        // slide styles
        var str = horizontal && !autoWidth ? getSlideWidthStyle(fixedWidth, gutter, items) : '';
        if (gutter) {
          str += getSlideGutterStyle(gutter);
        }

        // append to the last line
        if (str) {
          addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet));
        }
      }

      // ## MEDIAQUERIES
      if (responsive && CSSMQ) {
        for (var bp in responsive) {
          // bp: convert string to number
          bp = parseInt(bp);

          var opts = responsive[bp],
              str = '',
              middleWrapperStr = '',
              innerWrapperStr = '',
              containerStr = '',
              slideStr = '',
              itemsBP = !autoWidth ? getOption('items', bp) : null,
              fixedWidthBP = getOption('fixedWidth', bp),
              speedBP = getOption('speed', bp),
              edgePaddingBP = getOption('edgePadding', bp),
              autoHeightBP = getOption('autoHeight', bp),
              gutterBP = getOption('gutter', bp);

          // middle wrapper string
          if (TRANSITIONDURATION && middleWrapper && getOption('autoHeight', bp) && 'speed' in opts) {
            middleWrapperStr = '#' + slideId + '-mw{' + getTransitionDurationStyle(speedBP) + '}';
          }

          // inner wrapper string
          if ('edgePadding' in opts || 'gutter' in opts) {
            innerWrapperStr = '#' + slideId + '-iw{' + getInnerWrapperStyles(edgePaddingBP, gutterBP, fixedWidthBP, speedBP, autoHeightBP) + '}';
          }

          // container string
          if (carousel && horizontal && !autoWidth && ('fixedWidth' in opts || 'items' in opts || fixedWidth && 'gutter' in opts)) {
            containerStr = 'width:' + getContainerWidth(fixedWidthBP, gutterBP, itemsBP) + ';';
          }
          if (TRANSITIONDURATION && 'speed' in opts) {
            containerStr += getTransitionDurationStyle(speedBP);
          }
          if (containerStr) {
            containerStr = '#' + slideId + '{' + containerStr + '}';
          }

          // slide string
          if ('fixedWidth' in opts || fixedWidth && 'gutter' in opts || !carousel && 'items' in opts) {
            slideStr += getSlideWidthStyle(fixedWidthBP, gutterBP, itemsBP);
          }
          if ('gutter' in opts) {
            slideStr += getSlideGutterStyle(gutterBP);
          }
          // set gallery items transition-duration
          if (!carousel && 'speed' in opts) {
            if (TRANSITIONDURATION) {
              slideStr += getTransitionDurationStyle(speedBP);
            }
            if (ANIMATIONDURATION) {
              slideStr += getAnimationDurationStyle(speedBP);
            }
          }
          if (slideStr) {
            slideStr = '#' + slideId + ' > .tns-item{' + slideStr + '}';
          }

          // add up
          str = middleWrapperStr + innerWrapperStr + containerStr + slideStr;

          if (str) {
            sheet.insertRule('@media (min-width: ' + bp / 16 + 'em) {' + str + '}', sheet.cssRules.length);
          }
        }
      }
    }

    function initTools() {
      // == slides ==
      updateSlideStatus();

      // == live region ==
      outerWrapper.insertAdjacentHTML('afterbegin', '<div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">slide <span class="current">' + getLiveRegionStr() + '</span>  of ' + slideCount + '</div>');
      liveregionCurrent = outerWrapper.querySelector('.tns-liveregion .current');

      // == autoplayInit ==
      if (hasAutoplay) {
        var txt = autoplay ? 'stop' : 'start';
        if (autoplayButton) {
          setAttrs(autoplayButton, { 'data-action': txt });
        } else if (options.autoplayButtonOutput) {
          outerWrapper.insertAdjacentHTML(getInsertPosition(options.autoplayPosition), '<button data-action="' + txt + '">' + autoplayHtmlStrings[0] + txt + autoplayHtmlStrings[1] + autoplayText[0] + '</button>');
          autoplayButton = outerWrapper.querySelector('[data-action]');
        }

        // add event
        if (autoplayButton) {
          addEvents(autoplayButton, { 'click': toggleAutoplay });
        }

        if (autoplay) {
          startAutoplay();
          if (autoplayHoverPause) {
            addEvents(container, hoverEvents);
          }
          if (autoplayResetOnVisibility) {
            addEvents(container, visibilityEvent);
          }
        }
      }

      // == navInit ==
      if (hasNav) {
        var initIndex = !carousel ? 0 : cloneCount;
        // customized nav
        // will not hide the navs in case they're thumbnails
        if (navContainer) {
          setAttrs(navContainer, { 'aria-label': 'Carousel Pagination' });
          navItems = navContainer.children;
          forEach(navItems, function (item, i) {
            setAttrs(item, {
              'data-nav': i,
              'tabindex': '-1',
              'aria-label': navStr + (i + 1),
              'aria-controls': slideId
            });
          });

          // generated nav 
        } else {
          var navHtml = '',
              hiddenStr = navAsThumbnails ? '' : 'style="display:none"';
          for (var i = 0; i < slideCount; i++) {
            // hide nav items by default
            navHtml += '<button data-nav="' + i + '" tabindex="-1" aria-controls="' + slideId + '" ' + hiddenStr + ' aria-label="' + navStr + (i + 1) + '"></button>';
          }
          navHtml = '<div class="tns-nav" aria-label="Carousel Pagination">' + navHtml + '</div>';
          outerWrapper.insertAdjacentHTML(getInsertPosition(options.navPosition), navHtml);

          navContainer = outerWrapper.querySelector('.tns-nav');
          navItems = navContainer.children;
        }

        updateNavVisibility();

        // add transition
        if (TRANSITIONDURATION) {
          var prefix = TRANSITIONDURATION.substring(0, TRANSITIONDURATION.length - 18).toLowerCase(),
              str = 'transition: all ' + speed / 1000 + 's';

          if (prefix) {
            str = '-' + prefix + '-' + str;
          }

          addCSSRule(sheet, '[aria-controls^=' + slideId + '-item]', str, getCssRulesLength(sheet));
        }

        setAttrs(navItems[navCurrentIndex], { 'aria-label': navStr + (navCurrentIndex + 1) + navStrCurrent });
        removeAttrs(navItems[navCurrentIndex], 'tabindex');
        addClass(navItems[navCurrentIndex], navActiveClass);

        // add events
        addEvents(navContainer, navEvents);
      }

      // == controlsInit ==
      if (hasControls) {
        if (!controlsContainer && (!prevButton || !nextButton)) {
          outerWrapper.insertAdjacentHTML(getInsertPosition(options.controlsPosition), '<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button data-controls="prev" tabindex="-1" aria-controls="' + slideId + '">' + controlsText[0] + '</button><button data-controls="next" tabindex="-1" aria-controls="' + slideId + '">' + controlsText[1] + '</button></div>');

          controlsContainer = outerWrapper.querySelector('.tns-controls');
        }

        if (!prevButton || !nextButton) {
          prevButton = controlsContainer.children[0];
          nextButton = controlsContainer.children[1];
        }

        if (options.controlsContainer) {
          setAttrs(controlsContainer, {
            'aria-label': 'Carousel Navigation',
            'tabindex': '0'
          });
        }

        if (options.controlsContainer || options.prevButton && options.nextButton) {
          setAttrs([prevButton, nextButton], {
            'aria-controls': slideId,
            'tabindex': '-1'
          });
        }

        if (options.controlsContainer || options.prevButton && options.nextButton) {
          setAttrs(prevButton, { 'data-controls': 'prev' });
          setAttrs(nextButton, { 'data-controls': 'next' });
        }

        prevIsButton = isButton(prevButton);
        nextIsButton = isButton(nextButton);

        updateControlsStatus();

        // add events
        if (controlsContainer) {
          addEvents(controlsContainer, controlsEvents);
        } else {
          addEvents(prevButton, controlsEvents);
          addEvents(nextButton, controlsEvents);
        }
      }

      // hide tools if needed
      disableUI();
    }

    function initEvents() {
      // add events
      if (carousel && TRANSITIONEND) {
        var eve = {};
        eve[TRANSITIONEND] = onTransitionEnd;
        addEvents(container, eve);
      }

      if (touch) {
        addEvents(container, touchEvents, options.preventScrollOnTouch);
      }
      if (mouseDrag) {
        addEvents(container, dragEvents);
      }
      if (arrowKeys) {
        addEvents(doc, docmentKeydownEvent);
      }

      if (nested === 'inner') {
        events.on('outerResized', function () {
          resizeTasks();
          events.emit('innerLoaded', info());
        });
      } else if (responsive || fixedWidth || autoWidth || autoHeight || !horizontal) {
        addEvents(win, { 'resize': onResize });
      }

      if (autoHeight) {
        if (nested === 'outer') {
          events.on('innerLoaded', doAutoHeight);
        } else if (!disable) {
          doAutoHeight();
        }
      }

      doLazyLoad();
      if (disable) {
        disableSlider();
      } else if (freeze) {
        freezeSlider();
      }

      events.on('indexChanged', additionalUpdates);
      if (nested === 'inner') {
        events.emit('innerLoaded', info());
      }
      if (typeof onInit === 'function') {
        onInit(info());
      }
      isOn = true;
    }

    function destroy() {
      // sheet
      sheet.disabled = true;
      if (sheet.ownerNode) {
        sheet.ownerNode.remove();
      }

      // remove win event listeners
      removeEvents(win, { 'resize': onResize });

      // arrowKeys, controls, nav
      if (arrowKeys) {
        removeEvents(doc, docmentKeydownEvent);
      }
      if (controlsContainer) {
        removeEvents(controlsContainer, controlsEvents);
      }
      if (navContainer) {
        removeEvents(navContainer, navEvents);
      }

      // autoplay
      removeEvents(container, hoverEvents);
      removeEvents(container, visibilityEvent);
      if (autoplayButton) {
        removeEvents(autoplayButton, { 'click': toggleAutoplay });
      }
      if (autoplay) {
        clearInterval(autoplayTimer);
      }

      // container
      if (carousel && TRANSITIONEND) {
        var eve = {};
        eve[TRANSITIONEND] = onTransitionEnd;
        removeEvents(container, eve);
      }
      if (touch) {
        removeEvents(container, touchEvents);
      }
      if (mouseDrag) {
        removeEvents(container, dragEvents);
      }

      // cache Object values in options && reset HTML
      var htmlList = [containerHTML, controlsContainerHTML, prevButtonHTML, nextButtonHTML, navContainerHTML, autoplayButtonHTML];

      tnsList.forEach(function (item, i) {
        var el = item === 'container' ? outerWrapper : options[item];

        if ((typeof el === 'undefined' ? 'undefined' : _typeof(el)) === 'object') {
          var prevEl = el.previousElementSibling ? el.previousElementSibling : false,
              parentEl = el.parentNode;
          el.outerHTML = htmlList[i];
          options[item] = prevEl ? prevEl.nextElementSibling : parentEl.firstElementChild;
        }
      });

      // reset variables
      tnsList = animateIn = animateOut = animateDelay = animateNormal = horizontal = outerWrapper = innerWrapper = container = containerParent = containerHTML = slideItems = slideCount = breakpointZone = windowWidth = autoWidth = fixedWidth = edgePadding = gutter = viewport = items = slideBy = viewportMax = arrowKeys = speed = rewind = loop = autoHeight = sheet = lazyload = slidePositions = slideItemsOut = cloneCount = slideCountNew = hasRightDeadZone = rightBoundary = updateIndexBeforeTransform = transformAttr = transformPrefix = transformPostfix = getIndexMax = index = indexCached = indexMin = indexMax = resizeTimer = swipeAngle = moveDirectionExpected = running = onInit = events = newContainerClasses = slideId = disable = disabled = freezable = freeze = frozen = controlsEvents = navEvents = hoverEvents = visibilityEvent = docmentKeydownEvent = touchEvents = dragEvents = hasControls = hasNav = navAsThumbnails = hasAutoplay = hasTouch = hasMouseDrag = slideActiveClass = imgCompleteClass = imgEvents = imgsComplete = controls = controlsText = controlsContainer = controlsContainerHTML = prevButton = nextButton = prevIsButton = nextIsButton = nav = navContainer = navContainerHTML = navItems = pages = pagesCached = navClicked = navCurrentIndex = navCurrentIndexCached = navActiveClass = navStr = navStrCurrent = autoplay = autoplayTimeout = autoplayDirection = autoplayText = autoplayHoverPause = autoplayButton = autoplayButtonHTML = autoplayResetOnVisibility = autoplayHtmlStrings = autoplayTimer = animating = autoplayHoverPaused = autoplayUserPaused = autoplayVisibilityPaused = initPosition = lastPosition = translateInit = disX = disY = panStart = rafIndex = getDist = touch = mouseDrag = null;
      // check variables
      // [animateIn, animateOut, animateDelay, animateNormal, horizontal, outerWrapper, innerWrapper, container, containerParent, containerHTML, slideItems, slideCount, breakpointZone, windowWidth, autoWidth, fixedWidth, edgePadding, gutter, viewport, items, slideBy, viewportMax, arrowKeys, speed, rewind, loop, autoHeight, sheet, lazyload, slidePositions, slideItemsOut, cloneCount, slideCountNew, hasRightDeadZone, rightBoundary, updateIndexBeforeTransform, transformAttr, transformPrefix, transformPostfix, getIndexMax, index, indexCached, indexMin, indexMax, resizeTimer, swipeAngle, moveDirectionExpected, running, onInit, events, newContainerClasses, slideId, disable, disabled, freezable, freeze, frozen, controlsEvents, navEvents, hoverEvents, visibilityEvent, docmentKeydownEvent, touchEvents, dragEvents, hasControls, hasNav, navAsThumbnails, hasAutoplay, hasTouch, hasMouseDrag, slideActiveClass, imgCompleteClass, imgEvents, imgsComplete, controls, controlsText, controlsContainer, controlsContainerHTML, prevButton, nextButton, prevIsButton, nextIsButton, nav, navContainer, navContainerHTML, navItems, pages, pagesCached, navClicked, navCurrentIndex, navCurrentIndexCached, navActiveClass, navStr, navStrCurrent, autoplay, autoplayTimeout, autoplayDirection, autoplayText, autoplayHoverPause, autoplayButton, autoplayButtonHTML, autoplayResetOnVisibility, autoplayHtmlStrings, autoplayTimer, animating, autoplayHoverPaused, autoplayUserPaused, autoplayVisibilityPaused, initPosition, lastPosition, translateInit, disX, disY, panStart, rafIndex, getDist, touch, mouseDrag ].forEach(function(item) { if (item !== null) { console.log(item); } });

      for (var a in this) {
        if (a !== 'rebuild') {
          this[a] = null;
        }
      }
      isOn = false;
    }

    // === ON RESIZE ===
    // responsive || fixedWidth || autoWidth || !horizontal
    function onResize(e) {
      raf(function () {
        resizeTasks(getEvent(e));
      });
    }

    function resizeTasks(e) {
      if (!isOn) {
        return;
      }
      if (nested === 'outer') {
        events.emit('outerResized', info(e));
      }
      windowWidth = getWindowWidth();
      var bpChanged,
          breakpointZoneTem = breakpointZone,
          needContainerTransform = false;

      if (responsive) {
        setBreakpointZone();
        bpChanged = breakpointZoneTem !== breakpointZone;
        // if (hasRightDeadZone) { needContainerTransform = true; } // *?
        if (bpChanged) {
          events.emit('newBreakpointStart', info(e));
        }
      }

      var indChanged,
          itemsChanged,
          itemsTem = items,
          disableTem = disable,
          freezeTem = freeze,
          arrowKeysTem = arrowKeys,
          controlsTem = controls,
          navTem = nav,
          touchTem = touch,
          mouseDragTem = mouseDrag,
          autoplayTem = autoplay,
          autoplayHoverPauseTem = autoplayHoverPause,
          autoplayResetOnVisibilityTem = autoplayResetOnVisibility,
          indexTem = index;

      if (bpChanged) {
        var fixedWidthTem = fixedWidth,
            autoHeightTem = autoHeight,
            controlsTextTem = controlsText,
            centerTem = center,
            autoplayTextTem = autoplayText;

        if (!CSSMQ) {
          var gutterTem = gutter,
              edgePaddingTem = edgePadding;
        }
      }

      // get option:
      // fixed width: viewport, fixedWidth, gutter => items
      // others: window width => all variables
      // all: items => slideBy
      arrowKeys = getOption('arrowKeys');
      controls = getOption('controls');
      nav = getOption('nav');
      touch = getOption('touch');
      center = getOption('center');
      mouseDrag = getOption('mouseDrag');
      autoplay = getOption('autoplay');
      autoplayHoverPause = getOption('autoplayHoverPause');
      autoplayResetOnVisibility = getOption('autoplayResetOnVisibility');

      if (bpChanged) {
        disable = getOption('disable');
        fixedWidth = getOption('fixedWidth');
        speed = getOption('speed');
        autoHeight = getOption('autoHeight');
        controlsText = getOption('controlsText');
        autoplayText = getOption('autoplayText');
        autoplayTimeout = getOption('autoplayTimeout');

        if (!CSSMQ) {
          edgePadding = getOption('edgePadding');
          gutter = getOption('gutter');
        }
      }
      // update options
      resetVariblesWhenDisable(disable);

      viewport = getViewportWidth(); // <= edgePadding, gutter
      if ((!horizontal || autoWidth) && !disable) {
        setSlidePositions();
        if (!horizontal) {
          updateContentWrapperHeight(); // <= setSlidePositions
          needContainerTransform = true;
        }
      }
      if (fixedWidth || autoWidth) {
        rightBoundary = getRightBoundary(); // autoWidth: <= viewport, slidePositions, gutter
        // fixedWidth: <= viewport, fixedWidth, gutter
        indexMax = getIndexMax(); // autoWidth: <= rightBoundary, slidePositions
        // fixedWidth: <= rightBoundary, fixedWidth, gutter
      }

      if (bpChanged || fixedWidth) {
        items = getOption('items');
        slideBy = getOption('slideBy');
        itemsChanged = items !== itemsTem;

        if (itemsChanged) {
          if (!fixedWidth && !autoWidth) {
            indexMax = getIndexMax();
          } // <= items
          // check index before transform in case
          // slider reach the right edge then items become bigger
          updateIndex();
        }
      }

      if (bpChanged) {
        if (disable !== disableTem) {
          if (disable) {
            disableSlider();
          } else {
            enableSlider(); // <= slidePositions, rightBoundary, indexMax
          }
        }
      }

      if (freezable && (bpChanged || fixedWidth || autoWidth)) {
        freeze = getFreeze(); // <= autoWidth: slidePositions, gutter, viewport, rightBoundary
        // <= fixedWidth: fixedWidth, gutter, rightBoundary
        // <= others: items

        if (freeze !== freezeTem) {
          if (freeze) {
            doContainerTransform(getContainerTransformValue(getStartIndex(0)));
            freezeSlider();
          } else {
            unfreezeSlider();
            needContainerTransform = true;
          }
        }
      }

      resetVariblesWhenDisable(disable || freeze); // controls, nav, touch, mouseDrag, arrowKeys, autoplay, autoplayHoverPause, autoplayResetOnVisibility
      if (!autoplay) {
        autoplayHoverPause = autoplayResetOnVisibility = false;
      }

      if (arrowKeys !== arrowKeysTem) {
        arrowKeys ? addEvents(doc, docmentKeydownEvent) : removeEvents(doc, docmentKeydownEvent);
      }
      if (controls !== controlsTem) {
        if (controls) {
          if (controlsContainer) {
            showElement(controlsContainer);
          } else {
            if (prevButton) {
              showElement(prevButton);
            }
            if (nextButton) {
              showElement(nextButton);
            }
          }
        } else {
          if (controlsContainer) {
            hideElement(controlsContainer);
          } else {
            if (prevButton) {
              hideElement(prevButton);
            }
            if (nextButton) {
              hideElement(nextButton);
            }
          }
        }
      }
      if (nav !== navTem) {
        nav ? showElement(navContainer) : hideElement(navContainer);
      }
      if (touch !== touchTem) {
        touch ? addEvents(container, touchEvents, options.preventScrollOnTouch) : removeEvents(container, touchEvents);
      }
      if (mouseDrag !== mouseDragTem) {
        mouseDrag ? addEvents(container, dragEvents) : removeEvents(container, dragEvents);
      }
      if (autoplay !== autoplayTem) {
        if (autoplay) {
          if (autoplayButton) {
            showElement(autoplayButton);
          }
          if (!animating && !autoplayUserPaused) {
            startAutoplay();
          }
        } else {
          if (autoplayButton) {
            hideElement(autoplayButton);
          }
          if (animating) {
            stopAutoplay();
          }
        }
      }
      if (autoplayHoverPause !== autoplayHoverPauseTem) {
        autoplayHoverPause ? addEvents(container, hoverEvents) : removeEvents(container, hoverEvents);
      }
      if (autoplayResetOnVisibility !== autoplayResetOnVisibilityTem) {
        autoplayResetOnVisibility ? addEvents(doc, visibilityEvent) : removeEvents(doc, visibilityEvent);
      }

      if (bpChanged) {
        if (fixedWidth !== fixedWidthTem || center !== centerTem) {
          needContainerTransform = true;
        }

        if (autoHeight !== autoHeightTem) {
          if (!autoHeight) {
            innerWrapper.style.height = '';
          }
        }

        if (controls && controlsText !== controlsTextTem) {
          prevButton.innerHTML = controlsText[0];
          nextButton.innerHTML = controlsText[1];
        }

        if (autoplayButton && autoplayText !== autoplayTextTem) {
          var i = autoplay ? 1 : 0,
              html = autoplayButton.innerHTML,
              len = html.length - autoplayTextTem[i].length;
          if (html.substring(len) === autoplayTextTem[i]) {
            autoplayButton.innerHTML = html.substring(0, len) + autoplayText[i];
          }
        }
      } else {
        if (center && (fixedWidth || autoWidth)) {
          needContainerTransform = true;
        }
      }

      if (itemsChanged || fixedWidth && !autoWidth) {
        pages = getPages();
        updateNavVisibility();
      }

      indChanged = index !== indexTem;
      if (indChanged) {
        events.emit('indexChanged', info());
        needContainerTransform = true;
      } else if (itemsChanged) {
        if (!indChanged) {
          additionalUpdates();
        }
      } else if (fixedWidth || autoWidth) {
        doLazyLoad();
        updateSlideStatus();
        updateLiveRegion();
      }

      if (itemsChanged && !carousel) {
        updateGallerySlidePositions();
      }

      if (!disable && !freeze) {
        // non-meduaqueries: IE8
        if (bpChanged && !CSSMQ) {
          // middle wrapper styles
          if (autoHeight !== autoheightTem || speed !== speedTem) {
            update_carousel_transition_duration();
          }

          // inner wrapper styles
          if (edgePadding !== edgePaddingTem || gutter !== gutterTem) {
            innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, speed, autoHeight);
          }

          if (horizontal) {
            // container styles
            if (carousel) {
              container.style.width = getContainerWidth(fixedWidth, gutter, items);
            }

            // slide styles
            var str = getSlideWidthStyle(fixedWidth, gutter, items) + getSlideGutterStyle(gutter);

            // remove the last line and
            // add new styles
            removeCSSRule(sheet, getCssRulesLength(sheet) - 1);
            addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet));
          }
        }

        // auto height
        if (autoHeight) {
          doAutoHeight();
        }

        if (needContainerTransform) {
          doContainerTransformSilent();
          indexCached = index;
        }
      }

      if (bpChanged) {
        events.emit('newBreakpointEnd', info(e));
      }
    }

    // === INITIALIZATION FUNCTIONS === //
    function getFreeze() {
      if (!fixedWidth && !autoWidth) {
        var a = center ? items - (items - 1) / 2 : items;
        return slideCount <= a;
      }

      var width = fixedWidth ? (fixedWidth + gutter) * slideCount : slidePositions[slideCount],
          vp = edgePadding ? viewport + edgePadding * 2 : viewport + gutter;

      if (center) {
        vp -= fixedWidth ? (viewport - fixedWidth) / 2 : (viewport - (slidePositions[index + 1] - slidePositions[index] - gutter)) / 2;
      }

      return width <= vp;
    }

    function setBreakpointZone() {
      breakpointZone = 0;
      for (var bp in responsive) {
        bp = parseInt(bp); // convert string to number
        if (windowWidth >= bp) {
          breakpointZone = bp;
        }
      }
    }

    // (slideBy, indexMin, indexMax) => index
    var updateIndex = function () {
      return loop ? carousel ?
      // loop + carousel
      function () {
        var leftEdge = indexMin,
            rightEdge = indexMax;

        leftEdge += slideBy;
        rightEdge -= slideBy;

        // adjust edges when has edge paddings
        // or fixed-width slider with extra space on the right side
        if (edgePadding) {
          leftEdge += 1;
          rightEdge -= 1;
        } else if (fixedWidth) {
          if ((viewport + gutter) % (fixedWidth + gutter)) {
            rightEdge -= 1;
          }
        }

        if (cloneCount) {
          if (index > rightEdge) {
            index -= slideCount;
          } else if (index < leftEdge) {
            index += slideCount;
          }
        }
      } :
      // loop + gallery
      function () {
        if (index > indexMax) {
          while (index >= indexMin + slideCount) {
            index -= slideCount;
          }
        } else if (index < indexMin) {
          while (index <= indexMax - slideCount) {
            index += slideCount;
          }
        }
      } :
      // non-loop
      function () {
        index = Math.max(indexMin, Math.min(indexMax, index));
      };
    }();

    function disableUI() {
      if (!autoplay && autoplayButton) {
        hideElement(autoplayButton);
      }
      if (!nav && navContainer) {
        hideElement(navContainer);
      }
      if (!controls) {
        if (controlsContainer) {
          hideElement(controlsContainer);
        } else {
          if (prevButton) {
            hideElement(prevButton);
          }
          if (nextButton) {
            hideElement(nextButton);
          }
        }
      }
    }

    function enableUI() {
      if (autoplay && autoplayButton) {
        showElement(autoplayButton);
      }
      if (nav && navContainer) {
        showElement(navContainer);
      }
      if (controls) {
        if (controlsContainer) {
          showElement(controlsContainer);
        } else {
          if (prevButton) {
            showElement(prevButton);
          }
          if (nextButton) {
            showElement(nextButton);
          }
        }
      }
    }

    function freezeSlider() {
      if (frozen) {
        return;
      }

      // remove edge padding from inner wrapper
      if (edgePadding) {
        innerWrapper.style.margin = '0px';
      }

      // add class tns-transparent to cloned slides
      if (cloneCount) {
        var str = 'tns-transparent';
        for (var i = cloneCount; i--;) {
          if (carousel) {
            addClass(slideItems[i], str);
          }
          addClass(slideItems[slideCountNew - i - 1], str);
        }
      }

      // update tools
      disableUI();

      frozen = true;
    }

    function unfreezeSlider() {
      if (!frozen) {
        return;
      }

      // restore edge padding for inner wrapper
      // for mordern browsers
      if (edgePadding && CSSMQ) {
        innerWrapper.style.margin = '';
      }

      // remove class tns-transparent to cloned slides
      if (cloneCount) {
        var str = 'tns-transparent';
        for (var i = cloneCount; i--;) {
          if (carousel) {
            removeClass(slideItems[i], str);
          }
          removeClass(slideItems[slideCountNew - i - 1], str);
        }
      }

      // update tools
      enableUI();

      frozen = false;
    }

    function disableSlider() {
      if (disabled) {
        return;
      }

      sheet.disabled = true;
      container.className = container.className.replace(newContainerClasses.substring(1), '');
      removeAttrs(container, ['style']);
      if (loop) {
        for (var j = cloneCount; j--;) {
          if (carousel) {
            hideElement(slideItems[j]);
          }
          hideElement(slideItems[slideCountNew - j - 1]);
        }
      }

      // vertical slider
      if (!horizontal || !carousel) {
        removeAttrs(innerWrapper, ['style']);
      }

      // gallery
      if (!carousel) {
        for (var i = index, l = index + slideCount; i < l; i++) {
          var item = slideItems[i];
          removeAttrs(item, ['style']);
          removeClass(item, animateIn);
          removeClass(item, animateNormal);
        }
      }

      // update tools
      disableUI();

      disabled = true;
    }

    function enableSlider() {
      if (!disabled) {
        return;
      }

      sheet.disabled = false;
      container.className += newContainerClasses;
      doContainerTransformSilent();

      if (loop) {
        for (var j = cloneCount; j--;) {
          if (carousel) {
            showElement(slideItems[j]);
          }
          showElement(slideItems[slideCountNew - j - 1]);
        }
      }

      // gallery
      if (!carousel) {
        for (var i = index, l = index + slideCount; i < l; i++) {
          var item = slideItems[i],
              classN = i < index + items ? animateIn : animateNormal;
          item.style.left = (i - index) * 100 / items + '%';
          addClass(item, classN);
        }
      }

      // update tools
      enableUI();

      disabled = false;
    }

    function updateLiveRegion() {
      var str = getLiveRegionStr();
      if (liveregionCurrent.innerHTML !== str) {
        liveregionCurrent.innerHTML = str;
      }
    }

    function getLiveRegionStr() {
      var arr = getVisibleSlideRange(),
          start = arr[0] + 1,
          end = arr[1] + 1;
      return start === end ? start + '' : start + ' to ' + end;
    }

    function getVisibleSlideRange(val) {
      if (val == null) {
        val = getContainerTransformValue();
      }
      var start = index,
          end,
          rangestart,
          rangeend;

      // get range start, range end for autoWidth and fixedWidth
      if (center || edgePadding) {
        if (autoWidth || fixedWidth) {
          rangestart = -(parseFloat(val) + edgePadding);
          rangeend = rangestart + viewport + edgePadding * 2;
        }
      } else {
        if (autoWidth) {
          rangestart = slidePositions[index];
          rangeend = rangestart + viewport;
        }
      }

      // get start, end
      // - check auto width
      if (autoWidth) {
        slidePositions.forEach(function (point, i) {
          if (i < slideCountNew) {
            if ((center || edgePadding) && point <= rangestart + 0.5) {
              start = i;
            }
            if (rangeend - point >= 0.5) {
              end = i;
            }
          }
        });

        // - check percentage width, fixed width
      } else {

        if (fixedWidth) {
          var cell = fixedWidth + gutter;
          if (center || edgePadding) {
            start = Math.floor(rangestart / cell);
            end = Math.ceil(rangeend / cell - 1);
          } else {
            end = start + Math.ceil(viewport / cell) - 1;
          }
        } else {
          if (center || edgePadding) {
            var a = items - 1;
            if (center) {
              start -= a / 2;
              end = index + a / 2;
            } else {
              end = index + a;
            }

            if (edgePadding) {
              var b = edgePadding * items / viewport;
              start -= b;
              end += b;
            }

            start = Math.floor(start);
            end = Math.ceil(end);
          } else {
            end = start + items - 1;
          }
        }

        start = Math.max(start, 0);
        end = Math.min(end, slideCountNew - 1);
      }

      return [start, end];
    }

    function doLazyLoad() {
      if (lazyload && !disable) {
        getImageArray.apply(null, getVisibleSlideRange()).forEach(function (img) {
          if (!hasClass(img, imgCompleteClass)) {
            // stop propagation transitionend event to container
            var eve = {};
            eve[TRANSITIONEND] = function (e) {
              e.stopPropagation();
            };
            addEvents(img, eve);

            addEvents(img, imgEvents);

            // update src
            img.src = getAttr(img, 'data-src');

            // update srcset
            var srcset = getAttr(img, 'data-srcset');
            if (srcset) {
              img.srcset = srcset;
            }

            addClass(img, 'loading');
          }
        });
      }
    }

    function onImgLoaded(e) {
      imgLoaded(getTarget(e));
    }

    function onImgFailed(e) {
      imgFailed(getTarget(e));
    }

    function imgLoaded(img) {
      addClass(img, 'loaded');
      imgCompleted(img);
    }

    function imgFailed(img) {
      addClass(img, 'failed');
      imgCompleted(img);
    }

    function imgCompleted(img) {
      addClass(img, 'tns-complete');
      removeClass(img, 'loading');
      removeEvents(img, imgEvents);
    }

    function getImageArray(start, end) {
      var imgs = [];
      while (start <= end) {
        forEach(slideItems[start].querySelectorAll('img'), function (img) {
          imgs.push(img);
        });
        start++;
      }

      return imgs;
    }

    // check if all visible images are loaded
    // and update container height if it's done
    function doAutoHeight() {
      var imgs = getImageArray.apply(null, getVisibleSlideRange());
      raf(function () {
        imgsLoadedCheck(imgs, updateInnerWrapperHeight);
      });
    }

    function imgsLoadedCheck(imgs, cb) {
      // directly execute callback function if all images are complete
      if (imgsComplete) {
        return cb();
      }

      // check selected image classes otherwise
      imgs.forEach(function (img, index) {
        if (hasClass(img, imgCompleteClass)) {
          imgs.splice(index, 1);
        }
      });

      // execute callback function if selected images are all complete
      if (!imgs.length) {
        return cb();
      }

      // otherwise execute this functiona again
      raf(function () {
        imgsLoadedCheck(imgs, cb);
      });
    }

    function additionalUpdates() {
      doLazyLoad();
      updateSlideStatus();
      updateLiveRegion();
      updateControlsStatus();
      updateNavStatus();
    }

    function update_carousel_transition_duration() {
      if (carousel && autoHeight) {
        middleWrapper.style[TRANSITIONDURATION] = speed / 1000 + 's';
      }
    }

    function getMaxSlideHeight(slideStart, slideRange) {
      var heights = [];
      for (var i = slideStart, l = Math.min(slideStart + slideRange, slideCountNew); i < l; i++) {
        heights.push(slideItems[i].offsetHeight);
      }

      return Math.max.apply(null, heights);
    }

    // update inner wrapper height
    // 1. get the max-height of the visible slides
    // 2. set transitionDuration to speed
    // 3. update inner wrapper height to max-height
    // 4. set transitionDuration to 0s after transition done
    function updateInnerWrapperHeight() {
      var maxHeight = autoHeight ? getMaxSlideHeight(index, items) : getMaxSlideHeight(cloneCount, slideCount),
          wp = middleWrapper ? middleWrapper : innerWrapper;

      if (wp.style.height !== maxHeight) {
        wp.style.height = maxHeight + 'px';
      }
    }

    // get the distance from the top edge of the first slide to each slide
    // (init) => slidePositions
    function setSlidePositions() {
      slidePositions = [0];
      var attr = horizontal ? 'left' : 'top',
          attr2 = horizontal ? 'right' : 'bottom',
          base = slideItems[0].getBoundingClientRect()[attr];

      forEach(slideItems, function (item, i) {
        // skip the first slide
        if (i) {
          slidePositions.push(item.getBoundingClientRect()[attr] - base);
        }
        // add the end edge
        if (i === slideCountNew - 1) {
          slidePositions.push(item.getBoundingClientRect()[attr2] - base);
        }
      });
    }

    // update slide
    function updateSlideStatus() {
      var range = getVisibleSlideRange(),
          start = range[0],
          end = range[1];

      forEach(slideItems, function (item, i) {
        // show slides
        if (i >= start && i <= end) {
          if (hasAttr(item, 'aria-hidden')) {
            removeAttrs(item, ['aria-hidden', 'tabindex']);
            addClass(item, slideActiveClass);
          }
          // hide slides
        } else {
          if (!hasAttr(item, 'aria-hidden')) {
            setAttrs(item, {
              'aria-hidden': 'true',
              'tabindex': '-1'
            });
            removeClass(item, slideActiveClass);
          }
        }
      });
    }

    // gallery: update slide position
    function updateGallerySlidePositions() {
      var l = index + Math.min(slideCount, items);
      for (var i = slideCountNew; i--;) {
        var item = slideItems[i];

        if (i >= index && i < l) {
          // add transitions to visible slides when adjusting their positions
          addClass(item, 'tns-moving');

          item.style.left = (i - index) * 100 / items + '%';
          addClass(item, animateIn);
          removeClass(item, animateNormal);
        } else if (item.style.left) {
          item.style.left = '';
          addClass(item, animateNormal);
          removeClass(item, animateIn);
        }

        // remove outlet animation
        removeClass(item, animateOut);
      }

      // removing '.tns-moving'
      setTimeout(function () {
        forEach(slideItems, function (el) {
          removeClass(el, 'tns-moving');
        });
      }, 300);
    }

    // set tabindex on Nav
    function updateNavStatus() {
      // get current nav
      if (nav) {
        navCurrentIndex = navClicked >= 0 ? navClicked : getCurrentNavIndex();
        navClicked = -1;

        if (navCurrentIndex !== navCurrentIndexCached) {
          var navPrev = navItems[navCurrentIndexCached],
              navCurrent = navItems[navCurrentIndex];

          setAttrs(navPrev, {
            'tabindex': '-1',
            'aria-label': navStr + (navCurrentIndexCached + 1)
          });
          removeClass(navPrev, navActiveClass);

          setAttrs(navCurrent, { 'aria-label': navStr + (navCurrentIndex + 1) + navStrCurrent });
          removeAttrs(navCurrent, 'tabindex');
          addClass(navCurrent, navActiveClass);

          navCurrentIndexCached = navCurrentIndex;
        }
      }
    }

    function getLowerCaseNodeName(el) {
      return el.nodeName.toLowerCase();
    }

    function isButton(el) {
      return getLowerCaseNodeName(el) === 'button';
    }

    function isAriaDisabled(el) {
      return el.getAttribute('aria-disabled') === 'true';
    }

    function disEnableElement(isButton, el, val) {
      if (isButton) {
        el.disabled = val;
      } else {
        el.setAttribute('aria-disabled', val.toString());
      }
    }

    // set 'disabled' to true on controls when reach the edges
    function updateControlsStatus() {
      if (!controls || rewind || loop) {
        return;
      }

      var prevDisabled = prevIsButton ? prevButton.disabled : isAriaDisabled(prevButton),
          nextDisabled = nextIsButton ? nextButton.disabled : isAriaDisabled(nextButton),
          disablePrev = index <= indexMin ? true : false,
          disableNext = !rewind && index >= indexMax ? true : false;

      if (disablePrev && !prevDisabled) {
        disEnableElement(prevIsButton, prevButton, true);
      }
      if (!disablePrev && prevDisabled) {
        disEnableElement(prevIsButton, prevButton, false);
      }
      if (disableNext && !nextDisabled) {
        disEnableElement(nextIsButton, nextButton, true);
      }
      if (!disableNext && nextDisabled) {
        disEnableElement(nextIsButton, nextButton, false);
      }
    }

    // set duration
    function resetDuration(el, str) {
      if (TRANSITIONDURATION) {
        el.style[TRANSITIONDURATION] = str;
      }
    }

    function getSliderWidth() {
      return fixedWidth ? (fixedWidth + gutter) * slideCountNew : slidePositions[slideCountNew];
    }

    function getCenterGap(num) {
      if (num == null) {
        num = index;
      }

      var gap = edgePadding ? gutter : 0;
      return autoWidth ? (viewport - gap - (slidePositions[num + 1] - slidePositions[num] - gutter)) / 2 : fixedWidth ? (viewport - fixedWidth) / 2 : (items - 1) / 2;
    }

    function getRightBoundary() {
      var gap = edgePadding ? gutter : 0,
          result = viewport + gap - getSliderWidth();

      if (center && !loop) {
        result = fixedWidth ? -(fixedWidth + gutter) * (slideCountNew - 1) - getCenterGap() : getCenterGap(slideCountNew - 1) - slidePositions[slideCountNew - 1];
      }
      if (result > 0) {
        result = 0;
      }

      return result;
    }

    function getContainerTransformValue(num) {
      if (num == null) {
        num = index;
      }

      var val;
      if (horizontal && !autoWidth) {
        if (fixedWidth) {
          val = -(fixedWidth + gutter) * num;
          if (center) {
            val += getCenterGap();
          }
        } else {
          var denominator = TRANSFORM ? slideCountNew : items;
          if (center) {
            num -= getCenterGap();
          }
          val = -num * 100 / denominator;
        }
      } else {
        val = -slidePositions[num];
        if (center && autoWidth) {
          val += getCenterGap();
        }
      }

      if (hasRightDeadZone) {
        val = Math.max(val, rightBoundary);
      }

      val += horizontal && !autoWidth && !fixedWidth ? '%' : 'px';

      return val;
    }

    function doContainerTransformSilent(val) {
      resetDuration(container, '0s');
      doContainerTransform(val);
    }

    function doContainerTransform(val) {
      if (val == null) {
        val = getContainerTransformValue();
      }
      container.style[transformAttr] = transformPrefix + val + transformPostfix;
    }

    function animateSlide(number, classOut, classIn, isOut) {
      var l = number + items;
      if (!loop) {
        l = Math.min(l, slideCountNew);
      }

      for (var i = number; i < l; i++) {
        var item = slideItems[i];

        // set item positions
        if (!isOut) {
          item.style.left = (i - index) * 100 / items + '%';
        }

        if (animateDelay && TRANSITIONDELAY) {
          item.style[TRANSITIONDELAY] = item.style[ANIMATIONDELAY] = animateDelay * (i - number) / 1000 + 's';
        }
        removeClass(item, classOut);
        addClass(item, classIn);

        if (isOut) {
          slideItemsOut.push(item);
        }
      }
    }

    // make transfer after click/drag:
    // 1. change 'transform' property for mordern browsers
    // 2. change 'left' property for legacy browsers
    var transformCore = function () {
      return carousel ? function () {
        resetDuration(container, '');
        if (TRANSITIONDURATION || !speed) {
          // for morden browsers with non-zero duration or 
          // zero duration for all browsers
          doContainerTransform();
          // run fallback function manually 
          // when duration is 0 / container is hidden
          if (!speed || !isVisible(container)) {
            onTransitionEnd();
          }
        } else {
          // for old browser with non-zero duration
          jsTransform(container, transformAttr, transformPrefix, transformPostfix, getContainerTransformValue(), speed, onTransitionEnd);
        }

        if (!horizontal) {
          updateContentWrapperHeight();
        }
      } : function () {
        slideItemsOut = [];

        var eve = {};
        eve[TRANSITIONEND] = eve[ANIMATIONEND] = onTransitionEnd;
        removeEvents(slideItems[indexCached], eve);
        addEvents(slideItems[index], eve);

        animateSlide(indexCached, animateIn, animateOut, true);
        animateSlide(index, animateNormal, animateIn);

        // run fallback function manually 
        // when transition or animation not supported / duration is 0
        if (!TRANSITIONEND || !ANIMATIONEND || !speed || !isVisible(container)) {
          onTransitionEnd();
        }
      };
    }();

    function render(e, sliderMoved) {
      if (updateIndexBeforeTransform) {
        updateIndex();
      }

      // render when slider was moved (touch or drag) even though index may not change
      if (index !== indexCached || sliderMoved) {
        // events
        events.emit('indexChanged', info());
        events.emit('transitionStart', info());
        if (autoHeight) {
          doAutoHeight();
        }

        // pause autoplay when click or keydown from user
        if (animating && e && ['click', 'keydown'].indexOf(e.type) >= 0) {
          stopAutoplay();
        }

        running = true;
        transformCore();
      }
    }

    /*
     * Transfer prefixed properties to the same format
     * CSS: -Webkit-Transform => webkittransform
     * JS: WebkitTransform => webkittransform
     * @param {string} str - property
     *
     */
    function strTrans(str) {
      return str.toLowerCase().replace(/-/g, '');
    }

    // AFTER TRANSFORM
    // Things need to be done after a transfer:
    // 1. check index
    // 2. add classes to visible slide
    // 3. disable controls buttons when reach the first/last slide in non-loop slider
    // 4. update nav status
    // 5. lazyload images
    // 6. update container height
    function onTransitionEnd(event) {
      // check running on gallery mode
      // make sure trantionend/animationend events run only once
      if (carousel || running) {
        events.emit('transitionEnd', info(event));

        if (!carousel && slideItemsOut.length > 0) {
          for (var i = 0; i < slideItemsOut.length; i++) {
            var item = slideItemsOut[i];
            // set item positions
            item.style.left = '';

            if (ANIMATIONDELAY && TRANSITIONDELAY) {
              item.style[ANIMATIONDELAY] = '';
              item.style[TRANSITIONDELAY] = '';
            }
            removeClass(item, animateOut);
            addClass(item, animateNormal);
          }
        }

        /* update slides, nav, controls after checking ...
         * => legacy browsers who don't support 'event' 
         *    have to check event first, otherwise event.target will cause an error 
         * => or 'gallery' mode: 
         *   + event target is slide item
         * => or 'carousel' mode: 
         *   + event target is container, 
         *   + event.property is the same with transform attribute
         */
        if (!event || !carousel && event.target.parentNode === container || event.target === container && strTrans(event.propertyName) === strTrans(transformAttr)) {

          if (!updateIndexBeforeTransform) {
            var indexTem = index;
            updateIndex();
            if (index !== indexTem) {
              events.emit('indexChanged', info());

              doContainerTransformSilent();
            }
          }

          if (nested === 'inner') {
            events.emit('innerLoaded', info());
          }
          running = false;
          indexCached = index;
        }
      }
    }

    // # ACTIONS
    function goTo(targetIndex, e) {
      if (freeze) {
        return;
      }

      // prev slideBy
      if (targetIndex === 'prev') {
        onControlsClick(e, -1);

        // next slideBy
      } else if (targetIndex === 'next') {
        onControlsClick(e, 1);

        // go to exact slide
      } else {
        if (running) {
          if (preventActionWhenRunning) {
            return;
          } else {
            onTransitionEnd();
          }
        }

        var absIndex = getAbsIndex(),
            indexGap = 0;

        if (targetIndex === 'first') {
          indexGap = -absIndex;
        } else if (targetIndex === 'last') {
          indexGap = carousel ? slideCount - items - absIndex : slideCount - 1 - absIndex;
        } else {
          if (typeof targetIndex !== 'number') {
            targetIndex = parseInt(targetIndex);
          }

          if (!isNaN(targetIndex)) {
            // from directly called goTo function
            if (!e) {
              targetIndex = Math.max(0, Math.min(slideCount - 1, targetIndex));
            }

            indexGap = targetIndex - absIndex;
          }
        }

        // gallery: make sure new page won't overlap with current page
        if (!carousel && indexGap && Math.abs(indexGap) < items) {
          var factor = indexGap > 0 ? 1 : -1;
          indexGap += index + indexGap - slideCount >= indexMin ? slideCount * factor : slideCount * 2 * factor * -1;
        }

        index += indexGap;

        // make sure index is in range
        if (carousel && loop) {
          if (index < indexMin) {
            index += slideCount;
          }
          if (index > indexMax) {
            index -= slideCount;
          }
        }

        // if index is changed, start rendering
        if (getAbsIndex(index) !== getAbsIndex(indexCached)) {
          render(e);
        }
      }
    }

    // on controls click
    function onControlsClick(e, dir) {
      if (running) {
        if (preventActionWhenRunning) {
          return;
        } else {
          onTransitionEnd();
        }
      }
      var passEventObject;

      if (!dir) {
        e = getEvent(e);
        var target = getTarget(e);

        while (target !== controlsContainer && [prevButton, nextButton].indexOf(target) < 0) {
          target = target.parentNode;
        }

        var targetIn = [prevButton, nextButton].indexOf(target);
        if (targetIn >= 0) {
          passEventObject = true;
          dir = targetIn === 0 ? -1 : 1;
        }
      }

      if (rewind) {
        if (index === indexMin && dir === -1) {
          goTo('last', e);
          return;
        } else if (index === indexMax && dir === 1) {
          goTo('first', e);
          return;
        }
      }

      if (dir) {
        index += slideBy * dir;
        if (autoWidth) {
          index = Math.floor(index);
        }
        // pass e when click control buttons or keydown
        render(passEventObject || e && e.type === 'keydown' ? e : null);
      }
    }

    // on nav click
    function onNavClick(e) {
      if (running) {
        if (preventActionWhenRunning) {
          return;
        } else {
          onTransitionEnd();
        }
      }

      e = getEvent(e);
      var target = getTarget(e),
          navIndex;

      // find the clicked nav item
      while (target !== navContainer && !hasAttr(target, 'data-nav')) {
        target = target.parentNode;
      }
      if (hasAttr(target, 'data-nav')) {
        var navIndex = navClicked = Number(getAttr(target, 'data-nav')),
            targetIndexBase = fixedWidth || autoWidth ? navIndex * slideCount / pages : navIndex * items,
            targetIndex = navAsThumbnails ? navIndex : Math.min(Math.ceil(targetIndexBase), slideCount - 1);
        goTo(targetIndex, e);

        if (navCurrentIndex === navIndex) {
          if (animating) {
            stopAutoplay();
          }
          navClicked = -1; // reset navClicked
        }
      }
    }

    // autoplay functions
    function setAutoplayTimer() {
      autoplayTimer = setInterval(function () {
        onControlsClick(null, autoplayDirection);
      }, autoplayTimeout);

      animating = true;
    }

    function stopAutoplayTimer() {
      clearInterval(autoplayTimer);
      animating = false;
    }

    function updateAutoplayButton(action, txt) {
      setAttrs(autoplayButton, { 'data-action': action });
      autoplayButton.innerHTML = autoplayHtmlStrings[0] + action + autoplayHtmlStrings[1] + txt;
    }

    function startAutoplay() {
      setAutoplayTimer();
      if (autoplayButton) {
        updateAutoplayButton('stop', autoplayText[1]);
      }
    }

    function stopAutoplay() {
      stopAutoplayTimer();
      if (autoplayButton) {
        updateAutoplayButton('start', autoplayText[0]);
      }
    }

    // programaitcally play/pause the slider
    function play() {
      if (autoplay && !animating) {
        startAutoplay();
        autoplayUserPaused = false;
      }
    }
    function pause() {
      if (animating) {
        stopAutoplay();
        autoplayUserPaused = true;
      }
    }

    function toggleAutoplay() {
      if (animating) {
        stopAutoplay();
        autoplayUserPaused = true;
      } else {
        startAutoplay();
        autoplayUserPaused = false;
      }
    }

    function onVisibilityChange() {
      if (doc.hidden) {
        if (animating) {
          stopAutoplayTimer();
          autoplayVisibilityPaused = true;
        }
      } else if (autoplayVisibilityPaused) {
        setAutoplayTimer();
        autoplayVisibilityPaused = false;
      }
    }

    function mouseoverPause() {
      if (animating) {
        stopAutoplayTimer();
        autoplayHoverPaused = true;
      }
    }

    function mouseoutRestart() {
      if (autoplayHoverPaused) {
        setAutoplayTimer();
        autoplayHoverPaused = false;
      }
    }

    // keydown events on document 
    function onDocumentKeydown(e) {
      e = getEvent(e);
      var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode);

      if (keyIndex >= 0) {
        onControlsClick(e, keyIndex === 0 ? -1 : 1);
      }
    }

    // on key control
    function onControlsKeydown(e) {
      e = getEvent(e);
      var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode);

      if (keyIndex >= 0) {
        if (keyIndex === 0) {
          if (!prevButton.disabled) {
            onControlsClick(e, -1);
          }
        } else if (!nextButton.disabled) {
          onControlsClick(e, 1);
        }
      }
    }

    // set focus
    function setFocus(el) {
      el.focus();
    }

    // on key nav
    function onNavKeydown(e) {
      e = getEvent(e);
      var curElement = doc.activeElement;
      if (!hasAttr(curElement, 'data-nav')) {
        return;
      }

      // var code = e.keyCode,
      var keyIndex = [KEYS.LEFT, KEYS.RIGHT, KEYS.ENTER, KEYS.SPACE].indexOf(e.keyCode),
          navIndex = Number(getAttr(curElement, 'data-nav'));

      if (keyIndex >= 0) {
        if (keyIndex === 0) {
          if (navIndex > 0) {
            setFocus(navItems[navIndex - 1]);
          }
        } else if (keyIndex === 1) {
          if (navIndex < pages - 1) {
            setFocus(navItems[navIndex + 1]);
          }
        } else {
          navClicked = navIndex;
          goTo(navIndex, e);
        }
      }
    }

    function getEvent(e) {
      e = e || win.event;
      return isTouchEvent(e) ? e.changedTouches[0] : e;
    }
    function getTarget(e) {
      return e.target || win.event.srcElement;
    }

    function isTouchEvent(e) {
      return e.type.indexOf('touch') >= 0;
    }

    function preventDefaultBehavior(e) {
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
    }

    function getMoveDirectionExpected() {
      return getTouchDirection(toDegree(lastPosition.y - initPosition.y, lastPosition.x - initPosition.x), swipeAngle) === options.axis;
    }

    function onPanStart(e) {
      if (running) {
        if (preventActionWhenRunning) {
          return;
        } else {
          onTransitionEnd();
        }
      }

      if (autoplay && animating) {
        stopAutoplayTimer();
      }

      panStart = true;
      if (rafIndex) {
        caf(rafIndex);
        rafIndex = null;
      }

      var $ = getEvent(e);
      events.emit(isTouchEvent(e) ? 'touchStart' : 'dragStart', info(e));

      if (!isTouchEvent(e) && ['img', 'a'].indexOf(getLowerCaseNodeName(getTarget(e))) >= 0) {
        preventDefaultBehavior(e);
      }

      lastPosition.x = initPosition.x = $.clientX;
      lastPosition.y = initPosition.y = $.clientY;
      if (carousel) {
        translateInit = parseFloat(container.style[transformAttr].replace(transformPrefix, ''));
        resetDuration(container, '0s');
      }
    }

    function onPanMove(e) {
      if (panStart) {
        var $ = getEvent(e);
        lastPosition.x = $.clientX;
        lastPosition.y = $.clientY;

        if (carousel) {
          if (!rafIndex) {
            rafIndex = raf(function () {
              panUpdate(e);
            });
          }
        } else {
          if (moveDirectionExpected === '?') {
            moveDirectionExpected = getMoveDirectionExpected();
          }
          if (moveDirectionExpected) {
            preventScroll = true;
          }
        }

        if (preventScroll) {
          e.preventDefault();
        }
      }
    }

    function panUpdate(e) {
      if (!moveDirectionExpected) {
        panStart = false;
        return;
      }
      caf(rafIndex);
      if (panStart) {
        rafIndex = raf(function () {
          panUpdate(e);
        });
      }

      if (moveDirectionExpected === '?') {
        moveDirectionExpected = getMoveDirectionExpected();
      }
      if (moveDirectionExpected) {
        if (!preventScroll && isTouchEvent(e)) {
          preventScroll = true;
        }

        try {
          if (e.type) {
            events.emit(isTouchEvent(e) ? 'touchMove' : 'dragMove', info(e));
          }
        } catch (err) {}

        var x = translateInit,
            dist = getDist(lastPosition, initPosition);
        if (!horizontal || fixedWidth || autoWidth) {
          x += dist;
          x += 'px';
        } else {
          var percentageX = TRANSFORM ? dist * items * 100 / ((viewport + gutter) * slideCountNew) : dist * 100 / (viewport + gutter);
          x += percentageX;
          x += '%';
        }

        container.style[transformAttr] = transformPrefix + x + transformPostfix;
      }
    }

    function onPanEnd(e) {
      if (panStart) {
        if (rafIndex) {
          caf(rafIndex);
          rafIndex = null;
        }
        if (carousel) {
          resetDuration(container, '');
        }
        panStart = false;

        var $ = getEvent(e);
        lastPosition.x = $.clientX;
        lastPosition.y = $.clientY;
        var dist = getDist(lastPosition, initPosition);

        if (Math.abs(dist)) {
          // drag vs click
          if (!isTouchEvent(e)) {
            // prevent "click"
            var target = getTarget(e);
            addEvents(target, { 'click': function preventClick(e) {
                preventDefaultBehavior(e);
                removeEvents(target, { 'click': preventClick });
              } });
          }

          if (carousel) {
            rafIndex = raf(function () {
              if (horizontal && !autoWidth) {
                var indexMoved = -dist * items / (viewport + gutter);
                indexMoved = dist > 0 ? Math.floor(indexMoved) : Math.ceil(indexMoved);
                index += indexMoved;
              } else {
                var moved = -(translateInit + dist);
                if (moved <= 0) {
                  index = indexMin;
                } else if (moved >= slidePositions[slideCountNew - 1]) {
                  index = indexMax;
                } else {
                  var i = 0;
                  while (i < slideCountNew && moved >= slidePositions[i]) {
                    index = i;
                    if (moved > slidePositions[i] && dist < 0) {
                      index += 1;
                    }
                    i++;
                  }
                }
              }

              render(e, dist);
              events.emit(isTouchEvent(e) ? 'touchEnd' : 'dragEnd', info(e));
            });
          } else {
            if (moveDirectionExpected) {
              onControlsClick(e, dist > 0 ? -1 : 1);
            }
          }
        }
      }

      // reset
      if (options.preventScrollOnTouch === 'auto') {
        preventScroll = false;
      }
      if (swipeAngle) {
        moveDirectionExpected = '?';
      }
      if (autoplay && !animating) {
        setAutoplayTimer();
      }
    }

    // === RESIZE FUNCTIONS === //
    // (slidePositions, index, items) => vertical_conentWrapper.height
    function updateContentWrapperHeight() {
      var wp = middleWrapper ? middleWrapper : innerWrapper;
      wp.style.height = slidePositions[index + items] - slidePositions[index] + 'px';
    }

    function getPages() {
      var rough = fixedWidth ? (fixedWidth + gutter) * slideCount / viewport : slideCount / items;
      return Math.min(Math.ceil(rough), slideCount);
    }

    /*
     * 1. update visible nav items list
     * 2. add "hidden" attributes to previous visible nav items
     * 3. remove "hidden" attrubutes to new visible nav items
     */
    function updateNavVisibility() {
      if (!nav || navAsThumbnails) {
        return;
      }

      if (pages !== pagesCached) {
        var min = pagesCached,
            max = pages,
            fn = showElement;

        if (pagesCached > pages) {
          min = pages;
          max = pagesCached;
          fn = hideElement;
        }

        while (min < max) {
          fn(navItems[min]);
          min++;
        }

        // cache pages
        pagesCached = pages;
      }
    }

    function info(e) {
      return {
        container: container,
        slideItems: slideItems,
        navContainer: navContainer,
        navItems: navItems,
        controlsContainer: controlsContainer,
        hasControls: hasControls,
        prevButton: prevButton,
        nextButton: nextButton,
        items: items,
        slideBy: slideBy,
        cloneCount: cloneCount,
        slideCount: slideCount,
        slideCountNew: slideCountNew,
        index: index,
        indexCached: indexCached,
        displayIndex: getCurrentSlide(),
        navCurrentIndex: navCurrentIndex,
        navCurrentIndexCached: navCurrentIndexCached,
        pages: pages,
        pagesCached: pagesCached,
        sheet: sheet,
        isOn: isOn,
        event: e || {}
      };
    }

    return {
      version: '2.9.2',
      getInfo: info,
      events: events,
      goTo: goTo,
      play: play,
      pause: pause,
      isOn: isOn,
      updateSliderHeight: updateInnerWrapperHeight,
      refresh: initSliderTransform,
      destroy: destroy,
      rebuild: function rebuild() {
        return tns(extend(options, optionsElements));
      }
    };
  };

  return tns;
}();
'use strict';

var handleToggle = function handleToggle(event) {
  var target = event.target;
  var parentNode = target.closest('.faq-item');

  parentNode.classList.toggle('open');
};

// Add eventListeners.
var toggles = document.querySelectorAll('.js-faq-item-toggle');

for (var i = 0; i < toggles.length; i++) {
  var item = toggles[i];

  item.addEventListener('click', handleToggle);
}
'use strict';

(function () {
  var handleToggle = function handleToggle(event) {
    var sidebars = document.querySelectorAll('.sidebar');

    for (var i = 0; i < sidebars.length; i++) {
      var sidebar = sidebars[i];

      sidebar.classList.toggle('open');
    }
  };

  // Add eventListeners.
  var toggles = document.querySelectorAll('.js-sidebar-toggle');

  for (var i = 0; i < toggles.length; i++) {
    var item = toggles[i];

    item.addEventListener('click', handleToggle);
  }
})();
'use strict';

(function () {
  function handleToggle(event) {
    var clickedElement = this;
    var wrapper = clickedElement.closest('.tabba');
    var toggles = wrapper.querySelectorAll('.js-tabba-toggle');

    for (var i = 0; i < toggles.length; i++) {
      var toggle = toggles[i];
      var toggleWrapper = toggle.closest('.tabba');
      var nodeIsSame = toggle.isSameNode(clickedElement);
      var wrapperIsSame = toggleWrapper.isSameNode(wrapper);

      if (nodeIsSame && wrapperIsSame) {
        toggleElement(wrapper, i);
      }
    }
  }

  function toggleElement(wrapper, index) {
    var toggles = wrapper.querySelectorAll('.js-tabba-toggle');
    var contentItems = wrapper.querySelectorAll('.tabba-item');

    // Show content item
    var contentItemIndex = 0;
    for (var contentItemInt = 0; contentItemInt < contentItems.length; contentItemInt++) {
      var contentItem = contentItems[contentItemInt];
      var contentItemWrapper = contentItem.closest('.tabba');
      var contentWrapperIsSame = contentItemWrapper.isSameNode(wrapper);

      if (contentWrapperIsSame) {

        if (index === contentItemIndex) {
          contentItem.classList.remove('hidden');
        } else {
          contentItem.classList.add('hidden');
        }

        contentItemIndex++;
      }
    }

    // Set active class on toggle.
    var toggleIndex = 0;
    for (var toggleInt = 0; toggleInt < toggles.length; toggleInt++) {
      var toggle = toggles[toggleInt];
      var toggleWrapper = toggle.closest('.tabba');
      var toggleWrapperIsSame = toggleWrapper.isSameNode(wrapper);

      if (toggleWrapperIsSame) {

        if (index === toggleIndex) {
          toggle.classList.add('active');
        } else {
          toggle.classList.remove('active');
        }

        toggleIndex++;
      }
    }
  }

  // Add eventListeners.
  var wrappers = document.querySelectorAll('.tabba');

  for (var wrapperInt = 0; wrapperInt < wrappers.length; wrapperInt++) {
    var wrapper = wrappers[wrapperInt];
    var toggles = wrapper.querySelectorAll('.js-tabba-toggle');

    // Show the first element upon page load.
    toggleElement(wrapper, 0);

    // Run through toggles.
    for (var toggleInt = 0; toggleInt < toggles.length; toggleInt++) {
      var toggle = toggles[toggleInt];

      toggle.addEventListener('click', handleToggle);
    }
  }
})();
'use strict';

jQuery(function ($) {
  'use strict';

  // Flexy header
  // flexy_header.init();

  // Sidr

  $('.slinky-menu').find('ul, li, a').removeClass();

  // Enable tooltips.
  $('[data-toggle="tooltip"]').tooltip();

  // Showcases.
  var slider = tns({
    container: '.showcases',
    items: 1,
    slideBy: 'page',
    autoplay: true
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvb3RzdHJhcC5qcyIsImZsZXh5LWhlYWRlci5qcyIsInBhY2UuanMiLCJqcXVlcnkuc2xpbmt5LmpzIiwidGlueS1zbGlkZXIuanMiLCJmYXEtaXRlbXMuanMiLCJzaWRlYmFyLXRvZ2dsZS5qcyIsInRhYmJhLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbImpRdWVyeSIsIkVycm9yIiwiJCIsInZlcnNpb24iLCJmbiIsImpxdWVyeSIsInNwbGl0IiwidHJhbnNpdGlvbkVuZCIsImVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidHJhbnNFbmRFdmVudE5hbWVzIiwiV2Via2l0VHJhbnNpdGlvbiIsIk1velRyYW5zaXRpb24iLCJPVHJhbnNpdGlvbiIsInRyYW5zaXRpb24iLCJuYW1lIiwic3R5bGUiLCJ1bmRlZmluZWQiLCJlbmQiLCJlbXVsYXRlVHJhbnNpdGlvbkVuZCIsImR1cmF0aW9uIiwiY2FsbGVkIiwiJGVsIiwib25lIiwiY2FsbGJhY2siLCJ0cmlnZ2VyIiwic3VwcG9ydCIsInNldFRpbWVvdXQiLCJldmVudCIsInNwZWNpYWwiLCJic1RyYW5zaXRpb25FbmQiLCJiaW5kVHlwZSIsImRlbGVnYXRlVHlwZSIsImhhbmRsZSIsImUiLCJ0YXJnZXQiLCJpcyIsImhhbmRsZU9iaiIsImhhbmRsZXIiLCJhcHBseSIsImFyZ3VtZW50cyIsImRpc21pc3MiLCJBbGVydCIsIm9uIiwiY2xvc2UiLCJWRVJTSU9OIiwiVFJBTlNJVElPTl9EVVJBVElPTiIsInByb3RvdHlwZSIsIiR0aGlzIiwic2VsZWN0b3IiLCJhdHRyIiwicmVwbGFjZSIsIiRwYXJlbnQiLCJmaW5kIiwicHJldmVudERlZmF1bHQiLCJsZW5ndGgiLCJjbG9zZXN0IiwiRXZlbnQiLCJpc0RlZmF1bHRQcmV2ZW50ZWQiLCJyZW1vdmVDbGFzcyIsInJlbW92ZUVsZW1lbnQiLCJkZXRhY2giLCJyZW1vdmUiLCJoYXNDbGFzcyIsIlBsdWdpbiIsIm9wdGlvbiIsImVhY2giLCJkYXRhIiwiY2FsbCIsIm9sZCIsImFsZXJ0IiwiQ29uc3RydWN0b3IiLCJub0NvbmZsaWN0IiwiQnV0dG9uIiwiZWxlbWVudCIsIm9wdGlvbnMiLCIkZWxlbWVudCIsImV4dGVuZCIsIkRFRkFVTFRTIiwiaXNMb2FkaW5nIiwibG9hZGluZ1RleHQiLCJzZXRTdGF0ZSIsInN0YXRlIiwiZCIsInZhbCIsInJlc2V0VGV4dCIsInByb3h5IiwiYWRkQ2xhc3MiLCJwcm9wIiwicmVtb3ZlQXR0ciIsInRvZ2dsZSIsImNoYW5nZWQiLCIkaW5wdXQiLCJ0b2dnbGVDbGFzcyIsImJ1dHRvbiIsIiRidG4iLCJmaXJzdCIsInRlc3QiLCJ0eXBlIiwiQ2Fyb3VzZWwiLCIkaW5kaWNhdG9ycyIsInBhdXNlZCIsInNsaWRpbmciLCJpbnRlcnZhbCIsIiRhY3RpdmUiLCIkaXRlbXMiLCJrZXlib2FyZCIsImtleWRvd24iLCJwYXVzZSIsImRvY3VtZW50RWxlbWVudCIsImN5Y2xlIiwid3JhcCIsInRhZ05hbWUiLCJ3aGljaCIsInByZXYiLCJuZXh0IiwiY2xlYXJJbnRlcnZhbCIsInNldEludGVydmFsIiwiZ2V0SXRlbUluZGV4IiwiaXRlbSIsInBhcmVudCIsImNoaWxkcmVuIiwiaW5kZXgiLCJnZXRJdGVtRm9yRGlyZWN0aW9uIiwiZGlyZWN0aW9uIiwiYWN0aXZlIiwiYWN0aXZlSW5kZXgiLCJ3aWxsV3JhcCIsImRlbHRhIiwiaXRlbUluZGV4IiwiZXEiLCJ0byIsInBvcyIsInRoYXQiLCJzbGlkZSIsIiRuZXh0IiwiaXNDeWNsaW5nIiwicmVsYXRlZFRhcmdldCIsInNsaWRlRXZlbnQiLCIkbmV4dEluZGljYXRvciIsInNsaWRFdmVudCIsIm9mZnNldFdpZHRoIiwiam9pbiIsImFjdGlvbiIsImNhcm91c2VsIiwiY2xpY2tIYW5kbGVyIiwiaHJlZiIsIiR0YXJnZXQiLCJzbGlkZUluZGV4Iiwid2luZG93IiwiJGNhcm91c2VsIiwiQ29sbGFwc2UiLCIkdHJpZ2dlciIsImlkIiwidHJhbnNpdGlvbmluZyIsImdldFBhcmVudCIsImFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyIsImRpbWVuc2lvbiIsImhhc1dpZHRoIiwic2hvdyIsImFjdGl2ZXNEYXRhIiwiYWN0aXZlcyIsInN0YXJ0RXZlbnQiLCJjb21wbGV0ZSIsInNjcm9sbFNpemUiLCJjYW1lbENhc2UiLCJoaWRlIiwib2Zmc2V0SGVpZ2h0IiwiaSIsImdldFRhcmdldEZyb21UcmlnZ2VyIiwiaXNPcGVuIiwiY29sbGFwc2UiLCJiYWNrZHJvcCIsIkRyb3Bkb3duIiwiY2xlYXJNZW51cyIsImNvbnRhaW5zIiwiaXNBY3RpdmUiLCJpbnNlcnRBZnRlciIsInN0b3BQcm9wYWdhdGlvbiIsImRlc2MiLCJkcm9wZG93biIsIk1vZGFsIiwiJGJvZHkiLCJib2R5IiwiJGRpYWxvZyIsIiRiYWNrZHJvcCIsImlzU2hvd24iLCJvcmlnaW5hbEJvZHlQYWQiLCJzY3JvbGxiYXJXaWR0aCIsImlnbm9yZUJhY2tkcm9wQ2xpY2siLCJmaXhlZENvbnRlbnQiLCJyZW1vdGUiLCJsb2FkIiwiQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTiIsIl9yZWxhdGVkVGFyZ2V0IiwiY2hlY2tTY3JvbGxiYXIiLCJzZXRTY3JvbGxiYXIiLCJlc2NhcGUiLCJyZXNpemUiLCJhcHBlbmRUbyIsInNjcm9sbFRvcCIsImFkanVzdERpYWxvZyIsImVuZm9yY2VGb2N1cyIsIm9mZiIsImhpZGVNb2RhbCIsImhhcyIsImhhbmRsZVVwZGF0ZSIsInJlc2V0QWRqdXN0bWVudHMiLCJyZXNldFNjcm9sbGJhciIsInJlbW92ZUJhY2tkcm9wIiwiYW5pbWF0ZSIsImRvQW5pbWF0ZSIsImN1cnJlbnRUYXJnZXQiLCJmb2N1cyIsImNhbGxiYWNrUmVtb3ZlIiwibW9kYWxJc092ZXJmbG93aW5nIiwic2Nyb2xsSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiY3NzIiwicGFkZGluZ0xlZnQiLCJib2R5SXNPdmVyZmxvd2luZyIsInBhZGRpbmdSaWdodCIsImZ1bGxXaW5kb3dXaWR0aCIsImlubmVyV2lkdGgiLCJkb2N1bWVudEVsZW1lbnRSZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwicmlnaHQiLCJNYXRoIiwiYWJzIiwibGVmdCIsImNsaWVudFdpZHRoIiwibWVhc3VyZVNjcm9sbGJhciIsImJvZHlQYWQiLCJwYXJzZUludCIsImFjdHVhbFBhZGRpbmciLCJjYWxjdWxhdGVkUGFkZGluZyIsInBhcnNlRmxvYXQiLCJwYWRkaW5nIiwicmVtb3ZlRGF0YSIsInNjcm9sbERpdiIsImNsYXNzTmFtZSIsImFwcGVuZCIsInJlbW92ZUNoaWxkIiwibW9kYWwiLCJzaG93RXZlbnQiLCJESVNBTExPV0VEX0FUVFJJQlVURVMiLCJ1cmlBdHRycyIsIkFSSUFfQVRUUklCVVRFX1BBVFRFUk4iLCJEZWZhdWx0V2hpdGVsaXN0IiwiYSIsImFyZWEiLCJiIiwiYnIiLCJjb2wiLCJjb2RlIiwiZGl2IiwiZW0iLCJociIsImgxIiwiaDIiLCJoMyIsImg0IiwiaDUiLCJoNiIsImltZyIsImxpIiwib2wiLCJwIiwicHJlIiwicyIsInNtYWxsIiwic3BhbiIsInN1YiIsInN1cCIsInN0cm9uZyIsInUiLCJ1bCIsIlNBRkVfVVJMX1BBVFRFUk4iLCJEQVRBX1VSTF9QQVRURVJOIiwiYWxsb3dlZEF0dHJpYnV0ZSIsImFsbG93ZWRBdHRyaWJ1dGVMaXN0IiwiYXR0ck5hbWUiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiaW5BcnJheSIsIkJvb2xlYW4iLCJub2RlVmFsdWUiLCJtYXRjaCIsInJlZ0V4cCIsImZpbHRlciIsInZhbHVlIiwiUmVnRXhwIiwibCIsInNhbml0aXplSHRtbCIsInVuc2FmZUh0bWwiLCJ3aGl0ZUxpc3QiLCJzYW5pdGl6ZUZuIiwiaW1wbGVtZW50YXRpb24iLCJjcmVhdGVIVE1MRG9jdW1lbnQiLCJjcmVhdGVkRG9jdW1lbnQiLCJpbm5lckhUTUwiLCJ3aGl0ZWxpc3RLZXlzIiwibWFwIiwiZWxlbWVudHMiLCJsZW4iLCJlbE5hbWUiLCJwYXJlbnROb2RlIiwiYXR0cmlidXRlTGlzdCIsImF0dHJpYnV0ZXMiLCJ3aGl0ZWxpc3RlZEF0dHJpYnV0ZXMiLCJjb25jYXQiLCJqIiwibGVuMiIsInJlbW92ZUF0dHJpYnV0ZSIsIlRvb2x0aXAiLCJlbmFibGVkIiwidGltZW91dCIsImhvdmVyU3RhdGUiLCJpblN0YXRlIiwiaW5pdCIsImFuaW1hdGlvbiIsInBsYWNlbWVudCIsInRlbXBsYXRlIiwidGl0bGUiLCJkZWxheSIsImh0bWwiLCJjb250YWluZXIiLCJ2aWV3cG9ydCIsInNhbml0aXplIiwiZ2V0T3B0aW9ucyIsIiR2aWV3cG9ydCIsImlzRnVuY3Rpb24iLCJjbGljayIsImhvdmVyIiwiY29uc3RydWN0b3IiLCJ0cmlnZ2VycyIsImV2ZW50SW4iLCJldmVudE91dCIsImVudGVyIiwibGVhdmUiLCJfb3B0aW9ucyIsImZpeFRpdGxlIiwiZ2V0RGVmYXVsdHMiLCJkYXRhQXR0cmlidXRlcyIsImRhdGFBdHRyIiwiaGFzT3duUHJvcGVydHkiLCJnZXREZWxlZ2F0ZU9wdGlvbnMiLCJkZWZhdWx0cyIsImtleSIsIm9iaiIsInNlbGYiLCJ0aXAiLCJjbGVhclRpbWVvdXQiLCJpc0luU3RhdGVUcnVlIiwiaGFzQ29udGVudCIsImluRG9tIiwib3duZXJEb2N1bWVudCIsIiR0aXAiLCJ0aXBJZCIsImdldFVJRCIsInNldENvbnRlbnQiLCJhdXRvVG9rZW4iLCJhdXRvUGxhY2UiLCJ0b3AiLCJkaXNwbGF5IiwiZ2V0UG9zaXRpb24iLCJhY3R1YWxXaWR0aCIsImFjdHVhbEhlaWdodCIsIm9yZ1BsYWNlbWVudCIsInZpZXdwb3J0RGltIiwiYm90dG9tIiwid2lkdGgiLCJjYWxjdWxhdGVkT2Zmc2V0IiwiZ2V0Q2FsY3VsYXRlZE9mZnNldCIsImFwcGx5UGxhY2VtZW50IiwicHJldkhvdmVyU3RhdGUiLCJvZmZzZXQiLCJoZWlnaHQiLCJtYXJnaW5Ub3AiLCJtYXJnaW5MZWZ0IiwiaXNOYU4iLCJzZXRPZmZzZXQiLCJ1c2luZyIsInByb3BzIiwicm91bmQiLCJnZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEiLCJpc1ZlcnRpY2FsIiwiYXJyb3dEZWx0YSIsImFycm93T2Zmc2V0UG9zaXRpb24iLCJyZXBsYWNlQXJyb3ciLCJhcnJvdyIsImdldFRpdGxlIiwidGV4dCIsIiRlIiwiaXNCb2R5IiwiZWxSZWN0IiwiaXNTdmciLCJTVkdFbGVtZW50IiwiZWxPZmZzZXQiLCJzY3JvbGwiLCJvdXRlckRpbXMiLCJ2aWV3cG9ydFBhZGRpbmciLCJ2aWV3cG9ydERpbWVuc2lvbnMiLCJ0b3BFZGdlT2Zmc2V0IiwiYm90dG9tRWRnZU9mZnNldCIsImxlZnRFZGdlT2Zmc2V0IiwicmlnaHRFZGdlT2Zmc2V0IiwibyIsInByZWZpeCIsInJhbmRvbSIsImdldEVsZW1lbnRCeUlkIiwiJGFycm93IiwiZW5hYmxlIiwiZGlzYWJsZSIsInRvZ2dsZUVuYWJsZWQiLCJkZXN0cm95IiwidG9vbHRpcCIsIlBvcG92ZXIiLCJjb250ZW50IiwiZ2V0Q29udGVudCIsInR5cGVDb250ZW50IiwicG9wb3ZlciIsIlNjcm9sbFNweSIsIiRzY3JvbGxFbGVtZW50Iiwib2Zmc2V0cyIsInRhcmdldHMiLCJhY3RpdmVUYXJnZXQiLCJwcm9jZXNzIiwicmVmcmVzaCIsImdldFNjcm9sbEhlaWdodCIsIm1heCIsIm9mZnNldE1ldGhvZCIsIm9mZnNldEJhc2UiLCJpc1dpbmRvdyIsIiRocmVmIiwic29ydCIsInB1c2giLCJtYXhTY3JvbGwiLCJhY3RpdmF0ZSIsImNsZWFyIiwicGFyZW50cyIsInBhcmVudHNVbnRpbCIsInNjcm9sbHNweSIsIiRzcHkiLCJUYWIiLCIkdWwiLCIkcHJldmlvdXMiLCJoaWRlRXZlbnQiLCJ0YWIiLCJBZmZpeCIsImNoZWNrUG9zaXRpb24iLCJjaGVja1Bvc2l0aW9uV2l0aEV2ZW50TG9vcCIsImFmZml4ZWQiLCJ1bnBpbiIsInBpbm5lZE9mZnNldCIsIlJFU0VUIiwiZ2V0U3RhdGUiLCJvZmZzZXRUb3AiLCJvZmZzZXRCb3R0b20iLCJwb3NpdGlvbiIsInRhcmdldEhlaWdodCIsImluaXRpYWxpemluZyIsImNvbGxpZGVyVG9wIiwiY29sbGlkZXJIZWlnaHQiLCJnZXRQaW5uZWRPZmZzZXQiLCJhZmZpeCIsImFmZml4VHlwZSIsImZsZXh5X2hlYWRlciIsInB1YiIsIiRoZWFkZXJfc3RhdGljIiwiJGhlYWRlcl9zdGlja3kiLCJ1cGRhdGVfaW50ZXJ2YWwiLCJ0b2xlcmFuY2UiLCJ1cHdhcmQiLCJkb3dud2FyZCIsIl9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tIiwiY2xhc3NlcyIsInBpbm5lZCIsInVucGlubmVkIiwid2FzX3Njcm9sbGVkIiwibGFzdF9kaXN0YW5jZV9mcm9tX3RvcCIsInJlZ2lzdGVyRXZlbnRIYW5kbGVycyIsInJlZ2lzdGVyQm9vdEV2ZW50SGFuZGxlcnMiLCJkb2N1bWVudF93YXNfc2Nyb2xsZWQiLCJlbGVtZW50X2hlaWdodCIsIm91dGVySGVpZ2h0IiwiZWxlbWVudF9vZmZzZXQiLCJjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIiwiQWpheE1vbml0b3IiLCJCYXIiLCJEb2N1bWVudE1vbml0b3IiLCJFbGVtZW50TW9uaXRvciIsIkVsZW1lbnRUcmFja2VyIiwiRXZlbnRMYWdNb25pdG9yIiwiRXZlbnRlZCIsIkV2ZW50cyIsIk5vVGFyZ2V0RXJyb3IiLCJQYWNlIiwiUmVxdWVzdEludGVyY2VwdCIsIlNPVVJDRV9LRVlTIiwiU2NhbGVyIiwiU29ja2V0UmVxdWVzdFRyYWNrZXIiLCJYSFJSZXF1ZXN0VHJhY2tlciIsImF2Z0FtcGxpdHVkZSIsImJhciIsImNhbmNlbEFuaW1hdGlvbiIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZGVmYXVsdE9wdGlvbnMiLCJleHRlbmROYXRpdmUiLCJnZXRGcm9tRE9NIiwiZ2V0SW50ZXJjZXB0IiwiaGFuZGxlUHVzaFN0YXRlIiwiaWdub3JlU3RhY2siLCJub3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyZXN1bHQiLCJydW5BbmltYXRpb24iLCJzY2FsZXJzIiwic2hvdWxkSWdub3JlVVJMIiwic2hvdWxkVHJhY2siLCJzb3VyY2UiLCJzb3VyY2VzIiwidW5pU2NhbGVyIiwiX1dlYlNvY2tldCIsIl9YRG9tYWluUmVxdWVzdCIsIl9YTUxIdHRwUmVxdWVzdCIsIl9pIiwiX2ludGVyY2VwdCIsIl9sZW4iLCJfcHVzaFN0YXRlIiwiX3JlZiIsIl9yZWYxIiwiX3JlcGxhY2VTdGF0ZSIsIl9fc2xpY2UiLCJzbGljZSIsIl9faGFzUHJvcCIsIl9fZXh0ZW5kcyIsImNoaWxkIiwiY3RvciIsIl9fc3VwZXJfXyIsIl9faW5kZXhPZiIsImluZGV4T2YiLCJjYXRjaHVwVGltZSIsImluaXRpYWxSYXRlIiwibWluVGltZSIsImdob3N0VGltZSIsIm1heFByb2dyZXNzUGVyRnJhbWUiLCJlYXNlRmFjdG9yIiwic3RhcnRPblBhZ2VMb2FkIiwicmVzdGFydE9uUHVzaFN0YXRlIiwicmVzdGFydE9uUmVxdWVzdEFmdGVyIiwiY2hlY2tJbnRlcnZhbCIsInNlbGVjdG9ycyIsImV2ZW50TGFnIiwibWluU2FtcGxlcyIsInNhbXBsZUNvdW50IiwibGFnVGhyZXNob2xkIiwiYWpheCIsInRyYWNrTWV0aG9kcyIsInRyYWNrV2ViU29ja2V0cyIsImlnbm9yZVVSTHMiLCJwZXJmb3JtYW5jZSIsIkRhdGUiLCJtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtc1JlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIiwibGFzdCIsInRpY2siLCJkaWZmIiwiYXJncyIsIm91dCIsImFyciIsImNvdW50Iiwic3VtIiwidiIsImpzb24iLCJxdWVyeVNlbGVjdG9yIiwiZ2V0QXR0cmlidXRlIiwiSlNPTiIsInBhcnNlIiwiX2Vycm9yIiwiY29uc29sZSIsImVycm9yIiwiY3R4Iiwib25jZSIsIl9iYXNlIiwiYmluZGluZ3MiLCJfcmVzdWx0cyIsInNwbGljZSIsInBhY2VPcHRpb25zIiwiX3N1cGVyIiwicHJvZ3Jlc3MiLCJnZXRFbGVtZW50IiwidGFyZ2V0RWxlbWVudCIsImZpcnN0Q2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJhcHBlbmRDaGlsZCIsImZpbmlzaCIsInVwZGF0ZSIsInByb2ciLCJyZW5kZXIiLCJwcm9ncmVzc1N0ciIsInRyYW5zZm9ybSIsIl9qIiwiX2xlbjEiLCJfcmVmMiIsImxhc3RSZW5kZXJlZFByb2dyZXNzIiwic2V0QXR0cmlidXRlIiwiZG9uZSIsImJpbmRpbmciLCJYTUxIdHRwUmVxdWVzdCIsIlhEb21haW5SZXF1ZXN0IiwiV2ViU29ja2V0IiwiZnJvbSIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiY29uZmlndXJhYmxlIiwiZW51bWVyYWJsZSIsImlnbm9yZSIsInJldCIsInVuc2hpZnQiLCJzaGlmdCIsInRyYWNrIiwibWV0aG9kIiwidG9VcHBlckNhc2UiLCJtb25pdG9yWEhSIiwiX3RoaXMiLCJyZXEiLCJfb3BlbiIsIm9wZW4iLCJ1cmwiLCJhc3luYyIsInJlcXVlc3QiLCJmbGFncyIsInByb3RvY29scyIsInBhdHRlcm4iLCJfYXJnIiwiYWZ0ZXIiLCJydW5uaW5nIiwic3RpbGxBY3RpdmUiLCJfcmVmMyIsInJlYWR5U3RhdGUiLCJyZXN0YXJ0Iiwid2F0Y2giLCJ0cmFja2VyIiwic2l6ZSIsIl9vbnJlYWR5c3RhdGVjaGFuZ2UiLCJQcm9ncmVzc0V2ZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2dCIsImxlbmd0aENvbXB1dGFibGUiLCJsb2FkZWQiLCJ0b3RhbCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsImNoZWNrIiwic3RhdGVzIiwibG9hZGluZyIsImludGVyYWN0aXZlIiwiYXZnIiwicG9pbnRzIiwic2FtcGxlcyIsInNpbmNlTGFzdFVwZGF0ZSIsInJhdGUiLCJjYXRjaHVwIiwibGFzdFByb2dyZXNzIiwiZnJhbWVUaW1lIiwic2NhbGluZyIsInBvdyIsIm1pbiIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJyZXBsYWNlU3RhdGUiLCJfayIsIl9sZW4yIiwiX3JlZjQiLCJleHRyYVNvdXJjZXMiLCJzdG9wIiwic3RhcnQiLCJnbyIsImVucXVldWVOZXh0RnJhbWUiLCJyZW1haW5pbmciLCJzY2FsZXIiLCJzY2FsZXJMaXN0IiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsIm1vZHVsZSIsInQiLCJzbGlua3kiLCJsYWJlbCIsInNwZWVkIiwibiIsInIiLCJwcmVwZW5kIiwianVtcCIsImhvbWUiLCJjIiwidG5zIiwia2V5cyIsIm9iamVjdCIsIkVsZW1lbnQiLCJ3aW4iLCJyYWYiLCJjYiIsIndpbiQxIiwiY2FmIiwiY29weSIsImNoZWNrU3RvcmFnZVZhbHVlIiwic2V0TG9jYWxTdG9yYWdlIiwic3RvcmFnZSIsImFjY2VzcyIsInNldEl0ZW0iLCJnZXRTbGlkZUlkIiwidG5zSWQiLCJnZXRCb2R5IiwiZG9jIiwiZmFrZSIsImRvY0VsZW1lbnQiLCJzZXRGYWtlQm9keSIsImRvY092ZXJmbG93Iiwib3ZlcmZsb3ciLCJiYWNrZ3JvdW5kIiwicmVzZXRGYWtlQm9keSIsImNhbGMiLCJzdHIiLCJ2YWxzIiwicGVyY2VudGFnZUxheW91dCIsIndyYXBwZXIiLCJvdXRlciIsInBlclBhZ2UiLCJzdXBwb3J0ZWQiLCJtZWRpYXF1ZXJ5U3VwcG9ydCIsInJ1bGUiLCJzdHlsZVNoZWV0IiwiY3NzVGV4dCIsImNyZWF0ZVRleHROb2RlIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImN1cnJlbnRTdHlsZSIsImNyZWF0ZVN0eWxlU2hlZXQiLCJtZWRpYSIsInNoZWV0IiwiYWRkQ1NTUnVsZSIsInJ1bGVzIiwiaW5zZXJ0UnVsZSIsImFkZFJ1bGUiLCJyZW1vdmVDU1NSdWxlIiwiZGVsZXRlUnVsZSIsInJlbW92ZVJ1bGUiLCJnZXRDc3NSdWxlc0xlbmd0aCIsImNzc1J1bGVzIiwidG9EZWdyZWUiLCJ5IiwieCIsImF0YW4yIiwiUEkiLCJnZXRUb3VjaERpcmVjdGlvbiIsImFuZ2xlIiwicmFuZ2UiLCJnYXAiLCJmb3JFYWNoIiwic2NvcGUiLCJjbGFzc0xpc3RTdXBwb3J0IiwiY2xhc3NMaXN0IiwiYWRkIiwiaGFzQXR0ciIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHIiLCJpc05vZGVMaXN0Iiwic2V0QXR0cnMiLCJlbHMiLCJhdHRycyIsIkFycmF5IiwidG9TdHJpbmciLCJyZW1vdmVBdHRycyIsImF0dHJMZW5ndGgiLCJhcnJheUZyb21Ob2RlTGlzdCIsIm5sIiwiaGlkZUVsZW1lbnQiLCJmb3JjZUhpZGUiLCJzaG93RWxlbWVudCIsImlzVmlzaWJsZSIsIndoaWNoUHJvcGVydHkiLCJQcm9wcyIsImNoYXJBdCIsInN1YnN0ciIsInByZWZpeGVzIiwiaGFzM0RUcmFuc2Zvcm1zIiwidGYiLCJoYXMzZCIsImNzc1RGIiwiZ2V0UHJvcGVydHlWYWx1ZSIsImdldEVuZFByb3BlcnR5IiwicHJvcEluIiwicHJvcE91dCIsImVuZFByb3AiLCJzdXBwb3J0c1Bhc3NpdmUiLCJvcHRzIiwicGFzc2l2ZU9wdGlvbiIsInBhc3NpdmUiLCJhZGRFdmVudHMiLCJwcmV2ZW50U2Nyb2xsaW5nIiwicmVtb3ZlRXZlbnRzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInRvcGljcyIsImV2ZW50TmFtZSIsImVtaXQiLCJqc1RyYW5zZm9ybSIsInBvc3RmaXgiLCJ1bml0IiwiTnVtYmVyIiwicG9zaXRpb25UaWNrIiwibW92ZUVsZW1lbnQiLCJtb2RlIiwiYXhpcyIsIml0ZW1zIiwiZ3V0dGVyIiwiZWRnZVBhZGRpbmciLCJmaXhlZFdpZHRoIiwiYXV0b1dpZHRoIiwidmlld3BvcnRNYXgiLCJzbGlkZUJ5IiwiY2VudGVyIiwiY29udHJvbHMiLCJjb250cm9sc1Bvc2l0aW9uIiwiY29udHJvbHNUZXh0IiwiY29udHJvbHNDb250YWluZXIiLCJwcmV2QnV0dG9uIiwibmV4dEJ1dHRvbiIsIm5hdiIsIm5hdlBvc2l0aW9uIiwibmF2Q29udGFpbmVyIiwibmF2QXNUaHVtYm5haWxzIiwiYXJyb3dLZXlzIiwiYXV0b3BsYXkiLCJhdXRvcGxheVBvc2l0aW9uIiwiYXV0b3BsYXlUaW1lb3V0IiwiYXV0b3BsYXlEaXJlY3Rpb24iLCJhdXRvcGxheVRleHQiLCJhdXRvcGxheUhvdmVyUGF1c2UiLCJhdXRvcGxheUJ1dHRvbiIsImF1dG9wbGF5QnV0dG9uT3V0cHV0IiwiYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSIsImFuaW1hdGVJbiIsImFuaW1hdGVPdXQiLCJhbmltYXRlTm9ybWFsIiwiYW5pbWF0ZURlbGF5IiwibG9vcCIsInJld2luZCIsImF1dG9IZWlnaHQiLCJyZXNwb25zaXZlIiwibGF6eWxvYWQiLCJsYXp5bG9hZFNlbGVjdG9yIiwidG91Y2giLCJtb3VzZURyYWciLCJzd2lwZUFuZ2xlIiwibmVzdGVkIiwicHJldmVudEFjdGlvbldoZW5SdW5uaW5nIiwicHJldmVudFNjcm9sbE9uVG91Y2giLCJmcmVlemFibGUiLCJvbkluaXQiLCJ1c2VMb2NhbFN0b3JhZ2UiLCJLRVlTIiwiRU5URVIiLCJTUEFDRSIsIkxFRlQiLCJSSUdIVCIsInRuc1N0b3JhZ2UiLCJsb2NhbFN0b3JhZ2VBY2Nlc3MiLCJicm93c2VySW5mbyIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInVpZCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJyZW1vdmVJdGVtIiwiQ0FMQyIsIlBFUkNFTlRBR0VMQVlPVVQiLCJDU1NNUSIsIlRSQU5TRk9STSIsIkhBUzNEVFJBTlNGT1JNUyIsIlRSQU5TSVRJT05EVVJBVElPTiIsIlRSQU5TSVRJT05ERUxBWSIsIkFOSU1BVElPTkRVUkFUSU9OIiwiQU5JTUFUSU9OREVMQVkiLCJUUkFOU0lUSU9ORU5EIiwiQU5JTUFUSU9ORU5EIiwic3VwcG9ydENvbnNvbGVXYXJuIiwid2FybiIsInRuc0xpc3QiLCJvcHRpb25zRWxlbWVudHMiLCJyZXNwb25zaXZlVGVtIiwidXBkYXRlT3B0aW9ucyIsImhvcml6b250YWwiLCJvdXRlcldyYXBwZXIiLCJpbm5lcldyYXBwZXIiLCJtaWRkbGVXcmFwcGVyIiwiY29udGFpbmVyUGFyZW50IiwiY29udGFpbmVySFRNTCIsIm91dGVySFRNTCIsInNsaWRlSXRlbXMiLCJzbGlkZUNvdW50IiwiYnJlYWtwb2ludFpvbmUiLCJ3aW5kb3dXaWR0aCIsImdldFdpbmRvd1dpZHRoIiwiaXNPbiIsInNldEJyZWFrcG9pbnRab25lIiwiZ2V0T3B0aW9uIiwiZ2V0Vmlld3BvcnRXaWR0aCIsImZsb29yIiwiZml4ZWRXaWR0aFZpZXdwb3J0V2lkdGgiLCJzbGlkZVBvc2l0aW9ucyIsInNsaWRlSXRlbXNPdXQiLCJjbG9uZUNvdW50IiwiZ2V0Q2xvbmVDb3VudEZvckxvb3AiLCJzbGlkZUNvdW50TmV3IiwiaGFzUmlnaHREZWFkWm9uZSIsInJpZ2h0Qm91bmRhcnkiLCJnZXRSaWdodEJvdW5kYXJ5IiwidXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0iLCJ0cmFuc2Zvcm1BdHRyIiwidHJhbnNmb3JtUHJlZml4IiwidHJhbnNmb3JtUG9zdGZpeCIsImdldEluZGV4TWF4IiwiY2VpbCIsImdldFN0YXJ0SW5kZXgiLCJpbmRleENhY2hlZCIsImRpc3BsYXlJbmRleCIsImdldEN1cnJlbnRTbGlkZSIsImluZGV4TWluIiwiaW5kZXhNYXgiLCJyZXNpemVUaW1lciIsIm1vdmVEaXJlY3Rpb25FeHBlY3RlZCIsImV2ZW50cyIsIm5ld0NvbnRhaW5lckNsYXNzZXMiLCJzbGlkZUlkIiwiZGlzYWJsZWQiLCJmcmVlemUiLCJnZXRGcmVlemUiLCJmcm96ZW4iLCJjb250cm9sc0V2ZW50cyIsIm9uQ29udHJvbHNDbGljayIsIm9uQ29udHJvbHNLZXlkb3duIiwibmF2RXZlbnRzIiwib25OYXZDbGljayIsIm9uTmF2S2V5ZG93biIsImhvdmVyRXZlbnRzIiwibW91c2VvdmVyUGF1c2UiLCJtb3VzZW91dFJlc3RhcnQiLCJ2aXNpYmlsaXR5RXZlbnQiLCJvblZpc2liaWxpdHlDaGFuZ2UiLCJkb2NtZW50S2V5ZG93bkV2ZW50Iiwib25Eb2N1bWVudEtleWRvd24iLCJ0b3VjaEV2ZW50cyIsIm9uUGFuU3RhcnQiLCJvblBhbk1vdmUiLCJvblBhbkVuZCIsImRyYWdFdmVudHMiLCJoYXNDb250cm9scyIsImhhc09wdGlvbiIsImhhc05hdiIsImhhc0F1dG9wbGF5IiwiaGFzVG91Y2giLCJoYXNNb3VzZURyYWciLCJzbGlkZUFjdGl2ZUNsYXNzIiwiaW1nQ29tcGxldGVDbGFzcyIsImltZ0V2ZW50cyIsIm9uSW1nTG9hZGVkIiwib25JbWdGYWlsZWQiLCJpbWdzQ29tcGxldGUiLCJsaXZlcmVnaW9uQ3VycmVudCIsInByZXZlbnRTY3JvbGwiLCJjb250cm9sc0NvbnRhaW5lckhUTUwiLCJwcmV2QnV0dG9uSFRNTCIsIm5leHRCdXR0b25IVE1MIiwicHJldklzQnV0dG9uIiwibmV4dElzQnV0dG9uIiwibmF2Q29udGFpbmVySFRNTCIsIm5hdkl0ZW1zIiwicGFnZXMiLCJnZXRQYWdlcyIsInBhZ2VzQ2FjaGVkIiwibmF2Q2xpY2tlZCIsIm5hdkN1cnJlbnRJbmRleCIsImdldEN1cnJlbnROYXZJbmRleCIsIm5hdkN1cnJlbnRJbmRleENhY2hlZCIsIm5hdkFjdGl2ZUNsYXNzIiwibmF2U3RyIiwibmF2U3RyQ3VycmVudCIsImF1dG9wbGF5QnV0dG9uSFRNTCIsImF1dG9wbGF5SHRtbFN0cmluZ3MiLCJhdXRvcGxheVRpbWVyIiwiYW5pbWF0aW5nIiwiYXV0b3BsYXlIb3ZlclBhdXNlZCIsImF1dG9wbGF5VXNlclBhdXNlZCIsImF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZCIsImluaXRQb3NpdGlvbiIsImxhc3RQb3NpdGlvbiIsInRyYW5zbGF0ZUluaXQiLCJkaXNYIiwiZGlzWSIsInBhblN0YXJ0IiwicmFmSW5kZXgiLCJnZXREaXN0IiwicmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlIiwiaW5pdFN0cnVjdHVyZSIsImluaXRTaGVldCIsImluaXRTbGlkZXJUcmFuc2Zvcm0iLCJjb25kaXRpb24iLCJ0ZW0iLCJpbmQiLCJnZXRBYnNJbmRleCIsImFic0luZGV4IiwiZ2V0SXRlbXNNYXgiLCJicCIsIml0ZW1zTWF4IiwiZ2V0SW5zZXJ0UG9zaXRpb24iLCJnZXRDbGllbnRXaWR0aCIsInJlY3QiLCJ3dyIsImdldFNsaWRlTWFyZ2luTGVmdCIsImdldElubmVyV3JhcHBlclN0eWxlcyIsImVkZ2VQYWRkaW5nVGVtIiwiZ3V0dGVyVGVtIiwiZml4ZWRXaWR0aFRlbSIsInNwZWVkVGVtIiwiYXV0b0hlaWdodEJQIiwiZ3V0dGVyVGVtVW5pdCIsImRpciIsImdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlIiwiZ2V0Q29udGFpbmVyV2lkdGgiLCJpdGVtc1RlbSIsImdldFNsaWRlV2lkdGhTdHlsZSIsImRpdmlkZW5kIiwiZ2V0U2xpZGVHdXR0ZXJTdHlsZSIsImdldENTU1ByZWZpeCIsIm51bSIsInN1YnN0cmluZyIsImdldEFuaW1hdGlvbkR1cmF0aW9uU3R5bGUiLCJjbGFzc091dGVyIiwiY2xhc3NJbm5lciIsImhhc0d1dHRlciIsIndwIiwiZnJhZ21lbnRCZWZvcmUiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwiZnJhZ21lbnRBZnRlciIsImNsb25lRmlyc3QiLCJjbG9uZU5vZGUiLCJjbG9uZUxhc3QiLCJpbWdzIiwicXVlcnlTZWxlY3RvckFsbCIsInNyYyIsImltZ0xvYWRlZCIsImltZ3NMb2FkZWRDaGVjayIsImdldEltYWdlQXJyYXkiLCJpbml0U2xpZGVyVHJhbnNmb3JtU3R5bGVDaGVjayIsImRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50IiwiaW5pdFRvb2xzIiwiaW5pdEV2ZW50cyIsInN0eWxlc0FwcGxpY2F0aW9uQ2hlY2siLCJ0b0ZpeGVkIiwiaW5pdFNsaWRlclRyYW5zZm9ybUNvcmUiLCJzZXRTbGlkZVBvc2l0aW9ucyIsInVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0IiwiZm9udFNpemUiLCJ1cGRhdGVfY2Fyb3VzZWxfdHJhbnNpdGlvbl9kdXJhdGlvbiIsIm1pZGRsZVdyYXBwZXJTdHIiLCJpbm5lcldyYXBwZXJTdHIiLCJjb250YWluZXJTdHIiLCJzbGlkZVN0ciIsIml0ZW1zQlAiLCJmaXhlZFdpZHRoQlAiLCJzcGVlZEJQIiwiZWRnZVBhZGRpbmdCUCIsImd1dHRlckJQIiwidXBkYXRlU2xpZGVTdGF0dXMiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJnZXRMaXZlUmVnaW9uU3RyIiwidHh0IiwidG9nZ2xlQXV0b3BsYXkiLCJzdGFydEF1dG9wbGF5IiwiaW5pdEluZGV4IiwibmF2SHRtbCIsImhpZGRlblN0ciIsInVwZGF0ZU5hdlZpc2liaWxpdHkiLCJpc0J1dHRvbiIsInVwZGF0ZUNvbnRyb2xzU3RhdHVzIiwiZGlzYWJsZVVJIiwiZXZlIiwib25UcmFuc2l0aW9uRW5kIiwicmVzaXplVGFza3MiLCJpbmZvIiwib25SZXNpemUiLCJkb0F1dG9IZWlnaHQiLCJkb0xhenlMb2FkIiwiZGlzYWJsZVNsaWRlciIsImZyZWV6ZVNsaWRlciIsImFkZGl0aW9uYWxVcGRhdGVzIiwib3duZXJOb2RlIiwiaHRtbExpc3QiLCJwcmV2RWwiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwicGFyZW50RWwiLCJuZXh0RWxlbWVudFNpYmxpbmciLCJmaXJzdEVsZW1lbnRDaGlsZCIsImdldEV2ZW50IiwiYnBDaGFuZ2VkIiwiYnJlYWtwb2ludFpvbmVUZW0iLCJuZWVkQ29udGFpbmVyVHJhbnNmb3JtIiwiaW5kQ2hhbmdlZCIsIml0ZW1zQ2hhbmdlZCIsImRpc2FibGVUZW0iLCJmcmVlemVUZW0iLCJhcnJvd0tleXNUZW0iLCJjb250cm9sc1RlbSIsIm5hdlRlbSIsInRvdWNoVGVtIiwibW91c2VEcmFnVGVtIiwiYXV0b3BsYXlUZW0iLCJhdXRvcGxheUhvdmVyUGF1c2VUZW0iLCJhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5VGVtIiwiaW5kZXhUZW0iLCJhdXRvSGVpZ2h0VGVtIiwiY29udHJvbHNUZXh0VGVtIiwiY2VudGVyVGVtIiwiYXV0b3BsYXlUZXh0VGVtIiwidXBkYXRlSW5kZXgiLCJlbmFibGVTbGlkZXIiLCJkb0NvbnRhaW5lclRyYW5zZm9ybSIsImdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlIiwidW5mcmVlemVTbGlkZXIiLCJzdG9wQXV0b3BsYXkiLCJ1cGRhdGVMaXZlUmVnaW9uIiwidXBkYXRlR2FsbGVyeVNsaWRlUG9zaXRpb25zIiwiYXV0b2hlaWdodFRlbSIsInZwIiwibGVmdEVkZ2UiLCJyaWdodEVkZ2UiLCJlbmFibGVVSSIsIm1hcmdpbiIsImNsYXNzTiIsImdldFZpc2libGVTbGlkZVJhbmdlIiwicmFuZ2VzdGFydCIsInJhbmdlZW5kIiwicG9pbnQiLCJjZWxsIiwic3Jjc2V0IiwiZ2V0VGFyZ2V0IiwiaW1nRmFpbGVkIiwiaW1nQ29tcGxldGVkIiwidXBkYXRlSW5uZXJXcmFwcGVySGVpZ2h0IiwidXBkYXRlTmF2U3RhdHVzIiwiZ2V0TWF4U2xpZGVIZWlnaHQiLCJzbGlkZVN0YXJ0Iiwic2xpZGVSYW5nZSIsImhlaWdodHMiLCJtYXhIZWlnaHQiLCJhdHRyMiIsImJhc2UiLCJuYXZQcmV2IiwibmF2Q3VycmVudCIsImdldExvd2VyQ2FzZU5vZGVOYW1lIiwiaXNBcmlhRGlzYWJsZWQiLCJkaXNFbmFibGVFbGVtZW50IiwicHJldkRpc2FibGVkIiwibmV4dERpc2FibGVkIiwiZGlzYWJsZVByZXYiLCJkaXNhYmxlTmV4dCIsInJlc2V0RHVyYXRpb24iLCJnZXRTbGlkZXJXaWR0aCIsImdldENlbnRlckdhcCIsImRlbm9taW5hdG9yIiwiYW5pbWF0ZVNsaWRlIiwibnVtYmVyIiwiY2xhc3NPdXQiLCJjbGFzc0luIiwiaXNPdXQiLCJ0cmFuc2Zvcm1Db3JlIiwic2xpZGVyTW92ZWQiLCJzdHJUcmFucyIsInByb3BlcnR5TmFtZSIsImdvVG8iLCJ0YXJnZXRJbmRleCIsImluZGV4R2FwIiwiZmFjdG9yIiwicGFzc0V2ZW50T2JqZWN0IiwidGFyZ2V0SW4iLCJuYXZJbmRleCIsInRhcmdldEluZGV4QmFzZSIsInNldEF1dG9wbGF5VGltZXIiLCJzdG9wQXV0b3BsYXlUaW1lciIsInVwZGF0ZUF1dG9wbGF5QnV0dG9uIiwicGxheSIsImhpZGRlbiIsImtleUluZGV4Iiwia2V5Q29kZSIsInNldEZvY3VzIiwiY3VyRWxlbWVudCIsImFjdGl2ZUVsZW1lbnQiLCJpc1RvdWNoRXZlbnQiLCJjaGFuZ2VkVG91Y2hlcyIsInNyY0VsZW1lbnQiLCJwcmV2ZW50RGVmYXVsdEJlaGF2aW9yIiwicmV0dXJuVmFsdWUiLCJnZXRNb3ZlRGlyZWN0aW9uRXhwZWN0ZWQiLCJjbGllbnRYIiwiY2xpZW50WSIsInBhblVwZGF0ZSIsImVyciIsImRpc3QiLCJwZXJjZW50YWdlWCIsInByZXZlbnRDbGljayIsImluZGV4TW92ZWQiLCJtb3ZlZCIsInJvdWdoIiwiZ2V0SW5mbyIsInVwZGF0ZVNsaWRlckhlaWdodCIsInJlYnVpbGQiLCJoYW5kbGVUb2dnbGUiLCJ0b2dnbGVzIiwic2lkZWJhcnMiLCJzaWRlYmFyIiwiY2xpY2tlZEVsZW1lbnQiLCJ0b2dnbGVXcmFwcGVyIiwibm9kZUlzU2FtZSIsImlzU2FtZU5vZGUiLCJ3cmFwcGVySXNTYW1lIiwidG9nZ2xlRWxlbWVudCIsImNvbnRlbnRJdGVtcyIsImNvbnRlbnRJdGVtSW5kZXgiLCJjb250ZW50SXRlbUludCIsImNvbnRlbnRJdGVtIiwiY29udGVudEl0ZW1XcmFwcGVyIiwiY29udGVudFdyYXBwZXJJc1NhbWUiLCJ0b2dnbGVJbmRleCIsInRvZ2dsZUludCIsInRvZ2dsZVdyYXBwZXJJc1NhbWUiLCJ3cmFwcGVycyIsIndyYXBwZXJJbnQiLCJzbGlkZXIiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7O0FBTUEsSUFBSSxPQUFPQSxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDLFFBQU0sSUFBSUMsS0FBSixDQUFVLHlDQUFWLENBQU47QUFDRDs7QUFFRCxDQUFDLFVBQVVDLENBQVYsRUFBYTtBQUNaOztBQUNBLE1BQUlDLFVBQVVELEVBQUVFLEVBQUYsQ0FBS0MsTUFBTCxDQUFZQyxLQUFaLENBQWtCLEdBQWxCLEVBQXVCLENBQXZCLEVBQTBCQSxLQUExQixDQUFnQyxHQUFoQyxDQUFkO0FBQ0EsTUFBS0gsUUFBUSxDQUFSLElBQWEsQ0FBYixJQUFrQkEsUUFBUSxDQUFSLElBQWEsQ0FBaEMsSUFBdUNBLFFBQVEsQ0FBUixLQUFjLENBQWQsSUFBbUJBLFFBQVEsQ0FBUixLQUFjLENBQWpDLElBQXND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QVMsTUFITTtBQUlmYSxjQUFVO0FBSkssR0FBSixDQUFiO0FBTUQsQ0FyQkQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBCb290c3RyYXAgdjMuNC4xIChodHRwczovL2dldGJvb3RzdHJhcC5jb20vKVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuXG5pZiAodHlwZW9mIGpRdWVyeSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdCb290c3RyYXBcXCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5Jylcbn1cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyIHZlcnNpb24gPSAkLmZuLmpxdWVyeS5zcGxpdCgnICcpWzBdLnNwbGl0KCcuJylcbiAgaWYgKCh2ZXJzaW9uWzBdIDwgMiAmJiB2ZXJzaW9uWzFdIDwgOSkgfHwgKHZlcnNpb25bMF0gPT0gMSAmJiB2ZXJzaW9uWzFdID09IDkgJiYgdmVyc2lvblsyXSA8IDEpIHx8ICh2ZXJzaW9uWzBdID4gMykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Jvb3RzdHJhcFxcJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnkgdmVyc2lvbiAxLjkuMSBvciBoaWdoZXIsIGJ1dCBsb3dlciB0aGFuIHZlcnNpb24gNCcpXG4gIH1cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRyYW5zaXRpb24uanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jdHJhbnNpdGlvbnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDU1MgVFJBTlNJVElPTiBTVVBQT1JUIChTaG91dG91dDogaHR0cHM6Ly9tb2Rlcm5penIuY29tLylcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZCgpIHtcbiAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdib290c3RyYXAnKVxuXG4gICAgdmFyIHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcbiAgICAgIFdlYmtpdFRyYW5zaXRpb24gOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICBNb3pUcmFuc2l0aW9uICAgIDogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgT1RyYW5zaXRpb24gICAgICA6ICdvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCcsXG4gICAgICB0cmFuc2l0aW9uICAgICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gICAgfVxuXG4gICAgZm9yICh2YXIgbmFtZSBpbiB0cmFuc0VuZEV2ZW50TmFtZXMpIHtcbiAgICAgIGlmIChlbC5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB7IGVuZDogdHJhbnNFbmRFdmVudE5hbWVzW25hbWVdIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2UgLy8gZXhwbGljaXQgZm9yIGllOCAoICAuXy4pXG4gIH1cblxuICAvLyBodHRwczovL2Jsb2cuYWxleG1hY2Nhdy5jb20vY3NzLXRyYW5zaXRpb25zXG4gICQuZm4uZW11bGF0ZVRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbiAoZHVyYXRpb24pIHtcbiAgICB2YXIgY2FsbGVkID0gZmFsc2VcbiAgICB2YXIgJGVsID0gdGhpc1xuICAgICQodGhpcykub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7IGNhbGxlZCA9IHRydWUgfSlcbiAgICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IGlmICghY2FsbGVkKSAkKCRlbCkudHJpZ2dlcigkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpIH1cbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCBkdXJhdGlvbilcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgJChmdW5jdGlvbiAoKSB7XG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uRW5kKClcblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVyblxuXG4gICAgJC5ldmVudC5zcGVjaWFsLmJzVHJhbnNpdGlvbkVuZCA9IHtcbiAgICAgIGJpbmRUeXBlOiAkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsXG4gICAgICBkZWxlZ2F0ZVR5cGU6ICQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxcbiAgICAgIGhhbmRsZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmlzKHRoaXMpKSByZXR1cm4gZS5oYW5kbGVPYmouaGFuZGxlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBhbGVydC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNhbGVydHNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBBTEVSVCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgZGlzbWlzcyA9ICdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nXG4gIHZhciBBbGVydCAgID0gZnVuY3Rpb24gKGVsKSB7XG4gICAgJChlbCkub24oJ2NsaWNrJywgZGlzbWlzcywgdGhpcy5jbG9zZSlcbiAgfVxuXG4gIEFsZXJ0LlZFUlNJT04gPSAnMy40LjEnXG5cbiAgQWxlcnQuVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIEFsZXJ0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzICAgID0gJCh0aGlzKVxuICAgIHZhciBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JylcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgc2VsZWN0b3IgICAgPSBzZWxlY3RvciA9PT0gJyMnID8gW10gOiBzZWxlY3RvclxuICAgIHZhciAkcGFyZW50ID0gJChkb2N1bWVudCkuZmluZChzZWxlY3RvcilcblxuICAgIGlmIChlKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIGlmICghJHBhcmVudC5sZW5ndGgpIHtcbiAgICAgICRwYXJlbnQgPSAkdGhpcy5jbG9zZXN0KCcuYWxlcnQnKVxuICAgIH1cblxuICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnY2xvc2UuYnMuYWxlcnQnKSlcblxuICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICRwYXJlbnQucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoKSB7XG4gICAgICAvLyBkZXRhY2ggZnJvbSBwYXJlbnQsIGZpcmUgZXZlbnQgdGhlbiBjbGVhbiB1cCBkYXRhXG4gICAgICAkcGFyZW50LmRldGFjaCgpLnRyaWdnZXIoJ2Nsb3NlZC5icy5hbGVydCcpLnJlbW92ZSgpXG4gICAgfVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgJHBhcmVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICRwYXJlbnRcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgcmVtb3ZlRWxlbWVudClcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKEFsZXJ0LlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIHJlbW92ZUVsZW1lbnQoKVxuICB9XG5cblxuICAvLyBBTEVSVCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLmFsZXJ0JylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5hbGVydCcsIChkYXRhID0gbmV3IEFsZXJ0KHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0uY2FsbCgkdGhpcylcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYWxlcnRcblxuICAkLmZuLmFsZXJ0ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYWxlcnQuQ29uc3RydWN0b3IgPSBBbGVydFxuXG5cbiAgLy8gQUxFUlQgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmFsZXJ0Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5hbGVydCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFMRVJUIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLmFsZXJ0LmRhdGEtYXBpJywgZGlzbWlzcywgQWxlcnQucHJvdG90eXBlLmNsb3NlKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBidXR0b24uanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYnV0dG9uc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEJVVFRPTiBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQnV0dG9uID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICA9ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICA9ICQuZXh0ZW5kKHt9LCBCdXR0b24uREVGQVVMVFMsIG9wdGlvbnMpXG4gICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxuICB9XG5cbiAgQnV0dG9uLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIEJ1dHRvbi5ERUZBVUxUUyA9IHtcbiAgICBsb2FkaW5nVGV4dDogJ2xvYWRpbmcuLi4nXG4gIH1cblxuICBCdXR0b24ucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIGQgICAgPSAnZGlzYWJsZWQnXG4gICAgdmFyICRlbCAgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIHZhbCAgPSAkZWwuaXMoJ2lucHV0JykgPyAndmFsJyA6ICdodG1sJ1xuICAgIHZhciBkYXRhID0gJGVsLmRhdGEoKVxuXG4gICAgc3RhdGUgKz0gJ1RleHQnXG5cbiAgICBpZiAoZGF0YS5yZXNldFRleHQgPT0gbnVsbCkgJGVsLmRhdGEoJ3Jlc2V0VGV4dCcsICRlbFt2YWxdKCkpXG5cbiAgICAvLyBwdXNoIHRvIGV2ZW50IGxvb3AgdG8gYWxsb3cgZm9ybXMgdG8gc3VibWl0XG4gICAgc2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICRlbFt2YWxdKGRhdGFbc3RhdGVdID09IG51bGwgPyB0aGlzLm9wdGlvbnNbc3RhdGVdIDogZGF0YVtzdGF0ZV0pXG5cbiAgICAgIGlmIChzdGF0ZSA9PSAnbG9hZGluZ1RleHQnKSB7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZVxuICAgICAgICAkZWwuYWRkQ2xhc3MoZCkuYXR0cihkLCBkKS5wcm9wKGQsIHRydWUpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNMb2FkaW5nKSB7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcbiAgICAgICAgJGVsLnJlbW92ZUNsYXNzKGQpLnJlbW92ZUF0dHIoZCkucHJvcChkLCBmYWxzZSlcbiAgICAgIH1cbiAgICB9LCB0aGlzKSwgMClcbiAgfVxuXG4gIEJ1dHRvbi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGFuZ2VkID0gdHJ1ZVxuICAgIHZhciAkcGFyZW50ID0gdGhpcy4kZWxlbWVudC5jbG9zZXN0KCdbZGF0YS10b2dnbGU9XCJidXR0b25zXCJdJylcblxuICAgIGlmICgkcGFyZW50Lmxlbmd0aCkge1xuICAgICAgdmFyICRpbnB1dCA9IHRoaXMuJGVsZW1lbnQuZmluZCgnaW5wdXQnKVxuICAgICAgaWYgKCRpbnB1dC5wcm9wKCd0eXBlJykgPT0gJ3JhZGlvJykge1xuICAgICAgICBpZiAoJGlucHV0LnByb3AoJ2NoZWNrZWQnKSkgY2hhbmdlZCA9IGZhbHNlXG4gICAgICAgICRwYXJlbnQuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgfSBlbHNlIGlmICgkaW5wdXQucHJvcCgndHlwZScpID09ICdjaGVja2JveCcpIHtcbiAgICAgICAgaWYgKCgkaW5wdXQucHJvcCgnY2hlY2tlZCcpKSAhPT0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpIGNoYW5nZWQgPSBmYWxzZVxuICAgICAgICB0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgfVxuICAgICAgJGlucHV0LnByb3AoJ2NoZWNrZWQnLCB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSlcbiAgICAgIGlmIChjaGFuZ2VkKSAkaW5wdXQudHJpZ2dlcignY2hhbmdlJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kZWxlbWVudC5hdHRyKCdhcmlhLXByZXNzZWQnLCAhdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnYWN0aXZlJykpXG4gICAgICB0aGlzLiRlbGVtZW50LnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gQlVUVE9OIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5idXR0b24nKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmJ1dHRvbicsIChkYXRhID0gbmV3IEJ1dHRvbih0aGlzLCBvcHRpb25zKSkpXG5cbiAgICAgIGlmIChvcHRpb24gPT0gJ3RvZ2dsZScpIGRhdGEudG9nZ2xlKClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbikgZGF0YS5zZXRTdGF0ZShvcHRpb24pXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmJ1dHRvblxuXG4gICQuZm4uYnV0dG9uICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYnV0dG9uLkNvbnN0cnVjdG9yID0gQnV0dG9uXG5cblxuICAvLyBCVVRUT04gTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5idXR0b24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmJ1dHRvbiA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEJVVFRPTiBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuYnV0dG9uLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZV49XCJidXR0b25cIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyICRidG4gPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCcuYnRuJylcbiAgICAgIFBsdWdpbi5jYWxsKCRidG4sICd0b2dnbGUnKVxuICAgICAgaWYgKCEoJChlLnRhcmdldCkuaXMoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXSwgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJykpKSB7XG4gICAgICAgIC8vIFByZXZlbnQgZG91YmxlIGNsaWNrIG9uIHJhZGlvcywgYW5kIHRoZSBkb3VibGUgc2VsZWN0aW9ucyAoc28gY2FuY2VsbGF0aW9uKSBvbiBjaGVja2JveGVzXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAvLyBUaGUgdGFyZ2V0IGNvbXBvbmVudCBzdGlsbCByZWNlaXZlIHRoZSBmb2N1c1xuICAgICAgICBpZiAoJGJ0bi5pcygnaW5wdXQsYnV0dG9uJykpICRidG4udHJpZ2dlcignZm9jdXMnKVxuICAgICAgICBlbHNlICRidG4uZmluZCgnaW5wdXQ6dmlzaWJsZSxidXR0b246dmlzaWJsZScpLmZpcnN0KCkudHJpZ2dlcignZm9jdXMnKVxuICAgICAgfVxuICAgIH0pXG4gICAgLm9uKCdmb2N1cy5icy5idXR0b24uZGF0YS1hcGkgYmx1ci5icy5idXR0b24uZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAkKGUudGFyZ2V0KS5jbG9zZXN0KCcuYnRuJykudG9nZ2xlQ2xhc3MoJ2ZvY3VzJywgL15mb2N1cyhpbik/JC8udGVzdChlLnR5cGUpKVxuICAgIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGNhcm91c2VsLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2Nhcm91c2VsXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQ0FST1VTRUwgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIENhcm91c2VsID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMuJGluZGljYXRvcnMgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5jYXJvdXNlbC1pbmRpY2F0b3JzJylcbiAgICB0aGlzLm9wdGlvbnMgICAgID0gb3B0aW9uc1xuICAgIHRoaXMucGF1c2VkICAgICAgPSBudWxsXG4gICAgdGhpcy5zbGlkaW5nICAgICA9IG51bGxcbiAgICB0aGlzLmludGVydmFsICAgID0gbnVsbFxuICAgIHRoaXMuJGFjdGl2ZSAgICAgPSBudWxsXG4gICAgdGhpcy4kaXRlbXMgICAgICA9IG51bGxcblxuICAgIHRoaXMub3B0aW9ucy5rZXlib2FyZCAmJiB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLmtleWRvd24sIHRoaXMpKVxuXG4gICAgdGhpcy5vcHRpb25zLnBhdXNlID09ICdob3ZlcicgJiYgISgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpICYmIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5vbignbW91c2VlbnRlci5icy5jYXJvdXNlbCcsICQucHJveHkodGhpcy5wYXVzZSwgdGhpcykpXG4gICAgICAub24oJ21vdXNlbGVhdmUuYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMuY3ljbGUsIHRoaXMpKVxuICB9XG5cbiAgQ2Fyb3VzZWwuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQ2Fyb3VzZWwuVFJBTlNJVElPTl9EVVJBVElPTiA9IDYwMFxuXG4gIENhcm91c2VsLkRFRkFVTFRTID0ge1xuICAgIGludGVydmFsOiA1MDAwLFxuICAgIHBhdXNlOiAnaG92ZXInLFxuICAgIHdyYXA6IHRydWUsXG4gICAga2V5Ym9hcmQ6IHRydWVcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSkgcmV0dXJuXG4gICAgc3dpdGNoIChlLndoaWNoKSB7XG4gICAgICBjYXNlIDM3OiB0aGlzLnByZXYoKTsgYnJlYWtcbiAgICAgIGNhc2UgMzk6IHRoaXMubmV4dCgpOyBicmVha1xuICAgICAgZGVmYXVsdDogcmV0dXJuXG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuY3ljbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUgfHwgKHRoaXMucGF1c2VkID0gZmFsc2UpXG5cbiAgICB0aGlzLmludGVydmFsICYmIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbClcblxuICAgIHRoaXMub3B0aW9ucy5pbnRlcnZhbFxuICAgICAgJiYgIXRoaXMucGF1c2VkXG4gICAgICAmJiAodGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCQucHJveHkodGhpcy5uZXh0LCB0aGlzKSwgdGhpcy5vcHRpb25zLmludGVydmFsKSlcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuZ2V0SXRlbUluZGV4ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICB0aGlzLiRpdGVtcyA9IGl0ZW0ucGFyZW50KCkuY2hpbGRyZW4oJy5pdGVtJylcbiAgICByZXR1cm4gdGhpcy4kaXRlbXMuaW5kZXgoaXRlbSB8fCB0aGlzLiRhY3RpdmUpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuZ2V0SXRlbUZvckRpcmVjdGlvbiA9IGZ1bmN0aW9uIChkaXJlY3Rpb24sIGFjdGl2ZSkge1xuICAgIHZhciBhY3RpdmVJbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KGFjdGl2ZSlcbiAgICB2YXIgd2lsbFdyYXAgPSAoZGlyZWN0aW9uID09ICdwcmV2JyAmJiBhY3RpdmVJbmRleCA9PT0gMClcbiAgICAgICAgICAgICAgICB8fCAoZGlyZWN0aW9uID09ICduZXh0JyAmJiBhY3RpdmVJbmRleCA9PSAodGhpcy4kaXRlbXMubGVuZ3RoIC0gMSkpXG4gICAgaWYgKHdpbGxXcmFwICYmICF0aGlzLm9wdGlvbnMud3JhcCkgcmV0dXJuIGFjdGl2ZVxuICAgIHZhciBkZWx0YSA9IGRpcmVjdGlvbiA9PSAncHJldicgPyAtMSA6IDFcbiAgICB2YXIgaXRlbUluZGV4ID0gKGFjdGl2ZUluZGV4ICsgZGVsdGEpICUgdGhpcy4kaXRlbXMubGVuZ3RoXG4gICAgcmV0dXJuIHRoaXMuJGl0ZW1zLmVxKGl0ZW1JbmRleClcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS50byA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICB2YXIgdGhhdCAgICAgICAgPSB0aGlzXG4gICAgdmFyIGFjdGl2ZUluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgodGhpcy4kYWN0aXZlID0gdGhpcy4kZWxlbWVudC5maW5kKCcuaXRlbS5hY3RpdmUnKSlcblxuICAgIGlmIChwb3MgPiAodGhpcy4kaXRlbXMubGVuZ3RoIC0gMSkgfHwgcG9zIDwgMCkgcmV0dXJuXG5cbiAgICBpZiAodGhpcy5zbGlkaW5nKSAgICAgICByZXR1cm4gdGhpcy4kZWxlbWVudC5vbmUoJ3NsaWQuYnMuY2Fyb3VzZWwnLCBmdW5jdGlvbiAoKSB7IHRoYXQudG8ocG9zKSB9KSAvLyB5ZXMsIFwic2xpZFwiXG4gICAgaWYgKGFjdGl2ZUluZGV4ID09IHBvcykgcmV0dXJuIHRoaXMucGF1c2UoKS5jeWNsZSgpXG5cbiAgICByZXR1cm4gdGhpcy5zbGlkZShwb3MgPiBhY3RpdmVJbmRleCA/ICduZXh0JyA6ICdwcmV2JywgdGhpcy4kaXRlbXMuZXEocG9zKSlcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZSB8fCAodGhpcy5wYXVzZWQgPSB0cnVlKVxuXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQuZmluZCgnLm5leHQsIC5wcmV2JykubGVuZ3RoICYmICQuc3VwcG9ydC50cmFuc2l0aW9uKSB7XG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKVxuICAgICAgdGhpcy5jeWNsZSh0cnVlKVxuICAgIH1cblxuICAgIHRoaXMuaW50ZXJ2YWwgPSBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc2xpZGluZykgcmV0dXJuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUoJ25leHQnKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc2xpZGluZykgcmV0dXJuXG4gICAgcmV0dXJuIHRoaXMuc2xpZGUoJ3ByZXYnKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnNsaWRlID0gZnVuY3Rpb24gKHR5cGUsIG5leHQpIHtcbiAgICB2YXIgJGFjdGl2ZSAgID0gdGhpcy4kZWxlbWVudC5maW5kKCcuaXRlbS5hY3RpdmUnKVxuICAgIHZhciAkbmV4dCAgICAgPSBuZXh0IHx8IHRoaXMuZ2V0SXRlbUZvckRpcmVjdGlvbih0eXBlLCAkYWN0aXZlKVxuICAgIHZhciBpc0N5Y2xpbmcgPSB0aGlzLmludGVydmFsXG4gICAgdmFyIGRpcmVjdGlvbiA9IHR5cGUgPT0gJ25leHQnID8gJ2xlZnQnIDogJ3JpZ2h0J1xuICAgIHZhciB0aGF0ICAgICAgPSB0aGlzXG5cbiAgICBpZiAoJG5leHQuaGFzQ2xhc3MoJ2FjdGl2ZScpKSByZXR1cm4gKHRoaXMuc2xpZGluZyA9IGZhbHNlKVxuXG4gICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSAkbmV4dFswXVxuICAgIHZhciBzbGlkZUV2ZW50ID0gJC5FdmVudCgnc2xpZGUuYnMuY2Fyb3VzZWwnLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiByZWxhdGVkVGFyZ2V0LFxuICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb25cbiAgICB9KVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzbGlkZUV2ZW50KVxuICAgIGlmIChzbGlkZUV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuc2xpZGluZyA9IHRydWVcblxuICAgIGlzQ3ljbGluZyAmJiB0aGlzLnBhdXNlKClcblxuICAgIGlmICh0aGlzLiRpbmRpY2F0b3JzLmxlbmd0aCkge1xuICAgICAgdGhpcy4kaW5kaWNhdG9ycy5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB2YXIgJG5leHRJbmRpY2F0b3IgPSAkKHRoaXMuJGluZGljYXRvcnMuY2hpbGRyZW4oKVt0aGlzLmdldEl0ZW1JbmRleCgkbmV4dCldKVxuICAgICAgJG5leHRJbmRpY2F0b3IgJiYgJG5leHRJbmRpY2F0b3IuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgdmFyIHNsaWRFdmVudCA9ICQuRXZlbnQoJ3NsaWQuYnMuY2Fyb3VzZWwnLCB7IHJlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsIGRpcmVjdGlvbjogZGlyZWN0aW9uIH0pIC8vIHllcywgXCJzbGlkXCJcbiAgICBpZiAoJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnc2xpZGUnKSkge1xuICAgICAgJG5leHQuYWRkQ2xhc3ModHlwZSlcbiAgICAgIGlmICh0eXBlb2YgJG5leHQgPT09ICdvYmplY3QnICYmICRuZXh0Lmxlbmd0aCkge1xuICAgICAgICAkbmV4dFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcbiAgICAgIH1cbiAgICAgICRhY3RpdmUuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgJG5leHQuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgJGFjdGl2ZVxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJG5leHQucmVtb3ZlQ2xhc3MoW3R5cGUsIGRpcmVjdGlvbl0uam9pbignICcpKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKFsnYWN0aXZlJywgZGlyZWN0aW9uXS5qb2luKCcgJykpXG4gICAgICAgICAgdGhhdC5zbGlkaW5nID0gZmFsc2VcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcihzbGlkRXZlbnQpXG4gICAgICAgICAgfSwgMClcbiAgICAgICAgfSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENhcm91c2VsLlRSQU5TSVRJT05fRFVSQVRJT04pXG4gICAgfSBlbHNlIHtcbiAgICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkbmV4dC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgIHRoaXMuc2xpZGluZyA9IGZhbHNlXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc2xpZEV2ZW50KVxuICAgIH1cblxuICAgIGlzQ3ljbGluZyAmJiB0aGlzLmN5Y2xlKClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENBUk9VU0VMIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIENhcm91c2VsLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuICAgICAgdmFyIGFjdGlvbiAgPSB0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnID8gb3B0aW9uIDogb3B0aW9ucy5zbGlkZVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmNhcm91c2VsJywgKGRhdGEgPSBuZXcgQ2Fyb3VzZWwodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ251bWJlcicpIGRhdGEudG8ob3B0aW9uKVxuICAgICAgZWxzZSBpZiAoYWN0aW9uKSBkYXRhW2FjdGlvbl0oKVxuICAgICAgZWxzZSBpZiAob3B0aW9ucy5pbnRlcnZhbCkgZGF0YS5wYXVzZSgpLmN5Y2xlKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uY2Fyb3VzZWxcblxuICAkLmZuLmNhcm91c2VsICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uY2Fyb3VzZWwuQ29uc3RydWN0b3IgPSBDYXJvdXNlbFxuXG5cbiAgLy8gQ0FST1VTRUwgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmNhcm91c2VsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5jYXJvdXNlbCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIENBUk9VU0VMIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgdmFyIGhyZWYgICAgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICBpZiAoaHJlZikge1xuICAgICAgaHJlZiA9IGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICB2YXIgdGFyZ2V0ICA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykgfHwgaHJlZlxuICAgIHZhciAkdGFyZ2V0ID0gJChkb2N1bWVudCkuZmluZCh0YXJnZXQpXG5cbiAgICBpZiAoISR0YXJnZXQuaGFzQ2xhc3MoJ2Nhcm91c2VsJykpIHJldHVyblxuXG4gICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgJHRhcmdldC5kYXRhKCksICR0aGlzLmRhdGEoKSlcbiAgICB2YXIgc2xpZGVJbmRleCA9ICR0aGlzLmF0dHIoJ2RhdGEtc2xpZGUtdG8nKVxuICAgIGlmIChzbGlkZUluZGV4KSBvcHRpb25zLmludGVydmFsID0gZmFsc2VcblxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbnMpXG5cbiAgICBpZiAoc2xpZGVJbmRleCkge1xuICAgICAgJHRhcmdldC5kYXRhKCdicy5jYXJvdXNlbCcpLnRvKHNsaWRlSW5kZXgpXG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIH1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMuY2Fyb3VzZWwuZGF0YS1hcGknLCAnW2RhdGEtc2xpZGVdJywgY2xpY2tIYW5kbGVyKVxuICAgIC5vbignY2xpY2suYnMuY2Fyb3VzZWwuZGF0YS1hcGknLCAnW2RhdGEtc2xpZGUtdG9dJywgY2xpY2tIYW5kbGVyKVxuXG4gICQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1yaWRlPVwiY2Fyb3VzZWxcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkY2Fyb3VzZWwgPSAkKHRoaXMpXG4gICAgICBQbHVnaW4uY2FsbCgkY2Fyb3VzZWwsICRjYXJvdXNlbC5kYXRhKCkpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogY29sbGFwc2UuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jY29sbGFwc2VcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qIGpzaGludCBsYXRlZGVmOiBmYWxzZSAqL1xuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENPTExBUFNFIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIENvbGxhcHNlID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ICAgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgICAgID0gJC5leHRlbmQoe30sIENvbGxhcHNlLkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuJHRyaWdnZXIgICAgICA9ICQoJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2hyZWY9XCIjJyArIGVsZW1lbnQuaWQgKyAnXCJdLCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1tkYXRhLXRvZ2dsZT1cImNvbGxhcHNlXCJdW2RhdGEtdGFyZ2V0PVwiIycgKyBlbGVtZW50LmlkICsgJ1wiXScpXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gbnVsbFxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5wYXJlbnQpIHtcbiAgICAgIHRoaXMuJHBhcmVudCA9IHRoaXMuZ2V0UGFyZW50KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3ModGhpcy4kZWxlbWVudCwgdGhpcy4kdHJpZ2dlcilcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnRvZ2dsZSkgdGhpcy50b2dnbGUoKVxuICB9XG5cbiAgQ29sbGFwc2UuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTiA9IDM1MFxuXG4gIENvbGxhcHNlLkRFRkFVTFRTID0ge1xuICAgIHRvZ2dsZTogdHJ1ZVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmRpbWVuc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFzV2lkdGggPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCd3aWR0aCcpXG4gICAgcmV0dXJuIGhhc1dpZHRoID8gJ3dpZHRoJyA6ICdoZWlnaHQnXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uaW5nIHx8IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykpIHJldHVyblxuXG4gICAgdmFyIGFjdGl2ZXNEYXRhXG4gICAgdmFyIGFjdGl2ZXMgPSB0aGlzLiRwYXJlbnQgJiYgdGhpcy4kcGFyZW50LmNoaWxkcmVuKCcucGFuZWwnKS5jaGlsZHJlbignLmluLCAuY29sbGFwc2luZycpXG5cbiAgICBpZiAoYWN0aXZlcyAmJiBhY3RpdmVzLmxlbmd0aCkge1xuICAgICAgYWN0aXZlc0RhdGEgPSBhY3RpdmVzLmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICAgIGlmIChhY3RpdmVzRGF0YSAmJiBhY3RpdmVzRGF0YS50cmFuc2l0aW9uaW5nKSByZXR1cm5cbiAgICB9XG5cbiAgICB2YXIgc3RhcnRFdmVudCA9ICQuRXZlbnQoJ3Nob3cuYnMuY29sbGFwc2UnKVxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzdGFydEV2ZW50KVxuICAgIGlmIChzdGFydEV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIGlmIChhY3RpdmVzICYmIGFjdGl2ZXMubGVuZ3RoKSB7XG4gICAgICBQbHVnaW4uY2FsbChhY3RpdmVzLCAnaGlkZScpXG4gICAgICBhY3RpdmVzRGF0YSB8fCBhY3RpdmVzLmRhdGEoJ2JzLmNvbGxhcHNlJywgbnVsbClcbiAgICB9XG5cbiAgICB2YXIgZGltZW5zaW9uID0gdGhpcy5kaW1lbnNpb24oKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpXG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKVtkaW1lbnNpb25dKDApXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICB0aGlzLiR0cmlnZ2VyXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAxXG5cbiAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAgIC5hZGRDbGFzcygnY29sbGFwc2UgaW4nKVtkaW1lbnNpb25dKCcnKVxuICAgICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMFxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAudHJpZ2dlcignc2hvd24uYnMuY29sbGFwc2UnKVxuICAgIH1cblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVybiBjb21wbGV0ZS5jYWxsKHRoaXMpXG5cbiAgICB2YXIgc2Nyb2xsU2l6ZSA9ICQuY2FtZWxDYXNlKFsnc2Nyb2xsJywgZGltZW5zaW9uXS5qb2luKCctJykpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KGNvbXBsZXRlLCB0aGlzKSlcbiAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChDb2xsYXBzZS5UUkFOU0lUSU9OX0RVUkFUSU9OKVtkaW1lbnNpb25dKHRoaXMuJGVsZW1lbnRbMF1bc2Nyb2xsU2l6ZV0pXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uaW5nIHx8ICF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSByZXR1cm5cblxuICAgIHZhciBzdGFydEV2ZW50ID0gJC5FdmVudCgnaGlkZS5icy5jb2xsYXBzZScpXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHN0YXJ0RXZlbnQpXG4gICAgaWYgKHN0YXJ0RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdmFyIGRpbWVuc2lvbiA9IHRoaXMuZGltZW5zaW9uKClcblxuICAgIHRoaXMuJGVsZW1lbnRbZGltZW5zaW9uXSh0aGlzLiRlbGVtZW50W2RpbWVuc2lvbl0oKSlbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZSBpbicpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgdGhpcy4kdHJpZ2dlclxuICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZWQnKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDFcblxuICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDBcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZScpXG4gICAgICAgIC50cmlnZ2VyKCdoaWRkZW4uYnMuY29sbGFwc2UnKVxuICAgIH1cblxuICAgIGlmICghJC5zdXBwb3J0LnRyYW5zaXRpb24pIHJldHVybiBjb21wbGV0ZS5jYWxsKHRoaXMpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICBbZGltZW5zaW9uXSgwKVxuICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eShjb21wbGV0ZSwgdGhpcykpXG4gICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ29sbGFwc2UuVFJBTlNJVElPTl9EVVJBVElPTilcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpc1t0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpID8gJ2hpZGUnIDogJ3Nob3cnXSgpXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuZ2V0UGFyZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy5wYXJlbnQpXG4gICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS1wYXJlbnQ9XCInICsgdGhpcy5vcHRpb25zLnBhcmVudCArICdcIl0nKVxuICAgICAgLmVhY2goJC5wcm94eShmdW5jdGlvbiAoaSwgZWxlbWVudCkge1xuICAgICAgICB2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgICAgIHRoaXMuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzKGdldFRhcmdldEZyb21UcmlnZ2VyKCRlbGVtZW50KSwgJGVsZW1lbnQpXG4gICAgICB9LCB0aGlzKSlcbiAgICAgIC5lbmQoKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyA9IGZ1bmN0aW9uICgkZWxlbWVudCwgJHRyaWdnZXIpIHtcbiAgICB2YXIgaXNPcGVuID0gJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJylcblxuICAgICRlbGVtZW50LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW4pXG4gICAgJHRyaWdnZXJcbiAgICAgIC50b2dnbGVDbGFzcygnY29sbGFwc2VkJywgIWlzT3BlbilcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJHRyaWdnZXIpIHtcbiAgICB2YXIgaHJlZlxuICAgIHZhciB0YXJnZXQgPSAkdHJpZ2dlci5hdHRyKCdkYXRhLXRhcmdldCcpXG4gICAgICB8fCAoaHJlZiA9ICR0cmlnZ2VyLmF0dHIoJ2hyZWYnKSkgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuXG4gICAgcmV0dXJuICQoZG9jdW1lbnQpLmZpbmQodGFyZ2V0KVxuICB9XG5cblxuICAvLyBDT0xMQVBTRSBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5jb2xsYXBzZScpXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBDb2xsYXBzZS5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcblxuICAgICAgaWYgKCFkYXRhICYmIG9wdGlvbnMudG9nZ2xlICYmIC9zaG93fGhpZGUvLnRlc3Qob3B0aW9uKSkgb3B0aW9ucy50b2dnbGUgPSBmYWxzZVxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5jb2xsYXBzZScsIChkYXRhID0gbmV3IENvbGxhcHNlKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5jb2xsYXBzZVxuXG4gICQuZm4uY29sbGFwc2UgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5jb2xsYXBzZS5Db25zdHJ1Y3RvciA9IENvbGxhcHNlXG5cblxuICAvLyBDT0xMQVBTRSBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uY29sbGFwc2Uubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmNvbGxhcHNlID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQ09MTEFQU0UgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMuY29sbGFwc2UuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuXG4gICAgaWYgKCEkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpKSBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIHZhciAkdGFyZ2V0ID0gZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJHRoaXMpXG4gICAgdmFyIGRhdGEgICAgPSAkdGFyZ2V0LmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICB2YXIgb3B0aW9uICA9IGRhdGEgPyAndG9nZ2xlJyA6ICR0aGlzLmRhdGEoKVxuXG4gICAgUGx1Z2luLmNhbGwoJHRhcmdldCwgb3B0aW9uKVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBkcm9wZG93bi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNkcm9wZG93bnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBEUk9QRE9XTiBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgYmFja2Ryb3AgPSAnLmRyb3Bkb3duLWJhY2tkcm9wJ1xuICB2YXIgdG9nZ2xlICAgPSAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nXG4gIHZhciBEcm9wZG93biA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgJChlbGVtZW50KS5vbignY2xpY2suYnMuZHJvcGRvd24nLCB0aGlzLnRvZ2dsZSlcbiAgfVxuXG4gIERyb3Bkb3duLlZFUlNJT04gPSAnMy40LjEnXG5cbiAgZnVuY3Rpb24gZ2V0UGFyZW50KCR0aGlzKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgLyNbQS1aYS16XS8udGVzdChzZWxlY3RvcikgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICB2YXIgJHBhcmVudCA9IHNlbGVjdG9yICE9PSAnIycgPyAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKSA6IG51bGxcblxuICAgIHJldHVybiAkcGFyZW50ICYmICRwYXJlbnQubGVuZ3RoID8gJHBhcmVudCA6ICR0aGlzLnBhcmVudCgpXG4gIH1cblxuICBmdW5jdGlvbiBjbGVhck1lbnVzKGUpIHtcbiAgICBpZiAoZSAmJiBlLndoaWNoID09PSAzKSByZXR1cm5cbiAgICAkKGJhY2tkcm9wKS5yZW1vdmUoKVxuICAgICQodG9nZ2xlKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgICAgICAgID0gJCh0aGlzKVxuICAgICAgdmFyICRwYXJlbnQgICAgICAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgICB2YXIgcmVsYXRlZFRhcmdldCA9IHsgcmVsYXRlZFRhcmdldDogdGhpcyB9XG5cbiAgICAgIGlmICghJHBhcmVudC5oYXNDbGFzcygnb3BlbicpKSByZXR1cm5cblxuICAgICAgaWYgKGUgJiYgZS50eXBlID09ICdjbGljaycgJiYgL2lucHV0fHRleHRhcmVhL2kudGVzdChlLnRhcmdldC50YWdOYW1lKSAmJiAkLmNvbnRhaW5zKCRwYXJlbnRbMF0sIGUudGFyZ2V0KSkgcmV0dXJuXG5cbiAgICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnaGlkZS5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgICR0aGlzLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKVxuICAgICAgJHBhcmVudC5yZW1vdmVDbGFzcygnb3BlbicpLnRyaWdnZXIoJC5FdmVudCgnaGlkZGVuLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG4gICAgfSlcbiAgfVxuXG4gIERyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcylcblxuICAgIGlmICgkdGhpcy5pcygnLmRpc2FibGVkLCA6ZGlzYWJsZWQnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHBhcmVudCAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgdmFyIGlzQWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcygnb3BlbicpXG5cbiAgICBjbGVhck1lbnVzKClcblxuICAgIGlmICghaXNBY3RpdmUpIHtcbiAgICAgIGlmICgnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgISRwYXJlbnQuY2xvc2VzdCgnLm5hdmJhci1uYXYnKS5sZW5ndGgpIHtcbiAgICAgICAgLy8gaWYgbW9iaWxlIHdlIHVzZSBhIGJhY2tkcm9wIGJlY2F1c2UgY2xpY2sgZXZlbnRzIGRvbid0IGRlbGVnYXRlXG4gICAgICAgICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXG4gICAgICAgICAgLmFkZENsYXNzKCdkcm9wZG93bi1iYWNrZHJvcCcpXG4gICAgICAgICAgLmluc2VydEFmdGVyKCQodGhpcykpXG4gICAgICAgICAgLm9uKCdjbGljaycsIGNsZWFyTWVudXMpXG4gICAgICB9XG5cbiAgICAgIHZhciByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiB0aGlzIH1cbiAgICAgICRwYXJlbnQudHJpZ2dlcihlID0gJC5FdmVudCgnc2hvdy5icy5kcm9wZG93bicsIHJlbGF0ZWRUYXJnZXQpKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgICR0aGlzXG4gICAgICAgIC50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKVxuXG4gICAgICAkcGFyZW50XG4gICAgICAgIC50b2dnbGVDbGFzcygnb3BlbicpXG4gICAgICAgIC50cmlnZ2VyKCQuRXZlbnQoJ3Nob3duLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKCEvKDM4fDQwfDI3fDMyKS8udGVzdChlLndoaWNoKSB8fCAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGUudGFyZ2V0LnRhZ05hbWUpKSByZXR1cm5cblxuICAgIHZhciAkdGhpcyA9ICQodGhpcylcblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgIGlmICgkdGhpcy5pcygnLmRpc2FibGVkLCA6ZGlzYWJsZWQnKSkgcmV0dXJuXG5cbiAgICB2YXIgJHBhcmVudCAgPSBnZXRQYXJlbnQoJHRoaXMpXG4gICAgdmFyIGlzQWN0aXZlID0gJHBhcmVudC5oYXNDbGFzcygnb3BlbicpXG5cbiAgICBpZiAoIWlzQWN0aXZlICYmIGUud2hpY2ggIT0gMjcgfHwgaXNBY3RpdmUgJiYgZS53aGljaCA9PSAyNykge1xuICAgICAgaWYgKGUud2hpY2ggPT0gMjcpICRwYXJlbnQuZmluZCh0b2dnbGUpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgIHJldHVybiAkdGhpcy50cmlnZ2VyKCdjbGljaycpXG4gICAgfVxuXG4gICAgdmFyIGRlc2MgPSAnIGxpOm5vdCguZGlzYWJsZWQpOnZpc2libGUgYSdcbiAgICB2YXIgJGl0ZW1zID0gJHBhcmVudC5maW5kKCcuZHJvcGRvd24tbWVudScgKyBkZXNjKVxuXG4gICAgaWYgKCEkaXRlbXMubGVuZ3RoKSByZXR1cm5cblxuICAgIHZhciBpbmRleCA9ICRpdGVtcy5pbmRleChlLnRhcmdldClcblxuICAgIGlmIChlLndoaWNoID09IDM4ICYmIGluZGV4ID4gMCkgICAgICAgICAgICAgICAgIGluZGV4LS0gICAgICAgICAvLyB1cFxuICAgIGlmIChlLndoaWNoID09IDQwICYmIGluZGV4IDwgJGl0ZW1zLmxlbmd0aCAtIDEpIGluZGV4KysgICAgICAgICAvLyBkb3duXG4gICAgaWYgKCF+aW5kZXgpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwXG5cbiAgICAkaXRlbXMuZXEoaW5kZXgpLnRyaWdnZXIoJ2ZvY3VzJylcbiAgfVxuXG5cbiAgLy8gRFJPUERPV04gUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgPSAkdGhpcy5kYXRhKCdicy5kcm9wZG93bicpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuZHJvcGRvd24nLCAoZGF0YSA9IG5ldyBEcm9wZG93bih0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dLmNhbGwoJHRoaXMpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmRyb3Bkb3duXG5cbiAgJC5mbi5kcm9wZG93biAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yID0gRHJvcGRvd25cblxuXG4gIC8vIERST1BET1dOIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5kcm9wZG93bi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uZHJvcGRvd24gPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBUFBMWSBUTyBTVEFOREFSRCBEUk9QRE9XTiBFTEVNRU5UU1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsIGNsZWFyTWVudXMpXG4gICAgLm9uKCdjbGljay5icy5kcm9wZG93bi5kYXRhLWFwaScsICcuZHJvcGRvd24gZm9ybScsIGZ1bmN0aW9uIChlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCkgfSlcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgdG9nZ2xlLCBEcm9wZG93bi5wcm90b3R5cGUudG9nZ2xlKVxuICAgIC5vbigna2V5ZG93bi5icy5kcm9wZG93bi5kYXRhLWFwaScsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24pXG4gICAgLm9uKCdrZXlkb3duLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgJy5kcm9wZG93bi1tZW51JywgRHJvcGRvd24ucHJvdG90eXBlLmtleWRvd24pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IG1vZGFsLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI21vZGFsc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIE1PREFMIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBNb2RhbCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuJGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpXG4gICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICB0aGlzLiRkaWFsb2cgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5tb2RhbC1kaWFsb2cnKVxuICAgIHRoaXMuJGJhY2tkcm9wID0gbnVsbFxuICAgIHRoaXMuaXNTaG93biA9IG51bGxcbiAgICB0aGlzLm9yaWdpbmFsQm9keVBhZCA9IG51bGxcbiAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gMFxuICAgIHRoaXMuaWdub3JlQmFja2Ryb3BDbGljayA9IGZhbHNlXG4gICAgdGhpcy5maXhlZENvbnRlbnQgPSAnLm5hdmJhci1maXhlZC10b3AsIC5uYXZiYXItZml4ZWQtYm90dG9tJ1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdGUpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLmZpbmQoJy5tb2RhbC1jb250ZW50JylcbiAgICAgICAgLmxvYWQodGhpcy5vcHRpb25zLnJlbW90ZSwgJC5wcm94eShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdsb2FkZWQuYnMubW9kYWwnKVxuICAgICAgICB9LCB0aGlzKSlcbiAgICB9XG4gIH1cblxuICBNb2RhbC5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04gPSAzMDBcbiAgTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIE1vZGFsLkRFRkFVTFRTID0ge1xuICAgIGJhY2tkcm9wOiB0cnVlLFxuICAgIGtleWJvYXJkOiB0cnVlLFxuICAgIHNob3c6IHRydWVcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5pc1Nob3duID8gdGhpcy5oaWRlKCkgOiB0aGlzLnNob3coX3JlbGF0ZWRUYXJnZXQpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChfcmVsYXRlZFRhcmdldCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciBlID0gJC5FdmVudCgnc2hvdy5icy5tb2RhbCcsIHsgcmVsYXRlZFRhcmdldDogX3JlbGF0ZWRUYXJnZXQgfSlcblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKHRoaXMuaXNTaG93biB8fCBlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuaXNTaG93biA9IHRydWVcblxuICAgIHRoaXMuY2hlY2tTY3JvbGxiYXIoKVxuICAgIHRoaXMuc2V0U2Nyb2xsYmFyKClcbiAgICB0aGlzLiRib2R5LmFkZENsYXNzKCdtb2RhbC1vcGVuJylcblxuICAgIHRoaXMuZXNjYXBlKClcbiAgICB0aGlzLnJlc2l6ZSgpXG5cbiAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJywgJ1tkYXRhLWRpc21pc3M9XCJtb2RhbFwiXScsICQucHJveHkodGhpcy5oaWRlLCB0aGlzKSlcblxuICAgIHRoaXMuJGRpYWxvZy5vbignbW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRlbGVtZW50Lm9uZSgnbW91c2V1cC5kaXNtaXNzLmJzLm1vZGFsJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmlzKHRoYXQuJGVsZW1lbnQpKSB0aGF0Lmlnbm9yZUJhY2tkcm9wQ2xpY2sgPSB0cnVlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0cmFuc2l0aW9uID0gJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhhdC4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpXG5cbiAgICAgIGlmICghdGhhdC4kZWxlbWVudC5wYXJlbnQoKS5sZW5ndGgpIHtcbiAgICAgICAgdGhhdC4kZWxlbWVudC5hcHBlbmRUbyh0aGF0LiRib2R5KSAvLyBkb24ndCBtb3ZlIG1vZGFscyBkb20gcG9zaXRpb25cbiAgICAgIH1cblxuICAgICAgdGhhdC4kZWxlbWVudFxuICAgICAgICAuc2hvdygpXG4gICAgICAgIC5zY3JvbGxUb3AoMClcblxuICAgICAgdGhhdC5hZGp1c3REaWFsb2coKVxuXG4gICAgICBpZiAodHJhbnNpdGlvbikge1xuICAgICAgICB0aGF0LiRlbGVtZW50WzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuICAgICAgfVxuXG4gICAgICB0aGF0LiRlbGVtZW50LmFkZENsYXNzKCdpbicpXG5cbiAgICAgIHRoYXQuZW5mb3JjZUZvY3VzKClcblxuICAgICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93bi5icy5tb2RhbCcsIHsgcmVsYXRlZFRhcmdldDogX3JlbGF0ZWRUYXJnZXQgfSlcblxuICAgICAgdHJhbnNpdGlvbiA/XG4gICAgICAgIHRoYXQuJGRpYWxvZyAvLyB3YWl0IGZvciBtb2RhbCB0byBzbGlkZSBpblxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKS50cmlnZ2VyKGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJykudHJpZ2dlcihlKVxuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgZSA9ICQuRXZlbnQoJ2hpZGUuYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAoIXRoaXMuaXNTaG93biB8fCBlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgIHRoaXMuaXNTaG93biA9IGZhbHNlXG5cbiAgICB0aGlzLmVzY2FwZSgpXG4gICAgdGhpcy5yZXNpemUoKVxuXG4gICAgJChkb2N1bWVudCkub2ZmKCdmb2N1c2luLmJzLm1vZGFsJylcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5yZW1vdmVDbGFzcygnaW4nKVxuICAgICAgLm9mZignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcpXG4gICAgICAub2ZmKCdtb3VzZXVwLmRpc21pc3MuYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZGlhbG9nLm9mZignbW91c2Vkb3duLmRpc21pc3MuYnMubW9kYWwnKVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgJC5wcm94eSh0aGlzLmhpZGVNb2RhbCwgdGhpcykpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICB0aGlzLmhpZGVNb2RhbCgpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuZW5mb3JjZUZvY3VzID0gZnVuY3Rpb24gKCkge1xuICAgICQoZG9jdW1lbnQpXG4gICAgICAub2ZmKCdmb2N1c2luLmJzLm1vZGFsJykgLy8gZ3VhcmQgYWdhaW5zdCBpbmZpbml0ZSBmb2N1cyBsb29wXG4gICAgICAub24oJ2ZvY3VzaW4uYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChkb2N1bWVudCAhPT0gZS50YXJnZXQgJiZcbiAgICAgICAgICB0aGlzLiRlbGVtZW50WzBdICE9PSBlLnRhcmdldCAmJlxuICAgICAgICAgICF0aGlzLiRlbGVtZW50LmhhcyhlLnRhcmdldCkubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpKVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmVzY2FwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1Nob3duICYmIHRoaXMub3B0aW9ucy5rZXlib2FyZCkge1xuICAgICAgdGhpcy4kZWxlbWVudC5vbigna2V5ZG93bi5kaXNtaXNzLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLndoaWNoID09IDI3ICYmIHRoaXMuaGlkZSgpXG4gICAgICB9LCB0aGlzKSlcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2hvd24pIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub2ZmKCdrZXlkb3duLmRpc21pc3MuYnMubW9kYWwnKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaXNTaG93bikge1xuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuYnMubW9kYWwnLCAkLnByb3h5KHRoaXMuaGFuZGxlVXBkYXRlLCB0aGlzKSlcbiAgICB9IGVsc2Uge1xuICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplLmJzLm1vZGFsJylcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuaGlkZU1vZGFsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHRoaXMuJGVsZW1lbnQuaGlkZSgpXG4gICAgdGhpcy5iYWNrZHJvcChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGF0LiRib2R5LnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJylcbiAgICAgIHRoYXQucmVzZXRBZGp1c3RtZW50cygpXG4gICAgICB0aGF0LnJlc2V0U2Nyb2xsYmFyKClcbiAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignaGlkZGVuLmJzLm1vZGFsJylcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlbW92ZUJhY2tkcm9wID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGJhY2tkcm9wICYmIHRoaXMuJGJhY2tkcm9wLnJlbW92ZSgpXG4gICAgdGhpcy4kYmFja2Ryb3AgPSBudWxsXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuYmFja2Ryb3AgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgYW5pbWF0ZSA9IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/ICdmYWRlJyA6ICcnXG5cbiAgICBpZiAodGhpcy5pc1Nob3duICYmIHRoaXMub3B0aW9ucy5iYWNrZHJvcCkge1xuICAgICAgdmFyIGRvQW5pbWF0ZSA9ICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIGFuaW1hdGVcblxuICAgICAgdGhpcy4kYmFja2Ryb3AgPSAkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxuICAgICAgICAuYWRkQ2xhc3MoJ21vZGFsLWJhY2tkcm9wICcgKyBhbmltYXRlKVxuICAgICAgICAuYXBwZW5kVG8odGhpcy4kYm9keSlcblxuICAgICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suZGlzbWlzcy5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlQmFja2Ryb3BDbGljaykge1xuICAgICAgICAgIHRoaXMuaWdub3JlQmFja2Ryb3BDbGljayA9IGZhbHNlXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHJldHVyblxuICAgICAgICB0aGlzLm9wdGlvbnMuYmFja2Ryb3AgPT0gJ3N0YXRpYydcbiAgICAgICAgICA/IHRoaXMuJGVsZW1lbnRbMF0uZm9jdXMoKVxuICAgICAgICAgIDogdGhpcy5oaWRlKClcbiAgICAgIH0sIHRoaXMpKVxuXG4gICAgICBpZiAoZG9BbmltYXRlKSB0aGlzLiRiYWNrZHJvcFswXS5vZmZzZXRXaWR0aCAvLyBmb3JjZSByZWZsb3dcblxuICAgICAgdGhpcy4kYmFja2Ryb3AuYWRkQ2xhc3MoJ2luJylcblxuICAgICAgaWYgKCFjYWxsYmFjaykgcmV0dXJuXG5cbiAgICAgIGRvQW5pbWF0ZSA/XG4gICAgICAgIHRoaXMuJGJhY2tkcm9wXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY2FsbGJhY2spXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY2FsbGJhY2soKVxuXG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1Nob3duICYmIHRoaXMuJGJhY2tkcm9wKSB7XG4gICAgICB0aGlzLiRiYWNrZHJvcC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgICB2YXIgY2FsbGJhY2tSZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoYXQucmVtb3ZlQmFja2Ryb3AoKVxuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgICB9XG4gICAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgICB0aGlzLiRiYWNrZHJvcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNhbGxiYWNrUmVtb3ZlKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIGNhbGxiYWNrUmVtb3ZlKClcblxuICAgIH0gZWxzZSBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICAvLyB0aGVzZSBmb2xsb3dpbmcgbWV0aG9kcyBhcmUgdXNlZCB0byBoYW5kbGUgb3ZlcmZsb3dpbmcgbW9kYWxzXG5cbiAgTW9kYWwucHJvdG90eXBlLmhhbmRsZVVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFkanVzdERpYWxvZygpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuYWRqdXN0RGlhbG9nID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RhbElzT3ZlcmZsb3dpbmcgPSB0aGlzLiRlbGVtZW50WzBdLnNjcm9sbEhlaWdodCA+IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcblxuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHtcbiAgICAgIHBhZGRpbmdMZWZ0OiAhdGhpcy5ib2R5SXNPdmVyZmxvd2luZyAmJiBtb2RhbElzT3ZlcmZsb3dpbmcgPyB0aGlzLnNjcm9sbGJhcldpZHRoIDogJycsXG4gICAgICBwYWRkaW5nUmlnaHQ6IHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgJiYgIW1vZGFsSXNPdmVyZmxvd2luZyA/IHRoaXMuc2Nyb2xsYmFyV2lkdGggOiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzZXRBZGp1c3RtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRlbGVtZW50LmNzcyh7XG4gICAgICBwYWRkaW5nTGVmdDogJycsXG4gICAgICBwYWRkaW5nUmlnaHQ6ICcnXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5jaGVja1Njcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZnVsbFdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICBpZiAoIWZ1bGxXaW5kb3dXaWR0aCkgeyAvLyB3b3JrYXJvdW5kIGZvciBtaXNzaW5nIHdpbmRvdy5pbm5lcldpZHRoIGluIElFOFxuICAgICAgdmFyIGRvY3VtZW50RWxlbWVudFJlY3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGZ1bGxXaW5kb3dXaWR0aCA9IGRvY3VtZW50RWxlbWVudFJlY3QucmlnaHQgLSBNYXRoLmFicyhkb2N1bWVudEVsZW1lbnRSZWN0LmxlZnQpXG4gICAgfVxuICAgIHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIDwgZnVsbFdpbmRvd1dpZHRoXG4gICAgdGhpcy5zY3JvbGxiYXJXaWR0aCA9IHRoaXMubWVhc3VyZVNjcm9sbGJhcigpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuc2V0U2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBib2R5UGFkID0gcGFyc2VJbnQoKHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JykgfHwgMCksIDEwKVxuICAgIHRoaXMub3JpZ2luYWxCb2R5UGFkID0gZG9jdW1lbnQuYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgfHwgJydcbiAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSB0aGlzLnNjcm9sbGJhcldpZHRoXG4gICAgaWYgKHRoaXMuYm9keUlzT3ZlcmZsb3dpbmcpIHtcbiAgICAgIHRoaXMuJGJvZHkuY3NzKCdwYWRkaW5nLXJpZ2h0JywgYm9keVBhZCArIHNjcm9sbGJhcldpZHRoKVxuICAgICAgJCh0aGlzLmZpeGVkQ29udGVudCkuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGFjdHVhbFBhZGRpbmcgPSBlbGVtZW50LnN0eWxlLnBhZGRpbmdSaWdodFxuICAgICAgICB2YXIgY2FsY3VsYXRlZFBhZGRpbmcgPSAkKGVsZW1lbnQpLmNzcygncGFkZGluZy1yaWdodCcpXG4gICAgICAgICQoZWxlbWVudClcbiAgICAgICAgICAuZGF0YSgncGFkZGluZy1yaWdodCcsIGFjdHVhbFBhZGRpbmcpXG4gICAgICAgICAgLmNzcygncGFkZGluZy1yaWdodCcsIHBhcnNlRmxvYXQoY2FsY3VsYXRlZFBhZGRpbmcpICsgc2Nyb2xsYmFyV2lkdGggKyAncHgnKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVzZXRTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnLCB0aGlzLm9yaWdpbmFsQm9keVBhZClcbiAgICAkKHRoaXMuZml4ZWRDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgdmFyIHBhZGRpbmcgPSAkKGVsZW1lbnQpLmRhdGEoJ3BhZGRpbmctcmlnaHQnKVxuICAgICAgJChlbGVtZW50KS5yZW1vdmVEYXRhKCdwYWRkaW5nLXJpZ2h0JylcbiAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZyA/IHBhZGRpbmcgOiAnJ1xuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUubWVhc3VyZVNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHsgLy8gdGh4IHdhbHNoXG4gICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgc2Nyb2xsRGl2LmNsYXNzTmFtZSA9ICdtb2RhbC1zY3JvbGxiYXItbWVhc3VyZSdcbiAgICB0aGlzLiRib2R5LmFwcGVuZChzY3JvbGxEaXYpXG4gICAgdmFyIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoXG4gICAgdGhpcy4kYm9keVswXS5yZW1vdmVDaGlsZChzY3JvbGxEaXYpXG4gICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoXG4gIH1cblxuXG4gIC8vIE1PREFMIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbiwgX3JlbGF0ZWRUYXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnYnMubW9kYWwnKVxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgTW9kYWwuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMubW9kYWwnLCAoZGF0YSA9IG5ldyBNb2RhbCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKF9yZWxhdGVkVGFyZ2V0KVxuICAgICAgZWxzZSBpZiAob3B0aW9ucy5zaG93KSBkYXRhLnNob3coX3JlbGF0ZWRUYXJnZXQpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLm1vZGFsXG5cbiAgJC5mbi5tb2RhbCA9IFBsdWdpblxuICAkLmZuLm1vZGFsLkNvbnN0cnVjdG9yID0gTW9kYWxcblxuXG4gIC8vIE1PREFMIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5tb2RhbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4ubW9kYWwgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBNT0RBTCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5tb2RhbC5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgIHZhciBocmVmID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgdmFyIHRhcmdldCA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykgfHxcbiAgICAgIChocmVmICYmIGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpKSAvLyBzdHJpcCBmb3IgaWU3XG5cbiAgICB2YXIgJHRhcmdldCA9ICQoZG9jdW1lbnQpLmZpbmQodGFyZ2V0KVxuICAgIHZhciBvcHRpb24gPSAkdGFyZ2V0LmRhdGEoJ2JzLm1vZGFsJykgPyAndG9nZ2xlJyA6ICQuZXh0ZW5kKHsgcmVtb3RlOiAhLyMvLnRlc3QoaHJlZikgJiYgaHJlZiB9LCAkdGFyZ2V0LmRhdGEoKSwgJHRoaXMuZGF0YSgpKVxuXG4gICAgaWYgKCR0aGlzLmlzKCdhJykpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgJHRhcmdldC5vbmUoJ3Nob3cuYnMubW9kYWwnLCBmdW5jdGlvbiAoc2hvd0V2ZW50KSB7XG4gICAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm4gLy8gb25seSByZWdpc3RlciBmb2N1cyByZXN0b3JlciBpZiBtb2RhbCB3aWxsIGFjdHVhbGx5IGdldCBzaG93blxuICAgICAgJHRhcmdldC5vbmUoJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHRoaXMuaXMoJzp2aXNpYmxlJykgJiYgJHRoaXMudHJpZ2dlcignZm9jdXMnKVxuICAgICAgfSlcbiAgICB9KVxuICAgIFBsdWdpbi5jYWxsKCR0YXJnZXQsIG9wdGlvbiwgdGhpcylcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdG9vbHRpcC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0b29sdGlwXG4gKiBJbnNwaXJlZCBieSB0aGUgb3JpZ2luYWwgalF1ZXJ5LnRpcHN5IGJ5IEphc29uIEZyYW1lXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBESVNBTExPV0VEX0FUVFJJQlVURVMgPSBbJ3Nhbml0aXplJywgJ3doaXRlTGlzdCcsICdzYW5pdGl6ZUZuJ11cblxuICB2YXIgdXJpQXR0cnMgPSBbXG4gICAgJ2JhY2tncm91bmQnLFxuICAgICdjaXRlJyxcbiAgICAnaHJlZicsXG4gICAgJ2l0ZW10eXBlJyxcbiAgICAnbG9uZ2Rlc2MnLFxuICAgICdwb3N0ZXInLFxuICAgICdzcmMnLFxuICAgICd4bGluazpocmVmJ1xuICBdXG5cbiAgdmFyIEFSSUFfQVRUUklCVVRFX1BBVFRFUk4gPSAvXmFyaWEtW1xcdy1dKiQvaVxuXG4gIHZhciBEZWZhdWx0V2hpdGVsaXN0ID0ge1xuICAgIC8vIEdsb2JhbCBhdHRyaWJ1dGVzIGFsbG93ZWQgb24gYW55IHN1cHBsaWVkIGVsZW1lbnQgYmVsb3cuXG4gICAgJyonOiBbJ2NsYXNzJywgJ2RpcicsICdpZCcsICdsYW5nJywgJ3JvbGUnLCBBUklBX0FUVFJJQlVURV9QQVRURVJOXSxcbiAgICBhOiBbJ3RhcmdldCcsICdocmVmJywgJ3RpdGxlJywgJ3JlbCddLFxuICAgIGFyZWE6IFtdLFxuICAgIGI6IFtdLFxuICAgIGJyOiBbXSxcbiAgICBjb2w6IFtdLFxuICAgIGNvZGU6IFtdLFxuICAgIGRpdjogW10sXG4gICAgZW06IFtdLFxuICAgIGhyOiBbXSxcbiAgICBoMTogW10sXG4gICAgaDI6IFtdLFxuICAgIGgzOiBbXSxcbiAgICBoNDogW10sXG4gICAgaDU6IFtdLFxuICAgIGg2OiBbXSxcbiAgICBpOiBbXSxcbiAgICBpbWc6IFsnc3JjJywgJ2FsdCcsICd0aXRsZScsICd3aWR0aCcsICdoZWlnaHQnXSxcbiAgICBsaTogW10sXG4gICAgb2w6IFtdLFxuICAgIHA6IFtdLFxuICAgIHByZTogW10sXG4gICAgczogW10sXG4gICAgc21hbGw6IFtdLFxuICAgIHNwYW46IFtdLFxuICAgIHN1YjogW10sXG4gICAgc3VwOiBbXSxcbiAgICBzdHJvbmc6IFtdLFxuICAgIHU6IFtdLFxuICAgIHVsOiBbXVxuICB9XG5cbiAgLyoqXG4gICAqIEEgcGF0dGVybiB0aGF0IHJlY29nbml6ZXMgYSBjb21tb25seSB1c2VmdWwgc3Vic2V0IG9mIFVSTHMgdGhhdCBhcmUgc2FmZS5cbiAgICpcbiAgICogU2hvdXRvdXQgdG8gQW5ndWxhciA3IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvYmxvYi83LjIuNC9wYWNrYWdlcy9jb3JlL3NyYy9zYW5pdGl6YXRpb24vdXJsX3Nhbml0aXplci50c1xuICAgKi9cbiAgdmFyIFNBRkVfVVJMX1BBVFRFUk4gPSAvXig/Oig/Omh0dHBzP3xtYWlsdG98ZnRwfHRlbHxmaWxlKTp8W14mOi8/I10qKD86Wy8/I118JCkpL2dpXG5cbiAgLyoqXG4gICAqIEEgcGF0dGVybiB0aGF0IG1hdGNoZXMgc2FmZSBkYXRhIFVSTHMuIE9ubHkgbWF0Y2hlcyBpbWFnZSwgdmlkZW8gYW5kIGF1ZGlvIHR5cGVzLlxuICAgKlxuICAgKiBTaG91dG91dCB0byBBbmd1bGFyIDcgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9ibG9iLzcuMi40L3BhY2thZ2VzL2NvcmUvc3JjL3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyLnRzXG4gICAqL1xuICB2YXIgREFUQV9VUkxfUEFUVEVSTiA9IC9eZGF0YTooPzppbWFnZVxcLyg/OmJtcHxnaWZ8anBlZ3xqcGd8cG5nfHRpZmZ8d2VicCl8dmlkZW9cXC8oPzptcGVnfG1wNHxvZ2d8d2VibSl8YXVkaW9cXC8oPzptcDN8b2dhfG9nZ3xvcHVzKSk7YmFzZTY0LFthLXowLTkrL10rPSokL2lcblxuICBmdW5jdGlvbiBhbGxvd2VkQXR0cmlidXRlKGF0dHIsIGFsbG93ZWRBdHRyaWJ1dGVMaXN0KSB7XG4gICAgdmFyIGF0dHJOYW1lID0gYXR0ci5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiAoJC5pbkFycmF5KGF0dHJOYW1lLCBhbGxvd2VkQXR0cmlidXRlTGlzdCkgIT09IC0xKSB7XG4gICAgICBpZiAoJC5pbkFycmF5KGF0dHJOYW1lLCB1cmlBdHRycykgIT09IC0xKSB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKGF0dHIubm9kZVZhbHVlLm1hdGNoKFNBRkVfVVJMX1BBVFRFUk4pIHx8IGF0dHIubm9kZVZhbHVlLm1hdGNoKERBVEFfVVJMX1BBVFRFUk4pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHZhciByZWdFeHAgPSAkKGFsbG93ZWRBdHRyaWJ1dGVMaXN0KS5maWx0ZXIoZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwXG4gICAgfSlcblxuICAgIC8vIENoZWNrIGlmIGEgcmVndWxhciBleHByZXNzaW9uIHZhbGlkYXRlcyB0aGUgYXR0cmlidXRlLlxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gcmVnRXhwLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGF0dHJOYW1lLm1hdGNoKHJlZ0V4cFtpXSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHNhbml0aXplSHRtbCh1bnNhZmVIdG1sLCB3aGl0ZUxpc3QsIHNhbml0aXplRm4pIHtcbiAgICBpZiAodW5zYWZlSHRtbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bnNhZmVIdG1sXG4gICAgfVxuXG4gICAgaWYgKHNhbml0aXplRm4gJiYgdHlwZW9mIHNhbml0aXplRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBzYW5pdGl6ZUZuKHVuc2FmZUh0bWwpXG4gICAgfVxuXG4gICAgLy8gSUUgOCBhbmQgYmVsb3cgZG9uJ3Qgc3VwcG9ydCBjcmVhdGVIVE1MRG9jdW1lbnRcbiAgICBpZiAoIWRvY3VtZW50LmltcGxlbWVudGF0aW9uIHx8ICFkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybiB1bnNhZmVIdG1sXG4gICAgfVxuXG4gICAgdmFyIGNyZWF0ZWREb2N1bWVudCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCgnc2FuaXRpemF0aW9uJylcbiAgICBjcmVhdGVkRG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSB1bnNhZmVIdG1sXG5cbiAgICB2YXIgd2hpdGVsaXN0S2V5cyA9ICQubWFwKHdoaXRlTGlzdCwgZnVuY3Rpb24gKGVsLCBpKSB7IHJldHVybiBpIH0pXG4gICAgdmFyIGVsZW1lbnRzID0gJChjcmVhdGVkRG9jdW1lbnQuYm9keSkuZmluZCgnKicpXG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBlbCA9IGVsZW1lbnRzW2ldXG4gICAgICB2YXIgZWxOYW1lID0gZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKVxuXG4gICAgICBpZiAoJC5pbkFycmF5KGVsTmFtZSwgd2hpdGVsaXN0S2V5cykgPT09IC0xKSB7XG4gICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpXG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgdmFyIGF0dHJpYnV0ZUxpc3QgPSAkLm1hcChlbC5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoZWwpIHsgcmV0dXJuIGVsIH0pXG4gICAgICB2YXIgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzID0gW10uY29uY2F0KHdoaXRlTGlzdFsnKiddIHx8IFtdLCB3aGl0ZUxpc3RbZWxOYW1lXSB8fCBbXSlcblxuICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbjIgPSBhdHRyaWJ1dGVMaXN0Lmxlbmd0aDsgaiA8IGxlbjI7IGorKykge1xuICAgICAgICBpZiAoIWFsbG93ZWRBdHRyaWJ1dGUoYXR0cmlidXRlTGlzdFtqXSwgd2hpdGVsaXN0ZWRBdHRyaWJ1dGVzKSkge1xuICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVMaXN0W2pdLm5vZGVOYW1lKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZWREb2N1bWVudC5ib2R5LmlubmVySFRNTFxuICB9XG5cbiAgLy8gVE9PTFRJUCBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFRvb2x0aXAgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMudHlwZSAgICAgICA9IG51bGxcbiAgICB0aGlzLm9wdGlvbnMgICAgPSBudWxsXG4gICAgdGhpcy5lbmFibGVkICAgID0gbnVsbFxuICAgIHRoaXMudGltZW91dCAgICA9IG51bGxcbiAgICB0aGlzLmhvdmVyU3RhdGUgPSBudWxsXG4gICAgdGhpcy4kZWxlbWVudCAgID0gbnVsbFxuICAgIHRoaXMuaW5TdGF0ZSAgICA9IG51bGxcblxuICAgIHRoaXMuaW5pdCgndG9vbHRpcCcsIGVsZW1lbnQsIG9wdGlvbnMpXG4gIH1cblxuICBUb29sdGlwLlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTiA9IDE1MFxuXG4gIFRvb2x0aXAuREVGQVVMVFMgPSB7XG4gICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgIHBsYWNlbWVudDogJ3RvcCcsXG4gICAgc2VsZWN0b3I6IGZhbHNlLFxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInRvb2x0aXBcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJ0b29sdGlwLWFycm93XCI+PC9kaXY+PGRpdiBjbGFzcz1cInRvb2x0aXAtaW5uZXJcIj48L2Rpdj48L2Rpdj4nLFxuICAgIHRyaWdnZXI6ICdob3ZlciBmb2N1cycsXG4gICAgdGl0bGU6ICcnLFxuICAgIGRlbGF5OiAwLFxuICAgIGh0bWw6IGZhbHNlLFxuICAgIGNvbnRhaW5lcjogZmFsc2UsXG4gICAgdmlld3BvcnQ6IHtcbiAgICAgIHNlbGVjdG9yOiAnYm9keScsXG4gICAgICBwYWRkaW5nOiAwXG4gICAgfSxcbiAgICBzYW5pdGl6ZSA6IHRydWUsXG4gICAgc2FuaXRpemVGbiA6IG51bGwsXG4gICAgd2hpdGVMaXN0IDogRGVmYXVsdFdoaXRlbGlzdFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh0eXBlLCBlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5lbmFibGVkICAgPSB0cnVlXG4gICAgdGhpcy50eXBlICAgICAgPSB0eXBlXG4gICAgdGhpcy4kZWxlbWVudCAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgPSB0aGlzLmdldE9wdGlvbnMob3B0aW9ucylcbiAgICB0aGlzLiR2aWV3cG9ydCA9IHRoaXMub3B0aW9ucy52aWV3cG9ydCAmJiAkKGRvY3VtZW50KS5maW5kKCQuaXNGdW5jdGlvbih0aGlzLm9wdGlvbnMudmlld3BvcnQpID8gdGhpcy5vcHRpb25zLnZpZXdwb3J0LmNhbGwodGhpcywgdGhpcy4kZWxlbWVudCkgOiAodGhpcy5vcHRpb25zLnZpZXdwb3J0LnNlbGVjdG9yIHx8IHRoaXMub3B0aW9ucy52aWV3cG9ydCkpXG4gICAgdGhpcy5pblN0YXRlICAgPSB7IGNsaWNrOiBmYWxzZSwgaG92ZXI6IGZhbHNlLCBmb2N1czogZmFsc2UgfVxuXG4gICAgaWYgKHRoaXMuJGVsZW1lbnRbMF0gaW5zdGFuY2VvZiBkb2N1bWVudC5jb25zdHJ1Y3RvciAmJiAhdGhpcy5vcHRpb25zLnNlbGVjdG9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BzZWxlY3RvcmAgb3B0aW9uIG11c3QgYmUgc3BlY2lmaWVkIHdoZW4gaW5pdGlhbGl6aW5nICcgKyB0aGlzLnR5cGUgKyAnIG9uIHRoZSB3aW5kb3cuZG9jdW1lbnQgb2JqZWN0IScpXG4gICAgfVxuXG4gICAgdmFyIHRyaWdnZXJzID0gdGhpcy5vcHRpb25zLnRyaWdnZXIuc3BsaXQoJyAnKVxuXG4gICAgZm9yICh2YXIgaSA9IHRyaWdnZXJzLmxlbmd0aDsgaS0tOykge1xuICAgICAgdmFyIHRyaWdnZXIgPSB0cmlnZ2Vyc1tpXVxuXG4gICAgICBpZiAodHJpZ2dlciA9PSAnY2xpY2snKSB7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLnRvZ2dsZSwgdGhpcykpXG4gICAgICB9IGVsc2UgaWYgKHRyaWdnZXIgIT0gJ21hbnVhbCcpIHtcbiAgICAgICAgdmFyIGV2ZW50SW4gID0gdHJpZ2dlciA9PSAnaG92ZXInID8gJ21vdXNlZW50ZXInIDogJ2ZvY3VzaW4nXG4gICAgICAgIHZhciBldmVudE91dCA9IHRyaWdnZXIgPT0gJ2hvdmVyJyA/ICdtb3VzZWxlYXZlJyA6ICdmb2N1c291dCdcblxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKGV2ZW50SW4gICsgJy4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy5lbnRlciwgdGhpcykpXG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oZXZlbnRPdXQgKyAnLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLmxlYXZlLCB0aGlzKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMuc2VsZWN0b3IgP1xuICAgICAgKHRoaXMuX29wdGlvbnMgPSAkLmV4dGVuZCh7fSwgdGhpcy5vcHRpb25zLCB7IHRyaWdnZXI6ICdtYW51YWwnLCBzZWxlY3RvcjogJycgfSkpIDpcbiAgICAgIHRoaXMuZml4VGl0bGUoKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0RGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFRvb2x0aXAuREVGQVVMVFNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBkYXRhQXR0cmlidXRlcyA9IHRoaXMuJGVsZW1lbnQuZGF0YSgpXG5cbiAgICBmb3IgKHZhciBkYXRhQXR0ciBpbiBkYXRhQXR0cmlidXRlcykge1xuICAgICAgaWYgKGRhdGFBdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGRhdGFBdHRyKSAmJiAkLmluQXJyYXkoZGF0YUF0dHIsIERJU0FMTE9XRURfQVRUUklCVVRFUykgIT09IC0xKSB7XG4gICAgICAgIGRlbGV0ZSBkYXRhQXR0cmlidXRlc1tkYXRhQXR0cl1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgZGF0YUF0dHJpYnV0ZXMsIG9wdGlvbnMpXG5cbiAgICBpZiAob3B0aW9ucy5kZWxheSAmJiB0eXBlb2Ygb3B0aW9ucy5kZWxheSA9PSAnbnVtYmVyJykge1xuICAgICAgb3B0aW9ucy5kZWxheSA9IHtcbiAgICAgICAgc2hvdzogb3B0aW9ucy5kZWxheSxcbiAgICAgICAgaGlkZTogb3B0aW9ucy5kZWxheVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnNhbml0aXplKSB7XG4gICAgICBvcHRpb25zLnRlbXBsYXRlID0gc2FuaXRpemVIdG1sKG9wdGlvbnMudGVtcGxhdGUsIG9wdGlvbnMud2hpdGVMaXN0LCBvcHRpb25zLnNhbml0aXplRm4pXG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldERlbGVnYXRlT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyAgPSB7fVxuICAgIHZhciBkZWZhdWx0cyA9IHRoaXMuZ2V0RGVmYXVsdHMoKVxuXG4gICAgdGhpcy5fb3B0aW9ucyAmJiAkLmVhY2godGhpcy5fb3B0aW9ucywgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgIGlmIChkZWZhdWx0c1trZXldICE9IHZhbHVlKSBvcHRpb25zW2tleV0gPSB2YWx1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZW50ZXIgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHNlbGYgPSBvYmogaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yID9cbiAgICAgIG9iaiA6ICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBpZiAoIXNlbGYpIHtcbiAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihvYmouY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgfVxuXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mICQuRXZlbnQpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZVtvYmoudHlwZSA9PSAnZm9jdXNpbicgPyAnZm9jdXMnIDogJ2hvdmVyJ10gPSB0cnVlXG4gICAgfVxuXG4gICAgaWYgKHNlbGYudGlwKCkuaGFzQ2xhc3MoJ2luJykgfHwgc2VsZi5ob3ZlclN0YXRlID09ICdpbicpIHtcbiAgICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdpbidcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG5cbiAgICBzZWxmLmhvdmVyU3RhdGUgPSAnaW4nXG5cbiAgICBpZiAoIXNlbGYub3B0aW9ucy5kZWxheSB8fCAhc2VsZi5vcHRpb25zLmRlbGF5LnNob3cpIHJldHVybiBzZWxmLnNob3coKVxuXG4gICAgc2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5ob3ZlclN0YXRlID09ICdpbicpIHNlbGYuc2hvdygpXG4gICAgfSwgc2VsZi5vcHRpb25zLmRlbGF5LnNob3cpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5pc0luU3RhdGVUcnVlID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmluU3RhdGUpIHtcbiAgICAgIGlmICh0aGlzLmluU3RhdGVba2V5XSkgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmxlYXZlID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBzZWxmID0gb2JqIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3RvciA/XG4gICAgICBvYmogOiAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuXG4gICAgaWYgKCFzZWxmKSB7XG4gICAgICBzZWxmID0gbmV3IHRoaXMuY29uc3RydWN0b3Iob2JqLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAkKG9iai5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgIH1cblxuICAgIGlmIChvYmogaW5zdGFuY2VvZiAkLkV2ZW50KSB7XG4gICAgICBzZWxmLmluU3RhdGVbb2JqLnR5cGUgPT0gJ2ZvY3Vzb3V0JyA/ICdmb2N1cycgOiAnaG92ZXInXSA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHNlbGYuaXNJblN0YXRlVHJ1ZSgpKSByZXR1cm5cblxuICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG5cbiAgICBzZWxmLmhvdmVyU3RhdGUgPSAnb3V0J1xuXG4gICAgaWYgKCFzZWxmLm9wdGlvbnMuZGVsYXkgfHwgIXNlbGYub3B0aW9ucy5kZWxheS5oaWRlKSByZXR1cm4gc2VsZi5oaWRlKClcblxuICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNlbGYuaG92ZXJTdGF0ZSA9PSAnb3V0Jykgc2VsZi5oaWRlKClcbiAgICB9LCBzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSlcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93LmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBpZiAodGhpcy5oYXNDb250ZW50KCkgJiYgdGhpcy5lbmFibGVkKSB7XG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgICAgdmFyIGluRG9tID0gJC5jb250YWlucyh0aGlzLiRlbGVtZW50WzBdLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB0aGlzLiRlbGVtZW50WzBdKVxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkgfHwgIWluRG9tKSByZXR1cm5cbiAgICAgIHZhciB0aGF0ID0gdGhpc1xuXG4gICAgICB2YXIgJHRpcCA9IHRoaXMudGlwKClcblxuICAgICAgdmFyIHRpcElkID0gdGhpcy5nZXRVSUQodGhpcy50eXBlKVxuXG4gICAgICB0aGlzLnNldENvbnRlbnQoKVxuICAgICAgJHRpcC5hdHRyKCdpZCcsIHRpcElkKVxuICAgICAgdGhpcy4kZWxlbWVudC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgdGlwSWQpXG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uKSAkdGlwLmFkZENsYXNzKCdmYWRlJylcblxuICAgICAgdmFyIHBsYWNlbWVudCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMucGxhY2VtZW50ID09ICdmdW5jdGlvbicgP1xuICAgICAgICB0aGlzLm9wdGlvbnMucGxhY2VtZW50LmNhbGwodGhpcywgJHRpcFswXSwgdGhpcy4kZWxlbWVudFswXSkgOlxuICAgICAgICB0aGlzLm9wdGlvbnMucGxhY2VtZW50XG5cbiAgICAgIHZhciBhdXRvVG9rZW4gPSAvXFxzP2F1dG8/XFxzPy9pXG4gICAgICB2YXIgYXV0b1BsYWNlID0gYXV0b1Rva2VuLnRlc3QocGxhY2VtZW50KVxuICAgICAgaWYgKGF1dG9QbGFjZSkgcGxhY2VtZW50ID0gcGxhY2VtZW50LnJlcGxhY2UoYXV0b1Rva2VuLCAnJykgfHwgJ3RvcCdcblxuICAgICAgJHRpcFxuICAgICAgICAuZGV0YWNoKClcbiAgICAgICAgLmNzcyh7IHRvcDogMCwgbGVmdDogMCwgZGlzcGxheTogJ2Jsb2NrJyB9KVxuICAgICAgICAuYWRkQ2xhc3MocGxhY2VtZW50KVxuICAgICAgICAuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgdGhpcylcblxuICAgICAgdGhpcy5vcHRpb25zLmNvbnRhaW5lciA/ICR0aXAuYXBwZW5kVG8oJChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMuY29udGFpbmVyKSkgOiAkdGlwLmluc2VydEFmdGVyKHRoaXMuJGVsZW1lbnQpXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2luc2VydGVkLmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICAgIHZhciBwb3MgICAgICAgICAgPSB0aGlzLmdldFBvc2l0aW9uKClcbiAgICAgIHZhciBhY3R1YWxXaWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgICB2YXIgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgICAgaWYgKGF1dG9QbGFjZSkge1xuICAgICAgICB2YXIgb3JnUGxhY2VtZW50ID0gcGxhY2VtZW50XG4gICAgICAgIHZhciB2aWV3cG9ydERpbSA9IHRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpXG5cbiAgICAgICAgcGxhY2VtZW50ID0gcGxhY2VtZW50ID09ICdib3R0b20nICYmIHBvcy5ib3R0b20gKyBhY3R1YWxIZWlnaHQgPiB2aWV3cG9ydERpbS5ib3R0b20gPyAndG9wJyAgICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAndG9wJyAgICAmJiBwb3MudG9wICAgIC0gYWN0dWFsSGVpZ2h0IDwgdmlld3BvcnREaW0udG9wICAgID8gJ2JvdHRvbScgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3JpZ2h0JyAgJiYgcG9zLnJpZ2h0ICArIGFjdHVhbFdpZHRoICA+IHZpZXdwb3J0RGltLndpZHRoICA/ICdsZWZ0JyAgIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdsZWZ0JyAgICYmIHBvcy5sZWZ0ICAgLSBhY3R1YWxXaWR0aCAgPCB2aWV3cG9ydERpbS5sZWZ0ICAgPyAncmlnaHQnICA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFxuXG4gICAgICAgICR0aXBcbiAgICAgICAgICAucmVtb3ZlQ2xhc3Mob3JnUGxhY2VtZW50KVxuICAgICAgICAgIC5hZGRDbGFzcyhwbGFjZW1lbnQpXG4gICAgICB9XG5cbiAgICAgIHZhciBjYWxjdWxhdGVkT2Zmc2V0ID0gdGhpcy5nZXRDYWxjdWxhdGVkT2Zmc2V0KHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KVxuXG4gICAgICB0aGlzLmFwcGx5UGxhY2VtZW50KGNhbGN1bGF0ZWRPZmZzZXQsIHBsYWNlbWVudClcblxuICAgICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJldkhvdmVyU3RhdGUgPSB0aGF0LmhvdmVyU3RhdGVcbiAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdzaG93bi5icy4nICsgdGhhdC50eXBlKVxuICAgICAgICB0aGF0LmhvdmVyU3RhdGUgPSBudWxsXG5cbiAgICAgICAgaWYgKHByZXZIb3ZlclN0YXRlID09ICdvdXQnKSB0aGF0LmxlYXZlKHRoYXQpXG4gICAgICB9XG5cbiAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJHRpcC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICAgJHRpcFxuICAgICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGNvbXBsZXRlKVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY29tcGxldGUoKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmFwcGx5UGxhY2VtZW50ID0gZnVuY3Rpb24gKG9mZnNldCwgcGxhY2VtZW50KSB7XG4gICAgdmFyICR0aXAgICA9IHRoaXMudGlwKClcbiAgICB2YXIgd2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgIHZhciBoZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuXG4gICAgLy8gbWFudWFsbHkgcmVhZCBtYXJnaW5zIGJlY2F1c2UgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGluY2x1ZGVzIGRpZmZlcmVuY2VcbiAgICB2YXIgbWFyZ2luVG9wID0gcGFyc2VJbnQoJHRpcC5jc3MoJ21hcmdpbi10b3AnKSwgMTApXG4gICAgdmFyIG1hcmdpbkxlZnQgPSBwYXJzZUludCgkdGlwLmNzcygnbWFyZ2luLWxlZnQnKSwgMTApXG5cbiAgICAvLyB3ZSBtdXN0IGNoZWNrIGZvciBOYU4gZm9yIGllIDgvOVxuICAgIGlmIChpc05hTihtYXJnaW5Ub3ApKSAgbWFyZ2luVG9wICA9IDBcbiAgICBpZiAoaXNOYU4obWFyZ2luTGVmdCkpIG1hcmdpbkxlZnQgPSAwXG5cbiAgICBvZmZzZXQudG9wICArPSBtYXJnaW5Ub3BcbiAgICBvZmZzZXQubGVmdCArPSBtYXJnaW5MZWZ0XG5cbiAgICAvLyAkLmZuLm9mZnNldCBkb2Vzbid0IHJvdW5kIHBpeGVsIHZhbHVlc1xuICAgIC8vIHNvIHdlIHVzZSBzZXRPZmZzZXQgZGlyZWN0bHkgd2l0aCBvdXIgb3duIGZ1bmN0aW9uIEItMFxuICAgICQub2Zmc2V0LnNldE9mZnNldCgkdGlwWzBdLCAkLmV4dGVuZCh7XG4gICAgICB1c2luZzogZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgICAgICR0aXAuY3NzKHtcbiAgICAgICAgICB0b3A6IE1hdGgucm91bmQocHJvcHMudG9wKSxcbiAgICAgICAgICBsZWZ0OiBNYXRoLnJvdW5kKHByb3BzLmxlZnQpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSwgb2Zmc2V0KSwgMClcblxuICAgICR0aXAuYWRkQ2xhc3MoJ2luJylcblxuICAgIC8vIGNoZWNrIHRvIHNlZSBpZiBwbGFjaW5nIHRpcCBpbiBuZXcgb2Zmc2V0IGNhdXNlZCB0aGUgdGlwIHRvIHJlc2l6ZSBpdHNlbGZcbiAgICB2YXIgYWN0dWFsV2lkdGggID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgIHZhciBhY3R1YWxIZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuXG4gICAgaWYgKHBsYWNlbWVudCA9PSAndG9wJyAmJiBhY3R1YWxIZWlnaHQgIT0gaGVpZ2h0KSB7XG4gICAgICBvZmZzZXQudG9wID0gb2Zmc2V0LnRvcCArIGhlaWdodCAtIGFjdHVhbEhlaWdodFxuICAgIH1cblxuICAgIHZhciBkZWx0YSA9IHRoaXMuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhKHBsYWNlbWVudCwgb2Zmc2V0LCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KVxuXG4gICAgaWYgKGRlbHRhLmxlZnQpIG9mZnNldC5sZWZ0ICs9IGRlbHRhLmxlZnRcbiAgICBlbHNlIG9mZnNldC50b3AgKz0gZGVsdGEudG9wXG5cbiAgICB2YXIgaXNWZXJ0aWNhbCAgICAgICAgICA9IC90b3B8Ym90dG9tLy50ZXN0KHBsYWNlbWVudClcbiAgICB2YXIgYXJyb3dEZWx0YSAgICAgICAgICA9IGlzVmVydGljYWwgPyBkZWx0YS5sZWZ0ICogMiAtIHdpZHRoICsgYWN0dWFsV2lkdGggOiBkZWx0YS50b3AgKiAyIC0gaGVpZ2h0ICsgYWN0dWFsSGVpZ2h0XG4gICAgdmFyIGFycm93T2Zmc2V0UG9zaXRpb24gPSBpc1ZlcnRpY2FsID8gJ29mZnNldFdpZHRoJyA6ICdvZmZzZXRIZWlnaHQnXG5cbiAgICAkdGlwLm9mZnNldChvZmZzZXQpXG4gICAgdGhpcy5yZXBsYWNlQXJyb3coYXJyb3dEZWx0YSwgJHRpcFswXVthcnJvd09mZnNldFBvc2l0aW9uXSwgaXNWZXJ0aWNhbClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnJlcGxhY2VBcnJvdyA9IGZ1bmN0aW9uIChkZWx0YSwgZGltZW5zaW9uLCBpc1ZlcnRpY2FsKSB7XG4gICAgdGhpcy5hcnJvdygpXG4gICAgICAuY3NzKGlzVmVydGljYWwgPyAnbGVmdCcgOiAndG9wJywgNTAgKiAoMSAtIGRlbHRhIC8gZGltZW5zaW9uKSArICclJylcbiAgICAgIC5jc3MoaXNWZXJ0aWNhbCA/ICd0b3AnIDogJ2xlZnQnLCAnJylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnNldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aXAgID0gdGhpcy50aXAoKVxuICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0VGl0bGUoKVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5odG1sKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNhbml0aXplKSB7XG4gICAgICAgIHRpdGxlID0gc2FuaXRpemVIdG1sKHRpdGxlLCB0aGlzLm9wdGlvbnMud2hpdGVMaXN0LCB0aGlzLm9wdGlvbnMuc2FuaXRpemVGbilcbiAgICAgIH1cblxuICAgICAgJHRpcC5maW5kKCcudG9vbHRpcC1pbm5lcicpLmh0bWwodGl0bGUpXG4gICAgfSBlbHNlIHtcbiAgICAgICR0aXAuZmluZCgnLnRvb2x0aXAtaW5uZXInKS50ZXh0KHRpdGxlKVxuICAgIH1cblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2ZhZGUgaW4gdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0JylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICB2YXIgJHRpcCA9ICQodGhpcy4kdGlwKVxuICAgIHZhciBlICAgID0gJC5FdmVudCgnaGlkZS5icy4nICsgdGhpcy50eXBlKVxuXG4gICAgZnVuY3Rpb24gY29tcGxldGUoKSB7XG4gICAgICBpZiAodGhhdC5ob3ZlclN0YXRlICE9ICdpbicpICR0aXAuZGV0YWNoKClcbiAgICAgIGlmICh0aGF0LiRlbGVtZW50KSB7IC8vIFRPRE86IENoZWNrIHdoZXRoZXIgZ3VhcmRpbmcgdGhpcyBjb2RlIHdpdGggdGhpcyBgaWZgIGlzIHJlYWxseSBuZWNlc3NhcnkuXG4gICAgICAgIHRoYXQuJGVsZW1lbnRcbiAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1kZXNjcmliZWRieScpXG4gICAgICAgICAgLnRyaWdnZXIoJ2hpZGRlbi5icy4nICsgdGhhdC50eXBlKVxuICAgICAgfVxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgIH1cblxuICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgJHRpcC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICR0aXBcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY29tcGxldGUpXG4gICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChUb29sdGlwLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIGNvbXBsZXRlKClcblxuICAgIHRoaXMuaG92ZXJTdGF0ZSA9IG51bGxcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5maXhUaXRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50XG4gICAgaWYgKCRlLmF0dHIoJ3RpdGxlJykgfHwgdHlwZW9mICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKSAhPSAnc3RyaW5nJykge1xuICAgICAgJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScsICRlLmF0dHIoJ3RpdGxlJykgfHwgJycpLmF0dHIoJ3RpdGxlJywgJycpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaGFzQ29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRUaXRsZSgpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRQb3NpdGlvbiA9IGZ1bmN0aW9uICgkZWxlbWVudCkge1xuICAgICRlbGVtZW50ICAgPSAkZWxlbWVudCB8fCB0aGlzLiRlbGVtZW50XG5cbiAgICB2YXIgZWwgICAgID0gJGVsZW1lbnRbMF1cbiAgICB2YXIgaXNCb2R5ID0gZWwudGFnTmFtZSA9PSAnQk9EWSdcblxuICAgIHZhciBlbFJlY3QgICAgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGlmIChlbFJlY3Qud2lkdGggPT0gbnVsbCkge1xuICAgICAgLy8gd2lkdGggYW5kIGhlaWdodCBhcmUgbWlzc2luZyBpbiBJRTgsIHNvIGNvbXB1dGUgdGhlbSBtYW51YWxseTsgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9pc3N1ZXMvMTQwOTNcbiAgICAgIGVsUmVjdCA9ICQuZXh0ZW5kKHt9LCBlbFJlY3QsIHsgd2lkdGg6IGVsUmVjdC5yaWdodCAtIGVsUmVjdC5sZWZ0LCBoZWlnaHQ6IGVsUmVjdC5ib3R0b20gLSBlbFJlY3QudG9wIH0pXG4gICAgfVxuICAgIHZhciBpc1N2ZyA9IHdpbmRvdy5TVkdFbGVtZW50ICYmIGVsIGluc3RhbmNlb2Ygd2luZG93LlNWR0VsZW1lbnRcbiAgICAvLyBBdm9pZCB1c2luZyAkLm9mZnNldCgpIG9uIFNWR3Mgc2luY2UgaXQgZ2l2ZXMgaW5jb3JyZWN0IHJlc3VsdHMgaW4galF1ZXJ5IDMuXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9pc3N1ZXMvMjAyODBcbiAgICB2YXIgZWxPZmZzZXQgID0gaXNCb2R5ID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6IChpc1N2ZyA/IG51bGwgOiAkZWxlbWVudC5vZmZzZXQoKSlcbiAgICB2YXIgc2Nyb2xsICAgID0geyBzY3JvbGw6IGlzQm9keSA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgOiAkZWxlbWVudC5zY3JvbGxUb3AoKSB9XG4gICAgdmFyIG91dGVyRGltcyA9IGlzQm9keSA/IHsgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLCBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSB9IDogbnVsbFxuXG4gICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBlbFJlY3QsIHNjcm9sbCwgb3V0ZXJEaW1zLCBlbE9mZnNldClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldENhbGN1bGF0ZWRPZmZzZXQgPSBmdW5jdGlvbiAocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpIHtcbiAgICByZXR1cm4gcGxhY2VtZW50ID09ICdib3R0b20nID8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0LCAgIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIC8gMiAtIGFjdHVhbFdpZHRoIC8gMiB9IDpcbiAgICAgICAgICAgcGxhY2VtZW50ID09ICd0b3AnICAgID8geyB0b3A6IHBvcy50b3AgLSBhY3R1YWxIZWlnaHQsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIC8gMiAtIGFjdHVhbFdpZHRoIC8gMiB9IDpcbiAgICAgICAgICAgcGxhY2VtZW50ID09ICdsZWZ0JyAgID8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0IC0gYWN0dWFsV2lkdGggfSA6XG4gICAgICAgIC8qIHBsYWNlbWVudCA9PSAncmlnaHQnICovIHsgdG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCAvIDIgLSBhY3R1YWxIZWlnaHQgLyAyLCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCB9XG5cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YSA9IGZ1bmN0aW9uIChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodCkge1xuICAgIHZhciBkZWx0YSA9IHsgdG9wOiAwLCBsZWZ0OiAwIH1cbiAgICBpZiAoIXRoaXMuJHZpZXdwb3J0KSByZXR1cm4gZGVsdGFcblxuICAgIHZhciB2aWV3cG9ydFBhZGRpbmcgPSB0aGlzLm9wdGlvbnMudmlld3BvcnQgJiYgdGhpcy5vcHRpb25zLnZpZXdwb3J0LnBhZGRpbmcgfHwgMFxuICAgIHZhciB2aWV3cG9ydERpbWVuc2lvbnMgPSB0aGlzLmdldFBvc2l0aW9uKHRoaXMuJHZpZXdwb3J0KVxuXG4gICAgaWYgKC9yaWdodHxsZWZ0Ly50ZXN0KHBsYWNlbWVudCkpIHtcbiAgICAgIHZhciB0b3BFZGdlT2Zmc2V0ICAgID0gcG9zLnRvcCAtIHZpZXdwb3J0UGFkZGluZyAtIHZpZXdwb3J0RGltZW5zaW9ucy5zY3JvbGxcbiAgICAgIHZhciBib3R0b21FZGdlT2Zmc2V0ID0gcG9zLnRvcCArIHZpZXdwb3J0UGFkZGluZyAtIHZpZXdwb3J0RGltZW5zaW9ucy5zY3JvbGwgKyBhY3R1YWxIZWlnaHRcbiAgICAgIGlmICh0b3BFZGdlT2Zmc2V0IDwgdmlld3BvcnREaW1lbnNpb25zLnRvcCkgeyAvLyB0b3Agb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEudG9wID0gdmlld3BvcnREaW1lbnNpb25zLnRvcCAtIHRvcEVkZ2VPZmZzZXRcbiAgICAgIH0gZWxzZSBpZiAoYm90dG9tRWRnZU9mZnNldCA+IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgKyB2aWV3cG9ydERpbWVuc2lvbnMuaGVpZ2h0KSB7IC8vIGJvdHRvbSBvdmVyZmxvd1xuICAgICAgICBkZWx0YS50b3AgPSB2aWV3cG9ydERpbWVuc2lvbnMudG9wICsgdmlld3BvcnREaW1lbnNpb25zLmhlaWdodCAtIGJvdHRvbUVkZ2VPZmZzZXRcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGxlZnRFZGdlT2Zmc2V0ICA9IHBvcy5sZWZ0IC0gdmlld3BvcnRQYWRkaW5nXG4gICAgICB2YXIgcmlnaHRFZGdlT2Zmc2V0ID0gcG9zLmxlZnQgKyB2aWV3cG9ydFBhZGRpbmcgKyBhY3R1YWxXaWR0aFxuICAgICAgaWYgKGxlZnRFZGdlT2Zmc2V0IDwgdmlld3BvcnREaW1lbnNpb25zLmxlZnQpIHsgLy8gbGVmdCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS5sZWZ0ID0gdmlld3BvcnREaW1lbnNpb25zLmxlZnQgLSBsZWZ0RWRnZU9mZnNldFxuICAgICAgfSBlbHNlIGlmIChyaWdodEVkZ2VPZmZzZXQgPiB2aWV3cG9ydERpbWVuc2lvbnMucmlnaHQpIHsgLy8gcmlnaHQgb3ZlcmZsb3dcbiAgICAgICAgZGVsdGEubGVmdCA9IHZpZXdwb3J0RGltZW5zaW9ucy5sZWZ0ICsgdmlld3BvcnREaW1lbnNpb25zLndpZHRoIC0gcmlnaHRFZGdlT2Zmc2V0XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlbHRhXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXRUaXRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGl0bGVcbiAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIG8gID0gdGhpcy5vcHRpb25zXG5cbiAgICB0aXRsZSA9ICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKVxuICAgICAgfHwgKHR5cGVvZiBvLnRpdGxlID09ICdmdW5jdGlvbicgPyBvLnRpdGxlLmNhbGwoJGVbMF0pIDogIG8udGl0bGUpXG5cbiAgICByZXR1cm4gdGl0bGVcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFVJRCA9IGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICBkbyBwcmVmaXggKz0gfn4oTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApXG4gICAgd2hpbGUgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByZWZpeCkpXG4gICAgcmV0dXJuIHByZWZpeFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudGlwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy4kdGlwKSB7XG4gICAgICB0aGlzLiR0aXAgPSAkKHRoaXMub3B0aW9ucy50ZW1wbGF0ZSlcbiAgICAgIGlmICh0aGlzLiR0aXAubGVuZ3RoICE9IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMudHlwZSArICcgYHRlbXBsYXRlYCBvcHRpb24gbXVzdCBjb25zaXN0IG9mIGV4YWN0bHkgMSB0b3AtbGV2ZWwgZWxlbWVudCEnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy4kdGlwXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5hcnJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKHRoaXMuJGFycm93ID0gdGhpcy4kYXJyb3cgfHwgdGhpcy50aXAoKS5maW5kKCcudG9vbHRpcC1hcnJvdycpKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IHRydWVcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gZmFsc2VcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLnRvZ2dsZUVuYWJsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gIXRoaXMuZW5hYmxlZFxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICBpZiAoZSkge1xuICAgICAgc2VsZiA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlKVxuICAgICAgaWYgKCFzZWxmKSB7XG4gICAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihlLmN1cnJlbnRUYXJnZXQsIHRoaXMuZ2V0RGVsZWdhdGVPcHRpb25zKCkpXG4gICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdicy4nICsgdGhpcy50eXBlLCBzZWxmKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlKSB7XG4gICAgICBzZWxmLmluU3RhdGUuY2xpY2sgPSAhc2VsZi5pblN0YXRlLmNsaWNrXG4gICAgICBpZiAoc2VsZi5pc0luU3RhdGVUcnVlKCkpIHNlbGYuZW50ZXIoc2VsZilcbiAgICAgIGVsc2Ugc2VsZi5sZWF2ZShzZWxmKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnRpcCgpLmhhc0NsYXNzKCdpbicpID8gc2VsZi5sZWF2ZShzZWxmKSA6IHNlbGYuZW50ZXIoc2VsZilcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gICAgdGhpcy5oaWRlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoYXQuJGVsZW1lbnQub2ZmKCcuJyArIHRoYXQudHlwZSkucmVtb3ZlRGF0YSgnYnMuJyArIHRoYXQudHlwZSlcbiAgICAgIGlmICh0aGF0LiR0aXApIHtcbiAgICAgICAgdGhhdC4kdGlwLmRldGFjaCgpXG4gICAgICB9XG4gICAgICB0aGF0LiR0aXAgPSBudWxsXG4gICAgICB0aGF0LiRhcnJvdyA9IG51bGxcbiAgICAgIHRoYXQuJHZpZXdwb3J0ID0gbnVsbFxuICAgICAgdGhhdC4kZWxlbWVudCA9IG51bGxcbiAgICB9KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuc2FuaXRpemVIdG1sID0gZnVuY3Rpb24gKHVuc2FmZUh0bWwpIHtcbiAgICByZXR1cm4gc2FuaXRpemVIdG1sKHVuc2FmZUh0bWwsIHRoaXMub3B0aW9ucy53aGl0ZUxpc3QsIHRoaXMub3B0aW9ucy5zYW5pdGl6ZUZuKVxuICB9XG5cbiAgLy8gVE9PTFRJUCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnRvb2x0aXAnKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEgJiYgL2Rlc3Ryb3l8aGlkZS8udGVzdChvcHRpb24pKSByZXR1cm5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMudG9vbHRpcCcsIChkYXRhID0gbmV3IFRvb2x0aXAodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnRvb2x0aXBcblxuICAkLmZuLnRvb2x0aXAgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yID0gVG9vbHRpcFxuXG5cbiAgLy8gVE9PTFRJUCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi50b29sdGlwLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi50b29sdGlwID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBwb3BvdmVyLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3BvcG92ZXJzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gUE9QT1ZFUiBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIFBvcG92ZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuaW5pdCgncG9wb3ZlcicsIGVsZW1lbnQsIG9wdGlvbnMpXG4gIH1cblxuICBpZiAoISQuZm4udG9vbHRpcCkgdGhyb3cgbmV3IEVycm9yKCdQb3BvdmVyIHJlcXVpcmVzIHRvb2x0aXAuanMnKVxuXG4gIFBvcG92ZXIuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgUG9wb3Zlci5ERUZBVUxUUyA9ICQuZXh0ZW5kKHt9LCAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IuREVGQVVMVFMsIHtcbiAgICBwbGFjZW1lbnQ6ICdyaWdodCcsXG4gICAgdHJpZ2dlcjogJ2NsaWNrJyxcbiAgICBjb250ZW50OiAnJyxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJwb3BvdmVyXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj48aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz48ZGl2IGNsYXNzPVwicG9wb3Zlci1jb250ZW50XCI+PC9kaXY+PC9kaXY+J1xuICB9KVxuXG5cbiAgLy8gTk9URTogUE9QT1ZFUiBFWFRFTkRTIHRvb2x0aXAuanNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBQb3BvdmVyLnByb3RvdHlwZSA9ICQuZXh0ZW5kKHt9LCAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IucHJvdG90eXBlKVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUG9wb3ZlclxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmdldERlZmF1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQb3BvdmVyLkRFRkFVTFRTXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5zZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGlwICAgID0gdGhpcy50aXAoKVxuICAgIHZhciB0aXRsZSAgID0gdGhpcy5nZXRUaXRsZSgpXG4gICAgdmFyIGNvbnRlbnQgPSB0aGlzLmdldENvbnRlbnQoKVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5odG1sKSB7XG4gICAgICB2YXIgdHlwZUNvbnRlbnQgPSB0eXBlb2YgY29udGVudFxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNhbml0aXplKSB7XG4gICAgICAgIHRpdGxlID0gdGhpcy5zYW5pdGl6ZUh0bWwodGl0bGUpXG5cbiAgICAgICAgaWYgKHR5cGVDb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnRlbnQgPSB0aGlzLnNhbml0aXplSHRtbChjb250ZW50KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS5odG1sKHRpdGxlKVxuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci1jb250ZW50JykuY2hpbGRyZW4oKS5kZXRhY2goKS5lbmQoKVtcbiAgICAgICAgdHlwZUNvbnRlbnQgPT09ICdzdHJpbmcnID8gJ2h0bWwnIDogJ2FwcGVuZCdcbiAgICAgIF0oY29udGVudClcbiAgICB9IGVsc2Uge1xuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLnRleHQodGl0bGUpXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLWNvbnRlbnQnKS5jaGlsZHJlbigpLmRldGFjaCgpLmVuZCgpLnRleHQoY29udGVudClcbiAgICB9XG5cbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdmYWRlIHRvcCBib3R0b20gbGVmdCByaWdodCBpbicpXG5cbiAgICAvLyBJRTggZG9lc24ndCBhY2NlcHQgaGlkaW5nIHZpYSB0aGUgYDplbXB0eWAgcHNldWRvIHNlbGVjdG9yLCB3ZSBoYXZlIHRvIGRvXG4gICAgLy8gdGhpcyBtYW51YWxseSBieSBjaGVja2luZyB0aGUgY29udGVudHMuXG4gICAgaWYgKCEkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaHRtbCgpKSAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykuaGlkZSgpXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5oYXNDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRpdGxlKCkgfHwgdGhpcy5nZXRDb250ZW50KClcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmdldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRlID0gdGhpcy4kZWxlbWVudFxuICAgIHZhciBvICA9IHRoaXMub3B0aW9uc1xuXG4gICAgcmV0dXJuICRlLmF0dHIoJ2RhdGEtY29udGVudCcpXG4gICAgICB8fCAodHlwZW9mIG8uY29udGVudCA9PSAnZnVuY3Rpb24nID9cbiAgICAgICAgby5jb250ZW50LmNhbGwoJGVbMF0pIDpcbiAgICAgICAgby5jb250ZW50KVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuYXJyb3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICh0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZCgnLmFycm93JykpXG4gIH1cblxuXG4gIC8vIFBPUE9WRVIgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5wb3BvdmVyJylcbiAgICAgIHZhciBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cblxuICAgICAgaWYgKCFkYXRhICYmIC9kZXN0cm95fGhpZGUvLnRlc3Qob3B0aW9uKSkgcmV0dXJuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnBvcG92ZXInLCAoZGF0YSA9IG5ldyBQb3BvdmVyKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5wb3BvdmVyXG5cbiAgJC5mbi5wb3BvdmVyICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4ucG9wb3Zlci5Db25zdHJ1Y3RvciA9IFBvcG92ZXJcblxuXG4gIC8vIFBPUE9WRVIgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4ucG9wb3Zlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4ucG9wb3ZlciA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogc2Nyb2xsc3B5LmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3Njcm9sbHNweVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIFNDUk9MTFNQWSBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gU2Nyb2xsU3B5KGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRib2R5ICAgICAgICAgID0gJChkb2N1bWVudC5ib2R5KVxuICAgIHRoaXMuJHNjcm9sbEVsZW1lbnQgPSAkKGVsZW1lbnQpLmlzKGRvY3VtZW50LmJvZHkpID8gJCh3aW5kb3cpIDogJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgICAgICAgPSAkLmV4dGVuZCh7fSwgU2Nyb2xsU3B5LkRFRkFVTFRTLCBvcHRpb25zKVxuICAgIHRoaXMuc2VsZWN0b3IgICAgICAgPSAodGhpcy5vcHRpb25zLnRhcmdldCB8fCAnJykgKyAnIC5uYXYgbGkgPiBhJ1xuICAgIHRoaXMub2Zmc2V0cyAgICAgICAgPSBbXVxuICAgIHRoaXMudGFyZ2V0cyAgICAgICAgPSBbXVxuICAgIHRoaXMuYWN0aXZlVGFyZ2V0ICAgPSBudWxsXG4gICAgdGhpcy5zY3JvbGxIZWlnaHQgICA9IDBcblxuICAgIHRoaXMuJHNjcm9sbEVsZW1lbnQub24oJ3Njcm9sbC5icy5zY3JvbGxzcHknLCAkLnByb3h5KHRoaXMucHJvY2VzcywgdGhpcykpXG4gICAgdGhpcy5yZWZyZXNoKClcbiAgICB0aGlzLnByb2Nlc3MoKVxuICB9XG5cbiAgU2Nyb2xsU3B5LlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIFNjcm9sbFNweS5ERUZBVUxUUyA9IHtcbiAgICBvZmZzZXQ6IDEwXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmdldFNjcm9sbEhlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy4kc2Nyb2xsRWxlbWVudFswXS5zY3JvbGxIZWlnaHQgfHwgTWF0aC5tYXgodGhpcy4kYm9keVswXS5zY3JvbGxIZWlnaHQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQpXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgICAgICAgICAgPSB0aGlzXG4gICAgdmFyIG9mZnNldE1ldGhvZCAgPSAnb2Zmc2V0J1xuICAgIHZhciBvZmZzZXRCYXNlICAgID0gMFxuXG4gICAgdGhpcy5vZmZzZXRzICAgICAgPSBbXVxuICAgIHRoaXMudGFyZ2V0cyAgICAgID0gW11cbiAgICB0aGlzLnNjcm9sbEhlaWdodCA9IHRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KClcblxuICAgIGlmICghJC5pc1dpbmRvdyh0aGlzLiRzY3JvbGxFbGVtZW50WzBdKSkge1xuICAgICAgb2Zmc2V0TWV0aG9kID0gJ3Bvc2l0aW9uJ1xuICAgICAgb2Zmc2V0QmFzZSAgID0gdGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKVxuICAgIH1cblxuICAgIHRoaXMuJGJvZHlcbiAgICAgIC5maW5kKHRoaXMuc2VsZWN0b3IpXG4gICAgICAubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRlbCAgID0gJCh0aGlzKVxuICAgICAgICB2YXIgaHJlZiAgPSAkZWwuZGF0YSgndGFyZ2V0JykgfHwgJGVsLmF0dHIoJ2hyZWYnKVxuICAgICAgICB2YXIgJGhyZWYgPSAvXiMuLy50ZXN0KGhyZWYpICYmICQoaHJlZilcblxuICAgICAgICByZXR1cm4gKCRocmVmXG4gICAgICAgICAgJiYgJGhyZWYubGVuZ3RoXG4gICAgICAgICAgJiYgJGhyZWYuaXMoJzp2aXNpYmxlJylcbiAgICAgICAgICAmJiBbWyRocmVmW29mZnNldE1ldGhvZF0oKS50b3AgKyBvZmZzZXRCYXNlLCBocmVmXV0pIHx8IG51bGxcbiAgICAgIH0pXG4gICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYVswXSAtIGJbMF0gfSlcbiAgICAgIC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5vZmZzZXRzLnB1c2godGhpc1swXSlcbiAgICAgICAgdGhhdC50YXJnZXRzLnB1c2godGhpc1sxXSlcbiAgICAgIH0pXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjcm9sbFRvcCAgICA9IHRoaXMuJHNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wKCkgKyB0aGlzLm9wdGlvbnMub2Zmc2V0XG4gICAgdmFyIHNjcm9sbEhlaWdodCA9IHRoaXMuZ2V0U2Nyb2xsSGVpZ2h0KClcbiAgICB2YXIgbWF4U2Nyb2xsICAgID0gdGhpcy5vcHRpb25zLm9mZnNldCArIHNjcm9sbEhlaWdodCAtIHRoaXMuJHNjcm9sbEVsZW1lbnQuaGVpZ2h0KClcbiAgICB2YXIgb2Zmc2V0cyAgICAgID0gdGhpcy5vZmZzZXRzXG4gICAgdmFyIHRhcmdldHMgICAgICA9IHRoaXMudGFyZ2V0c1xuICAgIHZhciBhY3RpdmVUYXJnZXQgPSB0aGlzLmFjdGl2ZVRhcmdldFxuICAgIHZhciBpXG5cbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgIT0gc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH1cblxuICAgIGlmIChzY3JvbGxUb3AgPj0gbWF4U2Nyb2xsKSB7XG4gICAgICByZXR1cm4gYWN0aXZlVGFyZ2V0ICE9IChpID0gdGFyZ2V0c1t0YXJnZXRzLmxlbmd0aCAtIDFdKSAmJiB0aGlzLmFjdGl2YXRlKGkpXG4gICAgfVxuXG4gICAgaWYgKGFjdGl2ZVRhcmdldCAmJiBzY3JvbGxUb3AgPCBvZmZzZXRzWzBdKSB7XG4gICAgICB0aGlzLmFjdGl2ZVRhcmdldCA9IG51bGxcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyKClcbiAgICB9XG5cbiAgICBmb3IgKGkgPSBvZmZzZXRzLmxlbmd0aDsgaS0tOykge1xuICAgICAgYWN0aXZlVGFyZ2V0ICE9IHRhcmdldHNbaV1cbiAgICAgICAgJiYgc2Nyb2xsVG9wID49IG9mZnNldHNbaV1cbiAgICAgICAgJiYgKG9mZnNldHNbaSArIDFdID09PSB1bmRlZmluZWQgfHwgc2Nyb2xsVG9wIDwgb2Zmc2V0c1tpICsgMV0pXG4gICAgICAgICYmIHRoaXMuYWN0aXZhdGUodGFyZ2V0c1tpXSlcbiAgICB9XG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHRoaXMuYWN0aXZlVGFyZ2V0ID0gdGFyZ2V0XG5cbiAgICB0aGlzLmNsZWFyKClcblxuICAgIHZhciBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3IgK1xuICAgICAgJ1tkYXRhLXRhcmdldD1cIicgKyB0YXJnZXQgKyAnXCJdLCcgK1xuICAgICAgdGhpcy5zZWxlY3RvciArICdbaHJlZj1cIicgKyB0YXJnZXQgKyAnXCJdJ1xuXG4gICAgdmFyIGFjdGl2ZSA9ICQoc2VsZWN0b3IpXG4gICAgICAucGFyZW50cygnbGknKVxuICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuXG4gICAgaWYgKGFjdGl2ZS5wYXJlbnQoJy5kcm9wZG93bi1tZW51JykubGVuZ3RoKSB7XG4gICAgICBhY3RpdmUgPSBhY3RpdmVcbiAgICAgICAgLmNsb3Nlc3QoJ2xpLmRyb3Bkb3duJylcbiAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgIH1cblxuICAgIGFjdGl2ZS50cmlnZ2VyKCdhY3RpdmF0ZS5icy5zY3JvbGxzcHknKVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMuc2VsZWN0b3IpXG4gICAgICAucGFyZW50c1VudGlsKHRoaXMub3B0aW9ucy50YXJnZXQsICcuYWN0aXZlJylcbiAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgfVxuXG5cbiAgLy8gU0NST0xMU1BZIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5zY3JvbGxzcHknKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLnNjcm9sbHNweScsIChkYXRhID0gbmV3IFNjcm9sbFNweSh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uc2Nyb2xsc3B5XG5cbiAgJC5mbi5zY3JvbGxzcHkgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5zY3JvbGxzcHkuQ29uc3RydWN0b3IgPSBTY3JvbGxTcHlcblxuXG4gIC8vIFNDUk9MTFNQWSBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnNjcm9sbHNweS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uc2Nyb2xsc3B5ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gU0NST0xMU1BZIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PT09PVxuXG4gICQod2luZG93KS5vbignbG9hZC5icy5zY3JvbGxzcHkuZGF0YS1hcGknLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtc3B5PVwic2Nyb2xsXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHNweSA9ICQodGhpcylcbiAgICAgIFBsdWdpbi5jYWxsKCRzcHksICRzcHkuZGF0YSgpKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHRhYi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0YWJzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gVEFCIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgVGFiID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAvLyBqc2NzOmRpc2FibGUgcmVxdWlyZURvbGxhckJlZm9yZWpRdWVyeUFzc2lnbm1lbnRcbiAgICB0aGlzLmVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgLy8ganNjczplbmFibGUgcmVxdWlyZURvbGxhckJlZm9yZWpRdWVyeUFzc2lnbm1lbnRcbiAgfVxuXG4gIFRhYi5WRVJTSU9OID0gJzMuNC4xJ1xuXG4gIFRhYi5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgVGFiLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkdGhpcyAgICA9IHRoaXMuZWxlbWVudFxuICAgIHZhciAkdWwgICAgICA9ICR0aGlzLmNsb3Nlc3QoJ3VsOm5vdCguZHJvcGRvd24tbWVudSknKVxuICAgIHZhciBzZWxlY3RvciA9ICR0aGlzLmRhdGEoJ3RhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIGlmICgkdGhpcy5wYXJlbnQoJ2xpJykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSByZXR1cm5cblxuICAgIHZhciAkcHJldmlvdXMgPSAkdWwuZmluZCgnLmFjdGl2ZTpsYXN0IGEnKVxuICAgIHZhciBoaWRlRXZlbnQgPSAkLkV2ZW50KCdoaWRlLmJzLnRhYicsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6ICR0aGlzWzBdXG4gICAgfSlcbiAgICB2YXIgc2hvd0V2ZW50ID0gJC5FdmVudCgnc2hvdy5icy50YWInLCB7XG4gICAgICByZWxhdGVkVGFyZ2V0OiAkcHJldmlvdXNbMF1cbiAgICB9KVxuXG4gICAgJHByZXZpb3VzLnRyaWdnZXIoaGlkZUV2ZW50KVxuICAgICR0aGlzLnRyaWdnZXIoc2hvd0V2ZW50KVxuXG4gICAgaWYgKHNob3dFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCBoaWRlRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdmFyICR0YXJnZXQgPSAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKVxuXG4gICAgdGhpcy5hY3RpdmF0ZSgkdGhpcy5jbG9zZXN0KCdsaScpLCAkdWwpXG4gICAgdGhpcy5hY3RpdmF0ZSgkdGFyZ2V0LCAkdGFyZ2V0LnBhcmVudCgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkcHJldmlvdXMudHJpZ2dlcih7XG4gICAgICAgIHR5cGU6ICdoaWRkZW4uYnMudGFiJyxcbiAgICAgICAgcmVsYXRlZFRhcmdldDogJHRoaXNbMF1cbiAgICAgIH0pXG4gICAgICAkdGhpcy50cmlnZ2VyKHtcbiAgICAgICAgdHlwZTogJ3Nob3duLmJzLnRhYicsXG4gICAgICAgIHJlbGF0ZWRUYXJnZXQ6ICRwcmV2aW91c1swXVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgVGFiLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIsIGNhbGxiYWNrKSB7XG4gICAgdmFyICRhY3RpdmUgICAgPSBjb250YWluZXIuZmluZCgnPiAuYWN0aXZlJylcbiAgICB2YXIgdHJhbnNpdGlvbiA9IGNhbGxiYWNrXG4gICAgICAmJiAkLnN1cHBvcnQudHJhbnNpdGlvblxuICAgICAgJiYgKCRhY3RpdmUubGVuZ3RoICYmICRhY3RpdmUuaGFzQ2xhc3MoJ2ZhZGUnKSB8fCAhIWNvbnRhaW5lci5maW5kKCc+IC5mYWRlJykubGVuZ3RoKVxuXG4gICAgZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICRhY3RpdmVcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAuZmluZCgnPiAuZHJvcGRvd24tbWVudSA+IC5hY3RpdmUnKVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5lbmQoKVxuICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSlcblxuICAgICAgZWxlbWVudFxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG5cbiAgICAgIGlmICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGggLy8gcmVmbG93IGZvciB0cmFuc2l0aW9uXG4gICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2luJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZhZGUnKVxuICAgICAgfVxuXG4gICAgICBpZiAoZWxlbWVudC5wYXJlbnQoJy5kcm9wZG93bi1tZW51JykubGVuZ3RoKSB7XG4gICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAuY2xvc2VzdCgnbGkuZHJvcGRvd24nKVxuICAgICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAuZW5kKClcbiAgICAgICAgICAuZmluZCgnW2RhdGEtdG9nZ2xlPVwidGFiXCJdJylcbiAgICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIHRydWUpXG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICAkYWN0aXZlLmxlbmd0aCAmJiB0cmFuc2l0aW9uID9cbiAgICAgICRhY3RpdmVcbiAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgbmV4dClcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRhYi5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICBuZXh0KClcblxuICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoJ2luJylcbiAgfVxuXG5cbiAgLy8gVEFCIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLnRhYicpXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMudGFiJywgKGRhdGEgPSBuZXcgVGFiKHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi50YWJcblxuICAkLmZuLnRhYiAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnRhYi5Db25zdHJ1Y3RvciA9IFRhYlxuXG5cbiAgLy8gVEFCIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PVxuXG4gICQuZm4udGFiLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi50YWIgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBUQUIgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09XG5cbiAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgUGx1Z2luLmNhbGwoJCh0aGlzKSwgJ3Nob3cnKVxuICB9XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLnRhYi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nLCBjbGlja0hhbmRsZXIpXG4gICAgLm9uKCdjbGljay5icy50YWIuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwicGlsbFwiXScsIGNsaWNrSGFuZGxlcilcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogYWZmaXguanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jYWZmaXhcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBBRkZJWCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQWZmaXggPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBBZmZpeC5ERUZBVUxUUywgb3B0aW9ucylcblxuICAgIHZhciB0YXJnZXQgPSB0aGlzLm9wdGlvbnMudGFyZ2V0ID09PSBBZmZpeC5ERUZBVUxUUy50YXJnZXQgPyAkKHRoaXMub3B0aW9ucy50YXJnZXQpIDogJChkb2N1bWVudCkuZmluZCh0aGlzLm9wdGlvbnMudGFyZ2V0KVxuXG4gICAgdGhpcy4kdGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAub24oJ3Njcm9sbC5icy5hZmZpeC5kYXRhLWFwaScsICQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLCB0aGlzKSlcbiAgICAgIC5vbignY2xpY2suYnMuYWZmaXguZGF0YS1hcGknLCAgJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wLCB0aGlzKSlcblxuICAgIHRoaXMuJGVsZW1lbnQgICAgID0gJChlbGVtZW50KVxuICAgIHRoaXMuYWZmaXhlZCAgICAgID0gbnVsbFxuICAgIHRoaXMudW5waW4gICAgICAgID0gbnVsbFxuICAgIHRoaXMucGlubmVkT2Zmc2V0ID0gbnVsbFxuXG4gICAgdGhpcy5jaGVja1Bvc2l0aW9uKClcbiAgfVxuXG4gIEFmZml4LlZFUlNJT04gID0gJzMuNC4xJ1xuXG4gIEFmZml4LlJFU0VUICAgID0gJ2FmZml4IGFmZml4LXRvcCBhZmZpeC1ib3R0b20nXG5cbiAgQWZmaXguREVGQVVMVFMgPSB7XG4gICAgb2Zmc2V0OiAwLFxuICAgIHRhcmdldDogd2luZG93XG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbiAoc2Nyb2xsSGVpZ2h0LCBoZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKSB7XG4gICAgdmFyIHNjcm9sbFRvcCAgICA9IHRoaXMuJHRhcmdldC5zY3JvbGxUb3AoKVxuICAgIHZhciBwb3NpdGlvbiAgICAgPSB0aGlzLiRlbGVtZW50Lm9mZnNldCgpXG4gICAgdmFyIHRhcmdldEhlaWdodCA9IHRoaXMuJHRhcmdldC5oZWlnaHQoKVxuXG4gICAgaWYgKG9mZnNldFRvcCAhPSBudWxsICYmIHRoaXMuYWZmaXhlZCA9PSAndG9wJykgcmV0dXJuIHNjcm9sbFRvcCA8IG9mZnNldFRvcCA/ICd0b3AnIDogZmFsc2VcblxuICAgIGlmICh0aGlzLmFmZml4ZWQgPT0gJ2JvdHRvbScpIHtcbiAgICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCkgcmV0dXJuIChzY3JvbGxUb3AgKyB0aGlzLnVucGluIDw9IHBvc2l0aW9uLnRvcCkgPyBmYWxzZSA6ICdib3R0b20nXG4gICAgICByZXR1cm4gKHNjcm9sbFRvcCArIHRhcmdldEhlaWdodCA8PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pID8gZmFsc2UgOiAnYm90dG9tJ1xuICAgIH1cblxuICAgIHZhciBpbml0aWFsaXppbmcgICA9IHRoaXMuYWZmaXhlZCA9PSBudWxsXG4gICAgdmFyIGNvbGxpZGVyVG9wICAgID0gaW5pdGlhbGl6aW5nID8gc2Nyb2xsVG9wIDogcG9zaXRpb24udG9wXG4gICAgdmFyIGNvbGxpZGVySGVpZ2h0ID0gaW5pdGlhbGl6aW5nID8gdGFyZ2V0SGVpZ2h0IDogaGVpZ2h0XG5cbiAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwgJiYgc2Nyb2xsVG9wIDw9IG9mZnNldFRvcCkgcmV0dXJuICd0b3AnXG4gICAgaWYgKG9mZnNldEJvdHRvbSAhPSBudWxsICYmIChjb2xsaWRlclRvcCArIGNvbGxpZGVySGVpZ2h0ID49IHNjcm9sbEhlaWdodCAtIG9mZnNldEJvdHRvbSkpIHJldHVybiAnYm90dG9tJ1xuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuZ2V0UGlubmVkT2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnBpbm5lZE9mZnNldCkgcmV0dXJuIHRoaXMucGlubmVkT2Zmc2V0XG4gICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcyhBZmZpeC5SRVNFVCkuYWRkQ2xhc3MoJ2FmZml4JylcbiAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpXG4gICAgdmFyIHBvc2l0aW9uICA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KClcbiAgICByZXR1cm4gKHRoaXMucGlubmVkT2Zmc2V0ID0gcG9zaXRpb24udG9wIC0gc2Nyb2xsVG9wKVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wID0gZnVuY3Rpb24gKCkge1xuICAgIHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sIHRoaXMpLCAxKVxuICB9XG5cbiAgQWZmaXgucHJvdG90eXBlLmNoZWNrUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLiRlbGVtZW50LmlzKCc6dmlzaWJsZScpKSByZXR1cm5cblxuICAgIHZhciBoZWlnaHQgICAgICAgPSB0aGlzLiRlbGVtZW50LmhlaWdodCgpXG4gICAgdmFyIG9mZnNldCAgICAgICA9IHRoaXMub3B0aW9ucy5vZmZzZXRcbiAgICB2YXIgb2Zmc2V0VG9wICAgID0gb2Zmc2V0LnRvcFxuICAgIHZhciBvZmZzZXRCb3R0b20gPSBvZmZzZXQuYm90dG9tXG4gICAgdmFyIHNjcm9sbEhlaWdodCA9IE1hdGgubWF4KCQoZG9jdW1lbnQpLmhlaWdodCgpLCAkKGRvY3VtZW50LmJvZHkpLmhlaWdodCgpKVxuXG4gICAgaWYgKHR5cGVvZiBvZmZzZXQgIT0gJ29iamVjdCcpICAgICAgICAgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0VG9wID0gb2Zmc2V0XG4gICAgaWYgKHR5cGVvZiBvZmZzZXRUb3AgPT0gJ2Z1bmN0aW9uJykgICAgb2Zmc2V0VG9wICAgID0gb2Zmc2V0LnRvcCh0aGlzLiRlbGVtZW50KVxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0Qm90dG9tID09ICdmdW5jdGlvbicpIG9mZnNldEJvdHRvbSA9IG9mZnNldC5ib3R0b20odGhpcy4kZWxlbWVudClcblxuICAgIHZhciBhZmZpeCA9IHRoaXMuZ2V0U3RhdGUoc2Nyb2xsSGVpZ2h0LCBoZWlnaHQsIG9mZnNldFRvcCwgb2Zmc2V0Qm90dG9tKVxuXG4gICAgaWYgKHRoaXMuYWZmaXhlZCAhPSBhZmZpeCkge1xuICAgICAgaWYgKHRoaXMudW5waW4gIT0gbnVsbCkgdGhpcy4kZWxlbWVudC5jc3MoJ3RvcCcsICcnKVxuXG4gICAgICB2YXIgYWZmaXhUeXBlID0gJ2FmZml4JyArIChhZmZpeCA/ICctJyArIGFmZml4IDogJycpXG4gICAgICB2YXIgZSAgICAgICAgID0gJC5FdmVudChhZmZpeFR5cGUgKyAnLmJzLmFmZml4JylcblxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICAgdGhpcy5hZmZpeGVkID0gYWZmaXhcbiAgICAgIHRoaXMudW5waW4gPSBhZmZpeCA9PSAnYm90dG9tJyA/IHRoaXMuZ2V0UGlubmVkT2Zmc2V0KCkgOiBudWxsXG5cbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKEFmZml4LlJFU0VUKVxuICAgICAgICAuYWRkQ2xhc3MoYWZmaXhUeXBlKVxuICAgICAgICAudHJpZ2dlcihhZmZpeFR5cGUucmVwbGFjZSgnYWZmaXgnLCAnYWZmaXhlZCcpICsgJy5icy5hZmZpeCcpXG4gICAgfVxuXG4gICAgaWYgKGFmZml4ID09ICdib3R0b20nKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9mZnNldCh7XG4gICAgICAgIHRvcDogc2Nyb2xsSGVpZ2h0IC0gaGVpZ2h0IC0gb2Zmc2V0Qm90dG9tXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG5cbiAgLy8gQUZGSVggUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuYWZmaXgnKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmFmZml4JywgKGRhdGEgPSBuZXcgQWZmaXgodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmFmZml4XG5cbiAgJC5mbi5hZmZpeCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmFmZml4LkNvbnN0cnVjdG9yID0gQWZmaXhcblxuXG4gIC8vIEFGRklYIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5hZmZpeC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYWZmaXggPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBBRkZJWCBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PVxuXG4gICQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1zcHk9XCJhZmZpeFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRzcHkgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSA9ICRzcHkuZGF0YSgpXG5cbiAgICAgIGRhdGEub2Zmc2V0ID0gZGF0YS5vZmZzZXQgfHwge31cblxuICAgICAgaWYgKGRhdGEub2Zmc2V0Qm90dG9tICE9IG51bGwpIGRhdGEub2Zmc2V0LmJvdHRvbSA9IGRhdGEub2Zmc2V0Qm90dG9tXG4gICAgICBpZiAoZGF0YS5vZmZzZXRUb3AgICAgIT0gbnVsbCkgZGF0YS5vZmZzZXQudG9wICAgID0gZGF0YS5vZmZzZXRUb3BcblxuICAgICAgUGx1Z2luLmNhbGwoJHNweSwgZGF0YSlcbiAgICB9KVxuICB9KVxuXG59KGpRdWVyeSk7XG4iLCIvLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHwgRmxleHkgaGVhZGVyXG4vLyB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIHxcbi8vIHwgVGhpcyBqUXVlcnkgc2NyaXB0IGlzIHdyaXR0ZW4gYnlcbi8vIHxcbi8vIHwgTW9ydGVuIE5pc3NlblxuLy8gfCBoamVtbWVzaWRla29uZ2VuLmRrXG4vLyB8XG5cbnZhciBmbGV4eV9oZWFkZXIgPSAoZnVuY3Rpb24gKCQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgcHViID0ge30sXG4gICAgICAgICRoZWFkZXJfc3RhdGljID0gJCgnLmZsZXh5LWhlYWRlci0tc3RhdGljJyksXG4gICAgICAgICRoZWFkZXJfc3RpY2t5ID0gJCgnLmZsZXh5LWhlYWRlci0tc3RpY2t5JyksXG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB1cGRhdGVfaW50ZXJ2YWw6IDEwMCxcbiAgICAgICAgICAgIHRvbGVyYW5jZToge1xuICAgICAgICAgICAgICAgIHVwd2FyZDogMjAsXG4gICAgICAgICAgICAgICAgZG93bndhcmQ6IDEwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb2Zmc2V0OiBfZ2V0X29mZnNldF9mcm9tX2VsZW1lbnRzX2JvdHRvbSgkaGVhZGVyX3N0YXRpYyksXG4gICAgICAgICAgICBjbGFzc2VzOiB7XG4gICAgICAgICAgICAgICAgcGlubmVkOiBcImZsZXh5LWhlYWRlci0tcGlubmVkXCIsXG4gICAgICAgICAgICAgICAgdW5waW5uZWQ6IFwiZmxleHktaGVhZGVyLS11bnBpbm5lZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHdhc19zY3JvbGxlZCA9IGZhbHNlLFxuICAgICAgICBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wID0gMDtcblxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlXG4gICAgICovXG4gICAgcHViLmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICByZWdpc3RlckV2ZW50SGFuZGxlcnMoKTtcbiAgICAgICAgcmVnaXN0ZXJCb290RXZlbnRIYW5kbGVycygpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBib290IGV2ZW50IGhhbmRsZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJCb290RXZlbnRIYW5kbGVycygpIHtcbiAgICAgICAgJGhlYWRlcl9zdGlja3kuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnVucGlubmVkKTtcblxuICAgICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgaWYgKHdhc19zY3JvbGxlZCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50X3dhc19zY3JvbGxlZCgpO1xuXG4gICAgICAgICAgICAgICAgd2FzX3Njcm9sbGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIG9wdGlvbnMudXBkYXRlX2ludGVydmFsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBldmVudCBoYW5kbGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRIYW5kbGVycygpIHtcbiAgICAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgd2FzX3Njcm9sbGVkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IG9mZnNldCBmcm9tIGVsZW1lbnQgYm90dG9tXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2dldF9vZmZzZXRfZnJvbV9lbGVtZW50c19ib3R0b20oJGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRfaGVpZ2h0ID0gJGVsZW1lbnQub3V0ZXJIZWlnaHQodHJ1ZSksXG4gICAgICAgICAgICBlbGVtZW50X29mZnNldCA9ICRlbGVtZW50Lm9mZnNldCgpLnRvcDtcblxuICAgICAgICByZXR1cm4gKGVsZW1lbnRfaGVpZ2h0ICsgZWxlbWVudF9vZmZzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERvY3VtZW50IHdhcyBzY3JvbGxlZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvY3VtZW50X3dhc19zY3JvbGxlZCgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICAgLy8gSWYgcGFzdCBvZmZzZXRcbiAgICAgICAgaWYgKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgPj0gb3B0aW9ucy5vZmZzZXQpIHtcblxuICAgICAgICAgICAgLy8gRG93bndhcmRzIHNjcm9sbFxuICAgICAgICAgICAgaWYgKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgPiBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBPYmV5IHRoZSBkb3dud2FyZCB0b2xlcmFuY2VcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCAtIGxhc3RfZGlzdGFuY2VfZnJvbV90b3ApIDw9IG9wdGlvbnMudG9sZXJhbmNlLmRvd253YXJkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkaGVhZGVyX3N0aWNreS5yZW1vdmVDbGFzcyhvcHRpb25zLmNsYXNzZXMucGlubmVkKS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzZXMudW5waW5uZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBVcHdhcmRzIHNjcm9sbFxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvLyBPYmV5IHRoZSB1cHdhcmQgdG9sZXJhbmNlXG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AgLSBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wKSA8PSBvcHRpb25zLnRvbGVyYW5jZS51cHdhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFdlIGFyZSBub3Qgc2Nyb2xsZWQgcGFzdCB0aGUgZG9jdW1lbnQgd2hpY2ggaXMgcG9zc2libGUgb24gdGhlIE1hY1xuICAgICAgICAgICAgICAgIGlmICgoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCArICQod2luZG93KS5oZWlnaHQoKSkgPCAkKGRvY3VtZW50KS5oZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAkaGVhZGVyX3N0aWNreS5yZW1vdmVDbGFzcyhvcHRpb25zLmNsYXNzZXMudW5waW5uZWQpLmFkZENsYXNzKG9wdGlvbnMuY2xhc3Nlcy5waW5uZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdCBwYXN0IG9mZnNldFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICRoZWFkZXJfc3RpY2t5LnJlbW92ZUNsYXNzKG9wdGlvbnMuY2xhc3Nlcy5waW5uZWQpLmFkZENsYXNzKG9wdGlvbnMuY2xhc3Nlcy51bnBpbm5lZCk7XG4gICAgICAgIH1cblxuICAgICAgICBsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wID0gY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcHViO1xufSkoalF1ZXJ5KTtcbiIsIihmdW5jdGlvbigpIHtcbiAgdmFyIEFqYXhNb25pdG9yLCBCYXIsIERvY3VtZW50TW9uaXRvciwgRWxlbWVudE1vbml0b3IsIEVsZW1lbnRUcmFja2VyLCBFdmVudExhZ01vbml0b3IsIEV2ZW50ZWQsIEV2ZW50cywgTm9UYXJnZXRFcnJvciwgUGFjZSwgUmVxdWVzdEludGVyY2VwdCwgU09VUkNFX0tFWVMsIFNjYWxlciwgU29ja2V0UmVxdWVzdFRyYWNrZXIsIFhIUlJlcXVlc3RUcmFja2VyLCBhbmltYXRpb24sIGF2Z0FtcGxpdHVkZSwgYmFyLCBjYW5jZWxBbmltYXRpb24sIGNhbmNlbEFuaW1hdGlvbkZyYW1lLCBkZWZhdWx0T3B0aW9ucywgZXh0ZW5kLCBleHRlbmROYXRpdmUsIGdldEZyb21ET00sIGdldEludGVyY2VwdCwgaGFuZGxlUHVzaFN0YXRlLCBpZ25vcmVTdGFjaywgaW5pdCwgbm93LCBvcHRpb25zLCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIHJlc3VsdCwgcnVuQW5pbWF0aW9uLCBzY2FsZXJzLCBzaG91bGRJZ25vcmVVUkwsIHNob3VsZFRyYWNrLCBzb3VyY2UsIHNvdXJjZXMsIHVuaVNjYWxlciwgX1dlYlNvY2tldCwgX1hEb21haW5SZXF1ZXN0LCBfWE1MSHR0cFJlcXVlc3QsIF9pLCBfaW50ZXJjZXB0LCBfbGVuLCBfcHVzaFN0YXRlLCBfcmVmLCBfcmVmMSwgX3JlcGxhY2VTdGF0ZSxcbiAgICBfX3NsaWNlID0gW10uc2xpY2UsXG4gICAgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gICAgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gICAgX19pbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cbiAgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgY2F0Y2h1cFRpbWU6IDEwMCxcbiAgICBpbml0aWFsUmF0ZTogLjAzLFxuICAgIG1pblRpbWU6IDI1MCxcbiAgICBnaG9zdFRpbWU6IDEwMCxcbiAgICBtYXhQcm9ncmVzc1BlckZyYW1lOiAyMCxcbiAgICBlYXNlRmFjdG9yOiAxLjI1LFxuICAgIHN0YXJ0T25QYWdlTG9hZDogdHJ1ZSxcbiAgICByZXN0YXJ0T25QdXNoU3RhdGU6IHRydWUsXG4gICAgcmVzdGFydE9uUmVxdWVzdEFmdGVyOiA1MDAsXG4gICAgdGFyZ2V0OiAnYm9keScsXG4gICAgZWxlbWVudHM6IHtcbiAgICAgIGNoZWNrSW50ZXJ2YWw6IDEwMCxcbiAgICAgIHNlbGVjdG9yczogWydib2R5J11cbiAgICB9LFxuICAgIGV2ZW50TGFnOiB7XG4gICAgICBtaW5TYW1wbGVzOiAxMCxcbiAgICAgIHNhbXBsZUNvdW50OiAzLFxuICAgICAgbGFnVGhyZXNob2xkOiAzXG4gICAgfSxcbiAgICBhamF4OiB7XG4gICAgICB0cmFja01ldGhvZHM6IFsnR0VUJ10sXG4gICAgICB0cmFja1dlYlNvY2tldHM6IHRydWUsXG4gICAgICBpZ25vcmVVUkxzOiBbXVxuICAgIH1cbiAgfTtcblxuICBub3cgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JlZjtcbiAgICByZXR1cm4gKF9yZWYgPSB0eXBlb2YgcGVyZm9ybWFuY2UgIT09IFwidW5kZWZpbmVkXCIgJiYgcGVyZm9ybWFuY2UgIT09IG51bGwgPyB0eXBlb2YgcGVyZm9ybWFuY2Uubm93ID09PSBcImZ1bmN0aW9uXCIgPyBwZXJmb3JtYW5jZS5ub3coKSA6IHZvaWQgMCA6IHZvaWQgMCkgIT0gbnVsbCA/IF9yZWYgOiArKG5ldyBEYXRlKTtcbiAgfTtcblxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cbiAgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lO1xuXG4gIGlmIChyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT0gbnVsbCkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICByZXR1cm4gc2V0VGltZW91dChmbiwgNTApO1xuICAgIH07XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChpZCk7XG4gICAgfTtcbiAgfVxuXG4gIHJ1bkFuaW1hdGlvbiA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgdmFyIGxhc3QsIHRpY2s7XG4gICAgbGFzdCA9IG5vdygpO1xuICAgIHRpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkaWZmO1xuICAgICAgZGlmZiA9IG5vdygpIC0gbGFzdDtcbiAgICAgIGlmIChkaWZmID49IDMzKSB7XG4gICAgICAgIGxhc3QgPSBub3coKTtcbiAgICAgICAgcmV0dXJuIGZuKGRpZmYsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQodGljaywgMzMgLSBkaWZmKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiB0aWNrKCk7XG4gIH07XG5cbiAgcmVzdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MsIGtleSwgb2JqO1xuICAgIG9iaiA9IGFyZ3VtZW50c1swXSwga2V5ID0gYXJndW1lbnRzWzFdLCBhcmdzID0gMyA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMikgOiBbXTtcbiAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gb2JqW2tleV0uYXBwbHkob2JqLCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH1cbiAgfTtcblxuICBleHRlbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIga2V5LCBvdXQsIHNvdXJjZSwgc291cmNlcywgdmFsLCBfaSwgX2xlbjtcbiAgICBvdXQgPSBhcmd1bWVudHNbMF0sIHNvdXJjZXMgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gc291cmNlcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgc291cmNlID0gc291cmNlc1tfaV07XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgIGlmICghX19oYXNQcm9wLmNhbGwoc291cmNlLCBrZXkpKSBjb250aW51ZTtcbiAgICAgICAgICB2YWwgPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICBpZiAoKG91dFtrZXldICE9IG51bGwpICYmIHR5cGVvZiBvdXRba2V5XSA9PT0gJ29iamVjdCcgJiYgKHZhbCAhPSBudWxsKSAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZXh0ZW5kKG91dFtrZXldLCB2YWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRba2V5XSA9IHZhbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcblxuICBhdmdBbXBsaXR1ZGUgPSBmdW5jdGlvbihhcnIpIHtcbiAgICB2YXIgY291bnQsIHN1bSwgdiwgX2ksIF9sZW47XG4gICAgc3VtID0gY291bnQgPSAwO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gYXJyLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICB2ID0gYXJyW19pXTtcbiAgICAgIHN1bSArPSBNYXRoLmFicyh2KTtcbiAgICAgIGNvdW50Kys7XG4gICAgfVxuICAgIHJldHVybiBzdW0gLyBjb3VudDtcbiAgfTtcblxuICBnZXRGcm9tRE9NID0gZnVuY3Rpb24oa2V5LCBqc29uKSB7XG4gICAgdmFyIGRhdGEsIGUsIGVsO1xuICAgIGlmIChrZXkgPT0gbnVsbCkge1xuICAgICAga2V5ID0gJ29wdGlvbnMnO1xuICAgIH1cbiAgICBpZiAoanNvbiA9PSBudWxsKSB7XG4gICAgICBqc29uID0gdHJ1ZTtcbiAgICB9XG4gICAgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtcGFjZS1cIiArIGtleSArIFwiXVwiKTtcbiAgICBpZiAoIWVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRhdGEgPSBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhY2UtXCIgKyBrZXkpO1xuICAgIGlmICghanNvbikge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShkYXRhKTtcbiAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgIGUgPSBfZXJyb3I7XG4gICAgICByZXR1cm4gdHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZSAhPT0gbnVsbCA/IGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwYXJzaW5nIGlubGluZSBwYWNlIG9wdGlvbnNcIiwgZSkgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuXG4gIEV2ZW50ZWQgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRXZlbnRlZCgpIHt9XG5cbiAgICBFdmVudGVkLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKGV2ZW50LCBoYW5kbGVyLCBjdHgsIG9uY2UpIHtcbiAgICAgIHZhciBfYmFzZTtcbiAgICAgIGlmIChvbmNlID09IG51bGwpIHtcbiAgICAgICAgb25jZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuYmluZGluZ3MgPT0gbnVsbCkge1xuICAgICAgICB0aGlzLmJpbmRpbmdzID0ge307XG4gICAgICB9XG4gICAgICBpZiAoKF9iYXNlID0gdGhpcy5iaW5kaW5ncylbZXZlbnRdID09IG51bGwpIHtcbiAgICAgICAgX2Jhc2VbZXZlbnRdID0gW107XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5nc1tldmVudF0ucHVzaCh7XG4gICAgICAgIGhhbmRsZXI6IGhhbmRsZXIsXG4gICAgICAgIGN0eDogY3R4LFxuICAgICAgICBvbmNlOiBvbmNlXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgRXZlbnRlZC5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBoYW5kbGVyLCBjdHgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9uKGV2ZW50LCBoYW5kbGVyLCBjdHgsIHRydWUpO1xuICAgIH07XG5cbiAgICBFdmVudGVkLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbihldmVudCwgaGFuZGxlcikge1xuICAgICAgdmFyIGksIF9yZWYsIF9yZXN1bHRzO1xuICAgICAgaWYgKCgoX3JlZiA9IHRoaXMuYmluZGluZ3MpICE9IG51bGwgPyBfcmVmW2V2ZW50XSA6IHZvaWQgMCkgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaGFuZGxlciA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBkZWxldGUgdGhpcy5iaW5kaW5nc1tldmVudF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLmJpbmRpbmdzW2V2ZW50XS5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAodGhpcy5iaW5kaW5nc1tldmVudF1baV0uaGFuZGxlciA9PT0gaGFuZGxlcikge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLmJpbmRpbmdzW2V2ZW50XS5zcGxpY2UoaSwgMSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGkrKyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRXZlbnRlZC5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MsIGN0eCwgZXZlbnQsIGhhbmRsZXIsIGksIG9uY2UsIF9yZWYsIF9yZWYxLCBfcmVzdWx0cztcbiAgICAgIGV2ZW50ID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICAgIGlmICgoX3JlZiA9IHRoaXMuYmluZGluZ3MpICE9IG51bGwgPyBfcmVmW2V2ZW50XSA6IHZvaWQgMCkge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgd2hpbGUgKGkgPCB0aGlzLmJpbmRpbmdzW2V2ZW50XS5sZW5ndGgpIHtcbiAgICAgICAgICBfcmVmMSA9IHRoaXMuYmluZGluZ3NbZXZlbnRdW2ldLCBoYW5kbGVyID0gX3JlZjEuaGFuZGxlciwgY3R4ID0gX3JlZjEuY3R4LCBvbmNlID0gX3JlZjEub25jZTtcbiAgICAgICAgICBoYW5kbGVyLmFwcGx5KGN0eCAhPSBudWxsID8gY3R4IDogdGhpcywgYXJncyk7XG4gICAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godGhpcy5iaW5kaW5nc1tldmVudF0uc3BsaWNlKGksIDEpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChpKyspO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBFdmVudGVkO1xuXG4gIH0pKCk7XG5cbiAgUGFjZSA9IHdpbmRvdy5QYWNlIHx8IHt9O1xuXG4gIHdpbmRvdy5QYWNlID0gUGFjZTtcblxuICBleHRlbmQoUGFjZSwgRXZlbnRlZC5wcm90b3R5cGUpO1xuXG4gIG9wdGlvbnMgPSBQYWNlLm9wdGlvbnMgPSBleHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCB3aW5kb3cucGFjZU9wdGlvbnMsIGdldEZyb21ET00oKSk7XG5cbiAgX3JlZiA9IFsnYWpheCcsICdkb2N1bWVudCcsICdldmVudExhZycsICdlbGVtZW50cyddO1xuICBmb3IgKF9pID0gMCwgX2xlbiA9IF9yZWYubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICBzb3VyY2UgPSBfcmVmW19pXTtcbiAgICBpZiAob3B0aW9uc1tzb3VyY2VdID09PSB0cnVlKSB7XG4gICAgICBvcHRpb25zW3NvdXJjZV0gPSBkZWZhdWx0T3B0aW9uc1tzb3VyY2VdO1xuICAgIH1cbiAgfVxuXG4gIE5vVGFyZ2V0RXJyb3IgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE5vVGFyZ2V0RXJyb3IsIF9zdXBlcik7XG5cbiAgICBmdW5jdGlvbiBOb1RhcmdldEVycm9yKCkge1xuICAgICAgX3JlZjEgPSBOb1RhcmdldEVycm9yLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIF9yZWYxO1xuICAgIH1cblxuICAgIHJldHVybiBOb1RhcmdldEVycm9yO1xuXG4gIH0pKEVycm9yKTtcblxuICBCYXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gQmFyKCkge1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgfVxuXG4gICAgQmFyLnByb3RvdHlwZS5nZXRFbGVtZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdGFyZ2V0RWxlbWVudDtcbiAgICAgIGlmICh0aGlzLmVsID09IG51bGwpIHtcbiAgICAgICAgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy50YXJnZXQpO1xuICAgICAgICBpZiAoIXRhcmdldEVsZW1lbnQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTm9UYXJnZXRFcnJvcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZWwuY2xhc3NOYW1lID0gXCJwYWNlIHBhY2UtYWN0aXZlXCI7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSgvcGFjZS1kb25lL2csICcnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgKz0gJyBwYWNlLXJ1bm5pbmcnO1xuICAgICAgICB0aGlzLmVsLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwicGFjZS1wcm9ncmVzc1wiPlxcbiAgPGRpdiBjbGFzcz1cInBhY2UtcHJvZ3Jlc3MtaW5uZXJcIj48L2Rpdj5cXG48L2Rpdj5cXG48ZGl2IGNsYXNzPVwicGFjZS1hY3Rpdml0eVwiPjwvZGl2Pic7XG4gICAgICAgIGlmICh0YXJnZXRFbGVtZW50LmZpcnN0Q2hpbGQgIT0gbnVsbCkge1xuICAgICAgICAgIHRhcmdldEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRoaXMuZWwsIHRhcmdldEVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZWw7XG4gICAgfTtcblxuICAgIEJhci5wcm90b3R5cGUuZmluaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWw7XG4gICAgICBlbCA9IHRoaXMuZ2V0RWxlbWVudCgpO1xuICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoJ3BhY2UtYWN0aXZlJywgJycpO1xuICAgICAgZWwuY2xhc3NOYW1lICs9ICcgcGFjZS1pbmFjdGl2ZSc7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoJ3BhY2UtcnVubmluZycsICcnKTtcbiAgICAgIHJldHVybiBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSArPSAnIHBhY2UtZG9uZSc7XG4gICAgfTtcblxuICAgIEJhci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ocHJvZykge1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IHByb2c7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXIoKTtcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmdldEVsZW1lbnQoKS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZ2V0RWxlbWVudCgpKTtcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICBOb1RhcmdldEVycm9yID0gX2Vycm9yO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZWwgPSB2b2lkIDA7XG4gICAgfTtcblxuICAgIEJhci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWwsIGtleSwgcHJvZ3Jlc3NTdHIsIHRyYW5zZm9ybSwgX2osIF9sZW4xLCBfcmVmMjtcbiAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG9wdGlvbnMudGFyZ2V0KSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGVsID0gdGhpcy5nZXRFbGVtZW50KCk7XG4gICAgICB0cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZTNkKFwiICsgdGhpcy5wcm9ncmVzcyArIFwiJSwgMCwgMClcIjtcbiAgICAgIF9yZWYyID0gWyd3ZWJraXRUcmFuc2Zvcm0nLCAnbXNUcmFuc2Zvcm0nLCAndHJhbnNmb3JtJ107XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAga2V5ID0gX3JlZjJbX2pdO1xuICAgICAgICBlbC5jaGlsZHJlblswXS5zdHlsZVtrZXldID0gdHJhbnNmb3JtO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmxhc3RSZW5kZXJlZFByb2dyZXNzIHx8IHRoaXMubGFzdFJlbmRlcmVkUHJvZ3Jlc3MgfCAwICE9PSB0aGlzLnByb2dyZXNzIHwgMCkge1xuICAgICAgICBlbC5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZ3Jlc3MtdGV4dCcsIFwiXCIgKyAodGhpcy5wcm9ncmVzcyB8IDApICsgXCIlXCIpO1xuICAgICAgICBpZiAodGhpcy5wcm9ncmVzcyA+PSAxMDApIHtcbiAgICAgICAgICBwcm9ncmVzc1N0ciA9ICc5OSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvZ3Jlc3NTdHIgPSB0aGlzLnByb2dyZXNzIDwgMTAgPyBcIjBcIiA6IFwiXCI7XG4gICAgICAgICAgcHJvZ3Jlc3NTdHIgKz0gdGhpcy5wcm9ncmVzcyB8IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWwuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKCdkYXRhLXByb2dyZXNzJywgXCJcIiArIHByb2dyZXNzU3RyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmxhc3RSZW5kZXJlZFByb2dyZXNzID0gdGhpcy5wcm9ncmVzcztcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9ncmVzcyA+PSAxMDA7XG4gICAgfTtcblxuICAgIHJldHVybiBCYXI7XG5cbiAgfSkoKTtcblxuICBFdmVudHMgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRXZlbnRzKCkge1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IHt9O1xuICAgIH1cblxuICAgIEV2ZW50cy5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uKG5hbWUsIHZhbCkge1xuICAgICAgdmFyIGJpbmRpbmcsIF9qLCBfbGVuMSwgX3JlZjIsIF9yZXN1bHRzO1xuICAgICAgaWYgKHRoaXMuYmluZGluZ3NbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICBfcmVmMiA9IHRoaXMuYmluZGluZ3NbbmFtZV07XG4gICAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgIGJpbmRpbmcgPSBfcmVmMltfal07XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaChiaW5kaW5nLmNhbGwodGhpcywgdmFsKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBFdmVudHMucHJvdG90eXBlLm9uID0gZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICAgIHZhciBfYmFzZTtcbiAgICAgIGlmICgoX2Jhc2UgPSB0aGlzLmJpbmRpbmdzKVtuYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIF9iYXNlW25hbWVdID0gW107XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5iaW5kaW5nc1tuYW1lXS5wdXNoKGZuKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEV2ZW50cztcblxuICB9KSgpO1xuXG4gIF9YTUxIdHRwUmVxdWVzdCA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdDtcblxuICBfWERvbWFpblJlcXVlc3QgPSB3aW5kb3cuWERvbWFpblJlcXVlc3Q7XG5cbiAgX1dlYlNvY2tldCA9IHdpbmRvdy5XZWJTb2NrZXQ7XG5cbiAgZXh0ZW5kTmF0aXZlID0gZnVuY3Rpb24odG8sIGZyb20pIHtcbiAgICB2YXIgZSwga2V5LCBfcmVzdWx0cztcbiAgICBfcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoa2V5IGluIGZyb20ucHJvdG90eXBlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoKHRvW2tleV0gPT0gbnVsbCkgJiYgdHlwZW9mIGZyb21ba2V5XSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmICh0eXBlb2YgT2JqZWN0LmRlZmluZVByb3BlcnR5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0bywga2V5LCB7XG4gICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZyb20ucHJvdG90eXBlW2tleV07XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRvW2tleV0gPSBmcm9tLnByb3RvdHlwZVtrZXldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3Jlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgZSA9IF9lcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9yZXN1bHRzO1xuICB9O1xuXG4gIGlnbm9yZVN0YWNrID0gW107XG5cbiAgUGFjZS5pZ25vcmUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncywgZm4sIHJldDtcbiAgICBmbiA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgaWdub3JlU3RhY2sudW5zaGlmdCgnaWdub3JlJyk7XG4gICAgcmV0ID0gZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgaWdub3JlU3RhY2suc2hpZnQoKTtcbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIFBhY2UudHJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncywgZm4sIHJldDtcbiAgICBmbiA9IGFyZ3VtZW50c1swXSwgYXJncyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgaWdub3JlU3RhY2sudW5zaGlmdCgndHJhY2snKTtcbiAgICByZXQgPSBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICBpZ25vcmVTdGFjay5zaGlmdCgpO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgc2hvdWxkVHJhY2sgPSBmdW5jdGlvbihtZXRob2QpIHtcbiAgICB2YXIgX3JlZjI7XG4gICAgaWYgKG1ldGhvZCA9PSBudWxsKSB7XG4gICAgICBtZXRob2QgPSAnR0VUJztcbiAgICB9XG4gICAgaWYgKGlnbm9yZVN0YWNrWzBdID09PSAndHJhY2snKSB7XG4gICAgICByZXR1cm4gJ2ZvcmNlJztcbiAgICB9XG4gICAgaWYgKCFpZ25vcmVTdGFjay5sZW5ndGggJiYgb3B0aW9ucy5hamF4KSB7XG4gICAgICBpZiAobWV0aG9kID09PSAnc29ja2V0JyAmJiBvcHRpb25zLmFqYXgudHJhY2tXZWJTb2NrZXRzKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChfcmVmMiA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpLCBfX2luZGV4T2YuY2FsbChvcHRpb25zLmFqYXgudHJhY2tNZXRob2RzLCBfcmVmMikgPj0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIFJlcXVlc3RJbnRlcmNlcHQgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFJlcXVlc3RJbnRlcmNlcHQsIF9zdXBlcik7XG5cbiAgICBmdW5jdGlvbiBSZXF1ZXN0SW50ZXJjZXB0KCkge1xuICAgICAgdmFyIG1vbml0b3JYSFIsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIFJlcXVlc3RJbnRlcmNlcHQuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICBtb25pdG9yWEhSID0gZnVuY3Rpb24ocmVxKSB7XG4gICAgICAgIHZhciBfb3BlbjtcbiAgICAgICAgX29wZW4gPSByZXEub3BlbjtcbiAgICAgICAgcmV0dXJuIHJlcS5vcGVuID0gZnVuY3Rpb24odHlwZSwgdXJsLCBhc3luYykge1xuICAgICAgICAgIGlmIChzaG91bGRUcmFjayh0eXBlKSkge1xuICAgICAgICAgICAgX3RoaXMudHJpZ2dlcigncmVxdWVzdCcsIHtcbiAgICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgIHJlcXVlc3Q6IHJlcVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfb3Blbi5hcHBseShyZXEsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgICAgd2luZG93LlhNTEh0dHBSZXF1ZXN0ID0gZnVuY3Rpb24oZmxhZ3MpIHtcbiAgICAgICAgdmFyIHJlcTtcbiAgICAgICAgcmVxID0gbmV3IF9YTUxIdHRwUmVxdWVzdChmbGFncyk7XG4gICAgICAgIG1vbml0b3JYSFIocmVxKTtcbiAgICAgICAgcmV0dXJuIHJlcTtcbiAgICAgIH07XG4gICAgICB0cnkge1xuICAgICAgICBleHRlbmROYXRpdmUod2luZG93LlhNTEh0dHBSZXF1ZXN0LCBfWE1MSHR0cFJlcXVlc3QpO1xuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7fVxuICAgICAgaWYgKF9YRG9tYWluUmVxdWVzdCAhPSBudWxsKSB7XG4gICAgICAgIHdpbmRvdy5YRG9tYWluUmVxdWVzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciByZXE7XG4gICAgICAgICAgcmVxID0gbmV3IF9YRG9tYWluUmVxdWVzdDtcbiAgICAgICAgICBtb25pdG9yWEhSKHJlcSk7XG4gICAgICAgICAgcmV0dXJuIHJlcTtcbiAgICAgICAgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBleHRlbmROYXRpdmUod2luZG93LlhEb21haW5SZXF1ZXN0LCBfWERvbWFpblJlcXVlc3QpO1xuICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICB9XG4gICAgICBpZiAoKF9XZWJTb2NrZXQgIT0gbnVsbCkgJiYgb3B0aW9ucy5hamF4LnRyYWNrV2ViU29ja2V0cykge1xuICAgICAgICB3aW5kb3cuV2ViU29ja2V0ID0gZnVuY3Rpb24odXJsLCBwcm90b2NvbHMpIHtcbiAgICAgICAgICB2YXIgcmVxO1xuICAgICAgICAgIGlmIChwcm90b2NvbHMgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmVxID0gbmV3IF9XZWJTb2NrZXQodXJsLCBwcm90b2NvbHMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXEgPSBuZXcgX1dlYlNvY2tldCh1cmwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc2hvdWxkVHJhY2soJ3NvY2tldCcpKSB7XG4gICAgICAgICAgICBfdGhpcy50cmlnZ2VyKCdyZXF1ZXN0Jywge1xuICAgICAgICAgICAgICB0eXBlOiAnc29ja2V0JyxcbiAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgIHByb3RvY29sczogcHJvdG9jb2xzLFxuICAgICAgICAgICAgICByZXF1ZXN0OiByZXFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVxO1xuICAgICAgICB9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGV4dGVuZE5hdGl2ZSh3aW5kb3cuV2ViU29ja2V0LCBfV2ViU29ja2V0KTtcbiAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7fVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBSZXF1ZXN0SW50ZXJjZXB0O1xuXG4gIH0pKEV2ZW50cyk7XG5cbiAgX2ludGVyY2VwdCA9IG51bGw7XG5cbiAgZ2V0SW50ZXJjZXB0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKF9pbnRlcmNlcHQgPT0gbnVsbCkge1xuICAgICAgX2ludGVyY2VwdCA9IG5ldyBSZXF1ZXN0SW50ZXJjZXB0O1xuICAgIH1cbiAgICByZXR1cm4gX2ludGVyY2VwdDtcbiAgfTtcblxuICBzaG91bGRJZ25vcmVVUkwgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgcGF0dGVybiwgX2osIF9sZW4xLCBfcmVmMjtcbiAgICBfcmVmMiA9IG9wdGlvbnMuYWpheC5pZ25vcmVVUkxzO1xuICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgcGF0dGVybiA9IF9yZWYyW19qXTtcbiAgICAgIGlmICh0eXBlb2YgcGF0dGVybiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKHVybC5pbmRleE9mKHBhdHRlcm4pICE9PSAtMSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocGF0dGVybi50ZXN0KHVybCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgZ2V0SW50ZXJjZXB0KCkub24oJ3JlcXVlc3QnLCBmdW5jdGlvbihfYXJnKSB7XG4gICAgdmFyIGFmdGVyLCBhcmdzLCByZXF1ZXN0LCB0eXBlLCB1cmw7XG4gICAgdHlwZSA9IF9hcmcudHlwZSwgcmVxdWVzdCA9IF9hcmcucmVxdWVzdCwgdXJsID0gX2FyZy51cmw7XG4gICAgaWYgKHNob3VsZElnbm9yZVVSTCh1cmwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghUGFjZS5ydW5uaW5nICYmIChvcHRpb25zLnJlc3RhcnRPblJlcXVlc3RBZnRlciAhPT0gZmFsc2UgfHwgc2hvdWxkVHJhY2sodHlwZSkgPT09ICdmb3JjZScpKSB7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgYWZ0ZXIgPSBvcHRpb25zLnJlc3RhcnRPblJlcXVlc3RBZnRlciB8fCAwO1xuICAgICAgaWYgKHR5cGVvZiBhZnRlciA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIGFmdGVyID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3RpbGxBY3RpdmUsIF9qLCBfbGVuMSwgX3JlZjIsIF9yZWYzLCBfcmVzdWx0cztcbiAgICAgICAgaWYgKHR5cGUgPT09ICdzb2NrZXQnKSB7XG4gICAgICAgICAgc3RpbGxBY3RpdmUgPSByZXF1ZXN0LnJlYWR5U3RhdGUgPCAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0aWxsQWN0aXZlID0gKDAgPCAoX3JlZjIgPSByZXF1ZXN0LnJlYWR5U3RhdGUpICYmIF9yZWYyIDwgNCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0aWxsQWN0aXZlKSB7XG4gICAgICAgICAgUGFjZS5yZXN0YXJ0KCk7XG4gICAgICAgICAgX3JlZjMgPSBQYWNlLnNvdXJjZXM7XG4gICAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMy5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IF9yZWYzW19qXTtcbiAgICAgICAgICAgIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBBamF4TW9uaXRvcikge1xuICAgICAgICAgICAgICBzb3VyY2Uud2F0Y2guYXBwbHkoc291cmNlLCBhcmdzKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgICAgfVxuICAgICAgfSwgYWZ0ZXIpO1xuICAgIH1cbiAgfSk7XG5cbiAgQWpheE1vbml0b3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gQWpheE1vbml0b3IoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuICAgICAgZ2V0SW50ZXJjZXB0KCkub24oJ3JlcXVlc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLndhdGNoLmFwcGx5KF90aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgQWpheE1vbml0b3IucHJvdG90eXBlLndhdGNoID0gZnVuY3Rpb24oX2FyZykge1xuICAgICAgdmFyIHJlcXVlc3QsIHRyYWNrZXIsIHR5cGUsIHVybDtcbiAgICAgIHR5cGUgPSBfYXJnLnR5cGUsIHJlcXVlc3QgPSBfYXJnLnJlcXVlc3QsIHVybCA9IF9hcmcudXJsO1xuICAgICAgaWYgKHNob3VsZElnbm9yZVVSTCh1cmwpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09PSAnc29ja2V0Jykge1xuICAgICAgICB0cmFja2VyID0gbmV3IFNvY2tldFJlcXVlc3RUcmFja2VyKHJlcXVlc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJhY2tlciA9IG5ldyBYSFJSZXF1ZXN0VHJhY2tlcihyZXF1ZXN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRzLnB1c2godHJhY2tlcik7XG4gICAgfTtcblxuICAgIHJldHVybiBBamF4TW9uaXRvcjtcblxuICB9KSgpO1xuXG4gIFhIUlJlcXVlc3RUcmFja2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFhIUlJlcXVlc3RUcmFja2VyKHJlcXVlc3QpIHtcbiAgICAgIHZhciBldmVudCwgc2l6ZSwgX2osIF9sZW4xLCBfb25yZWFkeXN0YXRlY2hhbmdlLCBfcmVmMixcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgICBpZiAod2luZG93LlByb2dyZXNzRXZlbnQgIT0gbnVsbCkge1xuICAgICAgICBzaXplID0gbnVsbDtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gX3RoaXMucHJvZ3Jlc3MgKyAoMTAwIC0gX3RoaXMucHJvZ3Jlc3MpIC8gMjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgX3JlZjIgPSBbJ2xvYWQnLCAnYWJvcnQnLCAndGltZW91dCcsICdlcnJvciddO1xuICAgICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgICBldmVudCA9IF9yZWYyW19qXTtcbiAgICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwO1xuICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX29ucmVhZHlzdGF0ZWNoYW5nZSA9IHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlO1xuICAgICAgICByZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBfcmVmMztcbiAgICAgICAgICBpZiAoKF9yZWYzID0gcmVxdWVzdC5yZWFkeVN0YXRlKSA9PT0gMCB8fCBfcmVmMyA9PT0gNCkge1xuICAgICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDMpIHtcbiAgICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gNTA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0eXBlb2YgX29ucmVhZHlzdGF0ZWNoYW5nZSA9PT0gXCJmdW5jdGlvblwiID8gX29ucmVhZHlzdGF0ZWNoYW5nZS5hcHBseShudWxsLCBhcmd1bWVudHMpIDogdm9pZCAwO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBYSFJSZXF1ZXN0VHJhY2tlcjtcblxuICB9KSgpO1xuXG4gIFNvY2tldFJlcXVlc3RUcmFja2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFNvY2tldFJlcXVlc3RUcmFja2VyKHJlcXVlc3QpIHtcbiAgICAgIHZhciBldmVudCwgX2osIF9sZW4xLCBfcmVmMixcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgICBfcmVmMiA9IFsnZXJyb3InLCAnb3BlbiddO1xuICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgIGV2ZW50ID0gX3JlZjJbX2pdO1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBTb2NrZXRSZXF1ZXN0VHJhY2tlcjtcblxuICB9KSgpO1xuXG4gIEVsZW1lbnRNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEVsZW1lbnRNb25pdG9yKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxlY3RvciwgX2osIF9sZW4xLCBfcmVmMjtcbiAgICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgfVxuICAgICAgdGhpcy5lbGVtZW50cyA9IFtdO1xuICAgICAgaWYgKG9wdGlvbnMuc2VsZWN0b3JzID09IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5zZWxlY3RvcnMgPSBbXTtcbiAgICAgIH1cbiAgICAgIF9yZWYyID0gb3B0aW9ucy5zZWxlY3RvcnM7XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgc2VsZWN0b3IgPSBfcmVmMltfal07XG4gICAgICAgIHRoaXMuZWxlbWVudHMucHVzaChuZXcgRWxlbWVudFRyYWNrZXIoc2VsZWN0b3IpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gRWxlbWVudE1vbml0b3I7XG5cbiAgfSkoKTtcblxuICBFbGVtZW50VHJhY2tlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFbGVtZW50VHJhY2tlcihzZWxlY3Rvcikge1xuICAgICAgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgICB0aGlzLmNoZWNrKCk7XG4gICAgfVxuXG4gICAgRWxlbWVudFRyYWNrZXIucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5jaGVjaygpO1xuICAgICAgICB9KSwgb3B0aW9ucy5lbGVtZW50cy5jaGVja0ludGVydmFsKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgRWxlbWVudFRyYWNrZXIucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2dyZXNzID0gMTAwO1xuICAgIH07XG5cbiAgICByZXR1cm4gRWxlbWVudFRyYWNrZXI7XG5cbiAgfSkoKTtcblxuICBEb2N1bWVudE1vbml0b3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgRG9jdW1lbnRNb25pdG9yLnByb3RvdHlwZS5zdGF0ZXMgPSB7XG4gICAgICBsb2FkaW5nOiAwLFxuICAgICAgaW50ZXJhY3RpdmU6IDUwLFxuICAgICAgY29tcGxldGU6IDEwMFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBEb2N1bWVudE1vbml0b3IoKSB7XG4gICAgICB2YXIgX29ucmVhZHlzdGF0ZWNoYW5nZSwgX3JlZjIsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAoX3JlZjIgPSB0aGlzLnN0YXRlc1tkb2N1bWVudC5yZWFkeVN0YXRlXSkgIT0gbnVsbCA/IF9yZWYyIDogMTAwO1xuICAgICAgX29ucmVhZHlzdGF0ZWNoYW5nZSA9IGRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZTtcbiAgICAgIGRvY3VtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoX3RoaXMuc3RhdGVzW2RvY3VtZW50LnJlYWR5U3RhdGVdICE9IG51bGwpIHtcbiAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IF90aGlzLnN0YXRlc1tkb2N1bWVudC5yZWFkeVN0YXRlXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZW9mIF9vbnJlYWR5c3RhdGVjaGFuZ2UgPT09IFwiZnVuY3Rpb25cIiA/IF9vbnJlYWR5c3RhdGVjaGFuZ2UuYXBwbHkobnVsbCwgYXJndW1lbnRzKSA6IHZvaWQgMDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIERvY3VtZW50TW9uaXRvcjtcblxuICB9KSgpO1xuXG4gIEV2ZW50TGFnTW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFdmVudExhZ01vbml0b3IoKSB7XG4gICAgICB2YXIgYXZnLCBpbnRlcnZhbCwgbGFzdCwgcG9pbnRzLCBzYW1wbGVzLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIGF2ZyA9IDA7XG4gICAgICBzYW1wbGVzID0gW107XG4gICAgICBwb2ludHMgPSAwO1xuICAgICAgbGFzdCA9IG5vdygpO1xuICAgICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRpZmY7XG4gICAgICAgIGRpZmYgPSBub3coKSAtIGxhc3QgLSA1MDtcbiAgICAgICAgbGFzdCA9IG5vdygpO1xuICAgICAgICBzYW1wbGVzLnB1c2goZGlmZik7XG4gICAgICAgIGlmIChzYW1wbGVzLmxlbmd0aCA+IG9wdGlvbnMuZXZlbnRMYWcuc2FtcGxlQ291bnQpIHtcbiAgICAgICAgICBzYW1wbGVzLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgICAgYXZnID0gYXZnQW1wbGl0dWRlKHNhbXBsZXMpO1xuICAgICAgICBpZiAoKytwb2ludHMgPj0gb3B0aW9ucy5ldmVudExhZy5taW5TYW1wbGVzICYmIGF2ZyA8IG9wdGlvbnMuZXZlbnRMYWcubGFnVGhyZXNob2xkKSB7XG4gICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgICAgcmV0dXJuIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9ncmVzcyA9IDEwMCAqICgzIC8gKGF2ZyArIDMpKTtcbiAgICAgICAgfVxuICAgICAgfSwgNTApO1xuICAgIH1cblxuICAgIHJldHVybiBFdmVudExhZ01vbml0b3I7XG5cbiAgfSkoKTtcblxuICBTY2FsZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gU2NhbGVyKHNvdXJjZSkge1xuICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aGlzLmxhc3QgPSB0aGlzLnNpbmNlTGFzdFVwZGF0ZSA9IDA7XG4gICAgICB0aGlzLnJhdGUgPSBvcHRpb25zLmluaXRpYWxSYXRlO1xuICAgICAgdGhpcy5jYXRjaHVwID0gMDtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSB0aGlzLmxhc3RQcm9ncmVzcyA9IDA7XG4gICAgICBpZiAodGhpcy5zb3VyY2UgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnByb2dyZXNzID0gcmVzdWx0KHRoaXMuc291cmNlLCAncHJvZ3Jlc3MnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBTY2FsZXIucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbihmcmFtZVRpbWUsIHZhbCkge1xuICAgICAgdmFyIHNjYWxpbmc7XG4gICAgICBpZiAodmFsID09IG51bGwpIHtcbiAgICAgICAgdmFsID0gcmVzdWx0KHRoaXMuc291cmNlLCAncHJvZ3Jlc3MnKTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWwgPj0gMTAwKSB7XG4gICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAodmFsID09PSB0aGlzLmxhc3QpIHtcbiAgICAgICAgdGhpcy5zaW5jZUxhc3RVcGRhdGUgKz0gZnJhbWVUaW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuc2luY2VMYXN0VXBkYXRlKSB7XG4gICAgICAgICAgdGhpcy5yYXRlID0gKHZhbCAtIHRoaXMubGFzdCkgLyB0aGlzLnNpbmNlTGFzdFVwZGF0ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhdGNodXAgPSAodmFsIC0gdGhpcy5wcm9ncmVzcykgLyBvcHRpb25zLmNhdGNodXBUaW1lO1xuICAgICAgICB0aGlzLnNpbmNlTGFzdFVwZGF0ZSA9IDA7XG4gICAgICAgIHRoaXMubGFzdCA9IHZhbDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWwgPiB0aGlzLnByb2dyZXNzKSB7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3MgKz0gdGhpcy5jYXRjaHVwICogZnJhbWVUaW1lO1xuICAgICAgfVxuICAgICAgc2NhbGluZyA9IDEgLSBNYXRoLnBvdyh0aGlzLnByb2dyZXNzIC8gMTAwLCBvcHRpb25zLmVhc2VGYWN0b3IpO1xuICAgICAgdGhpcy5wcm9ncmVzcyArPSBzY2FsaW5nICogdGhpcy5yYXRlICogZnJhbWVUaW1lO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgubWluKHRoaXMubGFzdFByb2dyZXNzICsgb3B0aW9ucy5tYXhQcm9ncmVzc1BlckZyYW1lLCB0aGlzLnByb2dyZXNzKTtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSBNYXRoLm1heCgwLCB0aGlzLnByb2dyZXNzKTtcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSBNYXRoLm1pbigxMDAsIHRoaXMucHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5sYXN0UHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzO1xuICAgICAgcmV0dXJuIHRoaXMucHJvZ3Jlc3M7XG4gICAgfTtcblxuICAgIHJldHVybiBTY2FsZXI7XG5cbiAgfSkoKTtcblxuICBzb3VyY2VzID0gbnVsbDtcblxuICBzY2FsZXJzID0gbnVsbDtcblxuICBiYXIgPSBudWxsO1xuXG4gIHVuaVNjYWxlciA9IG51bGw7XG5cbiAgYW5pbWF0aW9uID0gbnVsbDtcblxuICBjYW5jZWxBbmltYXRpb24gPSBudWxsO1xuXG4gIFBhY2UucnVubmluZyA9IGZhbHNlO1xuXG4gIGhhbmRsZVB1c2hTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChvcHRpb25zLnJlc3RhcnRPblB1c2hTdGF0ZSkge1xuICAgICAgcmV0dXJuIFBhY2UucmVzdGFydCgpO1xuICAgIH1cbiAgfTtcblxuICBpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlICE9IG51bGwpIHtcbiAgICBfcHVzaFN0YXRlID0gd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlO1xuICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaGFuZGxlUHVzaFN0YXRlKCk7XG4gICAgICByZXR1cm4gX3B1c2hTdGF0ZS5hcHBseSh3aW5kb3cuaGlzdG9yeSwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSAhPSBudWxsKSB7XG4gICAgX3JlcGxhY2VTdGF0ZSA9IHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZTtcbiAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGhhbmRsZVB1c2hTdGF0ZSgpO1xuICAgICAgcmV0dXJuIF9yZXBsYWNlU3RhdGUuYXBwbHkod2luZG93Lmhpc3RvcnksIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIFNPVVJDRV9LRVlTID0ge1xuICAgIGFqYXg6IEFqYXhNb25pdG9yLFxuICAgIGVsZW1lbnRzOiBFbGVtZW50TW9uaXRvcixcbiAgICBkb2N1bWVudDogRG9jdW1lbnRNb25pdG9yLFxuICAgIGV2ZW50TGFnOiBFdmVudExhZ01vbml0b3JcbiAgfTtcblxuICAoaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0eXBlLCBfaiwgX2ssIF9sZW4xLCBfbGVuMiwgX3JlZjIsIF9yZWYzLCBfcmVmNDtcbiAgICBQYWNlLnNvdXJjZXMgPSBzb3VyY2VzID0gW107XG4gICAgX3JlZjIgPSBbJ2FqYXgnLCAnZWxlbWVudHMnLCAnZG9jdW1lbnQnLCAnZXZlbnRMYWcnXTtcbiAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgIHR5cGUgPSBfcmVmMltfal07XG4gICAgICBpZiAob3B0aW9uc1t0eXBlXSAhPT0gZmFsc2UpIHtcbiAgICAgICAgc291cmNlcy5wdXNoKG5ldyBTT1VSQ0VfS0VZU1t0eXBlXShvcHRpb25zW3R5cGVdKSk7XG4gICAgICB9XG4gICAgfVxuICAgIF9yZWY0ID0gKF9yZWYzID0gb3B0aW9ucy5leHRyYVNvdXJjZXMpICE9IG51bGwgPyBfcmVmMyA6IFtdO1xuICAgIGZvciAoX2sgPSAwLCBfbGVuMiA9IF9yZWY0Lmxlbmd0aDsgX2sgPCBfbGVuMjsgX2srKykge1xuICAgICAgc291cmNlID0gX3JlZjRbX2tdO1xuICAgICAgc291cmNlcy5wdXNoKG5ldyBzb3VyY2Uob3B0aW9ucykpO1xuICAgIH1cbiAgICBQYWNlLmJhciA9IGJhciA9IG5ldyBCYXI7XG4gICAgc2NhbGVycyA9IFtdO1xuICAgIHJldHVybiB1bmlTY2FsZXIgPSBuZXcgU2NhbGVyO1xuICB9KSgpO1xuXG4gIFBhY2Uuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIFBhY2UudHJpZ2dlcignc3RvcCcpO1xuICAgIFBhY2UucnVubmluZyA9IGZhbHNlO1xuICAgIGJhci5kZXN0cm95KCk7XG4gICAgY2FuY2VsQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICBpZiAoYW5pbWF0aW9uICE9IG51bGwpIHtcbiAgICAgIGlmICh0eXBlb2YgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShhbmltYXRpb24pO1xuICAgICAgfVxuICAgICAgYW5pbWF0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGluaXQoKTtcbiAgfTtcblxuICBQYWNlLnJlc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICBQYWNlLnRyaWdnZXIoJ3Jlc3RhcnQnKTtcbiAgICBQYWNlLnN0b3AoKTtcbiAgICByZXR1cm4gUGFjZS5zdGFydCgpO1xuICB9O1xuXG4gIFBhY2UuZ28gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhcnQ7XG4gICAgUGFjZS5ydW5uaW5nID0gdHJ1ZTtcbiAgICBiYXIucmVuZGVyKCk7XG4gICAgc3RhcnQgPSBub3coKTtcbiAgICBjYW5jZWxBbmltYXRpb24gPSBmYWxzZTtcbiAgICByZXR1cm4gYW5pbWF0aW9uID0gcnVuQW5pbWF0aW9uKGZ1bmN0aW9uKGZyYW1lVGltZSwgZW5xdWV1ZU5leHRGcmFtZSkge1xuICAgICAgdmFyIGF2ZywgY291bnQsIGRvbmUsIGVsZW1lbnQsIGVsZW1lbnRzLCBpLCBqLCByZW1haW5pbmcsIHNjYWxlciwgc2NhbGVyTGlzdCwgc3VtLCBfaiwgX2ssIF9sZW4xLCBfbGVuMiwgX3JlZjI7XG4gICAgICByZW1haW5pbmcgPSAxMDAgLSBiYXIucHJvZ3Jlc3M7XG4gICAgICBjb3VudCA9IHN1bSA9IDA7XG4gICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIGZvciAoaSA9IF9qID0gMCwgX2xlbjEgPSBzb3VyY2VzLmxlbmd0aDsgX2ogPCBfbGVuMTsgaSA9ICsrX2opIHtcbiAgICAgICAgc291cmNlID0gc291cmNlc1tpXTtcbiAgICAgICAgc2NhbGVyTGlzdCA9IHNjYWxlcnNbaV0gIT0gbnVsbCA/IHNjYWxlcnNbaV0gOiBzY2FsZXJzW2ldID0gW107XG4gICAgICAgIGVsZW1lbnRzID0gKF9yZWYyID0gc291cmNlLmVsZW1lbnRzKSAhPSBudWxsID8gX3JlZjIgOiBbc291cmNlXTtcbiAgICAgICAgZm9yIChqID0gX2sgPSAwLCBfbGVuMiA9IGVsZW1lbnRzLmxlbmd0aDsgX2sgPCBfbGVuMjsgaiA9ICsrX2spIHtcbiAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudHNbal07XG4gICAgICAgICAgc2NhbGVyID0gc2NhbGVyTGlzdFtqXSAhPSBudWxsID8gc2NhbGVyTGlzdFtqXSA6IHNjYWxlckxpc3Rbal0gPSBuZXcgU2NhbGVyKGVsZW1lbnQpO1xuICAgICAgICAgIGRvbmUgJj0gc2NhbGVyLmRvbmU7XG4gICAgICAgICAgaWYgKHNjYWxlci5kb25lKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgICBzdW0gKz0gc2NhbGVyLnRpY2soZnJhbWVUaW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYXZnID0gc3VtIC8gY291bnQ7XG4gICAgICBiYXIudXBkYXRlKHVuaVNjYWxlci50aWNrKGZyYW1lVGltZSwgYXZnKSk7XG4gICAgICBpZiAoYmFyLmRvbmUoKSB8fCBkb25lIHx8IGNhbmNlbEFuaW1hdGlvbikge1xuICAgICAgICBiYXIudXBkYXRlKDEwMCk7XG4gICAgICAgIFBhY2UudHJpZ2dlcignZG9uZScpO1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBiYXIuZmluaXNoKCk7XG4gICAgICAgICAgUGFjZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIFBhY2UudHJpZ2dlcignaGlkZScpO1xuICAgICAgICB9LCBNYXRoLm1heChvcHRpb25zLmdob3N0VGltZSwgTWF0aC5tYXgob3B0aW9ucy5taW5UaW1lIC0gKG5vdygpIC0gc3RhcnQpLCAwKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVucXVldWVOZXh0RnJhbWUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBQYWNlLnN0YXJ0ID0gZnVuY3Rpb24oX29wdGlvbnMpIHtcbiAgICBleHRlbmQob3B0aW9ucywgX29wdGlvbnMpO1xuICAgIFBhY2UucnVubmluZyA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIGJhci5yZW5kZXIoKTtcbiAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgIE5vVGFyZ2V0RXJyb3IgPSBfZXJyb3I7XG4gICAgfVxuICAgIGlmICghZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhY2UnKSkge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoUGFjZS5zdGFydCwgNTApO1xuICAgIH0gZWxzZSB7XG4gICAgICBQYWNlLnRyaWdnZXIoJ3N0YXJ0Jyk7XG4gICAgICByZXR1cm4gUGFjZS5nbygpO1xuICAgIH1cbiAgfTtcblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFsncGFjZSddLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBQYWNlO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gUGFjZTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob3B0aW9ucy5zdGFydE9uUGFnZUxvYWQpIHtcbiAgICAgIFBhY2Uuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxufSkuY2FsbCh0aGlzKTtcbiIsIiFmdW5jdGlvbihlKXt2YXIgdDtlLmZuLnNsaW5reT1mdW5jdGlvbihhKXt2YXIgcz1lLmV4dGVuZCh7bGFiZWw6XCJCYWNrXCIsdGl0bGU6ITEsc3BlZWQ6MzAwLHJlc2l6ZTohMH0sYSksaT1lKHRoaXMpLG49aS5jaGlsZHJlbigpLmZpcnN0KCk7aS5hZGRDbGFzcyhcInNsaW5reS1tZW51XCIpO3ZhciByPWZ1bmN0aW9uKGUsdCl7dmFyIGE9TWF0aC5yb3VuZChwYXJzZUludChuLmdldCgwKS5zdHlsZS5sZWZ0KSl8fDA7bi5jc3MoXCJsZWZ0XCIsYS0xMDAqZStcIiVcIiksXCJmdW5jdGlvblwiPT10eXBlb2YgdCYmc2V0VGltZW91dCh0LHMuc3BlZWQpfSxsPWZ1bmN0aW9uKGUpe2kuaGVpZ2h0KGUub3V0ZXJIZWlnaHQoKSl9LGQ9ZnVuY3Rpb24oZSl7aS5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsZStcIm1zXCIpLG4uY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLGUrXCJtc1wiKX07aWYoZChzLnNwZWVkKSxlKFwiYSArIHVsXCIsaSkucHJldigpLmFkZENsYXNzKFwibmV4dFwiKSxlKFwibGkgPiB1bFwiLGkpLnByZXBlbmQoJzxsaSBjbGFzcz1cImhlYWRlclwiPicpLHMudGl0bGU9PT0hMCYmZShcImxpID4gdWxcIixpKS5lYWNoKGZ1bmN0aW9uKCl7dmFyIHQ9ZSh0aGlzKS5wYXJlbnQoKS5maW5kKFwiYVwiKS5maXJzdCgpLnRleHQoKSxhPWUoXCI8aDI+XCIpLnRleHQodCk7ZShcIj4gLmhlYWRlclwiLHRoaXMpLmFwcGVuZChhKX0pLHMudGl0bGV8fHMubGFiZWwhPT0hMCl7dmFyIG89ZShcIjxhPlwiKS50ZXh0KHMubGFiZWwpLnByb3AoXCJocmVmXCIsXCIjXCIpLmFkZENsYXNzKFwiYmFja1wiKTtlKFwiLmhlYWRlclwiLGkpLmFwcGVuZChvKX1lbHNlIGUoXCJsaSA+IHVsXCIsaSkuZWFjaChmdW5jdGlvbigpe3ZhciB0PWUodGhpcykucGFyZW50KCkuZmluZChcImFcIikuZmlyc3QoKS50ZXh0KCksYT1lKFwiPGE+XCIpLnRleHQodCkucHJvcChcImhyZWZcIixcIiNcIikuYWRkQ2xhc3MoXCJiYWNrXCIpO2UoXCI+IC5oZWFkZXJcIix0aGlzKS5hcHBlbmQoYSl9KTtlKFwiYVwiLGkpLm9uKFwiY2xpY2tcIixmdW5jdGlvbihhKXtpZighKHQrcy5zcGVlZD5EYXRlLm5vdygpKSl7dD1EYXRlLm5vdygpO3ZhciBuPWUodGhpcyk7LyMvLnRlc3QodGhpcy5ocmVmKSYmYS5wcmV2ZW50RGVmYXVsdCgpLG4uaGFzQ2xhc3MoXCJuZXh0XCIpPyhpLmZpbmQoXCIuYWN0aXZlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLG4ubmV4dCgpLnNob3coKS5hZGRDbGFzcyhcImFjdGl2ZVwiKSxyKDEpLHMucmVzaXplJiZsKG4ubmV4dCgpKSk6bi5oYXNDbGFzcyhcImJhY2tcIikmJihyKC0xLGZ1bmN0aW9uKCl7aS5maW5kKFwiLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKSxuLnBhcmVudCgpLnBhcmVudCgpLmhpZGUoKS5wYXJlbnRzVW50aWwoaSxcInVsXCIpLmZpcnN0KCkuYWRkQ2xhc3MoXCJhY3RpdmVcIil9KSxzLnJlc2l6ZSYmbChuLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudHNVbnRpbChpLFwidWxcIikpKX19KSx0aGlzLmp1bXA9ZnVuY3Rpb24odCxhKXt0PWUodCk7dmFyIG49aS5maW5kKFwiLmFjdGl2ZVwiKTtuPW4ubGVuZ3RoPjA/bi5wYXJlbnRzVW50aWwoaSxcInVsXCIpLmxlbmd0aDowLGkuZmluZChcInVsXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLmhpZGUoKTt2YXIgbz10LnBhcmVudHNVbnRpbChpLFwidWxcIik7by5zaG93KCksdC5zaG93KCkuYWRkQ2xhc3MoXCJhY3RpdmVcIiksYT09PSExJiZkKDApLHIoby5sZW5ndGgtbikscy5yZXNpemUmJmwodCksYT09PSExJiZkKHMuc3BlZWQpfSx0aGlzLmhvbWU9ZnVuY3Rpb24odCl7dD09PSExJiZkKDApO3ZhciBhPWkuZmluZChcIi5hY3RpdmVcIiksbj1hLnBhcmVudHNVbnRpbChpLFwibGlcIikubGVuZ3RoO24+MCYmKHIoLW4sZnVuY3Rpb24oKXthLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpfSkscy5yZXNpemUmJmwoZShhLnBhcmVudHNVbnRpbChpLFwibGlcIikuZ2V0KG4tMSkpLnBhcmVudCgpKSksdD09PSExJiZkKHMuc3BlZWQpfSx0aGlzLmRlc3Ryb3k9ZnVuY3Rpb24oKXtlKFwiLmhlYWRlclwiLGkpLnJlbW92ZSgpLGUoXCJhXCIsaSkucmVtb3ZlQ2xhc3MoXCJuZXh0XCIpLm9mZihcImNsaWNrXCIpLGkucmVtb3ZlQ2xhc3MoXCJzbGlua3ktbWVudVwiKS5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsXCJcIiksbi5jc3MoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsXCJcIil9O3ZhciBjPWkuZmluZChcIi5hY3RpdmVcIik7cmV0dXJuIGMubGVuZ3RoPjAmJihjLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpLHRoaXMuanVtcChjLCExKSksdGhpc319KGpRdWVyeSk7IiwidmFyIHRucyA9IChmdW5jdGlvbiAoKXtcbi8vIE9iamVjdC5rZXlzXG5pZiAoIU9iamVjdC5rZXlzKSB7XG4gIE9iamVjdC5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBuYW1lIGluIG9iamVjdCkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIG5hbWUpKSB7XG4gICAgICAgIGtleXMucHVzaChuYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG59XG5cbi8vIENoaWxkTm9kZS5yZW1vdmVcbmlmKCEoXCJyZW1vdmVcIiBpbiBFbGVtZW50LnByb3RvdHlwZSkpe1xuICBFbGVtZW50LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbigpe1xuICAgIGlmKHRoaXMucGFyZW50Tm9kZSkge1xuICAgICAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgIH1cbiAgfTtcbn1cblxudmFyIHdpbiA9IHdpbmRvdztcblxudmFyIHJhZiA9IHdpbi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgfHwgd2luLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCB3aW4ubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gIHx8IHdpbi5tc1JlcXVlc3RBbmltYXRpb25GcmFtZVxuICB8fCBmdW5jdGlvbihjYikgeyByZXR1cm4gc2V0VGltZW91dChjYiwgMTYpOyB9O1xuXG52YXIgd2luJDEgPSB3aW5kb3c7XG5cbnZhciBjYWYgPSB3aW4kMS5jYW5jZWxBbmltYXRpb25GcmFtZVxuICB8fCB3aW4kMS5tb3pDYW5jZWxBbmltYXRpb25GcmFtZVxuICB8fCBmdW5jdGlvbihpZCl7IGNsZWFyVGltZW91dChpZCk7IH07XG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgdmFyIG9iaiwgbmFtZSwgY29weSxcbiAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSxcbiAgICAgIGkgPSAxLFxuICAgICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChvYmogPSBhcmd1bWVudHNbaV0pICE9PSBudWxsKSB7XG4gICAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICAgIGNvcHkgPSBvYmpbbmFtZV07XG5cbiAgICAgICAgaWYgKHRhcmdldCA9PT0gY29weSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGNvcHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRhcmdldFtuYW1lXSA9IGNvcHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gY2hlY2tTdG9yYWdlVmFsdWUgKHZhbHVlKSB7XG4gIHJldHVybiBbJ3RydWUnLCAnZmFsc2UnXS5pbmRleE9mKHZhbHVlKSA+PSAwID8gSlNPTi5wYXJzZSh2YWx1ZSkgOiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gc2V0TG9jYWxTdG9yYWdlKHN0b3JhZ2UsIGtleSwgdmFsdWUsIGFjY2Vzcykge1xuICBpZiAoYWNjZXNzKSB7XG4gICAgdHJ5IHsgc3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpOyB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gZ2V0U2xpZGVJZCgpIHtcbiAgdmFyIGlkID0gd2luZG93LnRuc0lkO1xuICB3aW5kb3cudG5zSWQgPSAhaWQgPyAxIDogaWQgKyAxO1xuICBcbiAgcmV0dXJuICd0bnMnICsgd2luZG93LnRuc0lkO1xufVxuXG5mdW5jdGlvbiBnZXRCb2R5ICgpIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgYm9keSA9IGRvYy5ib2R5O1xuXG4gIGlmICghYm9keSkge1xuICAgIGJvZHkgPSBkb2MuY3JlYXRlRWxlbWVudCgnYm9keScpO1xuICAgIGJvZHkuZmFrZSA9IHRydWU7XG4gIH1cblxuICByZXR1cm4gYm9keTtcbn1cblxudmFyIGRvY0VsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbmZ1bmN0aW9uIHNldEZha2VCb2R5IChib2R5KSB7XG4gIHZhciBkb2NPdmVyZmxvdyA9ICcnO1xuICBpZiAoYm9keS5mYWtlKSB7XG4gICAgZG9jT3ZlcmZsb3cgPSBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93O1xuICAgIC8vYXZvaWQgY3Jhc2hpbmcgSUU4LCBpZiBiYWNrZ3JvdW5kIGltYWdlIGlzIHVzZWRcbiAgICBib2R5LnN0eWxlLmJhY2tncm91bmQgPSAnJztcbiAgICAvL1NhZmFyaSA1LjEzLzUuMS40IE9TWCBzdG9wcyBsb2FkaW5nIGlmIDo6LXdlYmtpdC1zY3JvbGxiYXIgaXMgdXNlZCBhbmQgc2Nyb2xsYmFycyBhcmUgdmlzaWJsZVxuICAgIGJvZHkuc3R5bGUub3ZlcmZsb3cgPSBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgZG9jRWxlbWVudC5hcHBlbmRDaGlsZChib2R5KTtcbiAgfVxuXG4gIHJldHVybiBkb2NPdmVyZmxvdztcbn1cblxuZnVuY3Rpb24gcmVzZXRGYWtlQm9keSAoYm9keSwgZG9jT3ZlcmZsb3cpIHtcbiAgaWYgKGJvZHkuZmFrZSkge1xuICAgIGJvZHkucmVtb3ZlKCk7XG4gICAgZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IGRvY092ZXJmbG93O1xuICAgIC8vIFRyaWdnZXIgbGF5b3V0IHNvIGtpbmV0aWMgc2Nyb2xsaW5nIGlzbid0IGRpc2FibGVkIGluIGlPUzYrXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgZG9jRWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gIH1cbn1cblxuLy8gZ2V0IGNzcy1jYWxjIFxuXG5mdW5jdGlvbiBjYWxjKCkge1xuICB2YXIgZG9jID0gZG9jdW1lbnQsIFxuICAgICAgYm9keSA9IGdldEJvZHkoKSxcbiAgICAgIGRvY092ZXJmbG93ID0gc2V0RmFrZUJvZHkoYm9keSksXG4gICAgICBkaXYgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksIFxuICAgICAgcmVzdWx0ID0gZmFsc2U7XG5cbiAgYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICB0cnkge1xuICAgIHZhciBzdHIgPSAnKDEwcHggKiAxMCknLFxuICAgICAgICB2YWxzID0gWydjYWxjJyArIHN0ciwgJy1tb3otY2FsYycgKyBzdHIsICctd2Via2l0LWNhbGMnICsgc3RyXSxcbiAgICAgICAgdmFsO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICB2YWwgPSB2YWxzW2ldO1xuICAgICAgZGl2LnN0eWxlLndpZHRoID0gdmFsO1xuICAgICAgaWYgKGRpdi5vZmZzZXRXaWR0aCA9PT0gMTAwKSB7IFxuICAgICAgICByZXN1bHQgPSB2YWwucmVwbGFjZShzdHIsICcnKTsgXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge31cbiAgXG4gIGJvZHkuZmFrZSA/IHJlc2V0RmFrZUJvZHkoYm9keSwgZG9jT3ZlcmZsb3cpIDogZGl2LnJlbW92ZSgpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIGdldCBzdWJwaXhlbCBzdXBwb3J0IHZhbHVlXG5cbmZ1bmN0aW9uIHBlcmNlbnRhZ2VMYXlvdXQoKSB7XG4gIC8vIGNoZWNrIHN1YnBpeGVsIGxheW91dCBzdXBwb3J0aW5nXG4gIHZhciBkb2MgPSBkb2N1bWVudCxcbiAgICAgIGJvZHkgPSBnZXRCb2R5KCksXG4gICAgICBkb2NPdmVyZmxvdyA9IHNldEZha2VCb2R5KGJvZHkpLFxuICAgICAgd3JhcHBlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgIG91dGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgc3RyID0gJycsXG4gICAgICBjb3VudCA9IDcwLFxuICAgICAgcGVyUGFnZSA9IDMsXG4gICAgICBzdXBwb3J0ZWQgPSBmYWxzZTtcblxuICB3cmFwcGVyLmNsYXNzTmFtZSA9IFwidG5zLXQtc3VicDJcIjtcbiAgb3V0ZXIuY2xhc3NOYW1lID0gXCJ0bnMtdC1jdFwiO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIHN0ciArPSAnPGRpdj48L2Rpdj4nO1xuICB9XG5cbiAgb3V0ZXIuaW5uZXJIVE1MID0gc3RyO1xuICB3cmFwcGVyLmFwcGVuZENoaWxkKG91dGVyKTtcbiAgYm9keS5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblxuICBzdXBwb3J0ZWQgPSBNYXRoLmFicyh3cmFwcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSBvdXRlci5jaGlsZHJlbltjb3VudCAtIHBlclBhZ2VdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpIDwgMjtcblxuICBib2R5LmZha2UgPyByZXNldEZha2VCb2R5KGJvZHksIGRvY092ZXJmbG93KSA6IHdyYXBwZXIucmVtb3ZlKCk7XG5cbiAgcmV0dXJuIHN1cHBvcnRlZDtcbn1cblxuZnVuY3Rpb24gbWVkaWFxdWVyeVN1cHBvcnQgKCkge1xuICB2YXIgZG9jID0gZG9jdW1lbnQsXG4gICAgICBib2R5ID0gZ2V0Qm9keSgpLFxuICAgICAgZG9jT3ZlcmZsb3cgPSBzZXRGYWtlQm9keShib2R5KSxcbiAgICAgIGRpdiA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgIHN0eWxlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyksXG4gICAgICBydWxlID0gJ0BtZWRpYSBhbGwgYW5kIChtaW4td2lkdGg6MXB4KXsudG5zLW1xLXRlc3R7cG9zaXRpb246YWJzb2x1dGV9fScsXG4gICAgICBwb3NpdGlvbjtcblxuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgZGl2LmNsYXNzTmFtZSA9ICd0bnMtbXEtdGVzdCc7XG5cbiAgYm9keS5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIGJvZHkuYXBwZW5kQ2hpbGQoZGl2KTtcblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJ1bGU7XG4gIH0gZWxzZSB7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jLmNyZWF0ZVRleHROb2RlKHJ1bGUpKTtcbiAgfVxuXG4gIHBvc2l0aW9uID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkaXYpLnBvc2l0aW9uIDogZGl2LmN1cnJlbnRTdHlsZVsncG9zaXRpb24nXTtcblxuICBib2R5LmZha2UgPyByZXNldEZha2VCb2R5KGJvZHksIGRvY092ZXJmbG93KSA6IGRpdi5yZW1vdmUoKTtcblxuICByZXR1cm4gcG9zaXRpb24gPT09IFwiYWJzb2x1dGVcIjtcbn1cblxuLy8gY3JlYXRlIGFuZCBhcHBlbmQgc3R5bGUgc2hlZXRcbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlU2hlZXQgKG1lZGlhKSB7XG4gIC8vIENyZWF0ZSB0aGUgPHN0eWxlPiB0YWdcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAvLyBzdHlsZS5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dC9jc3NcIik7XG5cbiAgLy8gQWRkIGEgbWVkaWEgKGFuZC9vciBtZWRpYSBxdWVyeSkgaGVyZSBpZiB5b3UnZCBsaWtlIVxuICAvLyBzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBcInNjcmVlblwiKVxuICAvLyBzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBcIm9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoIDogMTAyNHB4KVwiKVxuICBpZiAobWVkaWEpIHsgc3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpOyB9XG5cbiAgLy8gV2ViS2l0IGhhY2sgOihcbiAgLy8gc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIikpO1xuXG4gIC8vIEFkZCB0aGUgPHN0eWxlPiBlbGVtZW50IHRvIHRoZSBwYWdlXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKS5hcHBlbmRDaGlsZChzdHlsZSk7XG5cbiAgcmV0dXJuIHN0eWxlLnNoZWV0ID8gc3R5bGUuc2hlZXQgOiBzdHlsZS5zdHlsZVNoZWV0O1xufVxuXG4vLyBjcm9zcyBicm93c2VycyBhZGRSdWxlIG1ldGhvZFxuZnVuY3Rpb24gYWRkQ1NTUnVsZShzaGVldCwgc2VsZWN0b3IsIHJ1bGVzLCBpbmRleCkge1xuICAvLyByZXR1cm4gcmFmKGZ1bmN0aW9uKCkge1xuICAgICdpbnNlcnRSdWxlJyBpbiBzaGVldCA/XG4gICAgICBzaGVldC5pbnNlcnRSdWxlKHNlbGVjdG9yICsgJ3snICsgcnVsZXMgKyAnfScsIGluZGV4KSA6XG4gICAgICBzaGVldC5hZGRSdWxlKHNlbGVjdG9yLCBydWxlcywgaW5kZXgpO1xuICAvLyB9KTtcbn1cblxuLy8gY3Jvc3MgYnJvd3NlcnMgYWRkUnVsZSBtZXRob2RcbmZ1bmN0aW9uIHJlbW92ZUNTU1J1bGUoc2hlZXQsIGluZGV4KSB7XG4gIC8vIHJldHVybiByYWYoZnVuY3Rpb24oKSB7XG4gICAgJ2RlbGV0ZVJ1bGUnIGluIHNoZWV0ID9cbiAgICAgIHNoZWV0LmRlbGV0ZVJ1bGUoaW5kZXgpIDpcbiAgICAgIHNoZWV0LnJlbW92ZVJ1bGUoaW5kZXgpO1xuICAvLyB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpIHtcbiAgdmFyIHJ1bGUgPSAoJ2luc2VydFJ1bGUnIGluIHNoZWV0KSA/IHNoZWV0LmNzc1J1bGVzIDogc2hlZXQucnVsZXM7XG4gIHJldHVybiBydWxlLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gdG9EZWdyZWUgKHksIHgpIHtcbiAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCkgKiAoMTgwIC8gTWF0aC5QSSk7XG59XG5cbmZ1bmN0aW9uIGdldFRvdWNoRGlyZWN0aW9uKGFuZ2xlLCByYW5nZSkge1xuICB2YXIgZGlyZWN0aW9uID0gZmFsc2UsXG4gICAgICBnYXAgPSBNYXRoLmFicyg5MCAtIE1hdGguYWJzKGFuZ2xlKSk7XG4gICAgICBcbiAgaWYgKGdhcCA+PSA5MCAtIHJhbmdlKSB7XG4gICAgZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xuICB9IGVsc2UgaWYgKGdhcCA8PSByYW5nZSkge1xuICAgIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gIH1cblxuICByZXR1cm4gZGlyZWN0aW9uO1xufVxuXG4vLyBodHRwczovL3RvZGRtb3R0by5jb20vZGl0Y2gtdGhlLWFycmF5LWZvcmVhY2gtY2FsbC1ub2RlbGlzdC1oYWNrL1xuZnVuY3Rpb24gZm9yRWFjaCAoYXJyLCBjYWxsYmFjaywgc2NvcGUpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY2FsbGJhY2suY2FsbChzY29wZSwgYXJyW2ldLCBpKTtcbiAgfVxufVxuXG52YXIgY2xhc3NMaXN0U3VwcG9ydCA9ICdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ18nKTtcblxudmFyIGhhc0NsYXNzID0gY2xhc3NMaXN0U3VwcG9ydCA/XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHsgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhzdHIpOyB9IDpcbiAgICBmdW5jdGlvbiAoZWwsIHN0cikgeyByZXR1cm4gZWwuY2xhc3NOYW1lLmluZGV4T2Yoc3RyKSA+PSAwOyB9O1xuXG52YXIgYWRkQ2xhc3MgPSBjbGFzc0xpc3RTdXBwb3J0ID9cbiAgICBmdW5jdGlvbiAoZWwsIHN0cikge1xuICAgICAgaWYgKCFoYXNDbGFzcyhlbCwgIHN0cikpIHsgZWwuY2xhc3NMaXN0LmFkZChzdHIpOyB9XG4gICAgfSA6XG4gICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcbiAgICAgIGlmICghaGFzQ2xhc3MoZWwsICBzdHIpKSB7IGVsLmNsYXNzTmFtZSArPSAnICcgKyBzdHI7IH1cbiAgICB9O1xuXG52YXIgcmVtb3ZlQ2xhc3MgPSBjbGFzc0xpc3RTdXBwb3J0ID9cbiAgICBmdW5jdGlvbiAoZWwsIHN0cikge1xuICAgICAgaWYgKGhhc0NsYXNzKGVsLCAgc3RyKSkgeyBlbC5jbGFzc0xpc3QucmVtb3ZlKHN0cik7IH1cbiAgICB9IDpcbiAgICBmdW5jdGlvbiAoZWwsIHN0cikge1xuICAgICAgaWYgKGhhc0NsYXNzKGVsLCBzdHIpKSB7IGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKHN0ciwgJycpOyB9XG4gICAgfTtcblxuZnVuY3Rpb24gaGFzQXR0cihlbCwgYXR0cikge1xuICByZXR1cm4gZWwuaGFzQXR0cmlidXRlKGF0dHIpO1xufVxuXG5mdW5jdGlvbiBnZXRBdHRyKGVsLCBhdHRyKSB7XG4gIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoYXR0cik7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZUxpc3QoZWwpIHtcbiAgLy8gT25seSBOb2RlTGlzdCBoYXMgdGhlIFwiaXRlbSgpXCIgZnVuY3Rpb25cbiAgcmV0dXJuIHR5cGVvZiBlbC5pdGVtICE9PSBcInVuZGVmaW5lZFwiOyBcbn1cblxuZnVuY3Rpb24gc2V0QXR0cnMoZWxzLCBhdHRycykge1xuICBlbHMgPSAoaXNOb2RlTGlzdChlbHMpIHx8IGVscyBpbnN0YW5jZW9mIEFycmF5KSA/IGVscyA6IFtlbHNdO1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGF0dHJzKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHsgcmV0dXJuOyB9XG5cbiAgZm9yICh2YXIgaSA9IGVscy5sZW5ndGg7IGktLTspIHtcbiAgICBmb3IodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgZWxzW2ldLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVBdHRycyhlbHMsIGF0dHJzKSB7XG4gIGVscyA9IChpc05vZGVMaXN0KGVscykgfHwgZWxzIGluc3RhbmNlb2YgQXJyYXkpID8gZWxzIDogW2Vsc107XG4gIGF0dHJzID0gKGF0dHJzIGluc3RhbmNlb2YgQXJyYXkpID8gYXR0cnMgOiBbYXR0cnNdO1xuXG4gIHZhciBhdHRyTGVuZ3RoID0gYXR0cnMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gZWxzLmxlbmd0aDsgaS0tOykge1xuICAgIGZvciAodmFyIGogPSBhdHRyTGVuZ3RoOyBqLS07KSB7XG4gICAgICBlbHNbaV0ucmVtb3ZlQXR0cmlidXRlKGF0dHJzW2pdKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYXJyYXlGcm9tTm9kZUxpc3QgKG5sKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBubC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBhcnIucHVzaChubFtpXSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZnVuY3Rpb24gaGlkZUVsZW1lbnQoZWwsIGZvcmNlSGlkZSkge1xuICBpZiAoZWwuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKSB7IGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7IH1cbn1cblxuZnVuY3Rpb24gc2hvd0VsZW1lbnQoZWwsIGZvcmNlSGlkZSkge1xuICBpZiAoZWwuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7IGVsLnN0eWxlLmRpc3BsYXkgPSAnJzsgfVxufVxuXG5mdW5jdGlvbiBpc1Zpc2libGUoZWwpIHtcbiAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5kaXNwbGF5ICE9PSAnbm9uZSc7XG59XG5cbmZ1bmN0aW9uIHdoaWNoUHJvcGVydHkocHJvcHMpe1xuICBpZiAodHlwZW9mIHByb3BzID09PSAnc3RyaW5nJykge1xuICAgIHZhciBhcnIgPSBbcHJvcHNdLFxuICAgICAgICBQcm9wcyA9IHByb3BzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcHMuc3Vic3RyKDEpLFxuICAgICAgICBwcmVmaXhlcyA9IFsnV2Via2l0JywgJ01veicsICdtcycsICdPJ107XG4gICAgICAgIFxuICAgIHByZWZpeGVzLmZvckVhY2goZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgICBpZiAocHJlZml4ICE9PSAnbXMnIHx8IHByb3BzID09PSAndHJhbnNmb3JtJykge1xuICAgICAgICBhcnIucHVzaChwcmVmaXggKyBQcm9wcyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBwcm9wcyA9IGFycjtcbiAgfVxuXG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zha2VlbGVtZW50JyksXG4gICAgICBsZW4gPSBwcm9wcy5sZW5ndGg7XG4gIGZvcih2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKyl7XG4gICAgdmFyIHByb3AgPSBwcm9wc1tpXTtcbiAgICBpZiggZWwuc3R5bGVbcHJvcF0gIT09IHVuZGVmaW5lZCApeyByZXR1cm4gcHJvcDsgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlOyAvLyBleHBsaWNpdCBmb3IgaWU5LVxufVxuXG5mdW5jdGlvbiBoYXMzRFRyYW5zZm9ybXModGYpe1xuICBpZiAoIXRmKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoIXdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7IHJldHVybiBmYWxzZTsgfVxuICBcbiAgdmFyIGRvYyA9IGRvY3VtZW50LFxuICAgICAgYm9keSA9IGdldEJvZHkoKSxcbiAgICAgIGRvY092ZXJmbG93ID0gc2V0RmFrZUJvZHkoYm9keSksXG4gICAgICBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KCdwJyksXG4gICAgICBoYXMzZCxcbiAgICAgIGNzc1RGID0gdGYubGVuZ3RoID4gOSA/ICctJyArIHRmLnNsaWNlKDAsIC05KS50b0xvd2VyQ2FzZSgpICsgJy0nIDogJyc7XG5cbiAgY3NzVEYgKz0gJ3RyYW5zZm9ybSc7XG5cbiAgLy8gQWRkIGl0IHRvIHRoZSBib2R5IHRvIGdldCB0aGUgY29tcHV0ZWQgc3R5bGVcbiAgYm9keS5pbnNlcnRCZWZvcmUoZWwsIG51bGwpO1xuXG4gIGVsLnN0eWxlW3RmXSA9ICd0cmFuc2xhdGUzZCgxcHgsMXB4LDFweCknO1xuICBoYXMzZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5nZXRQcm9wZXJ0eVZhbHVlKGNzc1RGKTtcblxuICBib2R5LmZha2UgPyByZXNldEZha2VCb2R5KGJvZHksIGRvY092ZXJmbG93KSA6IGVsLnJlbW92ZSgpO1xuXG4gIHJldHVybiAoaGFzM2QgIT09IHVuZGVmaW5lZCAmJiBoYXMzZC5sZW5ndGggPiAwICYmIGhhczNkICE9PSBcIm5vbmVcIik7XG59XG5cbi8vIGdldCB0cmFuc2l0aW9uZW5kLCBhbmltYXRpb25lbmQgYmFzZWQgb24gdHJhbnNpdGlvbkR1cmF0aW9uXG4vLyBAcHJvcGluOiBzdHJpbmdcbi8vIEBwcm9wT3V0OiBzdHJpbmcsIGZpcnN0LWxldHRlciB1cHBlcmNhc2Vcbi8vIFVzYWdlOiBnZXRFbmRQcm9wZXJ0eSgnV2Via2l0VHJhbnNpdGlvbkR1cmF0aW9uJywgJ1RyYW5zaXRpb24nKSA9PiB3ZWJraXRUcmFuc2l0aW9uRW5kXG5mdW5jdGlvbiBnZXRFbmRQcm9wZXJ0eShwcm9wSW4sIHByb3BPdXQpIHtcbiAgdmFyIGVuZFByb3AgPSBmYWxzZTtcbiAgaWYgKC9eV2Via2l0Ly50ZXN0KHByb3BJbikpIHtcbiAgICBlbmRQcm9wID0gJ3dlYmtpdCcgKyBwcm9wT3V0ICsgJ0VuZCc7XG4gIH0gZWxzZSBpZiAoL15PLy50ZXN0KHByb3BJbikpIHtcbiAgICBlbmRQcm9wID0gJ28nICsgcHJvcE91dCArICdFbmQnO1xuICB9IGVsc2UgaWYgKHByb3BJbikge1xuICAgIGVuZFByb3AgPSBwcm9wT3V0LnRvTG93ZXJDYXNlKCkgKyAnZW5kJztcbiAgfVxuICByZXR1cm4gZW5kUHJvcDtcbn1cblxuLy8gVGVzdCB2aWEgYSBnZXR0ZXIgaW4gdGhlIG9wdGlvbnMgb2JqZWN0IHRvIHNlZSBpZiB0aGUgcGFzc2l2ZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZFxudmFyIHN1cHBvcnRzUGFzc2l2ZSA9IGZhbHNlO1xudHJ5IHtcbiAgdmFyIG9wdHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICBzdXBwb3J0c1Bhc3NpdmUgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidGVzdFwiLCBudWxsLCBvcHRzKTtcbn0gY2F0Y2ggKGUpIHt9XG52YXIgcGFzc2l2ZU9wdGlvbiA9IHN1cHBvcnRzUGFzc2l2ZSA/IHsgcGFzc2l2ZTogdHJ1ZSB9IDogZmFsc2U7XG5cbmZ1bmN0aW9uIGFkZEV2ZW50cyhlbCwgb2JqLCBwcmV2ZW50U2Nyb2xsaW5nKSB7XG4gIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgdmFyIG9wdGlvbiA9IFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnXS5pbmRleE9mKHByb3ApID49IDAgJiYgIXByZXZlbnRTY3JvbGxpbmcgPyBwYXNzaXZlT3B0aW9uIDogZmFsc2U7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihwcm9wLCBvYmpbcHJvcF0sIG9wdGlvbik7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRzKGVsLCBvYmopIHtcbiAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICB2YXIgb3B0aW9uID0gWyd0b3VjaHN0YXJ0JywgJ3RvdWNobW92ZSddLmluZGV4T2YocHJvcCkgPj0gMCA/IHBhc3NpdmVPcHRpb24gOiBmYWxzZTtcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKHByb3AsIG9ialtwcm9wXSwgb3B0aW9uKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBFdmVudHMoKSB7XG4gIHJldHVybiB7XG4gICAgdG9waWNzOiB7fSxcbiAgICBvbjogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgIHRoaXMudG9waWNzW2V2ZW50TmFtZV0gPSB0aGlzLnRvcGljc1tldmVudE5hbWVdIHx8IFtdO1xuICAgICAgdGhpcy50b3BpY3NbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgICB9LFxuICAgIG9mZjogZnVuY3Rpb24oZXZlbnROYW1lLCBmbikge1xuICAgICAgaWYgKHRoaXMudG9waWNzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvcGljc1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHRoaXMudG9waWNzW2V2ZW50TmFtZV1baV0gPT09IGZuKSB7XG4gICAgICAgICAgICB0aGlzLnRvcGljc1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZW1pdDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgICAgZGF0YS50eXBlID0gZXZlbnROYW1lO1xuICAgICAgaWYgKHRoaXMudG9waWNzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgdGhpcy50b3BpY3NbZXZlbnROYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgICAgZm4oZGF0YSwgZXZlbnROYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBqc1RyYW5zZm9ybShlbGVtZW50LCBhdHRyLCBwcmVmaXgsIHBvc3RmaXgsIHRvLCBkdXJhdGlvbiwgY2FsbGJhY2spIHtcbiAgdmFyIHRpY2sgPSBNYXRoLm1pbihkdXJhdGlvbiwgMTApLFxuICAgICAgdW5pdCA9ICh0by5pbmRleE9mKCclJykgPj0gMCkgPyAnJScgOiAncHgnLFxuICAgICAgdG8gPSB0by5yZXBsYWNlKHVuaXQsICcnKSxcbiAgICAgIGZyb20gPSBOdW1iZXIoZWxlbWVudC5zdHlsZVthdHRyXS5yZXBsYWNlKHByZWZpeCwgJycpLnJlcGxhY2UocG9zdGZpeCwgJycpLnJlcGxhY2UodW5pdCwgJycpKSxcbiAgICAgIHBvc2l0aW9uVGljayA9ICh0byAtIGZyb20pIC8gZHVyYXRpb24gKiB0aWNrLFxuICAgICAgcnVubmluZztcblxuICBzZXRUaW1lb3V0KG1vdmVFbGVtZW50LCB0aWNrKTtcbiAgZnVuY3Rpb24gbW92ZUVsZW1lbnQoKSB7XG4gICAgZHVyYXRpb24gLT0gdGljaztcbiAgICBmcm9tICs9IHBvc2l0aW9uVGljaztcbiAgICBlbGVtZW50LnN0eWxlW2F0dHJdID0gcHJlZml4ICsgZnJvbSArIHVuaXQgKyBwb3N0Zml4O1xuICAgIGlmIChkdXJhdGlvbiA+IDApIHsgXG4gICAgICBzZXRUaW1lb3V0KG1vdmVFbGVtZW50LCB0aWNrKTsgXG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG59XG5cbnZhciB0bnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBleHRlbmQoe1xuICAgIGNvbnRhaW5lcjogJy5zbGlkZXInLFxuICAgIG1vZGU6ICdjYXJvdXNlbCcsXG4gICAgYXhpczogJ2hvcml6b250YWwnLFxuICAgIGl0ZW1zOiAxLFxuICAgIGd1dHRlcjogMCxcbiAgICBlZGdlUGFkZGluZzogMCxcbiAgICBmaXhlZFdpZHRoOiBmYWxzZSxcbiAgICBhdXRvV2lkdGg6IGZhbHNlLFxuICAgIHZpZXdwb3J0TWF4OiBmYWxzZSxcbiAgICBzbGlkZUJ5OiAxLFxuICAgIGNlbnRlcjogZmFsc2UsXG4gICAgY29udHJvbHM6IHRydWUsXG4gICAgY29udHJvbHNQb3NpdGlvbjogJ3RvcCcsXG4gICAgY29udHJvbHNUZXh0OiBbJ3ByZXYnLCAnbmV4dCddLFxuICAgIGNvbnRyb2xzQ29udGFpbmVyOiBmYWxzZSxcbiAgICBwcmV2QnV0dG9uOiBmYWxzZSxcbiAgICBuZXh0QnV0dG9uOiBmYWxzZSxcbiAgICBuYXY6IHRydWUsXG4gICAgbmF2UG9zaXRpb246ICd0b3AnLFxuICAgIG5hdkNvbnRhaW5lcjogZmFsc2UsXG4gICAgbmF2QXNUaHVtYm5haWxzOiBmYWxzZSxcbiAgICBhcnJvd0tleXM6IGZhbHNlLFxuICAgIHNwZWVkOiAzMDAsXG4gICAgYXV0b3BsYXk6IGZhbHNlLFxuICAgIGF1dG9wbGF5UG9zaXRpb246ICd0b3AnLFxuICAgIGF1dG9wbGF5VGltZW91dDogNTAwMCxcbiAgICBhdXRvcGxheURpcmVjdGlvbjogJ2ZvcndhcmQnLFxuICAgIGF1dG9wbGF5VGV4dDogWydzdGFydCcsICdzdG9wJ10sXG4gICAgYXV0b3BsYXlIb3ZlclBhdXNlOiBmYWxzZSxcbiAgICBhdXRvcGxheUJ1dHRvbjogZmFsc2UsXG4gICAgYXV0b3BsYXlCdXR0b25PdXRwdXQ6IHRydWUsXG4gICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eTogdHJ1ZSxcbiAgICBhbmltYXRlSW46ICd0bnMtZmFkZUluJyxcbiAgICBhbmltYXRlT3V0OiAndG5zLWZhZGVPdXQnLFxuICAgIGFuaW1hdGVOb3JtYWw6ICd0bnMtbm9ybWFsJyxcbiAgICBhbmltYXRlRGVsYXk6IGZhbHNlLFxuICAgIGxvb3A6IHRydWUsXG4gICAgcmV3aW5kOiBmYWxzZSxcbiAgICBhdXRvSGVpZ2h0OiBmYWxzZSxcbiAgICByZXNwb25zaXZlOiBmYWxzZSxcbiAgICBsYXp5bG9hZDogZmFsc2UsXG4gICAgbGF6eWxvYWRTZWxlY3RvcjogJy50bnMtbGF6eS1pbWcnLFxuICAgIHRvdWNoOiB0cnVlLFxuICAgIG1vdXNlRHJhZzogZmFsc2UsXG4gICAgc3dpcGVBbmdsZTogMTUsXG4gICAgbmVzdGVkOiBmYWxzZSxcbiAgICBwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmc6IGZhbHNlLFxuICAgIHByZXZlbnRTY3JvbGxPblRvdWNoOiBmYWxzZSxcbiAgICBmcmVlemFibGU6IHRydWUsXG4gICAgb25Jbml0OiBmYWxzZSxcbiAgICB1c2VMb2NhbFN0b3JhZ2U6IHRydWVcbiAgfSwgb3B0aW9ucyB8fCB7fSk7XG4gIFxuICB2YXIgZG9jID0gZG9jdW1lbnQsXG4gICAgICB3aW4gPSB3aW5kb3csXG4gICAgICBLRVlTID0ge1xuICAgICAgICBFTlRFUjogMTMsXG4gICAgICAgIFNQQUNFOiAzMixcbiAgICAgICAgTEVGVDogMzcsXG4gICAgICAgIFJJR0hUOiAzOVxuICAgICAgfSxcbiAgICAgIHRuc1N0b3JhZ2UgPSB7fSxcbiAgICAgIGxvY2FsU3RvcmFnZUFjY2VzcyA9IG9wdGlvbnMudXNlTG9jYWxTdG9yYWdlO1xuXG4gIGlmIChsb2NhbFN0b3JhZ2VBY2Nlc3MpIHtcbiAgICAvLyBjaGVjayBicm93c2VyIHZlcnNpb24gYW5kIGxvY2FsIHN0b3JhZ2UgYWNjZXNzXG4gICAgdmFyIGJyb3dzZXJJbmZvID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICB2YXIgdWlkID0gbmV3IERhdGU7XG5cbiAgICB0cnkge1xuICAgICAgdG5zU3RvcmFnZSA9IHdpbi5sb2NhbFN0b3JhZ2U7XG4gICAgICBpZiAodG5zU3RvcmFnZSkge1xuICAgICAgICB0bnNTdG9yYWdlLnNldEl0ZW0odWlkLCB1aWQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2VBY2Nlc3MgPSB0bnNTdG9yYWdlLmdldEl0ZW0odWlkKSA9PSB1aWQ7XG4gICAgICAgIHRuc1N0b3JhZ2UucmVtb3ZlSXRlbSh1aWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlQWNjZXNzID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIWxvY2FsU3RvcmFnZUFjY2VzcykgeyB0bnNTdG9yYWdlID0ge307IH1cbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGxvY2FsU3RvcmFnZUFjY2VzcyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChsb2NhbFN0b3JhZ2VBY2Nlc3MpIHtcbiAgICAgIC8vIHJlbW92ZSBzdG9yYWdlIHdoZW4gYnJvd3NlciB2ZXJzaW9uIGNoYW5nZXNcbiAgICAgIGlmICh0bnNTdG9yYWdlWyd0bnNBcHAnXSAmJiB0bnNTdG9yYWdlWyd0bnNBcHAnXSAhPT0gYnJvd3NlckluZm8pIHtcbiAgICAgICAgWyd0QycsICd0UEwnLCAndE1RJywgJ3RUZicsICd0M0QnLCAndFREdScsICd0VERlJywgJ3RBRHUnLCAndEFEZScsICd0VEUnLCAndEFFJ10uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IHRuc1N0b3JhZ2UucmVtb3ZlSXRlbShpdGVtKTsgfSk7XG4gICAgICB9XG4gICAgICAvLyB1cGRhdGUgYnJvd3NlckluZm9cbiAgICAgIGxvY2FsU3RvcmFnZVsndG5zQXBwJ10gPSBicm93c2VySW5mbztcbiAgICB9XG4gIH1cblxuICB2YXIgQ0FMQyA9IHRuc1N0b3JhZ2VbJ3RDJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0QyddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndEMnLCBjYWxjKCksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBQRVJDRU5UQUdFTEFZT1VUID0gdG5zU3RvcmFnZVsndFBMJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0UEwnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RQTCcsIHBlcmNlbnRhZ2VMYXlvdXQoKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIENTU01RID0gdG5zU3RvcmFnZVsndE1RJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0TVEnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RNUScsIG1lZGlhcXVlcnlTdXBwb3J0KCksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBUUkFOU0ZPUk0gPSB0bnNTdG9yYWdlWyd0VGYnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RUZiddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFRmJywgd2hpY2hQcm9wZXJ0eSgndHJhbnNmb3JtJyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBIQVMzRFRSQU5TRk9STVMgPSB0bnNTdG9yYWdlWyd0M0QnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3QzRCddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndDNEJywgaGFzM0RUcmFuc2Zvcm1zKFRSQU5TRk9STSksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBUUkFOU0lUSU9ORFVSQVRJT04gPSB0bnNTdG9yYWdlWyd0VER1J10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0VER1J10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0VER1Jywgd2hpY2hQcm9wZXJ0eSgndHJhbnNpdGlvbkR1cmF0aW9uJyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBUUkFOU0lUSU9OREVMQVkgPSB0bnNTdG9yYWdlWyd0VERlJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0VERlJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0VERlJywgd2hpY2hQcm9wZXJ0eSgndHJhbnNpdGlvbkRlbGF5JyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXG4gICAgICBBTklNQVRJT05EVVJBVElPTiA9IHRuc1N0b3JhZ2VbJ3RBRHUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RBRHUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RBRHUnLCB3aGljaFByb3BlcnR5KCdhbmltYXRpb25EdXJhdGlvbicpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgQU5JTUFUSU9OREVMQVkgPSB0bnNTdG9yYWdlWyd0QURlJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0QURlJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0QURlJywgd2hpY2hQcm9wZXJ0eSgnYW5pbWF0aW9uRGVsYXknKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcbiAgICAgIFRSQU5TSVRJT05FTkQgPSB0bnNTdG9yYWdlWyd0VEUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RURSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFRFJywgZ2V0RW5kUHJvcGVydHkoVFJBTlNJVElPTkRVUkFUSU9OLCAnVHJhbnNpdGlvbicpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxuICAgICAgQU5JTUFUSU9ORU5EID0gdG5zU3RvcmFnZVsndEFFJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0QUUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RBRScsIGdldEVuZFByb3BlcnR5KEFOSU1BVElPTkRVUkFUSU9OLCAnQW5pbWF0aW9uJyksIGxvY2FsU3RvcmFnZUFjY2Vzcyk7XG5cbiAgLy8gZ2V0IGVsZW1lbnQgbm9kZXMgZnJvbSBzZWxlY3RvcnNcbiAgdmFyIHN1cHBvcnRDb25zb2xlV2FybiA9IHdpbi5jb25zb2xlICYmIHR5cGVvZiB3aW4uY29uc29sZS53YXJuID09PSBcImZ1bmN0aW9uXCIsXG4gICAgICB0bnNMaXN0ID0gWydjb250YWluZXInLCAnY29udHJvbHNDb250YWluZXInLCAncHJldkJ1dHRvbicsICduZXh0QnV0dG9uJywgJ25hdkNvbnRhaW5lcicsICdhdXRvcGxheUJ1dHRvbiddLCBcbiAgICAgIG9wdGlvbnNFbGVtZW50cyA9IHt9O1xuICAgICAgXG4gIHRuc0xpc3QuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zW2l0ZW1dID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIHN0ciA9IG9wdGlvbnNbaXRlbV0sXG4gICAgICAgICAgZWwgPSBkb2MucXVlcnlTZWxlY3RvcihzdHIpO1xuICAgICAgb3B0aW9uc0VsZW1lbnRzW2l0ZW1dID0gc3RyO1xuXG4gICAgICBpZiAoZWwgJiYgZWwubm9kZU5hbWUpIHtcbiAgICAgICAgb3B0aW9uc1tpdGVtXSA9IGVsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHN1cHBvcnRDb25zb2xlV2FybikgeyBjb25zb2xlLndhcm4oJ0NhblxcJ3QgZmluZCcsIG9wdGlvbnNbaXRlbV0pOyB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIG1ha2Ugc3VyZSBhdCBsZWFzdCAxIHNsaWRlXG4gIGlmIChvcHRpb25zLmNvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPCAxKSB7XG4gICAgaWYgKHN1cHBvcnRDb25zb2xlV2FybikgeyBjb25zb2xlLndhcm4oJ05vIHNsaWRlcyBmb3VuZCBpbicsIG9wdGlvbnMuY29udGFpbmVyKTsgfVxuICAgIHJldHVybjtcbiAgIH1cblxuICAvLyB1cGRhdGUgb3B0aW9uc1xuICB2YXIgcmVzcG9uc2l2ZSA9IG9wdGlvbnMucmVzcG9uc2l2ZSxcbiAgICAgIG5lc3RlZCA9IG9wdGlvbnMubmVzdGVkLFxuICAgICAgY2Fyb3VzZWwgPSBvcHRpb25zLm1vZGUgPT09ICdjYXJvdXNlbCcgPyB0cnVlIDogZmFsc2U7XG5cbiAgaWYgKHJlc3BvbnNpdmUpIHtcbiAgICAvLyBhcHBseSByZXNwb25zaXZlWzBdIHRvIG9wdGlvbnMgYW5kIHJlbW92ZSBpdFxuICAgIGlmICgwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgIG9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywgcmVzcG9uc2l2ZVswXSk7XG4gICAgICBkZWxldGUgcmVzcG9uc2l2ZVswXTtcbiAgICB9XG5cbiAgICB2YXIgcmVzcG9uc2l2ZVRlbSA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiByZXNwb25zaXZlKSB7XG4gICAgICB2YXIgdmFsID0gcmVzcG9uc2l2ZVtrZXldO1xuICAgICAgLy8gdXBkYXRlIHJlc3BvbnNpdmVcbiAgICAgIC8vIGZyb206IDMwMDogMlxuICAgICAgLy8gdG86IFxuICAgICAgLy8gICAzMDA6IHsgXG4gICAgICAvLyAgICAgaXRlbXM6IDIgXG4gICAgICAvLyAgIH0gXG4gICAgICB2YWwgPSB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyA/IHtpdGVtczogdmFsfSA6IHZhbDtcbiAgICAgIHJlc3BvbnNpdmVUZW1ba2V5XSA9IHZhbDtcbiAgICB9XG4gICAgcmVzcG9uc2l2ZSA9IHJlc3BvbnNpdmVUZW07XG4gICAgcmVzcG9uc2l2ZVRlbSA9IG51bGw7XG4gIH1cblxuICAvLyB1cGRhdGUgb3B0aW9uc1xuICBmdW5jdGlvbiB1cGRhdGVPcHRpb25zIChvYmopIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIWNhcm91c2VsKSB7XG4gICAgICAgIGlmIChrZXkgPT09ICdzbGlkZUJ5JykgeyBvYmpba2V5XSA9ICdwYWdlJzsgfVxuICAgICAgICBpZiAoa2V5ID09PSAnZWRnZVBhZGRpbmcnKSB7IG9ialtrZXldID0gZmFsc2U7IH1cbiAgICAgICAgaWYgKGtleSA9PT0gJ2F1dG9IZWlnaHQnKSB7IG9ialtrZXldID0gZmFsc2U7IH1cbiAgICAgIH1cblxuICAgICAgLy8gdXBkYXRlIHJlc3BvbnNpdmUgb3B0aW9uc1xuICAgICAgaWYgKGtleSA9PT0gJ3Jlc3BvbnNpdmUnKSB7IHVwZGF0ZU9wdGlvbnMob2JqW2tleV0pOyB9XG4gICAgfVxuICB9XG4gIGlmICghY2Fyb3VzZWwpIHsgdXBkYXRlT3B0aW9ucyhvcHRpb25zKTsgfVxuXG5cbiAgLy8gPT09IGRlZmluZSBhbmQgc2V0IHZhcmlhYmxlcyA9PT1cbiAgaWYgKCFjYXJvdXNlbCkge1xuICAgIG9wdGlvbnMuYXhpcyA9ICdob3Jpem9udGFsJztcbiAgICBvcHRpb25zLnNsaWRlQnkgPSAncGFnZSc7XG4gICAgb3B0aW9ucy5lZGdlUGFkZGluZyA9IGZhbHNlO1xuXG4gICAgdmFyIGFuaW1hdGVJbiA9IG9wdGlvbnMuYW5pbWF0ZUluLFxuICAgICAgICBhbmltYXRlT3V0ID0gb3B0aW9ucy5hbmltYXRlT3V0LFxuICAgICAgICBhbmltYXRlRGVsYXkgPSBvcHRpb25zLmFuaW1hdGVEZWxheSxcbiAgICAgICAgYW5pbWF0ZU5vcm1hbCA9IG9wdGlvbnMuYW5pbWF0ZU5vcm1hbDtcbiAgfVxuXG4gIHZhciBob3Jpem9udGFsID0gb3B0aW9ucy5heGlzID09PSAnaG9yaXpvbnRhbCcgPyB0cnVlIDogZmFsc2UsXG4gICAgICBvdXRlcldyYXBwZXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBpbm5lcldyYXBwZXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBtaWRkbGVXcmFwcGVyLFxuICAgICAgY29udGFpbmVyID0gb3B0aW9ucy5jb250YWluZXIsXG4gICAgICBjb250YWluZXJQYXJlbnQgPSBjb250YWluZXIucGFyZW50Tm9kZSxcbiAgICAgIGNvbnRhaW5lckhUTUwgPSBjb250YWluZXIub3V0ZXJIVE1MLFxuICAgICAgc2xpZGVJdGVtcyA9IGNvbnRhaW5lci5jaGlsZHJlbixcbiAgICAgIHNsaWRlQ291bnQgPSBzbGlkZUl0ZW1zLmxlbmd0aCxcbiAgICAgIGJyZWFrcG9pbnRab25lLFxuICAgICAgd2luZG93V2lkdGggPSBnZXRXaW5kb3dXaWR0aCgpLFxuICAgICAgaXNPbiA9IGZhbHNlO1xuICBpZiAocmVzcG9uc2l2ZSkgeyBzZXRCcmVha3BvaW50Wm9uZSgpOyB9XG4gIGlmIChjYXJvdXNlbCkgeyBjb250YWluZXIuY2xhc3NOYW1lICs9ICcgdG5zLXZwZml4JzsgfVxuXG4gIC8vIGZpeGVkV2lkdGg6IHZpZXdwb3J0ID4gcmlnaHRCb3VuZGFyeSA+IGluZGV4TWF4XG4gIHZhciBhdXRvV2lkdGggPSBvcHRpb25zLmF1dG9XaWR0aCxcbiAgICAgIGZpeGVkV2lkdGggPSBnZXRPcHRpb24oJ2ZpeGVkV2lkdGgnKSxcbiAgICAgIGVkZ2VQYWRkaW5nID0gZ2V0T3B0aW9uKCdlZGdlUGFkZGluZycpLFxuICAgICAgZ3V0dGVyID0gZ2V0T3B0aW9uKCdndXR0ZXInKSxcbiAgICAgIHZpZXdwb3J0ID0gZ2V0Vmlld3BvcnRXaWR0aCgpLFxuICAgICAgY2VudGVyID0gZ2V0T3B0aW9uKCdjZW50ZXInKSxcbiAgICAgIGl0ZW1zID0gIWF1dG9XaWR0aCA/IE1hdGguZmxvb3IoZ2V0T3B0aW9uKCdpdGVtcycpKSA6IDEsXG4gICAgICBzbGlkZUJ5ID0gZ2V0T3B0aW9uKCdzbGlkZUJ5JyksXG4gICAgICB2aWV3cG9ydE1heCA9IG9wdGlvbnMudmlld3BvcnRNYXggfHwgb3B0aW9ucy5maXhlZFdpZHRoVmlld3BvcnRXaWR0aCxcbiAgICAgIGFycm93S2V5cyA9IGdldE9wdGlvbignYXJyb3dLZXlzJyksXG4gICAgICBzcGVlZCA9IGdldE9wdGlvbignc3BlZWQnKSxcbiAgICAgIHJld2luZCA9IG9wdGlvbnMucmV3aW5kLFxuICAgICAgbG9vcCA9IHJld2luZCA/IGZhbHNlIDogb3B0aW9ucy5sb29wLFxuICAgICAgYXV0b0hlaWdodCA9IGdldE9wdGlvbignYXV0b0hlaWdodCcpLFxuICAgICAgY29udHJvbHMgPSBnZXRPcHRpb24oJ2NvbnRyb2xzJyksXG4gICAgICBjb250cm9sc1RleHQgPSBnZXRPcHRpb24oJ2NvbnRyb2xzVGV4dCcpLFxuICAgICAgbmF2ID0gZ2V0T3B0aW9uKCduYXYnKSxcbiAgICAgIHRvdWNoID0gZ2V0T3B0aW9uKCd0b3VjaCcpLFxuICAgICAgbW91c2VEcmFnID0gZ2V0T3B0aW9uKCdtb3VzZURyYWcnKSxcbiAgICAgIGF1dG9wbGF5ID0gZ2V0T3B0aW9uKCdhdXRvcGxheScpLFxuICAgICAgYXV0b3BsYXlUaW1lb3V0ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVRpbWVvdXQnKSxcbiAgICAgIGF1dG9wbGF5VGV4dCA9IGdldE9wdGlvbignYXV0b3BsYXlUZXh0JyksXG4gICAgICBhdXRvcGxheUhvdmVyUGF1c2UgPSBnZXRPcHRpb24oJ2F1dG9wbGF5SG92ZXJQYXVzZScpLFxuICAgICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGdldE9wdGlvbignYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eScpLFxuICAgICAgc2hlZXQgPSBjcmVhdGVTdHlsZVNoZWV0KCksXG4gICAgICBsYXp5bG9hZCA9IG9wdGlvbnMubGF6eWxvYWQsXG4gICAgICBsYXp5bG9hZFNlbGVjdG9yID0gb3B0aW9ucy5sYXp5bG9hZFNlbGVjdG9yLFxuICAgICAgc2xpZGVQb3NpdGlvbnMsIC8vIGNvbGxlY3Rpb24gb2Ygc2xpZGUgcG9zaXRpb25zXG4gICAgICBzbGlkZUl0ZW1zT3V0ID0gW10sXG4gICAgICBjbG9uZUNvdW50ID0gbG9vcCA/IGdldENsb25lQ291bnRGb3JMb29wKCkgOiAwLFxuICAgICAgc2xpZGVDb3VudE5ldyA9ICFjYXJvdXNlbCA/IHNsaWRlQ291bnQgKyBjbG9uZUNvdW50IDogc2xpZGVDb3VudCArIGNsb25lQ291bnQgKiAyLFxuICAgICAgaGFzUmlnaHREZWFkWm9uZSA9IChmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCkgJiYgIWxvb3AgPyB0cnVlIDogZmFsc2UsXG4gICAgICByaWdodEJvdW5kYXJ5ID0gZml4ZWRXaWR0aCA/IGdldFJpZ2h0Qm91bmRhcnkoKSA6IG51bGwsXG4gICAgICB1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSA9ICghY2Fyb3VzZWwgfHwgIWxvb3ApID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgLy8gdHJhbnNmb3JtXG4gICAgICB0cmFuc2Zvcm1BdHRyID0gaG9yaXpvbnRhbCA/ICdsZWZ0JyA6ICd0b3AnLFxuICAgICAgdHJhbnNmb3JtUHJlZml4ID0gJycsXG4gICAgICB0cmFuc2Zvcm1Qb3N0Zml4ID0gJycsXG4gICAgICAvLyBpbmRleFxuICAgICAgZ2V0SW5kZXhNYXggPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZml4ZWRXaWR0aCkge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHsgcmV0dXJuIGNlbnRlciAmJiAhbG9vcCA/IHNsaWRlQ291bnQgLSAxIDogTWF0aC5jZWlsKC0gcmlnaHRCb3VuZGFyeSAvIChmaXhlZFdpZHRoICsgZ3V0dGVyKSk7IH07XG4gICAgICAgIH0gZWxzZSBpZiAoYXV0b1dpZHRoKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHNsaWRlQ291bnROZXc7IGktLTspIHtcbiAgICAgICAgICAgICAgaWYgKHNsaWRlUG9zaXRpb25zW2ldID49IC0gcmlnaHRCb3VuZGFyeSkgeyByZXR1cm4gaTsgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNlbnRlciAmJiBjYXJvdXNlbCAmJiAhbG9vcCkge1xuICAgICAgICAgICAgICByZXR1cm4gc2xpZGVDb3VudCAtIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gbG9vcCB8fCBjYXJvdXNlbCA/IE1hdGgubWF4KDAsIHNsaWRlQ291bnROZXcgLSBNYXRoLmNlaWwoaXRlbXMpKSA6IHNsaWRlQ291bnROZXcgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pKCksXG4gICAgICBpbmRleCA9IGdldFN0YXJ0SW5kZXgoZ2V0T3B0aW9uKCdzdGFydEluZGV4JykpLFxuICAgICAgaW5kZXhDYWNoZWQgPSBpbmRleCxcbiAgICAgIGRpc3BsYXlJbmRleCA9IGdldEN1cnJlbnRTbGlkZSgpLFxuICAgICAgaW5kZXhNaW4gPSAwLFxuICAgICAgaW5kZXhNYXggPSAhYXV0b1dpZHRoID8gZ2V0SW5kZXhNYXgoKSA6IG51bGwsXG4gICAgICAvLyByZXNpemVcbiAgICAgIHJlc2l6ZVRpbWVyLFxuICAgICAgcHJldmVudEFjdGlvbldoZW5SdW5uaW5nID0gb3B0aW9ucy5wcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcsXG4gICAgICBzd2lwZUFuZ2xlID0gb3B0aW9ucy5zd2lwZUFuZ2xlLFxuICAgICAgbW92ZURpcmVjdGlvbkV4cGVjdGVkID0gc3dpcGVBbmdsZSA/ICc/JyA6IHRydWUsXG4gICAgICBydW5uaW5nID0gZmFsc2UsXG4gICAgICBvbkluaXQgPSBvcHRpb25zLm9uSW5pdCxcbiAgICAgIGV2ZW50cyA9IG5ldyBFdmVudHMoKSxcbiAgICAgIC8vIGlkLCBjbGFzc1xuICAgICAgbmV3Q29udGFpbmVyQ2xhc3NlcyA9ICcgdG5zLXNsaWRlciB0bnMtJyArIG9wdGlvbnMubW9kZSxcbiAgICAgIHNsaWRlSWQgPSBjb250YWluZXIuaWQgfHwgZ2V0U2xpZGVJZCgpLFxuICAgICAgZGlzYWJsZSA9IGdldE9wdGlvbignZGlzYWJsZScpLFxuICAgICAgZGlzYWJsZWQgPSBmYWxzZSxcbiAgICAgIGZyZWV6YWJsZSA9IG9wdGlvbnMuZnJlZXphYmxlLFxuICAgICAgZnJlZXplID0gZnJlZXphYmxlICYmICFhdXRvV2lkdGggPyBnZXRGcmVlemUoKSA6IGZhbHNlLFxuICAgICAgZnJvemVuID0gZmFsc2UsXG4gICAgICBjb250cm9sc0V2ZW50cyA9IHtcbiAgICAgICAgJ2NsaWNrJzogb25Db250cm9sc0NsaWNrLFxuICAgICAgICAna2V5ZG93bic6IG9uQ29udHJvbHNLZXlkb3duXG4gICAgICB9LFxuICAgICAgbmF2RXZlbnRzID0ge1xuICAgICAgICAnY2xpY2snOiBvbk5hdkNsaWNrLFxuICAgICAgICAna2V5ZG93bic6IG9uTmF2S2V5ZG93blxuICAgICAgfSxcbiAgICAgIGhvdmVyRXZlbnRzID0ge1xuICAgICAgICAnbW91c2VvdmVyJzogbW91c2VvdmVyUGF1c2UsXG4gICAgICAgICdtb3VzZW91dCc6IG1vdXNlb3V0UmVzdGFydFxuICAgICAgfSxcbiAgICAgIHZpc2liaWxpdHlFdmVudCA9IHsndmlzaWJpbGl0eWNoYW5nZSc6IG9uVmlzaWJpbGl0eUNoYW5nZX0sXG4gICAgICBkb2NtZW50S2V5ZG93bkV2ZW50ID0geydrZXlkb3duJzogb25Eb2N1bWVudEtleWRvd259LFxuICAgICAgdG91Y2hFdmVudHMgPSB7XG4gICAgICAgICd0b3VjaHN0YXJ0Jzogb25QYW5TdGFydCxcbiAgICAgICAgJ3RvdWNobW92ZSc6IG9uUGFuTW92ZSxcbiAgICAgICAgJ3RvdWNoZW5kJzogb25QYW5FbmQsXG4gICAgICAgICd0b3VjaGNhbmNlbCc6IG9uUGFuRW5kXG4gICAgICB9LCBkcmFnRXZlbnRzID0ge1xuICAgICAgICAnbW91c2Vkb3duJzogb25QYW5TdGFydCxcbiAgICAgICAgJ21vdXNlbW92ZSc6IG9uUGFuTW92ZSxcbiAgICAgICAgJ21vdXNldXAnOiBvblBhbkVuZCxcbiAgICAgICAgJ21vdXNlbGVhdmUnOiBvblBhbkVuZFxuICAgICAgfSxcbiAgICAgIGhhc0NvbnRyb2xzID0gaGFzT3B0aW9uKCdjb250cm9scycpLFxuICAgICAgaGFzTmF2ID0gaGFzT3B0aW9uKCduYXYnKSxcbiAgICAgIG5hdkFzVGh1bWJuYWlscyA9IGF1dG9XaWR0aCA/IHRydWUgOiBvcHRpb25zLm5hdkFzVGh1bWJuYWlscyxcbiAgICAgIGhhc0F1dG9wbGF5ID0gaGFzT3B0aW9uKCdhdXRvcGxheScpLFxuICAgICAgaGFzVG91Y2ggPSBoYXNPcHRpb24oJ3RvdWNoJyksXG4gICAgICBoYXNNb3VzZURyYWcgPSBoYXNPcHRpb24oJ21vdXNlRHJhZycpLFxuICAgICAgc2xpZGVBY3RpdmVDbGFzcyA9ICd0bnMtc2xpZGUtYWN0aXZlJyxcbiAgICAgIGltZ0NvbXBsZXRlQ2xhc3MgPSAndG5zLWNvbXBsZXRlJyxcbiAgICAgIGltZ0V2ZW50cyA9IHtcbiAgICAgICAgJ2xvYWQnOiBvbkltZ0xvYWRlZCxcbiAgICAgICAgJ2Vycm9yJzogb25JbWdGYWlsZWRcbiAgICAgIH0sXG4gICAgICBpbWdzQ29tcGxldGUsXG4gICAgICBsaXZlcmVnaW9uQ3VycmVudCxcbiAgICAgIHByZXZlbnRTY3JvbGwgPSBvcHRpb25zLnByZXZlbnRTY3JvbGxPblRvdWNoID09PSAnZm9yY2UnID8gdHJ1ZSA6IGZhbHNlO1xuXG4gIC8vIGNvbnRyb2xzXG4gIGlmIChoYXNDb250cm9scykge1xuICAgIHZhciBjb250cm9sc0NvbnRhaW5lciA9IG9wdGlvbnMuY29udHJvbHNDb250YWluZXIsXG4gICAgICAgIGNvbnRyb2xzQ29udGFpbmVySFRNTCA9IG9wdGlvbnMuY29udHJvbHNDb250YWluZXIgPyBvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyLm91dGVySFRNTCA6ICcnLFxuICAgICAgICBwcmV2QnV0dG9uID0gb3B0aW9ucy5wcmV2QnV0dG9uLFxuICAgICAgICBuZXh0QnV0dG9uID0gb3B0aW9ucy5uZXh0QnV0dG9uLFxuICAgICAgICBwcmV2QnV0dG9uSFRNTCA9IG9wdGlvbnMucHJldkJ1dHRvbiA/IG9wdGlvbnMucHJldkJ1dHRvbi5vdXRlckhUTUwgOiAnJyxcbiAgICAgICAgbmV4dEJ1dHRvbkhUTUwgPSBvcHRpb25zLm5leHRCdXR0b24gPyBvcHRpb25zLm5leHRCdXR0b24ub3V0ZXJIVE1MIDogJycsXG4gICAgICAgIHByZXZJc0J1dHRvbixcbiAgICAgICAgbmV4dElzQnV0dG9uO1xuICB9XG5cbiAgLy8gbmF2XG4gIGlmIChoYXNOYXYpIHtcbiAgICB2YXIgbmF2Q29udGFpbmVyID0gb3B0aW9ucy5uYXZDb250YWluZXIsXG4gICAgICAgIG5hdkNvbnRhaW5lckhUTUwgPSBvcHRpb25zLm5hdkNvbnRhaW5lciA/IG9wdGlvbnMubmF2Q29udGFpbmVyLm91dGVySFRNTCA6ICcnLFxuICAgICAgICBuYXZJdGVtcyxcbiAgICAgICAgcGFnZXMgPSBhdXRvV2lkdGggPyBzbGlkZUNvdW50IDogZ2V0UGFnZXMoKSxcbiAgICAgICAgcGFnZXNDYWNoZWQgPSAwLFxuICAgICAgICBuYXZDbGlja2VkID0gLTEsXG4gICAgICAgIG5hdkN1cnJlbnRJbmRleCA9IGdldEN1cnJlbnROYXZJbmRleCgpLFxuICAgICAgICBuYXZDdXJyZW50SW5kZXhDYWNoZWQgPSBuYXZDdXJyZW50SW5kZXgsXG4gICAgICAgIG5hdkFjdGl2ZUNsYXNzID0gJ3Rucy1uYXYtYWN0aXZlJyxcbiAgICAgICAgbmF2U3RyID0gJ0Nhcm91c2VsIFBhZ2UgJyxcbiAgICAgICAgbmF2U3RyQ3VycmVudCA9ICcgKEN1cnJlbnQgU2xpZGUpJztcbiAgfVxuXG4gIC8vIGF1dG9wbGF5XG4gIGlmIChoYXNBdXRvcGxheSkge1xuICAgIHZhciBhdXRvcGxheURpcmVjdGlvbiA9IG9wdGlvbnMuYXV0b3BsYXlEaXJlY3Rpb24gPT09ICdmb3J3YXJkJyA/IDEgOiAtMSxcbiAgICAgICAgYXV0b3BsYXlCdXR0b24gPSBvcHRpb25zLmF1dG9wbGF5QnV0dG9uLFxuICAgICAgICBhdXRvcGxheUJ1dHRvbkhUTUwgPSBvcHRpb25zLmF1dG9wbGF5QnV0dG9uID8gb3B0aW9ucy5hdXRvcGxheUJ1dHRvbi5vdXRlckhUTUwgOiAnJyxcbiAgICAgICAgYXV0b3BsYXlIdG1sU3RyaW5ncyA9IFsnPHNwYW4gY2xhc3M9XFwndG5zLXZpc3VhbGx5LWhpZGRlblxcJz4nLCAnIGFuaW1hdGlvbjwvc3Bhbj4nXSxcbiAgICAgICAgYXV0b3BsYXlUaW1lcixcbiAgICAgICAgYW5pbWF0aW5nLFxuICAgICAgICBhdXRvcGxheUhvdmVyUGF1c2VkLFxuICAgICAgICBhdXRvcGxheVVzZXJQYXVzZWQsXG4gICAgICAgIGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZDtcbiAgfVxuXG4gIGlmIChoYXNUb3VjaCB8fCBoYXNNb3VzZURyYWcpIHtcbiAgICB2YXIgaW5pdFBvc2l0aW9uID0ge30sXG4gICAgICAgIGxhc3RQb3NpdGlvbiA9IHt9LFxuICAgICAgICB0cmFuc2xhdGVJbml0LFxuICAgICAgICBkaXNYLFxuICAgICAgICBkaXNZLFxuICAgICAgICBwYW5TdGFydCA9IGZhbHNlLFxuICAgICAgICByYWZJbmRleCxcbiAgICAgICAgZ2V0RGlzdCA9IGhvcml6b250YWwgPyBcbiAgICAgICAgICBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhLnggLSBiLng7IH0gOlxuICAgICAgICAgIGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEueSAtIGIueTsgfTtcbiAgfVxuICBcbiAgLy8gZGlzYWJsZSBzbGlkZXIgd2hlbiBzbGlkZWNvdW50IDw9IGl0ZW1zXG4gIGlmICghYXV0b1dpZHRoKSB7IHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlIHx8IGZyZWV6ZSk7IH1cblxuICBpZiAoVFJBTlNGT1JNKSB7XG4gICAgdHJhbnNmb3JtQXR0ciA9IFRSQU5TRk9STTtcbiAgICB0cmFuc2Zvcm1QcmVmaXggPSAndHJhbnNsYXRlJztcblxuICAgIGlmIChIQVMzRFRSQU5TRk9STVMpIHtcbiAgICAgIHRyYW5zZm9ybVByZWZpeCArPSBob3Jpem9udGFsID8gJzNkKCcgOiAnM2QoMHB4LCAnO1xuICAgICAgdHJhbnNmb3JtUG9zdGZpeCA9IGhvcml6b250YWwgPyAnLCAwcHgsIDBweCknIDogJywgMHB4KSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYW5zZm9ybVByZWZpeCArPSBob3Jpem9udGFsID8gJ1goJyA6ICdZKCc7XG4gICAgICB0cmFuc2Zvcm1Qb3N0Zml4ID0gJyknO1xuICAgIH1cblxuICB9XG5cbiAgaWYgKGNhcm91c2VsKSB7IGNvbnRhaW5lci5jbGFzc05hbWUgPSBjb250YWluZXIuY2xhc3NOYW1lLnJlcGxhY2UoJ3Rucy12cGZpeCcsICcnKTsgfVxuICBpbml0U3RydWN0dXJlKCk7XG4gIGluaXRTaGVldCgpO1xuICBpbml0U2xpZGVyVHJhbnNmb3JtKCk7XG5cbiAgLy8gPT09IENPTU1PTiBGVU5DVElPTlMgPT09IC8vXG4gIGZ1bmN0aW9uIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZSAoY29uZGl0aW9uKSB7XG4gICAgaWYgKGNvbmRpdGlvbikge1xuICAgICAgY29udHJvbHMgPSBuYXYgPSB0b3VjaCA9IG1vdXNlRHJhZyA9IGFycm93S2V5cyA9IGF1dG9wbGF5ID0gYXV0b3BsYXlIb3ZlclBhdXNlID0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEN1cnJlbnRTbGlkZSAoKSB7XG4gICAgdmFyIHRlbSA9IGNhcm91c2VsID8gaW5kZXggLSBjbG9uZUNvdW50IDogaW5kZXg7XG4gICAgd2hpbGUgKHRlbSA8IDApIHsgdGVtICs9IHNsaWRlQ291bnQ7IH1cbiAgICByZXR1cm4gdGVtJXNsaWRlQ291bnQgKyAxO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U3RhcnRJbmRleCAoaW5kKSB7XG4gICAgaW5kID0gaW5kID8gTWF0aC5tYXgoMCwgTWF0aC5taW4obG9vcCA/IHNsaWRlQ291bnQgLSAxIDogc2xpZGVDb3VudCAtIGl0ZW1zLCBpbmQpKSA6IDA7XG4gICAgcmV0dXJuIGNhcm91c2VsID8gaW5kICsgY2xvbmVDb3VudCA6IGluZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFic0luZGV4IChpKSB7XG4gICAgaWYgKGkgPT0gbnVsbCkgeyBpID0gaW5kZXg7IH1cblxuICAgIGlmIChjYXJvdXNlbCkgeyBpIC09IGNsb25lQ291bnQ7IH1cbiAgICB3aGlsZSAoaSA8IDApIHsgaSArPSBzbGlkZUNvdW50OyB9XG5cbiAgICByZXR1cm4gTWF0aC5mbG9vcihpJXNsaWRlQ291bnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3VycmVudE5hdkluZGV4ICgpIHtcbiAgICB2YXIgYWJzSW5kZXggPSBnZXRBYnNJbmRleCgpLFxuICAgICAgICByZXN1bHQ7XG5cbiAgICByZXN1bHQgPSBuYXZBc1RodW1ibmFpbHMgPyBhYnNJbmRleCA6IFxuICAgICAgZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGggPyBNYXRoLmNlaWwoKGFic0luZGV4ICsgMSkgKiBwYWdlcyAvIHNsaWRlQ291bnQgLSAxKSA6IFxuICAgICAgICAgIE1hdGguZmxvb3IoYWJzSW5kZXggLyBpdGVtcyk7XG5cbiAgICAvLyBzZXQgYWN0aXZlIG5hdiB0byB0aGUgbGFzdCBvbmUgd2hlbiByZWFjaGVzIHRoZSByaWdodCBlZGdlXG4gICAgaWYgKCFsb29wICYmIGNhcm91c2VsICYmIGluZGV4ID09PSBpbmRleE1heCkgeyByZXN1bHQgPSBwYWdlcyAtIDE7IH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJdGVtc01heCAoKSB7XG4gICAgLy8gZml4ZWRXaWR0aCBvciBhdXRvV2lkdGggd2hpbGUgdmlld3BvcnRNYXggaXMgbm90IGF2YWlsYWJsZVxuICAgIGlmIChhdXRvV2lkdGggfHwgKGZpeGVkV2lkdGggJiYgIXZpZXdwb3J0TWF4KSkge1xuICAgICAgcmV0dXJuIHNsaWRlQ291bnQgLSAxO1xuICAgIC8vIG1vc3QgY2FzZXNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN0ciA9IGZpeGVkV2lkdGggPyAnZml4ZWRXaWR0aCcgOiAnaXRlbXMnLFxuICAgICAgICAgIGFyciA9IFtdO1xuXG4gICAgICBpZiAoZml4ZWRXaWR0aCB8fCBvcHRpb25zW3N0cl0gPCBzbGlkZUNvdW50KSB7IGFyci5wdXNoKG9wdGlvbnNbc3RyXSk7IH1cblxuICAgICAgaWYgKHJlc3BvbnNpdmUpIHtcbiAgICAgICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xuICAgICAgICAgIHZhciB0ZW0gPSByZXNwb25zaXZlW2JwXVtzdHJdO1xuICAgICAgICAgIGlmICh0ZW0gJiYgKGZpeGVkV2lkdGggfHwgdGVtIDwgc2xpZGVDb3VudCkpIHsgYXJyLnB1c2godGVtKTsgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghYXJyLmxlbmd0aCkgeyBhcnIucHVzaCgwKTsgfVxuXG4gICAgICByZXR1cm4gTWF0aC5jZWlsKGZpeGVkV2lkdGggPyB2aWV3cG9ydE1heCAvIE1hdGgubWluLmFwcGx5KG51bGwsIGFycikgOiBNYXRoLm1heC5hcHBseShudWxsLCBhcnIpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDbG9uZUNvdW50Rm9yTG9vcCAoKSB7XG4gICAgdmFyIGl0ZW1zTWF4ID0gZ2V0SXRlbXNNYXgoKSxcbiAgICAgICAgcmVzdWx0ID0gY2Fyb3VzZWwgPyBNYXRoLmNlaWwoKGl0ZW1zTWF4ICogNSAtIHNsaWRlQ291bnQpLzIpIDogKGl0ZW1zTWF4ICogNCAtIHNsaWRlQ291bnQpO1xuICAgIHJlc3VsdCA9IE1hdGgubWF4KGl0ZW1zTWF4LCByZXN1bHQpO1xuXG4gICAgcmV0dXJuIGhhc09wdGlvbignZWRnZVBhZGRpbmcnKSA/IHJlc3VsdCArIDEgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRXaW5kb3dXaWR0aCAoKSB7XG4gICAgcmV0dXJuIHdpbi5pbm5lcldpZHRoIHx8IGRvYy5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHwgZG9jLmJvZHkuY2xpZW50V2lkdGg7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJbnNlcnRQb3NpdGlvbiAocG9zKSB7XG4gICAgcmV0dXJuIHBvcyA9PT0gJ3RvcCcgPyAnYWZ0ZXJiZWdpbicgOiAnYmVmb3JlZW5kJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENsaWVudFdpZHRoIChlbCkge1xuICAgIHZhciBkaXYgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksIHJlY3QsIHdpZHRoO1xuICAgIGVsLmFwcGVuZENoaWxkKGRpdik7XG4gICAgcmVjdCA9IGRpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB3aWR0aCA9IHJlY3QucmlnaHQgLSByZWN0LmxlZnQ7XG4gICAgZGl2LnJlbW92ZSgpO1xuICAgIHJldHVybiB3aWR0aCB8fCBnZXRDbGllbnRXaWR0aChlbC5wYXJlbnROb2RlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZpZXdwb3J0V2lkdGggKCkge1xuICAgIHZhciBnYXAgPSBlZGdlUGFkZGluZyA/IGVkZ2VQYWRkaW5nICogMiAtIGd1dHRlciA6IDA7XG4gICAgcmV0dXJuIGdldENsaWVudFdpZHRoKGNvbnRhaW5lclBhcmVudCkgLSBnYXA7XG4gIH1cblxuICBmdW5jdGlvbiBoYXNPcHRpb24gKGl0ZW0pIHtcbiAgICBpZiAob3B0aW9uc1tpdGVtXSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChyZXNwb25zaXZlKSB7XG4gICAgICAgIGZvciAodmFyIGJwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgICAgICBpZiAocmVzcG9uc2l2ZVticF1baXRlbV0pIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIGdldCBvcHRpb246XG4gIC8vIGZpeGVkIHdpZHRoOiB2aWV3cG9ydCwgZml4ZWRXaWR0aCwgZ3V0dGVyID0+IGl0ZW1zXG4gIC8vIG90aGVyczogd2luZG93IHdpZHRoID0+IGFsbCB2YXJpYWJsZXNcbiAgLy8gYWxsOiBpdGVtcyA9PiBzbGlkZUJ5XG4gIGZ1bmN0aW9uIGdldE9wdGlvbiAoaXRlbSwgd3cpIHtcbiAgICBpZiAod3cgPT0gbnVsbCkgeyB3dyA9IHdpbmRvd1dpZHRoOyB9XG5cbiAgICBpZiAoaXRlbSA9PT0gJ2l0ZW1zJyAmJiBmaXhlZFdpZHRoKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigodmlld3BvcnQgKyBndXR0ZXIpIC8gKGZpeGVkV2lkdGggKyBndXR0ZXIpKSB8fCAxO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXN1bHQgPSBvcHRpb25zW2l0ZW1dO1xuXG4gICAgICBpZiAocmVzcG9uc2l2ZSkge1xuICAgICAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XG4gICAgICAgICAgLy8gYnA6IGNvbnZlcnQgc3RyaW5nIHRvIG51bWJlclxuICAgICAgICAgIGlmICh3dyA+PSBwYXJzZUludChicCkpIHtcbiAgICAgICAgICAgIGlmIChpdGVtIGluIHJlc3BvbnNpdmVbYnBdKSB7IHJlc3VsdCA9IHJlc3BvbnNpdmVbYnBdW2l0ZW1dOyB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtID09PSAnc2xpZGVCeScgJiYgcmVzdWx0ID09PSAncGFnZScpIHsgcmVzdWx0ID0gZ2V0T3B0aW9uKCdpdGVtcycpOyB9XG4gICAgICBpZiAoIWNhcm91c2VsICYmIChpdGVtID09PSAnc2xpZGVCeScgfHwgaXRlbSA9PT0gJ2l0ZW1zJykpIHsgcmVzdWx0ID0gTWF0aC5mbG9vcihyZXN1bHQpOyB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2xpZGVNYXJnaW5MZWZ0IChpKSB7XG4gICAgcmV0dXJuIENBTEMgPyBcbiAgICAgIENBTEMgKyAnKCcgKyBpICogMTAwICsgJyUgLyAnICsgc2xpZGVDb3VudE5ldyArICcpJyA6IFxuICAgICAgaSAqIDEwMCAvIHNsaWRlQ291bnROZXcgKyAnJSc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJbm5lcldyYXBwZXJTdHlsZXMgKGVkZ2VQYWRkaW5nVGVtLCBndXR0ZXJUZW0sIGZpeGVkV2lkdGhUZW0sIHNwZWVkVGVtLCBhdXRvSGVpZ2h0QlApIHtcbiAgICB2YXIgc3RyID0gJyc7XG5cbiAgICBpZiAoZWRnZVBhZGRpbmdUZW0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGdhcCA9IGVkZ2VQYWRkaW5nVGVtO1xuICAgICAgaWYgKGd1dHRlclRlbSkgeyBnYXAgLT0gZ3V0dGVyVGVtOyB9XG4gICAgICBzdHIgPSBob3Jpem9udGFsID9cbiAgICAgICAgJ21hcmdpbjogMCAnICsgZ2FwICsgJ3B4IDAgJyArIGVkZ2VQYWRkaW5nVGVtICsgJ3B4OycgOlxuICAgICAgICAnbWFyZ2luOiAnICsgZWRnZVBhZGRpbmdUZW0gKyAncHggMCAnICsgZ2FwICsgJ3B4IDA7JztcbiAgICB9IGVsc2UgaWYgKGd1dHRlclRlbSAmJiAhZml4ZWRXaWR0aFRlbSkge1xuICAgICAgdmFyIGd1dHRlclRlbVVuaXQgPSAnLScgKyBndXR0ZXJUZW0gKyAncHgnLFxuICAgICAgICAgIGRpciA9IGhvcml6b250YWwgPyBndXR0ZXJUZW1Vbml0ICsgJyAwIDAnIDogJzAgJyArIGd1dHRlclRlbVVuaXQgKyAnIDAnO1xuICAgICAgc3RyID0gJ21hcmdpbjogMCAnICsgZGlyICsgJzsnO1xuICAgIH1cblxuICAgIGlmICghY2Fyb3VzZWwgJiYgYXV0b0hlaWdodEJQICYmIFRSQU5TSVRJT05EVVJBVElPTiAmJiBzcGVlZFRlbSkgeyBzdHIgKz0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWRUZW0pOyB9XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENvbnRhaW5lcldpZHRoIChmaXhlZFdpZHRoVGVtLCBndXR0ZXJUZW0sIGl0ZW1zVGVtKSB7XG4gICAgaWYgKGZpeGVkV2lkdGhUZW0pIHtcbiAgICAgIHJldHVybiAoZml4ZWRXaWR0aFRlbSArIGd1dHRlclRlbSkgKiBzbGlkZUNvdW50TmV3ICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIENBTEMgP1xuICAgICAgICBDQUxDICsgJygnICsgc2xpZGVDb3VudE5ldyAqIDEwMCArICclIC8gJyArIGl0ZW1zVGVtICsgJyknIDpcbiAgICAgICAgc2xpZGVDb3VudE5ldyAqIDEwMCAvIGl0ZW1zVGVtICsgJyUnO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNsaWRlV2lkdGhTdHlsZSAoZml4ZWRXaWR0aFRlbSwgZ3V0dGVyVGVtLCBpdGVtc1RlbSkge1xuICAgIHZhciB3aWR0aDtcblxuICAgIGlmIChmaXhlZFdpZHRoVGVtKSB7XG4gICAgICB3aWR0aCA9IChmaXhlZFdpZHRoVGVtICsgZ3V0dGVyVGVtKSArICdweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2Fyb3VzZWwpIHsgaXRlbXNUZW0gPSBNYXRoLmZsb29yKGl0ZW1zVGVtKTsgfVxuICAgICAgdmFyIGRpdmlkZW5kID0gY2Fyb3VzZWwgPyBzbGlkZUNvdW50TmV3IDogaXRlbXNUZW07XG4gICAgICB3aWR0aCA9IENBTEMgPyBcbiAgICAgICAgQ0FMQyArICcoMTAwJSAvICcgKyBkaXZpZGVuZCArICcpJyA6IFxuICAgICAgICAxMDAgLyBkaXZpZGVuZCArICclJztcbiAgICB9XG5cbiAgICB3aWR0aCA9ICd3aWR0aDonICsgd2lkdGg7XG5cbiAgICAvLyBpbm5lciBzbGlkZXI6IG92ZXJ3cml0ZSBvdXRlciBzbGlkZXIgc3R5bGVzXG4gICAgcmV0dXJuIG5lc3RlZCAhPT0gJ2lubmVyJyA/IHdpZHRoICsgJzsnIDogd2lkdGggKyAnICFpbXBvcnRhbnQ7JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNsaWRlR3V0dGVyU3R5bGUgKGd1dHRlclRlbSkge1xuICAgIHZhciBzdHIgPSAnJztcblxuICAgIC8vIGd1dHRlciBtYXliZSBpbnRlcmdlciB8fCAwXG4gICAgLy8gc28gY2FuJ3QgdXNlICdpZiAoZ3V0dGVyKSdcbiAgICBpZiAoZ3V0dGVyVGVtICE9PSBmYWxzZSkge1xuICAgICAgdmFyIHByb3AgPSBob3Jpem9udGFsID8gJ3BhZGRpbmctJyA6ICdtYXJnaW4tJyxcbiAgICAgICAgICBkaXIgPSBob3Jpem9udGFsID8gJ3JpZ2h0JyA6ICdib3R0b20nO1xuICAgICAgc3RyID0gcHJvcCArICBkaXIgKyAnOiAnICsgZ3V0dGVyVGVtICsgJ3B4Oyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENTU1ByZWZpeCAobmFtZSwgbnVtKSB7XG4gICAgdmFyIHByZWZpeCA9IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUubGVuZ3RoIC0gbnVtKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChwcmVmaXgpIHsgcHJlZml4ID0gJy0nICsgcHJlZml4ICsgJy0nOyB9XG5cbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUgKHNwZWVkKSB7XG4gICAgcmV0dXJuIGdldENTU1ByZWZpeChUUkFOU0lUSU9ORFVSQVRJT04sIDE4KSArICd0cmFuc2l0aW9uLWR1cmF0aW9uOicgKyBzcGVlZCAvIDEwMDAgKyAnczsnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QW5pbWF0aW9uRHVyYXRpb25TdHlsZSAoc3BlZWQpIHtcbiAgICByZXR1cm4gZ2V0Q1NTUHJlZml4KEFOSU1BVElPTkRVUkFUSU9OLCAxNykgKyAnYW5pbWF0aW9uLWR1cmF0aW9uOicgKyBzcGVlZCAvIDEwMDAgKyAnczsnO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFN0cnVjdHVyZSAoKSB7XG4gICAgdmFyIGNsYXNzT3V0ZXIgPSAndG5zLW91dGVyJyxcbiAgICAgICAgY2xhc3NJbm5lciA9ICd0bnMtaW5uZXInLFxuICAgICAgICBoYXNHdXR0ZXIgPSBoYXNPcHRpb24oJ2d1dHRlcicpO1xuXG4gICAgb3V0ZXJXcmFwcGVyLmNsYXNzTmFtZSA9IGNsYXNzT3V0ZXI7XG4gICAgaW5uZXJXcmFwcGVyLmNsYXNzTmFtZSA9IGNsYXNzSW5uZXI7XG4gICAgb3V0ZXJXcmFwcGVyLmlkID0gc2xpZGVJZCArICctb3cnO1xuICAgIGlubmVyV3JhcHBlci5pZCA9IHNsaWRlSWQgKyAnLWl3JztcblxuICAgIC8vIHNldCBjb250YWluZXIgcHJvcGVydGllc1xuICAgIGlmIChjb250YWluZXIuaWQgPT09ICcnKSB7IGNvbnRhaW5lci5pZCA9IHNsaWRlSWQ7IH1cbiAgICBuZXdDb250YWluZXJDbGFzc2VzICs9IFBFUkNFTlRBR0VMQVlPVVQgfHwgYXV0b1dpZHRoID8gJyB0bnMtc3VicGl4ZWwnIDogJyB0bnMtbm8tc3VicGl4ZWwnO1xuICAgIG5ld0NvbnRhaW5lckNsYXNzZXMgKz0gQ0FMQyA/ICcgdG5zLWNhbGMnIDogJyB0bnMtbm8tY2FsYyc7XG4gICAgaWYgKGF1dG9XaWR0aCkgeyBuZXdDb250YWluZXJDbGFzc2VzICs9ICcgdG5zLWF1dG93aWR0aCc7IH1cbiAgICBuZXdDb250YWluZXJDbGFzc2VzICs9ICcgdG5zLScgKyBvcHRpb25zLmF4aXM7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSArPSBuZXdDb250YWluZXJDbGFzc2VzO1xuXG4gICAgLy8gYWRkIGNvbnN0cmFpbiBsYXllciBmb3IgY2Fyb3VzZWxcbiAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgIG1pZGRsZVdyYXBwZXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBtaWRkbGVXcmFwcGVyLmlkID0gc2xpZGVJZCArICctbXcnO1xuICAgICAgbWlkZGxlV3JhcHBlci5jbGFzc05hbWUgPSAndG5zLW92aCc7XG5cbiAgICAgIG91dGVyV3JhcHBlci5hcHBlbmRDaGlsZChtaWRkbGVXcmFwcGVyKTtcbiAgICAgIG1pZGRsZVdyYXBwZXIuYXBwZW5kQ2hpbGQoaW5uZXJXcmFwcGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ZXJXcmFwcGVyLmFwcGVuZENoaWxkKGlubmVyV3JhcHBlcik7XG4gICAgfVxuXG4gICAgaWYgKGF1dG9IZWlnaHQpIHtcbiAgICAgIHZhciB3cCA9IG1pZGRsZVdyYXBwZXIgPyBtaWRkbGVXcmFwcGVyIDogaW5uZXJXcmFwcGVyO1xuICAgICAgd3AuY2xhc3NOYW1lICs9ICcgdG5zLWFoJztcbiAgICB9XG5cbiAgICBjb250YWluZXJQYXJlbnQuaW5zZXJ0QmVmb3JlKG91dGVyV3JhcHBlciwgY29udGFpbmVyKTtcbiAgICBpbm5lcldyYXBwZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblxuICAgIC8vIGFkZCBpZCwgY2xhc3MsIGFyaWEgYXR0cmlidXRlcyBcbiAgICAvLyBiZWZvcmUgY2xvbmUgc2xpZGVzXG4gICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICBhZGRDbGFzcyhpdGVtLCAndG5zLWl0ZW0nKTtcbiAgICAgIGlmICghaXRlbS5pZCkgeyBpdGVtLmlkID0gc2xpZGVJZCArICctaXRlbScgKyBpOyB9XG4gICAgICBpZiAoIWNhcm91c2VsICYmIGFuaW1hdGVOb3JtYWwpIHsgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7IH1cbiAgICAgIHNldEF0dHJzKGl0ZW0sIHtcbiAgICAgICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxuICAgICAgICAndGFiaW5kZXgnOiAnLTEnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vICMjIGNsb25lIHNsaWRlc1xuICAgIC8vIGNhcm91c2VsOiBuICsgc2xpZGVzICsgblxuICAgIC8vIGdhbGxlcnk6ICAgICAgc2xpZGVzICsgblxuICAgIGlmIChjbG9uZUNvdW50KSB7XG4gICAgICB2YXIgZnJhZ21lbnRCZWZvcmUgPSBkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLCBcbiAgICAgICAgICBmcmFnbWVudEFmdGVyID0gZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgICAgZm9yICh2YXIgaiA9IGNsb25lQ291bnQ7IGotLTspIHtcbiAgICAgICAgdmFyIG51bSA9IGolc2xpZGVDb3VudCxcbiAgICAgICAgICAgIGNsb25lRmlyc3QgPSBzbGlkZUl0ZW1zW251bV0uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICByZW1vdmVBdHRycyhjbG9uZUZpcnN0LCAnaWQnKTtcbiAgICAgICAgZnJhZ21lbnRBZnRlci5pbnNlcnRCZWZvcmUoY2xvbmVGaXJzdCwgZnJhZ21lbnRBZnRlci5maXJzdENoaWxkKTtcblxuICAgICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgICB2YXIgY2xvbmVMYXN0ID0gc2xpZGVJdGVtc1tzbGlkZUNvdW50IC0gMSAtIG51bV0uY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgIHJlbW92ZUF0dHJzKGNsb25lTGFzdCwgJ2lkJyk7XG4gICAgICAgICAgZnJhZ21lbnRCZWZvcmUuYXBwZW5kQ2hpbGQoY2xvbmVMYXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb250YWluZXIuaW5zZXJ0QmVmb3JlKGZyYWdtZW50QmVmb3JlLCBjb250YWluZXIuZmlyc3RDaGlsZCk7XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnRBZnRlcik7XG4gICAgICBzbGlkZUl0ZW1zID0gY29udGFpbmVyLmNoaWxkcmVuO1xuICAgIH1cblxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFNsaWRlclRyYW5zZm9ybSAoKSB7XG4gICAgLy8gIyMgaW1hZ2VzIGxvYWRlZC9mYWlsZWRcbiAgICBpZiAoaGFzT3B0aW9uKCdhdXRvSGVpZ2h0JykgfHwgYXV0b1dpZHRoIHx8ICFob3Jpem9udGFsKSB7XG4gICAgICB2YXIgaW1ncyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdpbWcnKTtcblxuICAgICAgLy8gYWRkIGNvbXBsZXRlIGNsYXNzIGlmIGFsbCBpbWFnZXMgYXJlIGxvYWRlZC9mYWlsZWRcbiAgICAgIGZvckVhY2goaW1ncywgZnVuY3Rpb24oaW1nKSB7XG4gICAgICAgIHZhciBzcmMgPSBpbWcuc3JjO1xuICAgICAgICBcbiAgICAgICAgaWYgKHNyYyAmJiBzcmMuaW5kZXhPZignZGF0YTppbWFnZScpIDwgMCkge1xuICAgICAgICAgIGFkZEV2ZW50cyhpbWcsIGltZ0V2ZW50cyk7XG4gICAgICAgICAgaW1nLnNyYyA9ICcnO1xuICAgICAgICAgIGltZy5zcmMgPSBzcmM7XG4gICAgICAgICAgYWRkQ2xhc3MoaW1nLCAnbG9hZGluZycpO1xuICAgICAgICB9IGVsc2UgaWYgKCFsYXp5bG9hZCkge1xuICAgICAgICAgIGltZ0xvYWRlZChpbWcpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gQWxsIGltZ3MgYXJlIGNvbXBsZXRlZFxuICAgICAgcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhhcnJheUZyb21Ob2RlTGlzdChpbWdzKSwgZnVuY3Rpb24oKSB7IGltZ3NDb21wbGV0ZSA9IHRydWU7IH0pOyB9KTtcblxuICAgICAgLy8gQ2hlY2sgaW1ncyBpbiB3aW5kb3cgb25seSBmb3IgYXV0byBoZWlnaHRcbiAgICAgIGlmICghYXV0b1dpZHRoICYmIGhvcml6b250YWwpIHsgaW1ncyA9IGdldEltYWdlQXJyYXkoaW5kZXgsIE1hdGgubWluKGluZGV4ICsgaXRlbXMgLSAxLCBzbGlkZUNvdW50TmV3IC0gMSkpOyB9XG5cbiAgICAgIGxhenlsb2FkID8gaW5pdFNsaWRlclRyYW5zZm9ybVN0eWxlQ2hlY2soKSA6IHJhZihmdW5jdGlvbigpeyBpbWdzTG9hZGVkQ2hlY2soYXJyYXlGcm9tTm9kZUxpc3QoaW1ncyksIGluaXRTbGlkZXJUcmFuc2Zvcm1TdHlsZUNoZWNrKTsgfSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2V0IGNvbnRhaW5lciB0cmFuc2Zvcm0gcHJvcGVydHlcbiAgICAgIGlmIChjYXJvdXNlbCkgeyBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpOyB9XG5cbiAgICAgIC8vIHVwZGF0ZSBzbGlkZXIgdG9vbHMgYW5kIGV2ZW50c1xuICAgICAgaW5pdFRvb2xzKCk7XG4gICAgICBpbml0RXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFNsaWRlclRyYW5zZm9ybVN0eWxlQ2hlY2sgKCkge1xuICAgIGlmIChhdXRvV2lkdGgpIHtcbiAgICAgIC8vIGNoZWNrIHN0eWxlcyBhcHBsaWNhdGlvblxuICAgICAgdmFyIG51bSA9IGxvb3AgPyBpbmRleCA6IHNsaWRlQ291bnQgLSAxO1xuICAgICAgKGZ1bmN0aW9uIHN0eWxlc0FwcGxpY2F0aW9uQ2hlY2soKSB7XG4gICAgICAgIHNsaWRlSXRlbXNbbnVtIC0gMV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQudG9GaXhlZCgyKSA9PT0gc2xpZGVJdGVtc1tudW1dLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQudG9GaXhlZCgyKSA/XG4gICAgICAgIGluaXRTbGlkZXJUcmFuc2Zvcm1Db3JlKCkgOlxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHN0eWxlc0FwcGxpY2F0aW9uQ2hlY2soKTsgfSwgMTYpO1xuICAgICAgfSkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5pdFNsaWRlclRyYW5zZm9ybUNvcmUoKTtcbiAgICB9XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGluaXRTbGlkZXJUcmFuc2Zvcm1Db3JlICgpIHtcbiAgICAvLyBydW4gRm4oKXMgd2hpY2ggYXJlIHJlbHkgb24gaW1hZ2UgbG9hZGluZ1xuICAgIGlmICghaG9yaXpvbnRhbCB8fCBhdXRvV2lkdGgpIHtcbiAgICAgIHNldFNsaWRlUG9zaXRpb25zKCk7XG5cbiAgICAgIGlmIChhdXRvV2lkdGgpIHtcbiAgICAgICAgcmlnaHRCb3VuZGFyeSA9IGdldFJpZ2h0Qm91bmRhcnkoKTtcbiAgICAgICAgaWYgKGZyZWV6YWJsZSkgeyBmcmVlemUgPSBnZXRGcmVlemUoKTsgfVxuICAgICAgICBpbmRleE1heCA9IGdldEluZGV4TWF4KCk7IC8vIDw9IHNsaWRlUG9zaXRpb25zLCByaWdodEJvdW5kYXJ5IDw9XG4gICAgICAgIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlIHx8IGZyZWV6ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cGRhdGVDb250ZW50V3JhcHBlckhlaWdodCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNldCBjb250YWluZXIgdHJhbnNmb3JtIHByb3BlcnR5XG4gICAgaWYgKGNhcm91c2VsKSB7IGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50KCk7IH1cblxuICAgIC8vIHVwZGF0ZSBzbGlkZXIgdG9vbHMgYW5kIGV2ZW50c1xuICAgIGluaXRUb29scygpO1xuICAgIGluaXRFdmVudHMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRTaGVldCAoKSB7XG4gICAgLy8gZ2FsbGVyeTpcbiAgICAvLyBzZXQgYW5pbWF0aW9uIGNsYXNzZXMgYW5kIGxlZnQgdmFsdWUgZm9yIGdhbGxlcnkgc2xpZGVyXG4gICAgaWYgKCFjYXJvdXNlbCkgeyBcbiAgICAgIGZvciAodmFyIGkgPSBpbmRleCwgbCA9IGluZGV4ICsgTWF0aC5taW4oc2xpZGVDb3VudCwgaXRlbXMpOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcbiAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gKGkgLSBpbmRleCkgKiAxMDAgLyBpdGVtcyArICclJztcbiAgICAgICAgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZUluKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gIyMjIyBMQVlPVVRcblxuICAgIC8vICMjIElOTElORS1CTE9DSyBWUyBGTE9BVFxuXG4gICAgLy8gIyMgUGVyY2VudGFnZUxheW91dDpcbiAgICAvLyBzbGlkZXM6IGlubGluZS1ibG9ja1xuICAgIC8vIHJlbW92ZSBibGFuayBzcGFjZSBiZXR3ZWVuIHNsaWRlcyBieSBzZXQgZm9udC1zaXplOiAwXG5cbiAgICAvLyAjIyBOb24gUGVyY2VudGFnZUxheW91dDpcbiAgICAvLyBzbGlkZXM6IGZsb2F0XG4gICAgLy8gICAgICAgICBtYXJnaW4tcmlnaHQ6IC0xMDAlXG4gICAgLy8gICAgICAgICBtYXJnaW4tbGVmdDogflxuXG4gICAgLy8gUmVzb3VyY2U6IGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzE0N3VwMjQ1d3dUWGVRWXZlM0JSU0FENG9WY3ZRbXVHc0Z0ZUpPZUE1eE5RL2VkaXQ/dXNwPXNoYXJpbmdcbiAgICBpZiAoaG9yaXpvbnRhbCkge1xuICAgICAgaWYgKFBFUkNFTlRBR0VMQVlPVVQgfHwgYXV0b1dpZHRoKSB7XG4gICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnID4gLnRucy1pdGVtJywgJ2ZvbnQtc2l6ZTonICsgd2luLmdldENvbXB1dGVkU3R5bGUoc2xpZGVJdGVtc1swXSkuZm9udFNpemUgKyAnOycsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQsICdmb250LXNpemU6MDsnLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgfSBlbHNlIGlmIChjYXJvdXNlbCkge1xuICAgICAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uIChzbGlkZSwgaSkge1xuICAgICAgICAgIHNsaWRlLnN0eWxlLm1hcmdpbkxlZnQgPSBnZXRTbGlkZU1hcmdpbkxlZnQoaSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gIyMgQkFTSUMgU1RZTEVTXG4gICAgaWYgKENTU01RKSB7XG4gICAgICAvLyBtaWRkbGUgd3JhcHBlciBzdHlsZVxuICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikge1xuICAgICAgICB2YXIgc3RyID0gbWlkZGxlV3JhcHBlciAmJiBvcHRpb25zLmF1dG9IZWlnaHQgPyBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShvcHRpb25zLnNwZWVkKSA6ICcnO1xuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJy1tdycsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgIH1cblxuICAgICAgLy8gaW5uZXIgd3JhcHBlciBzdHlsZXNcbiAgICAgIHN0ciA9IGdldElubmVyV3JhcHBlclN0eWxlcyhvcHRpb25zLmVkZ2VQYWRkaW5nLCBvcHRpb25zLmd1dHRlciwgb3B0aW9ucy5maXhlZFdpZHRoLCBvcHRpb25zLnNwZWVkLCBvcHRpb25zLmF1dG9IZWlnaHQpO1xuICAgICAgYWRkQ1NTUnVsZShzaGVldCwgJyMnICsgc2xpZGVJZCArICctaXcnLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG5cbiAgICAgIC8vIGNvbnRhaW5lciBzdHlsZXNcbiAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICBzdHIgPSBob3Jpem9udGFsICYmICFhdXRvV2lkdGggPyAnd2lkdGg6JyArIGdldENvbnRhaW5lcldpZHRoKG9wdGlvbnMuZml4ZWRXaWR0aCwgb3B0aW9ucy5ndXR0ZXIsIG9wdGlvbnMuaXRlbXMpICsgJzsnIDogJyc7XG4gICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHsgc3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkKTsgfVxuICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkLCBzdHIsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNsaWRlIHN0eWxlc1xuICAgICAgc3RyID0gaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoID8gZ2V0U2xpZGVXaWR0aFN0eWxlKG9wdGlvbnMuZml4ZWRXaWR0aCwgb3B0aW9ucy5ndXR0ZXIsIG9wdGlvbnMuaXRlbXMpIDogJyc7XG4gICAgICBpZiAob3B0aW9ucy5ndXR0ZXIpIHsgc3RyICs9IGdldFNsaWRlR3V0dGVyU3R5bGUob3B0aW9ucy5ndXR0ZXIpOyB9XG4gICAgICAvLyBzZXQgZ2FsbGVyeSBpdGVtcyB0cmFuc2l0aW9uLWR1cmF0aW9uXG4gICAgICBpZiAoIWNhcm91c2VsKSB7XG4gICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHsgc3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkKTsgfVxuICAgICAgICBpZiAoQU5JTUFUSU9ORFVSQVRJT04pIHsgc3RyICs9IGdldEFuaW1hdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWQpOyB9XG4gICAgICB9XG4gICAgICBpZiAoc3RyKSB7IGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnID4gLnRucy1pdGVtJywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpOyB9XG5cbiAgICAvLyBub24gQ1NTIG1lZGlhcXVlcmllczogSUU4XG4gICAgLy8gIyMgdXBkYXRlIGlubmVyIHdyYXBwZXIsIGNvbnRhaW5lciwgc2xpZGVzIGlmIG5lZWRlZFxuICAgIC8vIHNldCBpbmxpbmUgc3R5bGVzIGZvciBpbm5lciB3cmFwcGVyICYgY29udGFpbmVyXG4gICAgLy8gaW5zZXJ0IHN0eWxlc2hlZXQgKG9uZSBsaW5lKSBmb3Igc2xpZGVzIG9ubHkgKHNpbmNlIHNsaWRlcyBhcmUgbWFueSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3R5bGVzXG4gICAgICB1cGRhdGVfY2Fyb3VzZWxfdHJhbnNpdGlvbl9kdXJhdGlvbigpO1xuXG4gICAgICAvLyBpbm5lciB3cmFwcGVyIHN0eWxlc1xuICAgICAgaW5uZXJXcmFwcGVyLnN0eWxlLmNzc1RleHQgPSBnZXRJbm5lcldyYXBwZXJTdHlsZXMoZWRnZVBhZGRpbmcsIGd1dHRlciwgZml4ZWRXaWR0aCwgYXV0b0hlaWdodCk7XG5cbiAgICAgIC8vIGNvbnRhaW5lciBzdHlsZXNcbiAgICAgIGlmIChjYXJvdXNlbCAmJiBob3Jpem9udGFsICYmICFhdXRvV2lkdGgpIHtcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLndpZHRoID0gZ2V0Q29udGFpbmVyV2lkdGgoZml4ZWRXaWR0aCwgZ3V0dGVyLCBpdGVtcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNsaWRlIHN0eWxlc1xuICAgICAgdmFyIHN0ciA9IGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCA/IGdldFNsaWRlV2lkdGhTdHlsZShmaXhlZFdpZHRoLCBndXR0ZXIsIGl0ZW1zKSA6ICcnO1xuICAgICAgaWYgKGd1dHRlcikgeyBzdHIgKz0gZ2V0U2xpZGVHdXR0ZXJTdHlsZShndXR0ZXIpOyB9XG5cbiAgICAgIC8vIGFwcGVuZCB0byB0aGUgbGFzdCBsaW5lXG4gICAgICBpZiAoc3RyKSB7IGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnID4gLnRucy1pdGVtJywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpOyB9XG4gICAgfVxuXG4gICAgLy8gIyMgTUVESUFRVUVSSUVTXG4gICAgaWYgKHJlc3BvbnNpdmUgJiYgQ1NTTVEpIHtcbiAgICAgIGZvciAodmFyIGJwIGluIHJlc3BvbnNpdmUpIHtcbiAgICAgICAgLy8gYnA6IGNvbnZlcnQgc3RyaW5nIHRvIG51bWJlclxuICAgICAgICBicCA9IHBhcnNlSW50KGJwKTtcblxuICAgICAgICB2YXIgb3B0cyA9IHJlc3BvbnNpdmVbYnBdLFxuICAgICAgICAgICAgc3RyID0gJycsXG4gICAgICAgICAgICBtaWRkbGVXcmFwcGVyU3RyID0gJycsXG4gICAgICAgICAgICBpbm5lcldyYXBwZXJTdHIgPSAnJyxcbiAgICAgICAgICAgIGNvbnRhaW5lclN0ciA9ICcnLFxuICAgICAgICAgICAgc2xpZGVTdHIgPSAnJyxcbiAgICAgICAgICAgIGl0ZW1zQlAgPSAhYXV0b1dpZHRoID8gZ2V0T3B0aW9uKCdpdGVtcycsIGJwKSA6IG51bGwsXG4gICAgICAgICAgICBmaXhlZFdpZHRoQlAgPSBnZXRPcHRpb24oJ2ZpeGVkV2lkdGgnLCBicCksXG4gICAgICAgICAgICBzcGVlZEJQID0gZ2V0T3B0aW9uKCdzcGVlZCcsIGJwKSxcbiAgICAgICAgICAgIGVkZ2VQYWRkaW5nQlAgPSBnZXRPcHRpb24oJ2VkZ2VQYWRkaW5nJywgYnApLFxuICAgICAgICAgICAgYXV0b0hlaWdodEJQID0gZ2V0T3B0aW9uKCdhdXRvSGVpZ2h0JywgYnApLFxuICAgICAgICAgICAgZ3V0dGVyQlAgPSBnZXRPcHRpb24oJ2d1dHRlcicsIGJwKTtcblxuICAgICAgICAvLyBtaWRkbGUgd3JhcHBlciBzdHJpbmdcbiAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTiAmJiBtaWRkbGVXcmFwcGVyICYmIGdldE9wdGlvbignYXV0b0hlaWdodCcsIGJwKSAmJiAnc3BlZWQnIGluIG9wdHMpIHtcbiAgICAgICAgICBtaWRkbGVXcmFwcGVyU3RyID0gJyMnICsgc2xpZGVJZCArICctbXd7JyArIGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkQlApICsgJ30nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5uZXIgd3JhcHBlciBzdHJpbmdcbiAgICAgICAgaWYgKCdlZGdlUGFkZGluZycgaW4gb3B0cyB8fCAnZ3V0dGVyJyBpbiBvcHRzKSB7XG4gICAgICAgICAgaW5uZXJXcmFwcGVyU3RyID0gJyMnICsgc2xpZGVJZCArICctaXd7JyArIGdldElubmVyV3JhcHBlclN0eWxlcyhlZGdlUGFkZGluZ0JQLCBndXR0ZXJCUCwgZml4ZWRXaWR0aEJQLCBzcGVlZEJQLCBhdXRvSGVpZ2h0QlApICsgJ30nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29udGFpbmVyIHN0cmluZ1xuICAgICAgICBpZiAoY2Fyb3VzZWwgJiYgaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoICYmICgnZml4ZWRXaWR0aCcgaW4gb3B0cyB8fCAnaXRlbXMnIGluIG9wdHMgfHwgKGZpeGVkV2lkdGggJiYgJ2d1dHRlcicgaW4gb3B0cykpKSB7XG4gICAgICAgICAgY29udGFpbmVyU3RyID0gJ3dpZHRoOicgKyBnZXRDb250YWluZXJXaWR0aChmaXhlZFdpZHRoQlAsIGd1dHRlckJQLCBpdGVtc0JQKSArICc7JztcbiAgICAgICAgfVxuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OICYmICdzcGVlZCcgaW4gb3B0cykge1xuICAgICAgICAgIGNvbnRhaW5lclN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZEJQKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29udGFpbmVyU3RyKSB7XG4gICAgICAgICAgY29udGFpbmVyU3RyID0gJyMnICsgc2xpZGVJZCArICd7JyArIGNvbnRhaW5lclN0ciArICd9JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNsaWRlIHN0cmluZ1xuICAgICAgICBpZiAoJ2ZpeGVkV2lkdGgnIGluIG9wdHMgfHwgKGZpeGVkV2lkdGggJiYgJ2d1dHRlcicgaW4gb3B0cykgfHwgIWNhcm91c2VsICYmICdpdGVtcycgaW4gb3B0cykge1xuICAgICAgICAgIHNsaWRlU3RyICs9IGdldFNsaWRlV2lkdGhTdHlsZShmaXhlZFdpZHRoQlAsIGd1dHRlckJQLCBpdGVtc0JQKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ2d1dHRlcicgaW4gb3B0cykge1xuICAgICAgICAgIHNsaWRlU3RyICs9IGdldFNsaWRlR3V0dGVyU3R5bGUoZ3V0dGVyQlApO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNldCBnYWxsZXJ5IGl0ZW1zIHRyYW5zaXRpb24tZHVyYXRpb25cbiAgICAgICAgaWYgKCFjYXJvdXNlbCAmJiAnc3BlZWQnIGluIG9wdHMpIHtcbiAgICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7IHNsaWRlU3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkQlApOyB9XG4gICAgICAgICAgaWYgKEFOSU1BVElPTkRVUkFUSU9OKSB7IHNsaWRlU3RyICs9IGdldEFuaW1hdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWRCUCk7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc2xpZGVTdHIpIHsgc2xpZGVTdHIgPSAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbXsnICsgc2xpZGVTdHIgKyAnfSc7IH1cblxuICAgICAgICAvLyBhZGQgdXBcbiAgICAgICAgc3RyID0gbWlkZGxlV3JhcHBlclN0ciArIGlubmVyV3JhcHBlclN0ciArIGNvbnRhaW5lclN0ciArIHNsaWRlU3RyO1xuXG4gICAgICAgIGlmIChzdHIpIHtcbiAgICAgICAgICBzaGVldC5pbnNlcnRSdWxlKCdAbWVkaWEgKG1pbi13aWR0aDogJyArIGJwIC8gMTYgKyAnZW0pIHsnICsgc3RyICsgJ30nLCBzaGVldC5jc3NSdWxlcy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdFRvb2xzICgpIHtcbiAgICAvLyA9PSBzbGlkZXMgPT1cbiAgICB1cGRhdGVTbGlkZVN0YXR1cygpO1xuXG4gICAgLy8gPT0gbGl2ZSByZWdpb24gPT1cbiAgICBvdXRlcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgJzxkaXYgY2xhc3M9XCJ0bnMtbGl2ZXJlZ2lvbiB0bnMtdmlzdWFsbHktaGlkZGVuXCIgYXJpYS1saXZlPVwicG9saXRlXCIgYXJpYS1hdG9taWM9XCJ0cnVlXCI+c2xpZGUgPHNwYW4gY2xhc3M9XCJjdXJyZW50XCI+JyArIGdldExpdmVSZWdpb25TdHIoKSArICc8L3NwYW4+ICBvZiAnICsgc2xpZGVDb3VudCArICc8L2Rpdj4nKTtcbiAgICBsaXZlcmVnaW9uQ3VycmVudCA9IG91dGVyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcudG5zLWxpdmVyZWdpb24gLmN1cnJlbnQnKTtcblxuICAgIC8vID09IGF1dG9wbGF5SW5pdCA9PVxuICAgIGlmIChoYXNBdXRvcGxheSkge1xuICAgICAgdmFyIHR4dCA9IGF1dG9wbGF5ID8gJ3N0b3AnIDogJ3N0YXJ0JztcbiAgICAgIGlmIChhdXRvcGxheUJ1dHRvbikge1xuICAgICAgICBzZXRBdHRycyhhdXRvcGxheUJ1dHRvbiwgeydkYXRhLWFjdGlvbic6IHR4dH0pO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmF1dG9wbGF5QnV0dG9uT3V0cHV0KSB7XG4gICAgICAgIG91dGVyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoZ2V0SW5zZXJ0UG9zaXRpb24ob3B0aW9ucy5hdXRvcGxheVBvc2l0aW9uKSwgJzxidXR0b24gZGF0YS1hY3Rpb249XCInICsgdHh0ICsgJ1wiPicgKyBhdXRvcGxheUh0bWxTdHJpbmdzWzBdICsgdHh0ICsgYXV0b3BsYXlIdG1sU3RyaW5nc1sxXSArIGF1dG9wbGF5VGV4dFswXSArICc8L2J1dHRvbj4nKTtcbiAgICAgICAgYXV0b3BsYXlCdXR0b24gPSBvdXRlcldyYXBwZXIucXVlcnlTZWxlY3RvcignW2RhdGEtYWN0aW9uXScpO1xuICAgICAgfVxuXG4gICAgICAvLyBhZGQgZXZlbnRcbiAgICAgIGlmIChhdXRvcGxheUJ1dHRvbikge1xuICAgICAgICBhZGRFdmVudHMoYXV0b3BsYXlCdXR0b24sIHsnY2xpY2snOiB0b2dnbGVBdXRvcGxheX0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXV0b3BsYXkpIHtcbiAgICAgICAgc3RhcnRBdXRvcGxheSgpO1xuICAgICAgICBpZiAoYXV0b3BsYXlIb3ZlclBhdXNlKSB7IGFkZEV2ZW50cyhjb250YWluZXIsIGhvdmVyRXZlbnRzKTsgfVxuICAgICAgICBpZiAoYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSkgeyBhZGRFdmVudHMoY29udGFpbmVyLCB2aXNpYmlsaXR5RXZlbnQpOyB9XG4gICAgICB9XG4gICAgfVxuIFxuICAgIC8vID09IG5hdkluaXQgPT1cbiAgICBpZiAoaGFzTmF2KSB7XG4gICAgICB2YXIgaW5pdEluZGV4ID0gIWNhcm91c2VsID8gMCA6IGNsb25lQ291bnQ7XG4gICAgICAvLyBjdXN0b21pemVkIG5hdlxuICAgICAgLy8gd2lsbCBub3QgaGlkZSB0aGUgbmF2cyBpbiBjYXNlIHRoZXkncmUgdGh1bWJuYWlsc1xuICAgICAgaWYgKG5hdkNvbnRhaW5lcikge1xuICAgICAgICBzZXRBdHRycyhuYXZDb250YWluZXIsIHsnYXJpYS1sYWJlbCc6ICdDYXJvdXNlbCBQYWdpbmF0aW9uJ30pO1xuICAgICAgICBuYXZJdGVtcyA9IG5hdkNvbnRhaW5lci5jaGlsZHJlbjtcbiAgICAgICAgZm9yRWFjaChuYXZJdGVtcywgZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICAgIHNldEF0dHJzKGl0ZW0sIHtcbiAgICAgICAgICAgICdkYXRhLW5hdic6IGksXG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICAgICAgICAgJ2FyaWEtbGFiZWwnOiBuYXZTdHIgKyAoaSArIDEpLFxuICAgICAgICAgICAgJ2FyaWEtY29udHJvbHMnOiBzbGlkZUlkLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgLy8gZ2VuZXJhdGVkIG5hdiBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuYXZIdG1sID0gJycsXG4gICAgICAgICAgICBoaWRkZW5TdHIgPSBuYXZBc1RodW1ibmFpbHMgPyAnJyA6ICdzdHlsZT1cImRpc3BsYXk6bm9uZVwiJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZUNvdW50OyBpKyspIHtcbiAgICAgICAgICAvLyBoaWRlIG5hdiBpdGVtcyBieSBkZWZhdWx0XG4gICAgICAgICAgbmF2SHRtbCArPSAnPGJ1dHRvbiBkYXRhLW5hdj1cIicgKyBpICsnXCIgdGFiaW5kZXg9XCItMVwiIGFyaWEtY29udHJvbHM9XCInICsgc2xpZGVJZCArICdcIiAnICsgaGlkZGVuU3RyICsgJyBhcmlhLWxhYmVsPVwiJyArIG5hdlN0ciArIChpICsgMSkgKydcIj48L2J1dHRvbj4nO1xuICAgICAgICB9XG4gICAgICAgIG5hdkh0bWwgPSAnPGRpdiBjbGFzcz1cInRucy1uYXZcIiBhcmlhLWxhYmVsPVwiQ2Fyb3VzZWwgUGFnaW5hdGlvblwiPicgKyBuYXZIdG1sICsgJzwvZGl2Pic7XG4gICAgICAgIG91dGVyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoZ2V0SW5zZXJ0UG9zaXRpb24ob3B0aW9ucy5uYXZQb3NpdGlvbiksIG5hdkh0bWwpO1xuXG4gICAgICAgIG5hdkNvbnRhaW5lciA9IG91dGVyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcudG5zLW5hdicpO1xuICAgICAgICBuYXZJdGVtcyA9IG5hdkNvbnRhaW5lci5jaGlsZHJlbjtcbiAgICAgIH1cblxuICAgICAgdXBkYXRlTmF2VmlzaWJpbGl0eSgpO1xuXG4gICAgICAvLyBhZGQgdHJhbnNpdGlvblxuICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikge1xuICAgICAgICB2YXIgcHJlZml4ID0gVFJBTlNJVElPTkRVUkFUSU9OLnN1YnN0cmluZygwLCBUUkFOU0lUSU9ORFVSQVRJT04ubGVuZ3RoIC0gMTgpLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICBzdHIgPSAndHJhbnNpdGlvbjogYWxsICcgKyBzcGVlZCAvIDEwMDAgKyAncyc7XG5cbiAgICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICAgIHN0ciA9ICctJyArIHByZWZpeCArICctJyArIHN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICdbYXJpYS1jb250cm9sc149JyArIHNsaWRlSWQgKyAnLWl0ZW1dJywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xuICAgICAgfVxuXG4gICAgICBzZXRBdHRycyhuYXZJdGVtc1tuYXZDdXJyZW50SW5kZXhdLCB7J2FyaWEtbGFiZWwnOiBuYXZTdHIgKyAobmF2Q3VycmVudEluZGV4ICsgMSkgKyBuYXZTdHJDdXJyZW50fSk7XG4gICAgICByZW1vdmVBdHRycyhuYXZJdGVtc1tuYXZDdXJyZW50SW5kZXhdLCAndGFiaW5kZXgnKTtcbiAgICAgIGFkZENsYXNzKG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleF0sIG5hdkFjdGl2ZUNsYXNzKTtcblxuICAgICAgLy8gYWRkIGV2ZW50c1xuICAgICAgYWRkRXZlbnRzKG5hdkNvbnRhaW5lciwgbmF2RXZlbnRzKTtcbiAgICB9XG5cblxuXG4gICAgLy8gPT0gY29udHJvbHNJbml0ID09XG4gICAgaWYgKGhhc0NvbnRyb2xzKSB7XG4gICAgICBpZiAoIWNvbnRyb2xzQ29udGFpbmVyICYmICghcHJldkJ1dHRvbiB8fCAhbmV4dEJ1dHRvbikpIHtcbiAgICAgICAgb3V0ZXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTChnZXRJbnNlcnRQb3NpdGlvbihvcHRpb25zLmNvbnRyb2xzUG9zaXRpb24pLCAnPGRpdiBjbGFzcz1cInRucy1jb250cm9sc1wiIGFyaWEtbGFiZWw9XCJDYXJvdXNlbCBOYXZpZ2F0aW9uXCIgdGFiaW5kZXg9XCIwXCI+PGJ1dHRvbiBkYXRhLWNvbnRyb2xzPVwicHJldlwiIHRhYmluZGV4PVwiLTFcIiBhcmlhLWNvbnRyb2xzPVwiJyArIHNsaWRlSWQgKydcIj4nICsgY29udHJvbHNUZXh0WzBdICsgJzwvYnV0dG9uPjxidXR0b24gZGF0YS1jb250cm9scz1cIm5leHRcIiB0YWJpbmRleD1cIi0xXCIgYXJpYS1jb250cm9scz1cIicgKyBzbGlkZUlkICsnXCI+JyArIGNvbnRyb2xzVGV4dFsxXSArICc8L2J1dHRvbj48L2Rpdj4nKTtcblxuICAgICAgICBjb250cm9sc0NvbnRhaW5lciA9IG91dGVyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcudG5zLWNvbnRyb2xzJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghcHJldkJ1dHRvbiB8fCAhbmV4dEJ1dHRvbikge1xuICAgICAgICBwcmV2QnV0dG9uID0gY29udHJvbHNDb250YWluZXIuY2hpbGRyZW5bMF07XG4gICAgICAgIG5leHRCdXR0b24gPSBjb250cm9sc0NvbnRhaW5lci5jaGlsZHJlblsxXTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgc2V0QXR0cnMoY29udHJvbHNDb250YWluZXIsIHtcbiAgICAgICAgICAnYXJpYS1sYWJlbCc6ICdDYXJvdXNlbCBOYXZpZ2F0aW9uJyxcbiAgICAgICAgICAndGFiaW5kZXgnOiAnMCdcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyIHx8IChvcHRpb25zLnByZXZCdXR0b24gJiYgb3B0aW9ucy5uZXh0QnV0dG9uKSkge1xuICAgICAgICBzZXRBdHRycyhbcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbl0sIHtcbiAgICAgICAgICAnYXJpYS1jb250cm9scyc6IHNsaWRlSWQsXG4gICAgICAgICAgJ3RhYmluZGV4JzogJy0xJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyIHx8IChvcHRpb25zLnByZXZCdXR0b24gJiYgb3B0aW9ucy5uZXh0QnV0dG9uKSkge1xuICAgICAgICBzZXRBdHRycyhwcmV2QnV0dG9uLCB7J2RhdGEtY29udHJvbHMnIDogJ3ByZXYnfSk7XG4gICAgICAgIHNldEF0dHJzKG5leHRCdXR0b24sIHsnZGF0YS1jb250cm9scycgOiAnbmV4dCd9KTtcbiAgICAgIH1cblxuICAgICAgcHJldklzQnV0dG9uID0gaXNCdXR0b24ocHJldkJ1dHRvbik7XG4gICAgICBuZXh0SXNCdXR0b24gPSBpc0J1dHRvbihuZXh0QnV0dG9uKTtcblxuICAgICAgdXBkYXRlQ29udHJvbHNTdGF0dXMoKTtcblxuICAgICAgLy8gYWRkIGV2ZW50c1xuICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgIGFkZEV2ZW50cyhjb250cm9sc0NvbnRhaW5lciwgY29udHJvbHNFdmVudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWRkRXZlbnRzKHByZXZCdXR0b24sIGNvbnRyb2xzRXZlbnRzKTtcbiAgICAgICAgYWRkRXZlbnRzKG5leHRCdXR0b24sIGNvbnRyb2xzRXZlbnRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBoaWRlIHRvb2xzIGlmIG5lZWRlZFxuICAgIGRpc2FibGVVSSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdEV2ZW50cyAoKSB7XG4gICAgLy8gYWRkIGV2ZW50c1xuICAgIGlmIChjYXJvdXNlbCAmJiBUUkFOU0lUSU9ORU5EKSB7XG4gICAgICB2YXIgZXZlID0ge307XG4gICAgICBldmVbVFJBTlNJVElPTkVORF0gPSBvblRyYW5zaXRpb25FbmQ7XG4gICAgICBhZGRFdmVudHMoY29udGFpbmVyLCBldmUpO1xuICAgIH1cblxuICAgIGlmICh0b3VjaCkgeyBhZGRFdmVudHMoY29udGFpbmVyLCB0b3VjaEV2ZW50cywgb3B0aW9ucy5wcmV2ZW50U2Nyb2xsT25Ub3VjaCk7IH1cbiAgICBpZiAobW91c2VEcmFnKSB7IGFkZEV2ZW50cyhjb250YWluZXIsIGRyYWdFdmVudHMpOyB9XG4gICAgaWYgKGFycm93S2V5cykgeyBhZGRFdmVudHMoZG9jLCBkb2NtZW50S2V5ZG93bkV2ZW50KTsgfVxuXG4gICAgaWYgKG5lc3RlZCA9PT0gJ2lubmVyJykge1xuICAgICAgZXZlbnRzLm9uKCdvdXRlclJlc2l6ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlc2l6ZVRhc2tzKCk7XG4gICAgICAgIGV2ZW50cy5lbWl0KCdpbm5lckxvYWRlZCcsIGluZm8oKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNpdmUgfHwgZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGggfHwgYXV0b0hlaWdodCB8fCAhaG9yaXpvbnRhbCkge1xuICAgICAgYWRkRXZlbnRzKHdpbiwgeydyZXNpemUnOiBvblJlc2l6ZX0pO1xuICAgIH1cblxuICAgIGlmIChhdXRvSGVpZ2h0KSB7XG4gICAgICBpZiAobmVzdGVkID09PSAnb3V0ZXInKSB7XG4gICAgICAgIGV2ZW50cy5vbignaW5uZXJMb2FkZWQnLCBkb0F1dG9IZWlnaHQpO1xuICAgICAgfSBlbHNlIGlmICghZGlzYWJsZSkgeyBkb0F1dG9IZWlnaHQoKTsgfVxuICAgIH1cblxuICAgIGRvTGF6eUxvYWQoKTtcbiAgICBpZiAoZGlzYWJsZSkgeyBkaXNhYmxlU2xpZGVyKCk7IH0gZWxzZSBpZiAoZnJlZXplKSB7IGZyZWV6ZVNsaWRlcigpOyB9XG5cbiAgICBldmVudHMub24oJ2luZGV4Q2hhbmdlZCcsIGFkZGl0aW9uYWxVcGRhdGVzKTtcbiAgICBpZiAobmVzdGVkID09PSAnaW5uZXInKSB7IGV2ZW50cy5lbWl0KCdpbm5lckxvYWRlZCcsIGluZm8oKSk7IH1cbiAgICBpZiAodHlwZW9mIG9uSW5pdCA9PT0gJ2Z1bmN0aW9uJykgeyBvbkluaXQoaW5mbygpKTsgfVxuICAgIGlzT24gPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSAoKSB7XG4gICAgLy8gc2hlZXRcbiAgICBzaGVldC5kaXNhYmxlZCA9IHRydWU7XG4gICAgaWYgKHNoZWV0Lm93bmVyTm9kZSkgeyBzaGVldC5vd25lck5vZGUucmVtb3ZlKCk7IH1cblxuICAgIC8vIHJlbW92ZSB3aW4gZXZlbnQgbGlzdGVuZXJzXG4gICAgcmVtb3ZlRXZlbnRzKHdpbiwgeydyZXNpemUnOiBvblJlc2l6ZX0pO1xuXG4gICAgLy8gYXJyb3dLZXlzLCBjb250cm9scywgbmF2XG4gICAgaWYgKGFycm93S2V5cykgeyByZW1vdmVFdmVudHMoZG9jLCBkb2NtZW50S2V5ZG93bkV2ZW50KTsgfVxuICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikgeyByZW1vdmVFdmVudHMoY29udHJvbHNDb250YWluZXIsIGNvbnRyb2xzRXZlbnRzKTsgfVxuICAgIGlmIChuYXZDb250YWluZXIpIHsgcmVtb3ZlRXZlbnRzKG5hdkNvbnRhaW5lciwgbmF2RXZlbnRzKTsgfVxuXG4gICAgLy8gYXV0b3BsYXlcbiAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCBob3ZlckV2ZW50cyk7XG4gICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgdmlzaWJpbGl0eUV2ZW50KTtcbiAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgcmVtb3ZlRXZlbnRzKGF1dG9wbGF5QnV0dG9uLCB7J2NsaWNrJzogdG9nZ2xlQXV0b3BsYXl9KTsgfVxuICAgIGlmIChhdXRvcGxheSkgeyBjbGVhckludGVydmFsKGF1dG9wbGF5VGltZXIpOyB9XG5cbiAgICAvLyBjb250YWluZXJcbiAgICBpZiAoY2Fyb3VzZWwgJiYgVFJBTlNJVElPTkVORCkge1xuICAgICAgdmFyIGV2ZSA9IHt9O1xuICAgICAgZXZlW1RSQU5TSVRJT05FTkRdID0gb25UcmFuc2l0aW9uRW5kO1xuICAgICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgZXZlKTtcbiAgICB9XG4gICAgaWYgKHRvdWNoKSB7IHJlbW92ZUV2ZW50cyhjb250YWluZXIsIHRvdWNoRXZlbnRzKTsgfVxuICAgIGlmIChtb3VzZURyYWcpIHsgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgZHJhZ0V2ZW50cyk7IH1cblxuICAgIC8vIGNhY2hlIE9iamVjdCB2YWx1ZXMgaW4gb3B0aW9ucyAmJiByZXNldCBIVE1MXG4gICAgdmFyIGh0bWxMaXN0ID0gW2NvbnRhaW5lckhUTUwsIGNvbnRyb2xzQ29udGFpbmVySFRNTCwgcHJldkJ1dHRvbkhUTUwsIG5leHRCdXR0b25IVE1MLCBuYXZDb250YWluZXJIVE1MLCBhdXRvcGxheUJ1dHRvbkhUTUxdO1xuXG4gICAgdG5zTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIHZhciBlbCA9IGl0ZW0gPT09ICdjb250YWluZXInID8gb3V0ZXJXcmFwcGVyIDogb3B0aW9uc1tpdGVtXTtcblxuICAgICAgaWYgKHR5cGVvZiBlbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdmFyIHByZXZFbCA9IGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgPyBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nIDogZmFsc2UsXG4gICAgICAgICAgICBwYXJlbnRFbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgICAgIGVsLm91dGVySFRNTCA9IGh0bWxMaXN0W2ldO1xuICAgICAgICBvcHRpb25zW2l0ZW1dID0gcHJldkVsID8gcHJldkVsLm5leHRFbGVtZW50U2libGluZyA6IHBhcmVudEVsLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICAvLyByZXNldCB2YXJpYWJsZXNcbiAgICB0bnNMaXN0ID0gYW5pbWF0ZUluID0gYW5pbWF0ZU91dCA9IGFuaW1hdGVEZWxheSA9IGFuaW1hdGVOb3JtYWwgPSBob3Jpem9udGFsID0gb3V0ZXJXcmFwcGVyID0gaW5uZXJXcmFwcGVyID0gY29udGFpbmVyID0gY29udGFpbmVyUGFyZW50ID0gY29udGFpbmVySFRNTCA9IHNsaWRlSXRlbXMgPSBzbGlkZUNvdW50ID0gYnJlYWtwb2ludFpvbmUgPSB3aW5kb3dXaWR0aCA9IGF1dG9XaWR0aCA9IGZpeGVkV2lkdGggPSBlZGdlUGFkZGluZyA9IGd1dHRlciA9IHZpZXdwb3J0ID0gaXRlbXMgPSBzbGlkZUJ5ID0gdmlld3BvcnRNYXggPSBhcnJvd0tleXMgPSBzcGVlZCA9IHJld2luZCA9IGxvb3AgPSBhdXRvSGVpZ2h0ID0gc2hlZXQgPSBsYXp5bG9hZCA9IHNsaWRlUG9zaXRpb25zID0gc2xpZGVJdGVtc091dCA9IGNsb25lQ291bnQgPSBzbGlkZUNvdW50TmV3ID0gaGFzUmlnaHREZWFkWm9uZSA9IHJpZ2h0Qm91bmRhcnkgPSB1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSA9IHRyYW5zZm9ybUF0dHIgPSB0cmFuc2Zvcm1QcmVmaXggPSB0cmFuc2Zvcm1Qb3N0Zml4ID0gZ2V0SW5kZXhNYXggPSBpbmRleCA9IGluZGV4Q2FjaGVkID0gaW5kZXhNaW4gPSBpbmRleE1heCA9IHJlc2l6ZVRpbWVyID0gc3dpcGVBbmdsZSA9IG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9IHJ1bm5pbmcgPSBvbkluaXQgPSBldmVudHMgPSBuZXdDb250YWluZXJDbGFzc2VzID0gc2xpZGVJZCA9IGRpc2FibGUgPSBkaXNhYmxlZCA9IGZyZWV6YWJsZSA9IGZyZWV6ZSA9IGZyb3plbiA9IGNvbnRyb2xzRXZlbnRzID0gbmF2RXZlbnRzID0gaG92ZXJFdmVudHMgPSB2aXNpYmlsaXR5RXZlbnQgPSBkb2NtZW50S2V5ZG93bkV2ZW50ID0gdG91Y2hFdmVudHMgPSBkcmFnRXZlbnRzID0gaGFzQ29udHJvbHMgPSBoYXNOYXYgPSBuYXZBc1RodW1ibmFpbHMgPSBoYXNBdXRvcGxheSA9IGhhc1RvdWNoID0gaGFzTW91c2VEcmFnID0gc2xpZGVBY3RpdmVDbGFzcyA9IGltZ0NvbXBsZXRlQ2xhc3MgPSBpbWdFdmVudHMgPSBpbWdzQ29tcGxldGUgPSBjb250cm9scyA9IGNvbnRyb2xzVGV4dCA9IGNvbnRyb2xzQ29udGFpbmVyID0gY29udHJvbHNDb250YWluZXJIVE1MID0gcHJldkJ1dHRvbiA9IG5leHRCdXR0b24gPSBwcmV2SXNCdXR0b24gPSBuZXh0SXNCdXR0b24gPSBuYXYgPSBuYXZDb250YWluZXIgPSBuYXZDb250YWluZXJIVE1MID0gbmF2SXRlbXMgPSBwYWdlcyA9IHBhZ2VzQ2FjaGVkID0gbmF2Q2xpY2tlZCA9IG5hdkN1cnJlbnRJbmRleCA9IG5hdkN1cnJlbnRJbmRleENhY2hlZCA9IG5hdkFjdGl2ZUNsYXNzID0gbmF2U3RyID0gbmF2U3RyQ3VycmVudCA9IGF1dG9wbGF5ID0gYXV0b3BsYXlUaW1lb3V0ID0gYXV0b3BsYXlEaXJlY3Rpb24gPSBhdXRvcGxheVRleHQgPSBhdXRvcGxheUhvdmVyUGF1c2UgPSBhdXRvcGxheUJ1dHRvbiA9IGF1dG9wbGF5QnV0dG9uSFRNTCA9IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBhdXRvcGxheUh0bWxTdHJpbmdzID0gYXV0b3BsYXlUaW1lciA9IGFuaW1hdGluZyA9IGF1dG9wbGF5SG92ZXJQYXVzZWQgPSBhdXRvcGxheVVzZXJQYXVzZWQgPSBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQgPSBpbml0UG9zaXRpb24gPSBsYXN0UG9zaXRpb24gPSB0cmFuc2xhdGVJbml0ID0gZGlzWCA9IGRpc1kgPSBwYW5TdGFydCA9IHJhZkluZGV4ID0gZ2V0RGlzdCA9IHRvdWNoID0gbW91c2VEcmFnID0gbnVsbDtcbiAgICAvLyBjaGVjayB2YXJpYWJsZXNcbiAgICAvLyBbYW5pbWF0ZUluLCBhbmltYXRlT3V0LCBhbmltYXRlRGVsYXksIGFuaW1hdGVOb3JtYWwsIGhvcml6b250YWwsIG91dGVyV3JhcHBlciwgaW5uZXJXcmFwcGVyLCBjb250YWluZXIsIGNvbnRhaW5lclBhcmVudCwgY29udGFpbmVySFRNTCwgc2xpZGVJdGVtcywgc2xpZGVDb3VudCwgYnJlYWtwb2ludFpvbmUsIHdpbmRvd1dpZHRoLCBhdXRvV2lkdGgsIGZpeGVkV2lkdGgsIGVkZ2VQYWRkaW5nLCBndXR0ZXIsIHZpZXdwb3J0LCBpdGVtcywgc2xpZGVCeSwgdmlld3BvcnRNYXgsIGFycm93S2V5cywgc3BlZWQsIHJld2luZCwgbG9vcCwgYXV0b0hlaWdodCwgc2hlZXQsIGxhenlsb2FkLCBzbGlkZVBvc2l0aW9ucywgc2xpZGVJdGVtc091dCwgY2xvbmVDb3VudCwgc2xpZGVDb3VudE5ldywgaGFzUmlnaHREZWFkWm9uZSwgcmlnaHRCb3VuZGFyeSwgdXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0sIHRyYW5zZm9ybUF0dHIsIHRyYW5zZm9ybVByZWZpeCwgdHJhbnNmb3JtUG9zdGZpeCwgZ2V0SW5kZXhNYXgsIGluZGV4LCBpbmRleENhY2hlZCwgaW5kZXhNaW4sIGluZGV4TWF4LCByZXNpemVUaW1lciwgc3dpcGVBbmdsZSwgbW92ZURpcmVjdGlvbkV4cGVjdGVkLCBydW5uaW5nLCBvbkluaXQsIGV2ZW50cywgbmV3Q29udGFpbmVyQ2xhc3Nlcywgc2xpZGVJZCwgZGlzYWJsZSwgZGlzYWJsZWQsIGZyZWV6YWJsZSwgZnJlZXplLCBmcm96ZW4sIGNvbnRyb2xzRXZlbnRzLCBuYXZFdmVudHMsIGhvdmVyRXZlbnRzLCB2aXNpYmlsaXR5RXZlbnQsIGRvY21lbnRLZXlkb3duRXZlbnQsIHRvdWNoRXZlbnRzLCBkcmFnRXZlbnRzLCBoYXNDb250cm9scywgaGFzTmF2LCBuYXZBc1RodW1ibmFpbHMsIGhhc0F1dG9wbGF5LCBoYXNUb3VjaCwgaGFzTW91c2VEcmFnLCBzbGlkZUFjdGl2ZUNsYXNzLCBpbWdDb21wbGV0ZUNsYXNzLCBpbWdFdmVudHMsIGltZ3NDb21wbGV0ZSwgY29udHJvbHMsIGNvbnRyb2xzVGV4dCwgY29udHJvbHNDb250YWluZXIsIGNvbnRyb2xzQ29udGFpbmVySFRNTCwgcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbiwgcHJldklzQnV0dG9uLCBuZXh0SXNCdXR0b24sIG5hdiwgbmF2Q29udGFpbmVyLCBuYXZDb250YWluZXJIVE1MLCBuYXZJdGVtcywgcGFnZXMsIHBhZ2VzQ2FjaGVkLCBuYXZDbGlja2VkLCBuYXZDdXJyZW50SW5kZXgsIG5hdkN1cnJlbnRJbmRleENhY2hlZCwgbmF2QWN0aXZlQ2xhc3MsIG5hdlN0ciwgbmF2U3RyQ3VycmVudCwgYXV0b3BsYXksIGF1dG9wbGF5VGltZW91dCwgYXV0b3BsYXlEaXJlY3Rpb24sIGF1dG9wbGF5VGV4dCwgYXV0b3BsYXlIb3ZlclBhdXNlLCBhdXRvcGxheUJ1dHRvbiwgYXV0b3BsYXlCdXR0b25IVE1MLCBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5LCBhdXRvcGxheUh0bWxTdHJpbmdzLCBhdXRvcGxheVRpbWVyLCBhbmltYXRpbmcsIGF1dG9wbGF5SG92ZXJQYXVzZWQsIGF1dG9wbGF5VXNlclBhdXNlZCwgYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkLCBpbml0UG9zaXRpb24sIGxhc3RQb3NpdGlvbiwgdHJhbnNsYXRlSW5pdCwgZGlzWCwgZGlzWSwgcGFuU3RhcnQsIHJhZkluZGV4LCBnZXREaXN0LCB0b3VjaCwgbW91c2VEcmFnIF0uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IGlmIChpdGVtICE9PSBudWxsKSB7IGNvbnNvbGUubG9nKGl0ZW0pOyB9IH0pO1xuXG4gICAgZm9yICh2YXIgYSBpbiB0aGlzKSB7XG4gICAgICBpZiAoYSAhPT0gJ3JlYnVpbGQnKSB7IHRoaXNbYV0gPSBudWxsOyB9XG4gICAgfVxuICAgIGlzT24gPSBmYWxzZTtcbiAgfVxuXG4vLyA9PT0gT04gUkVTSVpFID09PVxuICAvLyByZXNwb25zaXZlIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoIHx8ICFob3Jpem9udGFsXG4gIGZ1bmN0aW9uIG9uUmVzaXplIChlKSB7XG4gICAgcmFmKGZ1bmN0aW9uKCl7IHJlc2l6ZVRhc2tzKGdldEV2ZW50KGUpKTsgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNpemVUYXNrcyAoZSkge1xuICAgIGlmICghaXNPbikgeyByZXR1cm47IH1cbiAgICBpZiAobmVzdGVkID09PSAnb3V0ZXInKSB7IGV2ZW50cy5lbWl0KCdvdXRlclJlc2l6ZWQnLCBpbmZvKGUpKTsgfVxuICAgIHdpbmRvd1dpZHRoID0gZ2V0V2luZG93V2lkdGgoKTtcbiAgICB2YXIgYnBDaGFuZ2VkLFxuICAgICAgICBicmVha3BvaW50Wm9uZVRlbSA9IGJyZWFrcG9pbnRab25lLFxuICAgICAgICBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gZmFsc2U7XG5cbiAgICBpZiAocmVzcG9uc2l2ZSkge1xuICAgICAgc2V0QnJlYWtwb2ludFpvbmUoKTtcbiAgICAgIGJwQ2hhbmdlZCA9IGJyZWFrcG9pbnRab25lVGVtICE9PSBicmVha3BvaW50Wm9uZTtcbiAgICAgIC8vIGlmIChoYXNSaWdodERlYWRab25lKSB7IG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlOyB9IC8vICo/XG4gICAgICBpZiAoYnBDaGFuZ2VkKSB7IGV2ZW50cy5lbWl0KCduZXdCcmVha3BvaW50U3RhcnQnLCBpbmZvKGUpKTsgfVxuICAgIH1cblxuICAgIHZhciBpbmRDaGFuZ2VkLFxuICAgICAgICBpdGVtc0NoYW5nZWQsXG4gICAgICAgIGl0ZW1zVGVtID0gaXRlbXMsXG4gICAgICAgIGRpc2FibGVUZW0gPSBkaXNhYmxlLFxuICAgICAgICBmcmVlemVUZW0gPSBmcmVlemUsXG4gICAgICAgIGFycm93S2V5c1RlbSA9IGFycm93S2V5cyxcbiAgICAgICAgY29udHJvbHNUZW0gPSBjb250cm9scyxcbiAgICAgICAgbmF2VGVtID0gbmF2LFxuICAgICAgICB0b3VjaFRlbSA9IHRvdWNoLFxuICAgICAgICBtb3VzZURyYWdUZW0gPSBtb3VzZURyYWcsXG4gICAgICAgIGF1dG9wbGF5VGVtID0gYXV0b3BsYXksXG4gICAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZVRlbSA9IGF1dG9wbGF5SG92ZXJQYXVzZSxcbiAgICAgICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVRlbSA9IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHksXG4gICAgICAgIGluZGV4VGVtID0gaW5kZXg7XG5cbiAgICBpZiAoYnBDaGFuZ2VkKSB7XG4gICAgICB2YXIgZml4ZWRXaWR0aFRlbSA9IGZpeGVkV2lkdGgsXG4gICAgICAgICAgYXV0b0hlaWdodFRlbSA9IGF1dG9IZWlnaHQsXG4gICAgICAgICAgY29udHJvbHNUZXh0VGVtID0gY29udHJvbHNUZXh0LFxuICAgICAgICAgIGNlbnRlclRlbSA9IGNlbnRlcixcbiAgICAgICAgICBhdXRvcGxheVRleHRUZW0gPSBhdXRvcGxheVRleHQ7XG5cbiAgICAgIGlmICghQ1NTTVEpIHtcbiAgICAgICAgdmFyIGd1dHRlclRlbSA9IGd1dHRlcixcbiAgICAgICAgICAgIGVkZ2VQYWRkaW5nVGVtID0gZWRnZVBhZGRpbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ2V0IG9wdGlvbjpcbiAgICAvLyBmaXhlZCB3aWR0aDogdmlld3BvcnQsIGZpeGVkV2lkdGgsIGd1dHRlciA9PiBpdGVtc1xuICAgIC8vIG90aGVyczogd2luZG93IHdpZHRoID0+IGFsbCB2YXJpYWJsZXNcbiAgICAvLyBhbGw6IGl0ZW1zID0+IHNsaWRlQnlcbiAgICBhcnJvd0tleXMgPSBnZXRPcHRpb24oJ2Fycm93S2V5cycpO1xuICAgIGNvbnRyb2xzID0gZ2V0T3B0aW9uKCdjb250cm9scycpO1xuICAgIG5hdiA9IGdldE9wdGlvbignbmF2Jyk7XG4gICAgdG91Y2ggPSBnZXRPcHRpb24oJ3RvdWNoJyk7XG4gICAgY2VudGVyID0gZ2V0T3B0aW9uKCdjZW50ZXInKTtcbiAgICBtb3VzZURyYWcgPSBnZXRPcHRpb24oJ21vdXNlRHJhZycpO1xuICAgIGF1dG9wbGF5ID0gZ2V0T3B0aW9uKCdhdXRvcGxheScpO1xuICAgIGF1dG9wbGF5SG92ZXJQYXVzZSA9IGdldE9wdGlvbignYXV0b3BsYXlIb3ZlclBhdXNlJyk7XG4gICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGdldE9wdGlvbignYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eScpO1xuXG4gICAgaWYgKGJwQ2hhbmdlZCkge1xuICAgICAgZGlzYWJsZSA9IGdldE9wdGlvbignZGlzYWJsZScpO1xuICAgICAgZml4ZWRXaWR0aCA9IGdldE9wdGlvbignZml4ZWRXaWR0aCcpO1xuICAgICAgc3BlZWQgPSBnZXRPcHRpb24oJ3NwZWVkJyk7XG4gICAgICBhdXRvSGVpZ2h0ID0gZ2V0T3B0aW9uKCdhdXRvSGVpZ2h0Jyk7XG4gICAgICBjb250cm9sc1RleHQgPSBnZXRPcHRpb24oJ2NvbnRyb2xzVGV4dCcpO1xuICAgICAgYXV0b3BsYXlUZXh0ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVRleHQnKTtcbiAgICAgIGF1dG9wbGF5VGltZW91dCA9IGdldE9wdGlvbignYXV0b3BsYXlUaW1lb3V0Jyk7XG5cbiAgICAgIGlmICghQ1NTTVEpIHtcbiAgICAgICAgZWRnZVBhZGRpbmcgPSBnZXRPcHRpb24oJ2VkZ2VQYWRkaW5nJyk7XG4gICAgICAgIGd1dHRlciA9IGdldE9wdGlvbignZ3V0dGVyJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHVwZGF0ZSBvcHRpb25zXG4gICAgcmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlKGRpc2FibGUpO1xuXG4gICAgdmlld3BvcnQgPSBnZXRWaWV3cG9ydFdpZHRoKCk7IC8vIDw9IGVkZ2VQYWRkaW5nLCBndXR0ZXJcbiAgICBpZiAoKCFob3Jpem9udGFsIHx8IGF1dG9XaWR0aCkgJiYgIWRpc2FibGUpIHtcbiAgICAgIHNldFNsaWRlUG9zaXRpb25zKCk7XG4gICAgICBpZiAoIWhvcml6b250YWwpIHtcbiAgICAgICAgdXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQoKTsgLy8gPD0gc2V0U2xpZGVQb3NpdGlvbnNcbiAgICAgICAgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCkge1xuICAgICAgcmlnaHRCb3VuZGFyeSA9IGdldFJpZ2h0Qm91bmRhcnkoKTsgLy8gYXV0b1dpZHRoOiA8PSB2aWV3cG9ydCwgc2xpZGVQb3NpdGlvbnMsIGd1dHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZml4ZWRXaWR0aDogPD0gdmlld3BvcnQsIGZpeGVkV2lkdGgsIGd1dHRlclxuICAgICAgaW5kZXhNYXggPSBnZXRJbmRleE1heCgpOyAvLyBhdXRvV2lkdGg6IDw9IHJpZ2h0Qm91bmRhcnksIHNsaWRlUG9zaXRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpeGVkV2lkdGg6IDw9IHJpZ2h0Qm91bmRhcnksIGZpeGVkV2lkdGgsIGd1dHRlclxuICAgIH1cblxuICAgIGlmIChicENoYW5nZWQgfHwgZml4ZWRXaWR0aCkge1xuICAgICAgaXRlbXMgPSBnZXRPcHRpb24oJ2l0ZW1zJyk7XG4gICAgICBzbGlkZUJ5ID0gZ2V0T3B0aW9uKCdzbGlkZUJ5Jyk7XG4gICAgICBpdGVtc0NoYW5nZWQgPSBpdGVtcyAhPT0gaXRlbXNUZW07XG5cbiAgICAgIGlmIChpdGVtc0NoYW5nZWQpIHtcbiAgICAgICAgaWYgKCFmaXhlZFdpZHRoICYmICFhdXRvV2lkdGgpIHsgaW5kZXhNYXggPSBnZXRJbmRleE1heCgpOyB9IC8vIDw9IGl0ZW1zXG4gICAgICAgIC8vIGNoZWNrIGluZGV4IGJlZm9yZSB0cmFuc2Zvcm0gaW4gY2FzZVxuICAgICAgICAvLyBzbGlkZXIgcmVhY2ggdGhlIHJpZ2h0IGVkZ2UgdGhlbiBpdGVtcyBiZWNvbWUgYmlnZ2VyXG4gICAgICAgIHVwZGF0ZUluZGV4KCk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmIChicENoYW5nZWQpIHtcbiAgICAgIGlmIChkaXNhYmxlICE9PSBkaXNhYmxlVGVtKSB7XG4gICAgICAgIGlmIChkaXNhYmxlKSB7XG4gICAgICAgICAgZGlzYWJsZVNsaWRlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVuYWJsZVNsaWRlcigpOyAvLyA8PSBzbGlkZVBvc2l0aW9ucywgcmlnaHRCb3VuZGFyeSwgaW5kZXhNYXhcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmcmVlemFibGUgJiYgKGJwQ2hhbmdlZCB8fCBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCkpIHtcbiAgICAgIGZyZWV6ZSA9IGdldEZyZWV6ZSgpOyAvLyA8PSBhdXRvV2lkdGg6IHNsaWRlUG9zaXRpb25zLCBndXR0ZXIsIHZpZXdwb3J0LCByaWdodEJvdW5kYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPD0gZml4ZWRXaWR0aDogZml4ZWRXaWR0aCwgZ3V0dGVyLCByaWdodEJvdW5kYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPD0gb3RoZXJzOiBpdGVtc1xuXG4gICAgICBpZiAoZnJlZXplICE9PSBmcmVlemVUZW0pIHtcbiAgICAgICAgaWYgKGZyZWV6ZSkge1xuICAgICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtKGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlKGdldFN0YXJ0SW5kZXgoMCkpKTtcbiAgICAgICAgICBmcmVlemVTbGlkZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1bmZyZWV6ZVNsaWRlcigpO1xuICAgICAgICAgIG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlKGRpc2FibGUgfHwgZnJlZXplKTsgLy8gY29udHJvbHMsIG5hdiwgdG91Y2gsIG1vdXNlRHJhZywgYXJyb3dLZXlzLCBhdXRvcGxheSwgYXV0b3BsYXlIb3ZlclBhdXNlLCBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5XG4gICAgaWYgKCFhdXRvcGxheSkgeyBhdXRvcGxheUhvdmVyUGF1c2UgPSBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID0gZmFsc2U7IH1cblxuICAgIGlmIChhcnJvd0tleXMgIT09IGFycm93S2V5c1RlbSkge1xuICAgICAgYXJyb3dLZXlzID9cbiAgICAgICAgYWRkRXZlbnRzKGRvYywgZG9jbWVudEtleWRvd25FdmVudCkgOlxuICAgICAgICByZW1vdmVFdmVudHMoZG9jLCBkb2NtZW50S2V5ZG93bkV2ZW50KTtcbiAgICB9XG4gICAgaWYgKGNvbnRyb2xzICE9PSBjb250cm9sc1RlbSkge1xuICAgICAgaWYgKGNvbnRyb2xzKSB7XG4gICAgICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICAgIHNob3dFbGVtZW50KGNvbnRyb2xzQ29udGFpbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocHJldkJ1dHRvbikgeyBzaG93RWxlbWVudChwcmV2QnV0dG9uKTsgfVxuICAgICAgICAgIGlmIChuZXh0QnV0dG9uKSB7IHNob3dFbGVtZW50KG5leHRCdXR0b24pOyB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICAgIGhpZGVFbGVtZW50KGNvbnRyb2xzQ29udGFpbmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocHJldkJ1dHRvbikgeyBoaWRlRWxlbWVudChwcmV2QnV0dG9uKTsgfVxuICAgICAgICAgIGlmIChuZXh0QnV0dG9uKSB7IGhpZGVFbGVtZW50KG5leHRCdXR0b24pOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG5hdiAhPT0gbmF2VGVtKSB7XG4gICAgICBuYXYgP1xuICAgICAgICBzaG93RWxlbWVudChuYXZDb250YWluZXIpIDpcbiAgICAgICAgaGlkZUVsZW1lbnQobmF2Q29udGFpbmVyKTtcbiAgICB9XG4gICAgaWYgKHRvdWNoICE9PSB0b3VjaFRlbSkge1xuICAgICAgdG91Y2ggP1xuICAgICAgICBhZGRFdmVudHMoY29udGFpbmVyLCB0b3VjaEV2ZW50cywgb3B0aW9ucy5wcmV2ZW50U2Nyb2xsT25Ub3VjaCkgOlxuICAgICAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCB0b3VjaEV2ZW50cyk7XG4gICAgfVxuICAgIGlmIChtb3VzZURyYWcgIT09IG1vdXNlRHJhZ1RlbSkge1xuICAgICAgbW91c2VEcmFnID9cbiAgICAgICAgYWRkRXZlbnRzKGNvbnRhaW5lciwgZHJhZ0V2ZW50cykgOlxuICAgICAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCBkcmFnRXZlbnRzKTtcbiAgICB9XG4gICAgaWYgKGF1dG9wbGF5ICE9PSBhdXRvcGxheVRlbSkge1xuICAgICAgaWYgKGF1dG9wbGF5KSB7XG4gICAgICAgIGlmIChhdXRvcGxheUJ1dHRvbikgeyBzaG93RWxlbWVudChhdXRvcGxheUJ1dHRvbik7IH1cbiAgICAgICAgaWYgKCFhbmltYXRpbmcgJiYgIWF1dG9wbGF5VXNlclBhdXNlZCkgeyBzdGFydEF1dG9wbGF5KCk7IH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChhdXRvcGxheUJ1dHRvbikgeyBoaWRlRWxlbWVudChhdXRvcGxheUJ1dHRvbik7IH1cbiAgICAgICAgaWYgKGFuaW1hdGluZykgeyBzdG9wQXV0b3BsYXkoKTsgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYXV0b3BsYXlIb3ZlclBhdXNlICE9PSBhdXRvcGxheUhvdmVyUGF1c2VUZW0pIHtcbiAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZSA/XG4gICAgICAgIGFkZEV2ZW50cyhjb250YWluZXIsIGhvdmVyRXZlbnRzKSA6XG4gICAgICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGhvdmVyRXZlbnRzKTtcbiAgICB9XG4gICAgaWYgKGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgIT09IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHlUZW0pIHtcbiAgICAgIGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgP1xuICAgICAgICBhZGRFdmVudHMoZG9jLCB2aXNpYmlsaXR5RXZlbnQpIDpcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGRvYywgdmlzaWJpbGl0eUV2ZW50KTtcbiAgICB9XG5cbiAgICBpZiAoYnBDaGFuZ2VkKSB7XG4gICAgICBpZiAoZml4ZWRXaWR0aCAhPT0gZml4ZWRXaWR0aFRlbSB8fCBjZW50ZXIgIT09IGNlbnRlclRlbSkgeyBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTsgfVxuXG4gICAgICBpZiAoYXV0b0hlaWdodCAhPT0gYXV0b0hlaWdodFRlbSkge1xuICAgICAgICBpZiAoIWF1dG9IZWlnaHQpIHsgaW5uZXJXcmFwcGVyLnN0eWxlLmhlaWdodCA9ICcnOyB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjb250cm9scyAmJiBjb250cm9sc1RleHQgIT09IGNvbnRyb2xzVGV4dFRlbSkge1xuICAgICAgICBwcmV2QnV0dG9uLmlubmVySFRNTCA9IGNvbnRyb2xzVGV4dFswXTtcbiAgICAgICAgbmV4dEJ1dHRvbi5pbm5lckhUTUwgPSBjb250cm9sc1RleHRbMV07XG4gICAgICB9XG5cbiAgICAgIGlmIChhdXRvcGxheUJ1dHRvbiAmJiBhdXRvcGxheVRleHQgIT09IGF1dG9wbGF5VGV4dFRlbSkge1xuICAgICAgICB2YXIgaSA9IGF1dG9wbGF5ID8gMSA6IDAsXG4gICAgICAgICAgICBodG1sID0gYXV0b3BsYXlCdXR0b24uaW5uZXJIVE1MLFxuICAgICAgICAgICAgbGVuID0gaHRtbC5sZW5ndGggLSBhdXRvcGxheVRleHRUZW1baV0ubGVuZ3RoO1xuICAgICAgICBpZiAoaHRtbC5zdWJzdHJpbmcobGVuKSA9PT0gYXV0b3BsYXlUZXh0VGVtW2ldKSB7XG4gICAgICAgICAgYXV0b3BsYXlCdXR0b24uaW5uZXJIVE1MID0gaHRtbC5zdWJzdHJpbmcoMCwgbGVuKSArIGF1dG9wbGF5VGV4dFtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2VudGVyICYmIChmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCkpIHsgbmVlZENvbnRhaW5lclRyYW5zZm9ybSA9IHRydWU7IH1cbiAgICB9XG5cbiAgICBpZiAoaXRlbXNDaGFuZ2VkIHx8IGZpeGVkV2lkdGggJiYgIWF1dG9XaWR0aCkge1xuICAgICAgcGFnZXMgPSBnZXRQYWdlcygpO1xuICAgICAgdXBkYXRlTmF2VmlzaWJpbGl0eSgpO1xuICAgIH1cblxuICAgIGluZENoYW5nZWQgPSBpbmRleCAhPT0gaW5kZXhUZW07XG4gICAgaWYgKGluZENoYW5nZWQpIHsgXG4gICAgICBldmVudHMuZW1pdCgnaW5kZXhDaGFuZ2VkJywgaW5mbygpKTtcbiAgICAgIG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoaXRlbXNDaGFuZ2VkKSB7XG4gICAgICBpZiAoIWluZENoYW5nZWQpIHsgYWRkaXRpb25hbFVwZGF0ZXMoKTsgfVxuICAgIH0gZWxzZSBpZiAoZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpIHtcbiAgICAgIGRvTGF6eUxvYWQoKTsgXG4gICAgICB1cGRhdGVTbGlkZVN0YXR1cygpO1xuICAgICAgdXBkYXRlTGl2ZVJlZ2lvbigpO1xuICAgIH1cblxuICAgIGlmIChpdGVtc0NoYW5nZWQgJiYgIWNhcm91c2VsKSB7IHVwZGF0ZUdhbGxlcnlTbGlkZVBvc2l0aW9ucygpOyB9XG5cbiAgICBpZiAoIWRpc2FibGUgJiYgIWZyZWV6ZSkge1xuICAgICAgLy8gbm9uLW1lZHVhcXVlcmllczogSUU4XG4gICAgICBpZiAoYnBDaGFuZ2VkICYmICFDU1NNUSkge1xuICAgICAgICAvLyBtaWRkbGUgd3JhcHBlciBzdHlsZXNcbiAgICAgICAgaWYgKGF1dG9IZWlnaHQgIT09IGF1dG9oZWlnaHRUZW0gfHwgc3BlZWQgIT09IHNwZWVkVGVtKSB7XG4gICAgICAgICAgdXBkYXRlX2Nhcm91c2VsX3RyYW5zaXRpb25fZHVyYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlubmVyIHdyYXBwZXIgc3R5bGVzXG4gICAgICAgIGlmIChlZGdlUGFkZGluZyAhPT0gZWRnZVBhZGRpbmdUZW0gfHwgZ3V0dGVyICE9PSBndXR0ZXJUZW0pIHtcbiAgICAgICAgICBpbm5lcldyYXBwZXIuc3R5bGUuY3NzVGV4dCA9IGdldElubmVyV3JhcHBlclN0eWxlcyhlZGdlUGFkZGluZywgZ3V0dGVyLCBmaXhlZFdpZHRoLCBzcGVlZCwgYXV0b0hlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaG9yaXpvbnRhbCkge1xuICAgICAgICAgIC8vIGNvbnRhaW5lciBzdHlsZXNcbiAgICAgICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGdldENvbnRhaW5lcldpZHRoKGZpeGVkV2lkdGgsIGd1dHRlciwgaXRlbXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHNsaWRlIHN0eWxlc1xuICAgICAgICAgIHZhciBzdHIgPSBnZXRTbGlkZVdpZHRoU3R5bGUoZml4ZWRXaWR0aCwgZ3V0dGVyLCBpdGVtcykgKyBcbiAgICAgICAgICAgICAgICAgICAgZ2V0U2xpZGVHdXR0ZXJTdHlsZShndXR0ZXIpO1xuXG4gICAgICAgICAgLy8gcmVtb3ZlIHRoZSBsYXN0IGxpbmUgYW5kXG4gICAgICAgICAgLy8gYWRkIG5ldyBzdHlsZXNcbiAgICAgICAgICByZW1vdmVDU1NSdWxlKHNoZWV0LCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkgLSAxKTtcbiAgICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBhdXRvIGhlaWdodFxuICAgICAgaWYgKGF1dG9IZWlnaHQpIHsgZG9BdXRvSGVpZ2h0KCk7IH1cblxuICAgICAgaWYgKG5lZWRDb250YWluZXJUcmFuc2Zvcm0pIHtcbiAgICAgICAgZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQoKTtcbiAgICAgICAgaW5kZXhDYWNoZWQgPSBpbmRleDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYnBDaGFuZ2VkKSB7IGV2ZW50cy5lbWl0KCduZXdCcmVha3BvaW50RW5kJywgaW5mbyhlKSk7IH1cbiAgfVxuXG5cblxuXG5cbiAgLy8gPT09IElOSVRJQUxJWkFUSU9OIEZVTkNUSU9OUyA9PT0gLy9cbiAgZnVuY3Rpb24gZ2V0RnJlZXplICgpIHtcbiAgICBpZiAoIWZpeGVkV2lkdGggJiYgIWF1dG9XaWR0aCkge1xuICAgICAgdmFyIGEgPSBjZW50ZXIgPyBpdGVtcyAtIChpdGVtcyAtIDEpIC8gMiA6IGl0ZW1zO1xuICAgICAgcmV0dXJuICBzbGlkZUNvdW50IDw9IGE7XG4gICAgfVxuXG4gICAgdmFyIHdpZHRoID0gZml4ZWRXaWR0aCA/IChmaXhlZFdpZHRoICsgZ3V0dGVyKSAqIHNsaWRlQ291bnQgOiBzbGlkZVBvc2l0aW9uc1tzbGlkZUNvdW50XSxcbiAgICAgICAgdnAgPSBlZGdlUGFkZGluZyA/IHZpZXdwb3J0ICsgZWRnZVBhZGRpbmcgKiAyIDogdmlld3BvcnQgKyBndXR0ZXI7XG5cbiAgICBpZiAoY2VudGVyKSB7XG4gICAgICB2cCAtPSBmaXhlZFdpZHRoID8gKHZpZXdwb3J0IC0gZml4ZWRXaWR0aCkgLyAyIDogKHZpZXdwb3J0IC0gKHNsaWRlUG9zaXRpb25zW2luZGV4ICsgMV0gLSBzbGlkZVBvc2l0aW9uc1tpbmRleF0gLSBndXR0ZXIpKSAvIDI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdpZHRoIDw9IHZwO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0QnJlYWtwb2ludFpvbmUgKCkge1xuICAgIGJyZWFrcG9pbnRab25lID0gMDtcbiAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XG4gICAgICBicCA9IHBhcnNlSW50KGJwKTsgLy8gY29udmVydCBzdHJpbmcgdG8gbnVtYmVyXG4gICAgICBpZiAod2luZG93V2lkdGggPj0gYnApIHsgYnJlYWtwb2ludFpvbmUgPSBicDsgfVxuICAgIH1cbiAgfVxuXG4gIC8vIChzbGlkZUJ5LCBpbmRleE1pbiwgaW5kZXhNYXgpID0+IGluZGV4XG4gIHZhciB1cGRhdGVJbmRleCA9IChmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGxvb3AgPyBcbiAgICAgIGNhcm91c2VsID9cbiAgICAgICAgLy8gbG9vcCArIGNhcm91c2VsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgbGVmdEVkZ2UgPSBpbmRleE1pbixcbiAgICAgICAgICAgICAgcmlnaHRFZGdlID0gaW5kZXhNYXg7XG5cbiAgICAgICAgICBsZWZ0RWRnZSArPSBzbGlkZUJ5O1xuICAgICAgICAgIHJpZ2h0RWRnZSAtPSBzbGlkZUJ5O1xuXG4gICAgICAgICAgLy8gYWRqdXN0IGVkZ2VzIHdoZW4gaGFzIGVkZ2UgcGFkZGluZ3NcbiAgICAgICAgICAvLyBvciBmaXhlZC13aWR0aCBzbGlkZXIgd2l0aCBleHRyYSBzcGFjZSBvbiB0aGUgcmlnaHQgc2lkZVxuICAgICAgICAgIGlmIChlZGdlUGFkZGluZykge1xuICAgICAgICAgICAgbGVmdEVkZ2UgKz0gMTtcbiAgICAgICAgICAgIHJpZ2h0RWRnZSAtPSAxO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZml4ZWRXaWR0aCkge1xuICAgICAgICAgICAgaWYgKCh2aWV3cG9ydCArIGd1dHRlciklKGZpeGVkV2lkdGggKyBndXR0ZXIpKSB7IHJpZ2h0RWRnZSAtPSAxOyB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNsb25lQ291bnQpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IHJpZ2h0RWRnZSkge1xuICAgICAgICAgICAgICBpbmRleCAtPSBzbGlkZUNvdW50O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IGxlZnRFZGdlKSB7XG4gICAgICAgICAgICAgIGluZGV4ICs9IHNsaWRlQ291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IDpcbiAgICAgICAgLy8gbG9vcCArIGdhbGxlcnlcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGluZGV4ID4gaW5kZXhNYXgpIHtcbiAgICAgICAgICAgIHdoaWxlIChpbmRleCA+PSBpbmRleE1pbiArIHNsaWRlQ291bnQpIHsgaW5kZXggLT0gc2xpZGVDb3VudDsgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCBpbmRleE1pbikge1xuICAgICAgICAgICAgd2hpbGUgKGluZGV4IDw9IGluZGV4TWF4IC0gc2xpZGVDb3VudCkgeyBpbmRleCArPSBzbGlkZUNvdW50OyB9XG4gICAgICAgICAgfVxuICAgICAgICB9IDpcbiAgICAgIC8vIG5vbi1sb29wXG4gICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgaW5kZXggPSBNYXRoLm1heChpbmRleE1pbiwgTWF0aC5taW4oaW5kZXhNYXgsIGluZGV4KSk7XG4gICAgICB9O1xuICB9KSgpO1xuXG4gIGZ1bmN0aW9uIGRpc2FibGVVSSAoKSB7XG4gICAgaWYgKCFhdXRvcGxheSAmJiBhdXRvcGxheUJ1dHRvbikgeyBoaWRlRWxlbWVudChhdXRvcGxheUJ1dHRvbik7IH1cbiAgICBpZiAoIW5hdiAmJiBuYXZDb250YWluZXIpIHsgaGlkZUVsZW1lbnQobmF2Q29udGFpbmVyKTsgfVxuICAgIGlmICghY29udHJvbHMpIHtcbiAgICAgIGlmIChjb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICBoaWRlRWxlbWVudChjb250cm9sc0NvbnRhaW5lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJldkJ1dHRvbikgeyBoaWRlRWxlbWVudChwcmV2QnV0dG9uKTsgfVxuICAgICAgICBpZiAobmV4dEJ1dHRvbikgeyBoaWRlRWxlbWVudChuZXh0QnV0dG9uKTsgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVuYWJsZVVJICgpIHtcbiAgICBpZiAoYXV0b3BsYXkgJiYgYXV0b3BsYXlCdXR0b24pIHsgc2hvd0VsZW1lbnQoYXV0b3BsYXlCdXR0b24pOyB9XG4gICAgaWYgKG5hdiAmJiBuYXZDb250YWluZXIpIHsgc2hvd0VsZW1lbnQobmF2Q29udGFpbmVyKTsgfVxuICAgIGlmIChjb250cm9scykge1xuICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XG4gICAgICAgIHNob3dFbGVtZW50KGNvbnRyb2xzQ29udGFpbmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwcmV2QnV0dG9uKSB7IHNob3dFbGVtZW50KHByZXZCdXR0b24pOyB9XG4gICAgICAgIGlmIChuZXh0QnV0dG9uKSB7IHNob3dFbGVtZW50KG5leHRCdXR0b24pOyB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZnJlZXplU2xpZGVyICgpIHtcbiAgICBpZiAoZnJvemVuKSB7IHJldHVybjsgfVxuXG4gICAgLy8gcmVtb3ZlIGVkZ2UgcGFkZGluZyBmcm9tIGlubmVyIHdyYXBwZXJcbiAgICBpZiAoZWRnZVBhZGRpbmcpIHsgaW5uZXJXcmFwcGVyLnN0eWxlLm1hcmdpbiA9ICcwcHgnOyB9XG5cbiAgICAvLyBhZGQgY2xhc3MgdG5zLXRyYW5zcGFyZW50IHRvIGNsb25lZCBzbGlkZXNcbiAgICBpZiAoY2xvbmVDb3VudCkge1xuICAgICAgdmFyIHN0ciA9ICd0bnMtdHJhbnNwYXJlbnQnO1xuICAgICAgZm9yICh2YXIgaSA9IGNsb25lQ291bnQ7IGktLTspIHtcbiAgICAgICAgaWYgKGNhcm91c2VsKSB7IGFkZENsYXNzKHNsaWRlSXRlbXNbaV0sIHN0cik7IH1cbiAgICAgICAgYWRkQ2xhc3Moc2xpZGVJdGVtc1tzbGlkZUNvdW50TmV3IC0gaSAtIDFdLCBzdHIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVwZGF0ZSB0b29sc1xuICAgIGRpc2FibGVVSSgpO1xuXG4gICAgZnJvemVuID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuZnJlZXplU2xpZGVyICgpIHtcbiAgICBpZiAoIWZyb3plbikgeyByZXR1cm47IH1cblxuICAgIC8vIHJlc3RvcmUgZWRnZSBwYWRkaW5nIGZvciBpbm5lciB3cmFwcGVyXG4gICAgLy8gZm9yIG1vcmRlcm4gYnJvd3NlcnNcbiAgICBpZiAoZWRnZVBhZGRpbmcgJiYgQ1NTTVEpIHsgaW5uZXJXcmFwcGVyLnN0eWxlLm1hcmdpbiA9ICcnOyB9XG5cbiAgICAvLyByZW1vdmUgY2xhc3MgdG5zLXRyYW5zcGFyZW50IHRvIGNsb25lZCBzbGlkZXNcbiAgICBpZiAoY2xvbmVDb3VudCkge1xuICAgICAgdmFyIHN0ciA9ICd0bnMtdHJhbnNwYXJlbnQnO1xuICAgICAgZm9yICh2YXIgaSA9IGNsb25lQ291bnQ7IGktLTspIHtcbiAgICAgICAgaWYgKGNhcm91c2VsKSB7IHJlbW92ZUNsYXNzKHNsaWRlSXRlbXNbaV0sIHN0cik7IH1cbiAgICAgICAgcmVtb3ZlQ2xhc3Moc2xpZGVJdGVtc1tzbGlkZUNvdW50TmV3IC0gaSAtIDFdLCBzdHIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVwZGF0ZSB0b29sc1xuICAgIGVuYWJsZVVJKCk7XG5cbiAgICBmcm96ZW4gPSBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpc2FibGVTbGlkZXIgKCkge1xuICAgIGlmIChkaXNhYmxlZCkgeyByZXR1cm47IH1cblxuICAgIHNoZWV0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKG5ld0NvbnRhaW5lckNsYXNzZXMuc3Vic3RyaW5nKDEpLCAnJyk7XG4gICAgcmVtb3ZlQXR0cnMoY29udGFpbmVyLCBbJ3N0eWxlJ10pO1xuICAgIGlmIChsb29wKSB7XG4gICAgICBmb3IgKHZhciBqID0gY2xvbmVDb3VudDsgai0tOykge1xuICAgICAgICBpZiAoY2Fyb3VzZWwpIHsgaGlkZUVsZW1lbnQoc2xpZGVJdGVtc1tqXSk7IH1cbiAgICAgICAgaGlkZUVsZW1lbnQoc2xpZGVJdGVtc1tzbGlkZUNvdW50TmV3IC0gaiAtIDFdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB2ZXJ0aWNhbCBzbGlkZXJcbiAgICBpZiAoIWhvcml6b250YWwgfHwgIWNhcm91c2VsKSB7IHJlbW92ZUF0dHJzKGlubmVyV3JhcHBlciwgWydzdHlsZSddKTsgfVxuXG4gICAgLy8gZ2FsbGVyeVxuICAgIGlmICghY2Fyb3VzZWwpIHsgXG4gICAgICBmb3IgKHZhciBpID0gaW5kZXgsIGwgPSBpbmRleCArIHNsaWRlQ291bnQ7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zW2ldO1xuICAgICAgICByZW1vdmVBdHRycyhpdGVtLCBbJ3N0eWxlJ10pO1xuICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlSW4pO1xuICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgdG9vbHNcbiAgICBkaXNhYmxlVUkoKTtcblxuICAgIGRpc2FibGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVuYWJsZVNsaWRlciAoKSB7XG4gICAgaWYgKCFkaXNhYmxlZCkgeyByZXR1cm47IH1cblxuICAgIHNoZWV0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSArPSBuZXdDb250YWluZXJDbGFzc2VzO1xuICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50KCk7XG5cbiAgICBpZiAobG9vcCkge1xuICAgICAgZm9yICh2YXIgaiA9IGNsb25lQ291bnQ7IGotLTspIHtcbiAgICAgICAgaWYgKGNhcm91c2VsKSB7IHNob3dFbGVtZW50KHNsaWRlSXRlbXNbal0pOyB9XG4gICAgICAgIHNob3dFbGVtZW50KHNsaWRlSXRlbXNbc2xpZGVDb3VudE5ldyAtIGogLSAxXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZ2FsbGVyeVxuICAgIGlmICghY2Fyb3VzZWwpIHsgXG4gICAgICBmb3IgKHZhciBpID0gaW5kZXgsIGwgPSBpbmRleCArIHNsaWRlQ291bnQ7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zW2ldLFxuICAgICAgICAgICAgY2xhc3NOID0gaSA8IGluZGV4ICsgaXRlbXMgPyBhbmltYXRlSW4gOiBhbmltYXRlTm9ybWFsO1xuICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSAoaSAtIGluZGV4KSAqIDEwMCAvIGl0ZW1zICsgJyUnO1xuICAgICAgICBhZGRDbGFzcyhpdGVtLCBjbGFzc04pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVwZGF0ZSB0b29sc1xuICAgIGVuYWJsZVVJKCk7XG5cbiAgICBkaXNhYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlTGl2ZVJlZ2lvbiAoKSB7XG4gICAgdmFyIHN0ciA9IGdldExpdmVSZWdpb25TdHIoKTtcbiAgICBpZiAobGl2ZXJlZ2lvbkN1cnJlbnQuaW5uZXJIVE1MICE9PSBzdHIpIHsgbGl2ZXJlZ2lvbkN1cnJlbnQuaW5uZXJIVE1MID0gc3RyOyB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMaXZlUmVnaW9uU3RyICgpIHtcbiAgICB2YXIgYXJyID0gZ2V0VmlzaWJsZVNsaWRlUmFuZ2UoKSxcbiAgICAgICAgc3RhcnQgPSBhcnJbMF0gKyAxLFxuICAgICAgICBlbmQgPSBhcnJbMV0gKyAxO1xuICAgIHJldHVybiBzdGFydCA9PT0gZW5kID8gc3RhcnQgKyAnJyA6IHN0YXJ0ICsgJyB0byAnICsgZW5kOyBcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZpc2libGVTbGlkZVJhbmdlICh2YWwpIHtcbiAgICBpZiAodmFsID09IG51bGwpIHsgdmFsID0gZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUoKTsgfVxuICAgIHZhciBzdGFydCA9IGluZGV4LCBlbmQsIHJhbmdlc3RhcnQsIHJhbmdlZW5kO1xuXG4gICAgLy8gZ2V0IHJhbmdlIHN0YXJ0LCByYW5nZSBlbmQgZm9yIGF1dG9XaWR0aCBhbmQgZml4ZWRXaWR0aFxuICAgIGlmIChjZW50ZXIgfHwgZWRnZVBhZGRpbmcpIHtcbiAgICAgIGlmIChhdXRvV2lkdGggfHwgZml4ZWRXaWR0aCkge1xuICAgICAgICByYW5nZXN0YXJ0ID0gLSAocGFyc2VGbG9hdCh2YWwpICsgZWRnZVBhZGRpbmcpO1xuICAgICAgICByYW5nZWVuZCA9IHJhbmdlc3RhcnQgKyB2aWV3cG9ydCArIGVkZ2VQYWRkaW5nICogMjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGF1dG9XaWR0aCkge1xuICAgICAgICByYW5nZXN0YXJ0ID0gc2xpZGVQb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgICByYW5nZWVuZCA9IHJhbmdlc3RhcnQgKyB2aWV3cG9ydDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBnZXQgc3RhcnQsIGVuZFxuICAgIC8vIC0gY2hlY2sgYXV0byB3aWR0aFxuICAgIGlmIChhdXRvV2lkdGgpIHtcbiAgICAgIHNsaWRlUG9zaXRpb25zLmZvckVhY2goZnVuY3Rpb24ocG9pbnQsIGkpIHtcbiAgICAgICAgaWYgKGkgPCBzbGlkZUNvdW50TmV3KSB7XG4gICAgICAgICAgaWYgKChjZW50ZXIgfHwgZWRnZVBhZGRpbmcpICYmIHBvaW50IDw9IHJhbmdlc3RhcnQgKyAwLjUpIHsgc3RhcnQgPSBpOyB9XG4gICAgICAgICAgaWYgKHJhbmdlZW5kIC0gcG9pbnQgPj0gMC41KSB7IGVuZCA9IGk7IH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAvLyAtIGNoZWNrIHBlcmNlbnRhZ2Ugd2lkdGgsIGZpeGVkIHdpZHRoXG4gICAgfSBlbHNlIHtcblxuICAgICAgaWYgKGZpeGVkV2lkdGgpIHtcbiAgICAgICAgdmFyIGNlbGwgPSBmaXhlZFdpZHRoICsgZ3V0dGVyO1xuICAgICAgICBpZiAoY2VudGVyIHx8IGVkZ2VQYWRkaW5nKSB7XG4gICAgICAgICAgc3RhcnQgPSBNYXRoLmZsb29yKHJhbmdlc3RhcnQvY2VsbCk7XG4gICAgICAgICAgZW5kID0gTWF0aC5jZWlsKHJhbmdlZW5kL2NlbGwgLSAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbmQgPSBzdGFydCArIE1hdGguY2VpbCh2aWV3cG9ydC9jZWxsKSAtIDE7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNlbnRlciB8fCBlZGdlUGFkZGluZykge1xuICAgICAgICAgIHZhciBhID0gaXRlbXMgLSAxO1xuICAgICAgICAgIGlmIChjZW50ZXIpIHtcbiAgICAgICAgICAgIHN0YXJ0IC09IGEgLyAyO1xuICAgICAgICAgICAgZW5kID0gaW5kZXggKyBhIC8gMjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5kID0gaW5kZXggKyBhO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChlZGdlUGFkZGluZykge1xuICAgICAgICAgICAgdmFyIGIgPSBlZGdlUGFkZGluZyAqIGl0ZW1zIC8gdmlld3BvcnQ7XG4gICAgICAgICAgICBzdGFydCAtPSBiO1xuICAgICAgICAgICAgZW5kICs9IGI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3RhcnQgPSBNYXRoLmZsb29yKHN0YXJ0KTtcbiAgICAgICAgICBlbmQgPSBNYXRoLmNlaWwoZW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbmQgPSBzdGFydCArIGl0ZW1zIC0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzdGFydCA9IE1hdGgubWF4KHN0YXJ0LCAwKTtcbiAgICAgIGVuZCA9IE1hdGgubWluKGVuZCwgc2xpZGVDb3VudE5ldyAtIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBbc3RhcnQsIGVuZF07XG4gIH1cblxuICBmdW5jdGlvbiBkb0xhenlMb2FkICgpIHtcbiAgICBpZiAobGF6eWxvYWQgJiYgIWRpc2FibGUpIHtcbiAgICAgIGdldEltYWdlQXJyYXkuYXBwbHkobnVsbCwgZ2V0VmlzaWJsZVNsaWRlUmFuZ2UoKSkuZm9yRWFjaChmdW5jdGlvbiAoaW1nKSB7XG4gICAgICAgIGlmICghaGFzQ2xhc3MoaW1nLCBpbWdDb21wbGV0ZUNsYXNzKSkge1xuICAgICAgICAgIC8vIHN0b3AgcHJvcGFnYXRpb24gdHJhbnNpdGlvbmVuZCBldmVudCB0byBjb250YWluZXJcbiAgICAgICAgICB2YXIgZXZlID0ge307XG4gICAgICAgICAgZXZlW1RSQU5TSVRJT05FTkRdID0gZnVuY3Rpb24gKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgfTtcbiAgICAgICAgICBhZGRFdmVudHMoaW1nLCBldmUpO1xuXG4gICAgICAgICAgYWRkRXZlbnRzKGltZywgaW1nRXZlbnRzKTtcblxuICAgICAgICAgIC8vIHVwZGF0ZSBzcmNcbiAgICAgICAgICBpbWcuc3JjID0gZ2V0QXR0cihpbWcsICdkYXRhLXNyYycpO1xuXG4gICAgICAgICAgLy8gdXBkYXRlIHNyY3NldFxuICAgICAgICAgIHZhciBzcmNzZXQgPSBnZXRBdHRyKGltZywgJ2RhdGEtc3Jjc2V0Jyk7XG4gICAgICAgICAgaWYgKHNyY3NldCkgeyBpbWcuc3Jjc2V0ID0gc3Jjc2V0OyB9XG5cbiAgICAgICAgICBhZGRDbGFzcyhpbWcsICdsb2FkaW5nJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uSW1nTG9hZGVkIChlKSB7XG4gICAgaW1nTG9hZGVkKGdldFRhcmdldChlKSk7XG4gIH1cblxuICBmdW5jdGlvbiBvbkltZ0ZhaWxlZCAoZSkge1xuICAgIGltZ0ZhaWxlZChnZXRUYXJnZXQoZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW1nTG9hZGVkIChpbWcpIHtcbiAgICBhZGRDbGFzcyhpbWcsICdsb2FkZWQnKTtcbiAgICBpbWdDb21wbGV0ZWQoaW1nKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGltZ0ZhaWxlZCAoaW1nKSB7XG4gICAgYWRkQ2xhc3MoaW1nLCAnZmFpbGVkJyk7XG4gICAgaW1nQ29tcGxldGVkKGltZyk7XG4gIH1cblxuICBmdW5jdGlvbiBpbWdDb21wbGV0ZWQgKGltZykge1xuICAgIGFkZENsYXNzKGltZywgJ3Rucy1jb21wbGV0ZScpO1xuICAgIHJlbW92ZUNsYXNzKGltZywgJ2xvYWRpbmcnKTtcbiAgICByZW1vdmVFdmVudHMoaW1nLCBpbWdFdmVudHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW1hZ2VBcnJheSAoc3RhcnQsIGVuZCkge1xuICAgIHZhciBpbWdzID0gW107XG4gICAgd2hpbGUgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgZm9yRWFjaChzbGlkZUl0ZW1zW3N0YXJ0XS5xdWVyeVNlbGVjdG9yQWxsKCdpbWcnKSwgZnVuY3Rpb24gKGltZykgeyBpbWdzLnB1c2goaW1nKTsgfSk7XG4gICAgICBzdGFydCsrO1xuICAgIH1cblxuICAgIHJldHVybiBpbWdzO1xuICB9XG5cbiAgLy8gY2hlY2sgaWYgYWxsIHZpc2libGUgaW1hZ2VzIGFyZSBsb2FkZWRcbiAgLy8gYW5kIHVwZGF0ZSBjb250YWluZXIgaGVpZ2h0IGlmIGl0J3MgZG9uZVxuICBmdW5jdGlvbiBkb0F1dG9IZWlnaHQgKCkge1xuICAgIHZhciBpbWdzID0gZ2V0SW1hZ2VBcnJheS5hcHBseShudWxsLCBnZXRWaXNpYmxlU2xpZGVSYW5nZSgpKTtcbiAgICByYWYoZnVuY3Rpb24oKXsgaW1nc0xvYWRlZENoZWNrKGltZ3MsIHVwZGF0ZUlubmVyV3JhcHBlckhlaWdodCk7IH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaW1nc0xvYWRlZENoZWNrIChpbWdzLCBjYikge1xuICAgIC8vIGRpcmVjdGx5IGV4ZWN1dGUgY2FsbGJhY2sgZnVuY3Rpb24gaWYgYWxsIGltYWdlcyBhcmUgY29tcGxldGVcbiAgICBpZiAoaW1nc0NvbXBsZXRlKSB7IHJldHVybiBjYigpOyB9XG5cbiAgICAvLyBjaGVjayBzZWxlY3RlZCBpbWFnZSBjbGFzc2VzIG90aGVyd2lzZVxuICAgIGltZ3MuZm9yRWFjaChmdW5jdGlvbiAoaW1nLCBpbmRleCkge1xuICAgICAgaWYgKGhhc0NsYXNzKGltZywgaW1nQ29tcGxldGVDbGFzcykpIHsgaW1ncy5zcGxpY2UoaW5kZXgsIDEpOyB9XG4gICAgfSk7XG5cbiAgICAvLyBleGVjdXRlIGNhbGxiYWNrIGZ1bmN0aW9uIGlmIHNlbGVjdGVkIGltYWdlcyBhcmUgYWxsIGNvbXBsZXRlXG4gICAgaWYgKCFpbWdzLmxlbmd0aCkgeyByZXR1cm4gY2IoKTsgfVxuXG4gICAgLy8gb3RoZXJ3aXNlIGV4ZWN1dGUgdGhpcyBmdW5jdGlvbmEgYWdhaW5cbiAgICByYWYoZnVuY3Rpb24oKXsgaW1nc0xvYWRlZENoZWNrKGltZ3MsIGNiKTsgfSk7XG4gIH0gXG5cbiAgZnVuY3Rpb24gYWRkaXRpb25hbFVwZGF0ZXMgKCkge1xuICAgIGRvTGF6eUxvYWQoKTsgXG4gICAgdXBkYXRlU2xpZGVTdGF0dXMoKTtcbiAgICB1cGRhdGVMaXZlUmVnaW9uKCk7XG4gICAgdXBkYXRlQ29udHJvbHNTdGF0dXMoKTtcbiAgICB1cGRhdGVOYXZTdGF0dXMoKTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gdXBkYXRlX2Nhcm91c2VsX3RyYW5zaXRpb25fZHVyYXRpb24gKCkge1xuICAgIGlmIChjYXJvdXNlbCAmJiBhdXRvSGVpZ2h0KSB7XG4gICAgICBtaWRkbGVXcmFwcGVyLnN0eWxlW1RSQU5TSVRJT05EVVJBVElPTl0gPSBzcGVlZCAvIDEwMDAgKyAncyc7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TWF4U2xpZGVIZWlnaHQgKHNsaWRlU3RhcnQsIHNsaWRlUmFuZ2UpIHtcbiAgICB2YXIgaGVpZ2h0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSBzbGlkZVN0YXJ0LCBsID0gTWF0aC5taW4oc2xpZGVTdGFydCArIHNsaWRlUmFuZ2UsIHNsaWRlQ291bnROZXcpOyBpIDwgbDsgaSsrKSB7XG4gICAgICBoZWlnaHRzLnB1c2goc2xpZGVJdGVtc1tpXS5vZmZzZXRIZWlnaHQpO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCBoZWlnaHRzKTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBpbm5lciB3cmFwcGVyIGhlaWdodFxuICAvLyAxLiBnZXQgdGhlIG1heC1oZWlnaHQgb2YgdGhlIHZpc2libGUgc2xpZGVzXG4gIC8vIDIuIHNldCB0cmFuc2l0aW9uRHVyYXRpb24gdG8gc3BlZWRcbiAgLy8gMy4gdXBkYXRlIGlubmVyIHdyYXBwZXIgaGVpZ2h0IHRvIG1heC1oZWlnaHRcbiAgLy8gNC4gc2V0IHRyYW5zaXRpb25EdXJhdGlvbiB0byAwcyBhZnRlciB0cmFuc2l0aW9uIGRvbmVcbiAgZnVuY3Rpb24gdXBkYXRlSW5uZXJXcmFwcGVySGVpZ2h0ICgpIHtcbiAgICB2YXIgbWF4SGVpZ2h0ID0gYXV0b0hlaWdodCA/IGdldE1heFNsaWRlSGVpZ2h0KGluZGV4LCBpdGVtcykgOiBnZXRNYXhTbGlkZUhlaWdodChjbG9uZUNvdW50LCBzbGlkZUNvdW50KSxcbiAgICAgICAgd3AgPSBtaWRkbGVXcmFwcGVyID8gbWlkZGxlV3JhcHBlciA6IGlubmVyV3JhcHBlcjtcblxuICAgIGlmICh3cC5zdHlsZS5oZWlnaHQgIT09IG1heEhlaWdodCkgeyB3cC5zdHlsZS5oZWlnaHQgPSBtYXhIZWlnaHQgKyAncHgnOyB9XG4gIH1cblxuICAvLyBnZXQgdGhlIGRpc3RhbmNlIGZyb20gdGhlIHRvcCBlZGdlIG9mIHRoZSBmaXJzdCBzbGlkZSB0byBlYWNoIHNsaWRlXG4gIC8vIChpbml0KSA9PiBzbGlkZVBvc2l0aW9uc1xuICBmdW5jdGlvbiBzZXRTbGlkZVBvc2l0aW9ucyAoKSB7XG4gICAgc2xpZGVQb3NpdGlvbnMgPSBbMF07XG4gICAgdmFyIGF0dHIgPSBob3Jpem9udGFsID8gJ2xlZnQnIDogJ3RvcCcsXG4gICAgICAgIGF0dHIyID0gaG9yaXpvbnRhbCA/ICdyaWdodCcgOiAnYm90dG9tJyxcbiAgICAgICAgYmFzZSA9IHNsaWRlSXRlbXNbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClbYXR0cl07XG5cbiAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIC8vIHNraXAgdGhlIGZpcnN0IHNsaWRlXG4gICAgICBpZiAoaSkgeyBzbGlkZVBvc2l0aW9ucy5wdXNoKGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClbYXR0cl0gLSBiYXNlKTsgfVxuICAgICAgLy8gYWRkIHRoZSBlbmQgZWRnZVxuICAgICAgaWYgKGkgPT09IHNsaWRlQ291bnROZXcgLSAxKSB7IHNsaWRlUG9zaXRpb25zLnB1c2goaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVthdHRyMl0gLSBiYXNlKTsgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gdXBkYXRlIHNsaWRlXG4gIGZ1bmN0aW9uIHVwZGF0ZVNsaWRlU3RhdHVzICgpIHtcbiAgICB2YXIgcmFuZ2UgPSBnZXRWaXNpYmxlU2xpZGVSYW5nZSgpLFxuICAgICAgICBzdGFydCA9IHJhbmdlWzBdLFxuICAgICAgICBlbmQgPSByYW5nZVsxXTtcblxuICAgIGZvckVhY2goc2xpZGVJdGVtcywgZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgLy8gc2hvdyBzbGlkZXNcbiAgICAgIGlmIChpID49IHN0YXJ0ICYmIGkgPD0gZW5kKSB7XG4gICAgICAgIGlmIChoYXNBdHRyKGl0ZW0sICdhcmlhLWhpZGRlbicpKSB7XG4gICAgICAgICAgcmVtb3ZlQXR0cnMoaXRlbSwgWydhcmlhLWhpZGRlbicsICd0YWJpbmRleCddKTtcbiAgICAgICAgICBhZGRDbGFzcyhpdGVtLCBzbGlkZUFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgLy8gaGlkZSBzbGlkZXNcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaGFzQXR0cihpdGVtLCAnYXJpYS1oaWRkZW4nKSkge1xuICAgICAgICAgIHNldEF0dHJzKGl0ZW0sIHtcbiAgICAgICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcbiAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBzbGlkZUFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gZ2FsbGVyeTogdXBkYXRlIHNsaWRlIHBvc2l0aW9uXG4gIGZ1bmN0aW9uIHVwZGF0ZUdhbGxlcnlTbGlkZVBvc2l0aW9ucyAoKSB7XG4gICAgdmFyIGwgPSBpbmRleCArIE1hdGgubWluKHNsaWRlQ291bnQsIGl0ZW1zKTtcbiAgICBmb3IgKHZhciBpID0gc2xpZGVDb3VudE5ldzsgaS0tOykge1xuICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zW2ldO1xuXG4gICAgICBpZiAoaSA+PSBpbmRleCAmJiBpIDwgbCkge1xuICAgICAgICAvLyBhZGQgdHJhbnNpdGlvbnMgdG8gdmlzaWJsZSBzbGlkZXMgd2hlbiBhZGp1c3RpbmcgdGhlaXIgcG9zaXRpb25zXG4gICAgICAgIGFkZENsYXNzKGl0ZW0sICd0bnMtbW92aW5nJyk7XG5cbiAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gKGkgLSBpbmRleCkgKiAxMDAgLyBpdGVtcyArICclJztcbiAgICAgICAgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZUluKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uc3R5bGUubGVmdCkge1xuICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSAnJztcbiAgICAgICAgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XG4gICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVJbik7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlbW92ZSBvdXRsZXQgYW5pbWF0aW9uXG4gICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlT3V0KTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmluZyAnLnRucy1tb3ZpbmcnXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGZvckVhY2goc2xpZGVJdGVtcywgZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoZWwsICd0bnMtbW92aW5nJyk7XG4gICAgICB9KTtcbiAgICB9LCAzMDApO1xuICB9XG5cbiAgLy8gc2V0IHRhYmluZGV4IG9uIE5hdlxuICBmdW5jdGlvbiB1cGRhdGVOYXZTdGF0dXMgKCkge1xuICAgIC8vIGdldCBjdXJyZW50IG5hdlxuICAgIGlmIChuYXYpIHtcbiAgICAgIG5hdkN1cnJlbnRJbmRleCA9IG5hdkNsaWNrZWQgPj0gMCA/IG5hdkNsaWNrZWQgOiBnZXRDdXJyZW50TmF2SW5kZXgoKTtcbiAgICAgIG5hdkNsaWNrZWQgPSAtMTtcblxuICAgICAgaWYgKG5hdkN1cnJlbnRJbmRleCAhPT0gbmF2Q3VycmVudEluZGV4Q2FjaGVkKSB7XG4gICAgICAgIHZhciBuYXZQcmV2ID0gbmF2SXRlbXNbbmF2Q3VycmVudEluZGV4Q2FjaGVkXSxcbiAgICAgICAgICAgIG5hdkN1cnJlbnQgPSBuYXZJdGVtc1tuYXZDdXJyZW50SW5kZXhdO1xuXG4gICAgICAgIHNldEF0dHJzKG5hdlByZXYsIHtcbiAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICAgICAgICdhcmlhLWxhYmVsJzogbmF2U3RyICsgKG5hdkN1cnJlbnRJbmRleENhY2hlZCArIDEpXG4gICAgICAgIH0pO1xuICAgICAgICByZW1vdmVDbGFzcyhuYXZQcmV2LCBuYXZBY3RpdmVDbGFzcyk7XG4gICAgICAgIFxuICAgICAgICBzZXRBdHRycyhuYXZDdXJyZW50LCB7J2FyaWEtbGFiZWwnOiBuYXZTdHIgKyAobmF2Q3VycmVudEluZGV4ICsgMSkgKyBuYXZTdHJDdXJyZW50fSk7XG4gICAgICAgIHJlbW92ZUF0dHJzKG5hdkN1cnJlbnQsICd0YWJpbmRleCcpO1xuICAgICAgICBhZGRDbGFzcyhuYXZDdXJyZW50LCBuYXZBY3RpdmVDbGFzcyk7XG5cbiAgICAgICAgbmF2Q3VycmVudEluZGV4Q2FjaGVkID0gbmF2Q3VycmVudEluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExvd2VyQ2FzZU5vZGVOYW1lIChlbCkge1xuICAgIHJldHVybiBlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNCdXR0b24gKGVsKSB7XG4gICAgcmV0dXJuIGdldExvd2VyQ2FzZU5vZGVOYW1lKGVsKSA9PT0gJ2J1dHRvbic7XG4gIH1cblxuICBmdW5jdGlvbiBpc0FyaWFEaXNhYmxlZCAoZWwpIHtcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJykgPT09ICd0cnVlJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGRpc0VuYWJsZUVsZW1lbnQgKGlzQnV0dG9uLCBlbCwgdmFsKSB7XG4gICAgaWYgKGlzQnV0dG9uKSB7XG4gICAgICBlbC5kaXNhYmxlZCA9IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJywgdmFsLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNldCAnZGlzYWJsZWQnIHRvIHRydWUgb24gY29udHJvbHMgd2hlbiByZWFjaCB0aGUgZWRnZXNcbiAgZnVuY3Rpb24gdXBkYXRlQ29udHJvbHNTdGF0dXMgKCkge1xuICAgIGlmICghY29udHJvbHMgfHwgcmV3aW5kIHx8IGxvb3ApIHsgcmV0dXJuOyB9XG5cbiAgICB2YXIgcHJldkRpc2FibGVkID0gKHByZXZJc0J1dHRvbikgPyBwcmV2QnV0dG9uLmRpc2FibGVkIDogaXNBcmlhRGlzYWJsZWQocHJldkJ1dHRvbiksXG4gICAgICAgIG5leHREaXNhYmxlZCA9IChuZXh0SXNCdXR0b24pID8gbmV4dEJ1dHRvbi5kaXNhYmxlZCA6IGlzQXJpYURpc2FibGVkKG5leHRCdXR0b24pLFxuICAgICAgICBkaXNhYmxlUHJldiA9IChpbmRleCA8PSBpbmRleE1pbikgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgIGRpc2FibGVOZXh0ID0gKCFyZXdpbmQgJiYgaW5kZXggPj0gaW5kZXhNYXgpID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgaWYgKGRpc2FibGVQcmV2ICYmICFwcmV2RGlzYWJsZWQpIHtcbiAgICAgIGRpc0VuYWJsZUVsZW1lbnQocHJldklzQnV0dG9uLCBwcmV2QnV0dG9uLCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKCFkaXNhYmxlUHJldiAmJiBwcmV2RGlzYWJsZWQpIHtcbiAgICAgIGRpc0VuYWJsZUVsZW1lbnQocHJldklzQnV0dG9uLCBwcmV2QnV0dG9uLCBmYWxzZSk7XG4gICAgfVxuICAgIGlmIChkaXNhYmxlTmV4dCAmJiAhbmV4dERpc2FibGVkKSB7XG4gICAgICBkaXNFbmFibGVFbGVtZW50KG5leHRJc0J1dHRvbiwgbmV4dEJ1dHRvbiwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmICghZGlzYWJsZU5leHQgJiYgbmV4dERpc2FibGVkKSB7XG4gICAgICBkaXNFbmFibGVFbGVtZW50KG5leHRJc0J1dHRvbiwgbmV4dEJ1dHRvbiwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNldCBkdXJhdGlvblxuICBmdW5jdGlvbiByZXNldER1cmF0aW9uIChlbCwgc3RyKSB7XG4gICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikgeyBlbC5zdHlsZVtUUkFOU0lUSU9ORFVSQVRJT05dID0gc3RyOyB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTbGlkZXJXaWR0aCAoKSB7XG4gICAgcmV0dXJuIGZpeGVkV2lkdGggPyAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiBzbGlkZUNvdW50TmV3IDogc2xpZGVQb3NpdGlvbnNbc2xpZGVDb3VudE5ld107XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDZW50ZXJHYXAgKG51bSkge1xuICAgIGlmIChudW0gPT0gbnVsbCkgeyBudW0gPSBpbmRleDsgfVxuXG4gICAgdmFyIGdhcCA9IGVkZ2VQYWRkaW5nID8gZ3V0dGVyIDogMDtcbiAgICByZXR1cm4gYXV0b1dpZHRoID8gKCh2aWV3cG9ydCAtIGdhcCkgLSAoc2xpZGVQb3NpdGlvbnNbbnVtICsgMV0gLSBzbGlkZVBvc2l0aW9uc1tudW1dIC0gZ3V0dGVyKSkvMiA6XG4gICAgICBmaXhlZFdpZHRoID8gKHZpZXdwb3J0IC0gZml4ZWRXaWR0aCkgLyAyIDpcbiAgICAgICAgKGl0ZW1zIC0gMSkgLyAyO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmlnaHRCb3VuZGFyeSAoKSB7XG4gICAgdmFyIGdhcCA9IGVkZ2VQYWRkaW5nID8gZ3V0dGVyIDogMCxcbiAgICAgICAgcmVzdWx0ID0gKHZpZXdwb3J0ICsgZ2FwKSAtIGdldFNsaWRlcldpZHRoKCk7XG5cbiAgICBpZiAoY2VudGVyICYmICFsb29wKSB7XG4gICAgICByZXN1bHQgPSBmaXhlZFdpZHRoID8gLSAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiAoc2xpZGVDb3VudE5ldyAtIDEpIC0gZ2V0Q2VudGVyR2FwKCkgOlxuICAgICAgICBnZXRDZW50ZXJHYXAoc2xpZGVDb3VudE5ldyAtIDEpIC0gc2xpZGVQb3NpdGlvbnNbc2xpZGVDb3VudE5ldyAtIDFdO1xuICAgIH1cbiAgICBpZiAocmVzdWx0ID4gMCkgeyByZXN1bHQgPSAwOyB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUgKG51bSkge1xuICAgIGlmIChudW0gPT0gbnVsbCkgeyBudW0gPSBpbmRleDsgfVxuXG4gICAgdmFyIHZhbDtcbiAgICBpZiAoaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoKSB7XG4gICAgICBpZiAoZml4ZWRXaWR0aCkge1xuICAgICAgICB2YWwgPSAtIChmaXhlZFdpZHRoICsgZ3V0dGVyKSAqIG51bTtcbiAgICAgICAgaWYgKGNlbnRlcikgeyB2YWwgKz0gZ2V0Q2VudGVyR2FwKCk7IH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkZW5vbWluYXRvciA9IFRSQU5TRk9STSA/IHNsaWRlQ291bnROZXcgOiBpdGVtcztcbiAgICAgICAgaWYgKGNlbnRlcikgeyBudW0gLT0gZ2V0Q2VudGVyR2FwKCk7IH1cbiAgICAgICAgdmFsID0gLSBudW0gKiAxMDAgLyBkZW5vbWluYXRvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFsID0gLSBzbGlkZVBvc2l0aW9uc1tudW1dO1xuICAgICAgaWYgKGNlbnRlciAmJiBhdXRvV2lkdGgpIHtcbiAgICAgICAgdmFsICs9IGdldENlbnRlckdhcCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNSaWdodERlYWRab25lKSB7IHZhbCA9IE1hdGgubWF4KHZhbCwgcmlnaHRCb3VuZGFyeSk7IH1cblxuICAgIHZhbCArPSAoaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoICYmICFmaXhlZFdpZHRoKSA/ICclJyA6ICdweCc7XG5cbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgZnVuY3Rpb24gZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQgKHZhbCkge1xuICAgIHJlc2V0RHVyYXRpb24oY29udGFpbmVyLCAnMHMnKTtcbiAgICBkb0NvbnRhaW5lclRyYW5zZm9ybSh2YWwpO1xuICB9XG5cbiAgZnVuY3Rpb24gZG9Db250YWluZXJUcmFuc2Zvcm0gKHZhbCkge1xuICAgIGlmICh2YWwgPT0gbnVsbCkgeyB2YWwgPSBnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZSgpOyB9XG4gICAgY29udGFpbmVyLnN0eWxlW3RyYW5zZm9ybUF0dHJdID0gdHJhbnNmb3JtUHJlZml4ICsgdmFsICsgdHJhbnNmb3JtUG9zdGZpeDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFuaW1hdGVTbGlkZSAobnVtYmVyLCBjbGFzc091dCwgY2xhc3NJbiwgaXNPdXQpIHtcbiAgICB2YXIgbCA9IG51bWJlciArIGl0ZW1zO1xuICAgIGlmICghbG9vcCkgeyBsID0gTWF0aC5taW4obCwgc2xpZGVDb3VudE5ldyk7IH1cblxuICAgIGZvciAodmFyIGkgPSBudW1iZXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zW2ldO1xuXG4gICAgICAvLyBzZXQgaXRlbSBwb3NpdGlvbnNcbiAgICAgIGlmICghaXNPdXQpIHsgaXRlbS5zdHlsZS5sZWZ0ID0gKGkgLSBpbmRleCkgKiAxMDAgLyBpdGVtcyArICclJzsgfVxuXG4gICAgICBpZiAoYW5pbWF0ZURlbGF5ICYmIFRSQU5TSVRJT05ERUxBWSkge1xuICAgICAgICBpdGVtLnN0eWxlW1RSQU5TSVRJT05ERUxBWV0gPSBpdGVtLnN0eWxlW0FOSU1BVElPTkRFTEFZXSA9IGFuaW1hdGVEZWxheSAqIChpIC0gbnVtYmVyKSAvIDEwMDAgKyAncyc7XG4gICAgICB9XG4gICAgICByZW1vdmVDbGFzcyhpdGVtLCBjbGFzc091dCk7XG4gICAgICBhZGRDbGFzcyhpdGVtLCBjbGFzc0luKTtcbiAgICAgIFxuICAgICAgaWYgKGlzT3V0KSB7IHNsaWRlSXRlbXNPdXQucHVzaChpdGVtKTsgfVxuICAgIH1cbiAgfVxuXG4gIC8vIG1ha2UgdHJhbnNmZXIgYWZ0ZXIgY2xpY2svZHJhZzpcbiAgLy8gMS4gY2hhbmdlICd0cmFuc2Zvcm0nIHByb3BlcnR5IGZvciBtb3JkZXJuIGJyb3dzZXJzXG4gIC8vIDIuIGNoYW5nZSAnbGVmdCcgcHJvcGVydHkgZm9yIGxlZ2FjeSBicm93c2Vyc1xuICB2YXIgdHJhbnNmb3JtQ29yZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNhcm91c2VsID9cbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVzZXREdXJhdGlvbihjb250YWluZXIsICcnKTtcbiAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTiB8fCAhc3BlZWQpIHtcbiAgICAgICAgICAvLyBmb3IgbW9yZGVuIGJyb3dzZXJzIHdpdGggbm9uLXplcm8gZHVyYXRpb24gb3IgXG4gICAgICAgICAgLy8gemVybyBkdXJhdGlvbiBmb3IgYWxsIGJyb3dzZXJzXG4gICAgICAgICAgZG9Db250YWluZXJUcmFuc2Zvcm0oKTtcbiAgICAgICAgICAvLyBydW4gZmFsbGJhY2sgZnVuY3Rpb24gbWFudWFsbHkgXG4gICAgICAgICAgLy8gd2hlbiBkdXJhdGlvbiBpcyAwIC8gY29udGFpbmVyIGlzIGhpZGRlblxuICAgICAgICAgIGlmICghc3BlZWQgfHwgIWlzVmlzaWJsZShjb250YWluZXIpKSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmb3Igb2xkIGJyb3dzZXIgd2l0aCBub24temVybyBkdXJhdGlvblxuICAgICAgICAgIGpzVHJhbnNmb3JtKGNvbnRhaW5lciwgdHJhbnNmb3JtQXR0ciwgdHJhbnNmb3JtUHJlZml4LCB0cmFuc2Zvcm1Qb3N0Zml4LCBnZXRDb250YWluZXJUcmFuc2Zvcm1WYWx1ZSgpLCBzcGVlZCwgb25UcmFuc2l0aW9uRW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaG9yaXpvbnRhbCkgeyB1cGRhdGVDb250ZW50V3JhcHBlckhlaWdodCgpOyB9XG4gICAgICB9IDpcbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2xpZGVJdGVtc091dCA9IFtdO1xuXG4gICAgICAgIHZhciBldmUgPSB7fTtcbiAgICAgICAgZXZlW1RSQU5TSVRJT05FTkRdID0gZXZlW0FOSU1BVElPTkVORF0gPSBvblRyYW5zaXRpb25FbmQ7XG4gICAgICAgIHJlbW92ZUV2ZW50cyhzbGlkZUl0ZW1zW2luZGV4Q2FjaGVkXSwgZXZlKTtcbiAgICAgICAgYWRkRXZlbnRzKHNsaWRlSXRlbXNbaW5kZXhdLCBldmUpO1xuXG4gICAgICAgIGFuaW1hdGVTbGlkZShpbmRleENhY2hlZCwgYW5pbWF0ZUluLCBhbmltYXRlT3V0LCB0cnVlKTtcbiAgICAgICAgYW5pbWF0ZVNsaWRlKGluZGV4LCBhbmltYXRlTm9ybWFsLCBhbmltYXRlSW4pO1xuXG4gICAgICAgIC8vIHJ1biBmYWxsYmFjayBmdW5jdGlvbiBtYW51YWxseSBcbiAgICAgICAgLy8gd2hlbiB0cmFuc2l0aW9uIG9yIGFuaW1hdGlvbiBub3Qgc3VwcG9ydGVkIC8gZHVyYXRpb24gaXMgMFxuICAgICAgICBpZiAoIVRSQU5TSVRJT05FTkQgfHwgIUFOSU1BVElPTkVORCB8fCAhc3BlZWQgfHwgIWlzVmlzaWJsZShjb250YWluZXIpKSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG4gICAgICB9O1xuICB9KSgpO1xuXG4gIGZ1bmN0aW9uIHJlbmRlciAoZSwgc2xpZGVyTW92ZWQpIHtcbiAgICBpZiAodXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0pIHsgdXBkYXRlSW5kZXgoKTsgfVxuXG4gICAgLy8gcmVuZGVyIHdoZW4gc2xpZGVyIHdhcyBtb3ZlZCAodG91Y2ggb3IgZHJhZykgZXZlbiB0aG91Z2ggaW5kZXggbWF5IG5vdCBjaGFuZ2VcbiAgICBpZiAoaW5kZXggIT09IGluZGV4Q2FjaGVkIHx8IHNsaWRlck1vdmVkKSB7XG4gICAgICAvLyBldmVudHNcbiAgICAgIGV2ZW50cy5lbWl0KCdpbmRleENoYW5nZWQnLCBpbmZvKCkpO1xuICAgICAgZXZlbnRzLmVtaXQoJ3RyYW5zaXRpb25TdGFydCcsIGluZm8oKSk7XG4gICAgICBpZiAoYXV0b0hlaWdodCkgeyBkb0F1dG9IZWlnaHQoKTsgfVxuXG4gICAgICAvLyBwYXVzZSBhdXRvcGxheSB3aGVuIGNsaWNrIG9yIGtleWRvd24gZnJvbSB1c2VyXG4gICAgICBpZiAoYW5pbWF0aW5nICYmIGUgJiYgWydjbGljaycsICdrZXlkb3duJ10uaW5kZXhPZihlLnR5cGUpID49IDApIHsgc3RvcEF1dG9wbGF5KCk7IH1cblxuICAgICAgcnVubmluZyA9IHRydWU7XG4gICAgICB0cmFuc2Zvcm1Db3JlKCk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgICogVHJhbnNmZXIgcHJlZml4ZWQgcHJvcGVydGllcyB0byB0aGUgc2FtZSBmb3JtYXRcbiAgICogQ1NTOiAtV2Via2l0LVRyYW5zZm9ybSA9PiB3ZWJraXR0cmFuc2Zvcm1cbiAgICogSlM6IFdlYmtpdFRyYW5zZm9ybSA9PiB3ZWJraXR0cmFuc2Zvcm1cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIHByb3BlcnR5XG4gICAqXG4gICAqL1xuICBmdW5jdGlvbiBzdHJUcmFucyAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLy0vZywgJycpO1xuICB9XG5cbiAgLy8gQUZURVIgVFJBTlNGT1JNXG4gIC8vIFRoaW5ncyBuZWVkIHRvIGJlIGRvbmUgYWZ0ZXIgYSB0cmFuc2ZlcjpcbiAgLy8gMS4gY2hlY2sgaW5kZXhcbiAgLy8gMi4gYWRkIGNsYXNzZXMgdG8gdmlzaWJsZSBzbGlkZVxuICAvLyAzLiBkaXNhYmxlIGNvbnRyb2xzIGJ1dHRvbnMgd2hlbiByZWFjaCB0aGUgZmlyc3QvbGFzdCBzbGlkZSBpbiBub24tbG9vcCBzbGlkZXJcbiAgLy8gNC4gdXBkYXRlIG5hdiBzdGF0dXNcbiAgLy8gNS4gbGF6eWxvYWQgaW1hZ2VzXG4gIC8vIDYuIHVwZGF0ZSBjb250YWluZXIgaGVpZ2h0XG4gIGZ1bmN0aW9uIG9uVHJhbnNpdGlvbkVuZCAoZXZlbnQpIHtcbiAgICAvLyBjaGVjayBydW5uaW5nIG9uIGdhbGxlcnkgbW9kZVxuICAgIC8vIG1ha2Ugc3VyZSB0cmFudGlvbmVuZC9hbmltYXRpb25lbmQgZXZlbnRzIHJ1biBvbmx5IG9uY2VcbiAgICBpZiAoY2Fyb3VzZWwgfHwgcnVubmluZykge1xuICAgICAgZXZlbnRzLmVtaXQoJ3RyYW5zaXRpb25FbmQnLCBpbmZvKGV2ZW50KSk7XG5cbiAgICAgIGlmICghY2Fyb3VzZWwgJiYgc2xpZGVJdGVtc091dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpZGVJdGVtc091dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc091dFtpXTtcbiAgICAgICAgICAvLyBzZXQgaXRlbSBwb3NpdGlvbnNcbiAgICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSAnJztcblxuICAgICAgICAgIGlmIChBTklNQVRJT05ERUxBWSAmJiBUUkFOU0lUSU9OREVMQVkpIHsgXG4gICAgICAgICAgICBpdGVtLnN0eWxlW0FOSU1BVElPTkRFTEFZXSA9ICcnO1xuICAgICAgICAgICAgaXRlbS5zdHlsZVtUUkFOU0lUSU9OREVMQVldID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVPdXQpO1xuICAgICAgICAgIGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qIHVwZGF0ZSBzbGlkZXMsIG5hdiwgY29udHJvbHMgYWZ0ZXIgY2hlY2tpbmcgLi4uXG4gICAgICAgKiA9PiBsZWdhY3kgYnJvd3NlcnMgd2hvIGRvbid0IHN1cHBvcnQgJ2V2ZW50JyBcbiAgICAgICAqICAgIGhhdmUgdG8gY2hlY2sgZXZlbnQgZmlyc3QsIG90aGVyd2lzZSBldmVudC50YXJnZXQgd2lsbCBjYXVzZSBhbiBlcnJvciBcbiAgICAgICAqID0+IG9yICdnYWxsZXJ5JyBtb2RlOiBcbiAgICAgICAqICAgKyBldmVudCB0YXJnZXQgaXMgc2xpZGUgaXRlbVxuICAgICAgICogPT4gb3IgJ2Nhcm91c2VsJyBtb2RlOiBcbiAgICAgICAqICAgKyBldmVudCB0YXJnZXQgaXMgY29udGFpbmVyLCBcbiAgICAgICAqICAgKyBldmVudC5wcm9wZXJ0eSBpcyB0aGUgc2FtZSB3aXRoIHRyYW5zZm9ybSBhdHRyaWJ1dGVcbiAgICAgICAqL1xuICAgICAgaWYgKCFldmVudCB8fCBcbiAgICAgICAgICAhY2Fyb3VzZWwgJiYgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUgPT09IGNvbnRhaW5lciB8fCBcbiAgICAgICAgICBldmVudC50YXJnZXQgPT09IGNvbnRhaW5lciAmJiBzdHJUcmFucyhldmVudC5wcm9wZXJ0eU5hbWUpID09PSBzdHJUcmFucyh0cmFuc2Zvcm1BdHRyKSkge1xuXG4gICAgICAgIGlmICghdXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0pIHsgXG4gICAgICAgICAgdmFyIGluZGV4VGVtID0gaW5kZXg7XG4gICAgICAgICAgdXBkYXRlSW5kZXgoKTtcbiAgICAgICAgICBpZiAoaW5kZXggIT09IGluZGV4VGVtKSB7IFxuICAgICAgICAgICAgZXZlbnRzLmVtaXQoJ2luZGV4Q2hhbmdlZCcsIGluZm8oKSk7XG5cbiAgICAgICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IFxuXG4gICAgICAgIGlmIChuZXN0ZWQgPT09ICdpbm5lcicpIHsgZXZlbnRzLmVtaXQoJ2lubmVyTG9hZGVkJywgaW5mbygpKTsgfVxuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGluZGV4Q2FjaGVkID0gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvLyAjIEFDVElPTlNcbiAgZnVuY3Rpb24gZ29UbyAodGFyZ2V0SW5kZXgsIGUpIHtcbiAgICBpZiAoZnJlZXplKSB7IHJldHVybjsgfVxuXG4gICAgLy8gcHJldiBzbGlkZUJ5XG4gICAgaWYgKHRhcmdldEluZGV4ID09PSAncHJldicpIHtcbiAgICAgIG9uQ29udHJvbHNDbGljayhlLCAtMSk7XG5cbiAgICAvLyBuZXh0IHNsaWRlQnlcbiAgICB9IGVsc2UgaWYgKHRhcmdldEluZGV4ID09PSAnbmV4dCcpIHtcbiAgICAgIG9uQ29udHJvbHNDbGljayhlLCAxKTtcblxuICAgIC8vIGdvIHRvIGV4YWN0IHNsaWRlXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgIGlmIChwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcpIHsgcmV0dXJuOyB9IGVsc2UgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxuICAgICAgfVxuXG4gICAgICB2YXIgYWJzSW5kZXggPSBnZXRBYnNJbmRleCgpLCBcbiAgICAgICAgICBpbmRleEdhcCA9IDA7XG5cbiAgICAgIGlmICh0YXJnZXRJbmRleCA9PT0gJ2ZpcnN0Jykge1xuICAgICAgICBpbmRleEdhcCA9IC0gYWJzSW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKHRhcmdldEluZGV4ID09PSAnbGFzdCcpIHtcbiAgICAgICAgaW5kZXhHYXAgPSBjYXJvdXNlbCA/IHNsaWRlQ291bnQgLSBpdGVtcyAtIGFic0luZGV4IDogc2xpZGVDb3VudCAtIDEgLSBhYnNJbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0SW5kZXggIT09ICdudW1iZXInKSB7IHRhcmdldEluZGV4ID0gcGFyc2VJbnQodGFyZ2V0SW5kZXgpOyB9XG5cbiAgICAgICAgaWYgKCFpc05hTih0YXJnZXRJbmRleCkpIHtcbiAgICAgICAgICAvLyBmcm9tIGRpcmVjdGx5IGNhbGxlZCBnb1RvIGZ1bmN0aW9uXG4gICAgICAgICAgaWYgKCFlKSB7IHRhcmdldEluZGV4ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oc2xpZGVDb3VudCAtIDEsIHRhcmdldEluZGV4KSk7IH1cblxuICAgICAgICAgIGluZGV4R2FwID0gdGFyZ2V0SW5kZXggLSBhYnNJbmRleDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBnYWxsZXJ5OiBtYWtlIHN1cmUgbmV3IHBhZ2Ugd29uJ3Qgb3ZlcmxhcCB3aXRoIGN1cnJlbnQgcGFnZVxuICAgICAgaWYgKCFjYXJvdXNlbCAmJiBpbmRleEdhcCAmJiBNYXRoLmFicyhpbmRleEdhcCkgPCBpdGVtcykge1xuICAgICAgICB2YXIgZmFjdG9yID0gaW5kZXhHYXAgPiAwID8gMSA6IC0xO1xuICAgICAgICBpbmRleEdhcCArPSAoaW5kZXggKyBpbmRleEdhcCAtIHNsaWRlQ291bnQpID49IGluZGV4TWluID8gc2xpZGVDb3VudCAqIGZhY3RvciA6IHNsaWRlQ291bnQgKiAyICogZmFjdG9yICogLTE7XG4gICAgICB9XG5cbiAgICAgIGluZGV4ICs9IGluZGV4R2FwO1xuXG4gICAgICAvLyBtYWtlIHN1cmUgaW5kZXggaXMgaW4gcmFuZ2VcbiAgICAgIGlmIChjYXJvdXNlbCAmJiBsb29wKSB7XG4gICAgICAgIGlmIChpbmRleCA8IGluZGV4TWluKSB7IGluZGV4ICs9IHNsaWRlQ291bnQ7IH1cbiAgICAgICAgaWYgKGluZGV4ID4gaW5kZXhNYXgpIHsgaW5kZXggLT0gc2xpZGVDb3VudDsgfVxuICAgICAgfVxuXG4gICAgICAvLyBpZiBpbmRleCBpcyBjaGFuZ2VkLCBzdGFydCByZW5kZXJpbmdcbiAgICAgIGlmIChnZXRBYnNJbmRleChpbmRleCkgIT09IGdldEFic0luZGV4KGluZGV4Q2FjaGVkKSkge1xuICAgICAgICByZW5kZXIoZSk7XG4gICAgICB9XG5cbiAgICB9XG4gIH1cblxuICAvLyBvbiBjb250cm9scyBjbGlja1xuICBmdW5jdGlvbiBvbkNvbnRyb2xzQ2xpY2sgKGUsIGRpcikge1xuICAgIGlmIChydW5uaW5nKSB7XG4gICAgICBpZiAocHJldmVudEFjdGlvbldoZW5SdW5uaW5nKSB7IHJldHVybjsgfSBlbHNlIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cbiAgICB9XG4gICAgdmFyIHBhc3NFdmVudE9iamVjdDtcblxuICAgIGlmICghZGlyKSB7XG4gICAgICBlID0gZ2V0RXZlbnQoZSk7XG4gICAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGUpO1xuXG4gICAgICB3aGlsZSAodGFyZ2V0ICE9PSBjb250cm9sc0NvbnRhaW5lciAmJiBbcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbl0uaW5kZXhPZih0YXJnZXQpIDwgMCkgeyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTsgfVxuXG4gICAgICB2YXIgdGFyZ2V0SW4gPSBbcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbl0uaW5kZXhPZih0YXJnZXQpO1xuICAgICAgaWYgKHRhcmdldEluID49IDApIHtcbiAgICAgICAgcGFzc0V2ZW50T2JqZWN0ID0gdHJ1ZTtcbiAgICAgICAgZGlyID0gdGFyZ2V0SW4gPT09IDAgPyAtMSA6IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJld2luZCkge1xuICAgICAgaWYgKGluZGV4ID09PSBpbmRleE1pbiAmJiBkaXIgPT09IC0xKSB7XG4gICAgICAgIGdvVG8oJ2xhc3QnLCBlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gaW5kZXhNYXggJiYgZGlyID09PSAxKSB7XG4gICAgICAgIGdvVG8oJ2ZpcnN0JywgZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGlyKSB7XG4gICAgICBpbmRleCArPSBzbGlkZUJ5ICogZGlyO1xuICAgICAgaWYgKGF1dG9XaWR0aCkgeyBpbmRleCA9IE1hdGguZmxvb3IoaW5kZXgpOyB9XG4gICAgICAvLyBwYXNzIGUgd2hlbiBjbGljayBjb250cm9sIGJ1dHRvbnMgb3Iga2V5ZG93blxuICAgICAgcmVuZGVyKChwYXNzRXZlbnRPYmplY3QgfHwgKGUgJiYgZS50eXBlID09PSAna2V5ZG93bicpKSA/IGUgOiBudWxsKTtcbiAgICB9XG4gIH1cblxuICAvLyBvbiBuYXYgY2xpY2tcbiAgZnVuY3Rpb24gb25OYXZDbGljayAoZSkge1xuICAgIGlmIChydW5uaW5nKSB7XG4gICAgICBpZiAocHJldmVudEFjdGlvbldoZW5SdW5uaW5nKSB7IHJldHVybjsgfSBlbHNlIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cbiAgICB9XG4gICAgXG4gICAgZSA9IGdldEV2ZW50KGUpO1xuICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoZSksIG5hdkluZGV4O1xuXG4gICAgLy8gZmluZCB0aGUgY2xpY2tlZCBuYXYgaXRlbVxuICAgIHdoaWxlICh0YXJnZXQgIT09IG5hdkNvbnRhaW5lciAmJiAhaGFzQXR0cih0YXJnZXQsICdkYXRhLW5hdicpKSB7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlOyB9XG4gICAgaWYgKGhhc0F0dHIodGFyZ2V0LCAnZGF0YS1uYXYnKSkge1xuICAgICAgdmFyIG5hdkluZGV4ID0gbmF2Q2xpY2tlZCA9IE51bWJlcihnZXRBdHRyKHRhcmdldCwgJ2RhdGEtbmF2JykpLFxuICAgICAgICAgIHRhcmdldEluZGV4QmFzZSA9IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoID8gbmF2SW5kZXggKiBzbGlkZUNvdW50IC8gcGFnZXMgOiBuYXZJbmRleCAqIGl0ZW1zLFxuICAgICAgICAgIHRhcmdldEluZGV4ID0gbmF2QXNUaHVtYm5haWxzID8gbmF2SW5kZXggOiBNYXRoLm1pbihNYXRoLmNlaWwodGFyZ2V0SW5kZXhCYXNlKSwgc2xpZGVDb3VudCAtIDEpO1xuICAgICAgZ29Ubyh0YXJnZXRJbmRleCwgZSk7XG5cbiAgICAgIGlmIChuYXZDdXJyZW50SW5kZXggPT09IG5hdkluZGV4KSB7XG4gICAgICAgIGlmIChhbmltYXRpbmcpIHsgc3RvcEF1dG9wbGF5KCk7IH1cbiAgICAgICAgbmF2Q2xpY2tlZCA9IC0xOyAvLyByZXNldCBuYXZDbGlja2VkXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gYXV0b3BsYXkgZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIHNldEF1dG9wbGF5VGltZXIgKCkge1xuICAgIGF1dG9wbGF5VGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICBvbkNvbnRyb2xzQ2xpY2sobnVsbCwgYXV0b3BsYXlEaXJlY3Rpb24pO1xuICAgIH0sIGF1dG9wbGF5VGltZW91dCk7XG5cbiAgICBhbmltYXRpbmcgPSB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RvcEF1dG9wbGF5VGltZXIgKCkge1xuICAgIGNsZWFySW50ZXJ2YWwoYXV0b3BsYXlUaW1lcik7XG4gICAgYW5pbWF0aW5nID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVBdXRvcGxheUJ1dHRvbiAoYWN0aW9uLCB0eHQpIHtcbiAgICBzZXRBdHRycyhhdXRvcGxheUJ1dHRvbiwgeydkYXRhLWFjdGlvbic6IGFjdGlvbn0pO1xuICAgIGF1dG9wbGF5QnV0dG9uLmlubmVySFRNTCA9IGF1dG9wbGF5SHRtbFN0cmluZ3NbMF0gKyBhY3Rpb24gKyBhdXRvcGxheUh0bWxTdHJpbmdzWzFdICsgdHh0O1xuICB9XG5cbiAgZnVuY3Rpb24gc3RhcnRBdXRvcGxheSAoKSB7XG4gICAgc2V0QXV0b3BsYXlUaW1lcigpO1xuICAgIGlmIChhdXRvcGxheUJ1dHRvbikgeyB1cGRhdGVBdXRvcGxheUJ1dHRvbignc3RvcCcsIGF1dG9wbGF5VGV4dFsxXSk7IH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BBdXRvcGxheSAoKSB7XG4gICAgc3RvcEF1dG9wbGF5VGltZXIoKTtcbiAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgdXBkYXRlQXV0b3BsYXlCdXR0b24oJ3N0YXJ0JywgYXV0b3BsYXlUZXh0WzBdKTsgfVxuICB9XG5cbiAgLy8gcHJvZ3JhbWFpdGNhbGx5IHBsYXkvcGF1c2UgdGhlIHNsaWRlclxuICBmdW5jdGlvbiBwbGF5ICgpIHtcbiAgICBpZiAoYXV0b3BsYXkgJiYgIWFuaW1hdGluZykge1xuICAgICAgc3RhcnRBdXRvcGxheSgpO1xuICAgICAgYXV0b3BsYXlVc2VyUGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHBhdXNlICgpIHtcbiAgICBpZiAoYW5pbWF0aW5nKSB7XG4gICAgICBzdG9wQXV0b3BsYXkoKTtcbiAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlQXV0b3BsYXkgKCkge1xuICAgIGlmIChhbmltYXRpbmcpIHtcbiAgICAgIHN0b3BBdXRvcGxheSgpO1xuICAgICAgYXV0b3BsYXlVc2VyUGF1c2VkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnRBdXRvcGxheSgpO1xuICAgICAgYXV0b3BsYXlVc2VyUGF1c2VkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25WaXNpYmlsaXR5Q2hhbmdlICgpIHtcbiAgICBpZiAoZG9jLmhpZGRlbikge1xuICAgICAgaWYgKGFuaW1hdGluZykge1xuICAgICAgICBzdG9wQXV0b3BsYXlUaW1lcigpO1xuICAgICAgICBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkKSB7XG4gICAgICBzZXRBdXRvcGxheVRpbWVyKCk7XG4gICAgICBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZW92ZXJQYXVzZSAoKSB7XG4gICAgaWYgKGFuaW1hdGluZykgeyBcbiAgICAgIHN0b3BBdXRvcGxheVRpbWVyKCk7XG4gICAgICBhdXRvcGxheUhvdmVyUGF1c2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZW91dFJlc3RhcnQgKCkge1xuICAgIGlmIChhdXRvcGxheUhvdmVyUGF1c2VkKSB7IFxuICAgICAgc2V0QXV0b3BsYXlUaW1lcigpO1xuICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIGtleWRvd24gZXZlbnRzIG9uIGRvY3VtZW50IFxuICBmdW5jdGlvbiBvbkRvY3VtZW50S2V5ZG93biAoZSkge1xuICAgIGUgPSBnZXRFdmVudChlKTtcbiAgICB2YXIga2V5SW5kZXggPSBbS0VZUy5MRUZULCBLRVlTLlJJR0hUXS5pbmRleE9mKGUua2V5Q29kZSk7XG5cbiAgICBpZiAoa2V5SW5kZXggPj0gMCkge1xuICAgICAgb25Db250cm9sc0NsaWNrKGUsIGtleUluZGV4ID09PSAwID8gLTEgOiAxKTtcbiAgICB9XG4gIH1cblxuICAvLyBvbiBrZXkgY29udHJvbFxuICBmdW5jdGlvbiBvbkNvbnRyb2xzS2V5ZG93biAoZSkge1xuICAgIGUgPSBnZXRFdmVudChlKTtcbiAgICB2YXIga2V5SW5kZXggPSBbS0VZUy5MRUZULCBLRVlTLlJJR0hUXS5pbmRleE9mKGUua2V5Q29kZSk7XG5cbiAgICBpZiAoa2V5SW5kZXggPj0gMCkge1xuICAgICAgaWYgKGtleUluZGV4ID09PSAwKSB7XG4gICAgICAgIGlmICghcHJldkJ1dHRvbi5kaXNhYmxlZCkgeyBvbkNvbnRyb2xzQ2xpY2soZSwgLTEpOyB9XG4gICAgICB9IGVsc2UgaWYgKCFuZXh0QnV0dG9uLmRpc2FibGVkKSB7XG4gICAgICAgIG9uQ29udHJvbHNDbGljayhlLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBzZXQgZm9jdXNcbiAgZnVuY3Rpb24gc2V0Rm9jdXMgKGVsKSB7XG4gICAgZWwuZm9jdXMoKTtcbiAgfVxuXG4gIC8vIG9uIGtleSBuYXZcbiAgZnVuY3Rpb24gb25OYXZLZXlkb3duIChlKSB7XG4gICAgZSA9IGdldEV2ZW50KGUpO1xuICAgIHZhciBjdXJFbGVtZW50ID0gZG9jLmFjdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKCFoYXNBdHRyKGN1ckVsZW1lbnQsICdkYXRhLW5hdicpKSB7IHJldHVybjsgfVxuXG4gICAgLy8gdmFyIGNvZGUgPSBlLmtleUNvZGUsXG4gICAgdmFyIGtleUluZGV4ID0gW0tFWVMuTEVGVCwgS0VZUy5SSUdIVCwgS0VZUy5FTlRFUiwgS0VZUy5TUEFDRV0uaW5kZXhPZihlLmtleUNvZGUpLFxuICAgICAgICBuYXZJbmRleCA9IE51bWJlcihnZXRBdHRyKGN1ckVsZW1lbnQsICdkYXRhLW5hdicpKTtcblxuICAgIGlmIChrZXlJbmRleCA+PSAwKSB7XG4gICAgICBpZiAoa2V5SW5kZXggPT09IDApIHtcbiAgICAgICAgaWYgKG5hdkluZGV4ID4gMCkgeyBzZXRGb2N1cyhuYXZJdGVtc1tuYXZJbmRleCAtIDFdKTsgfVxuICAgICAgfSBlbHNlIGlmIChrZXlJbmRleCA9PT0gMSkge1xuICAgICAgICBpZiAobmF2SW5kZXggPCBwYWdlcyAtIDEpIHsgc2V0Rm9jdXMobmF2SXRlbXNbbmF2SW5kZXggKyAxXSk7IH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hdkNsaWNrZWQgPSBuYXZJbmRleDtcbiAgICAgICAgZ29UbyhuYXZJbmRleCwgZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RXZlbnQgKGUpIHtcbiAgICBlID0gZSB8fCB3aW4uZXZlbnQ7XG4gICAgcmV0dXJuIGlzVG91Y2hFdmVudChlKSA/IGUuY2hhbmdlZFRvdWNoZXNbMF0gOiBlO1xuICB9XG4gIGZ1bmN0aW9uIGdldFRhcmdldCAoZSkge1xuICAgIHJldHVybiBlLnRhcmdldCB8fCB3aW4uZXZlbnQuc3JjRWxlbWVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVG91Y2hFdmVudCAoZSkge1xuICAgIHJldHVybiBlLnR5cGUuaW5kZXhPZigndG91Y2gnKSA+PSAwO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJldmVudERlZmF1bHRCZWhhdmlvciAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgKCkge1xuICAgIHJldHVybiBnZXRUb3VjaERpcmVjdGlvbih0b0RlZ3JlZShsYXN0UG9zaXRpb24ueSAtIGluaXRQb3NpdGlvbi55LCBsYXN0UG9zaXRpb24ueCAtIGluaXRQb3NpdGlvbi54KSwgc3dpcGVBbmdsZSkgPT09IG9wdGlvbnMuYXhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uUGFuU3RhcnQgKGUpIHtcbiAgICBpZiAocnVubmluZykge1xuICAgICAgaWYgKHByZXZlbnRBY3Rpb25XaGVuUnVubmluZykgeyByZXR1cm47IH0gZWxzZSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XG4gICAgfVxuXG4gICAgaWYgKGF1dG9wbGF5ICYmIGFuaW1hdGluZykgeyBzdG9wQXV0b3BsYXlUaW1lcigpOyB9XG4gICAgXG4gICAgcGFuU3RhcnQgPSB0cnVlO1xuICAgIGlmIChyYWZJbmRleCkge1xuICAgICAgY2FmKHJhZkluZGV4KTtcbiAgICAgIHJhZkluZGV4ID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgJCA9IGdldEV2ZW50KGUpO1xuICAgIGV2ZW50cy5lbWl0KGlzVG91Y2hFdmVudChlKSA/ICd0b3VjaFN0YXJ0JyA6ICdkcmFnU3RhcnQnLCBpbmZvKGUpKTtcblxuICAgIGlmICghaXNUb3VjaEV2ZW50KGUpICYmIFsnaW1nJywgJ2EnXS5pbmRleE9mKGdldExvd2VyQ2FzZU5vZGVOYW1lKGdldFRhcmdldChlKSkpID49IDApIHtcbiAgICAgIHByZXZlbnREZWZhdWx0QmVoYXZpb3IoZSk7XG4gICAgfVxuXG4gICAgbGFzdFBvc2l0aW9uLnggPSBpbml0UG9zaXRpb24ueCA9ICQuY2xpZW50WDtcbiAgICBsYXN0UG9zaXRpb24ueSA9IGluaXRQb3NpdGlvbi55ID0gJC5jbGllbnRZO1xuICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgdHJhbnNsYXRlSW5pdCA9IHBhcnNlRmxvYXQoY29udGFpbmVyLnN0eWxlW3RyYW5zZm9ybUF0dHJdLnJlcGxhY2UodHJhbnNmb3JtUHJlZml4LCAnJykpO1xuICAgICAgcmVzZXREdXJhdGlvbihjb250YWluZXIsICcwcycpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uUGFuTW92ZSAoZSkge1xuICAgIGlmIChwYW5TdGFydCkge1xuICAgICAgdmFyICQgPSBnZXRFdmVudChlKTtcbiAgICAgIGxhc3RQb3NpdGlvbi54ID0gJC5jbGllbnRYO1xuICAgICAgbGFzdFBvc2l0aW9uLnkgPSAkLmNsaWVudFk7XG5cbiAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICBpZiAoIXJhZkluZGV4KSB7IHJhZkluZGV4ID0gcmFmKGZ1bmN0aW9uKCl7IHBhblVwZGF0ZShlKTsgfSk7IH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPT09ICc/JykgeyBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSBnZXRNb3ZlRGlyZWN0aW9uRXhwZWN0ZWQoKTsgfVxuICAgICAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkKSB7IHByZXZlbnRTY3JvbGwgPSB0cnVlOyB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2ZW50U2Nyb2xsKSB7IGUucHJldmVudERlZmF1bHQoKTsgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhblVwZGF0ZSAoZSkge1xuICAgIGlmICghbW92ZURpcmVjdGlvbkV4cGVjdGVkKSB7XG4gICAgICBwYW5TdGFydCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjYWYocmFmSW5kZXgpO1xuICAgIGlmIChwYW5TdGFydCkgeyByYWZJbmRleCA9IHJhZihmdW5jdGlvbigpeyBwYW5VcGRhdGUoZSk7IH0pOyB9XG5cbiAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkID09PSAnPycpIHsgbW92ZURpcmVjdGlvbkV4cGVjdGVkID0gZ2V0TW92ZURpcmVjdGlvbkV4cGVjdGVkKCk7IH1cbiAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkKSB7XG4gICAgICBpZiAoIXByZXZlbnRTY3JvbGwgJiYgaXNUb3VjaEV2ZW50KGUpKSB7IHByZXZlbnRTY3JvbGwgPSB0cnVlOyB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChlLnR5cGUpIHsgZXZlbnRzLmVtaXQoaXNUb3VjaEV2ZW50KGUpID8gJ3RvdWNoTW92ZScgOiAnZHJhZ01vdmUnLCBpbmZvKGUpKTsgfVxuICAgICAgfSBjYXRjaChlcnIpIHt9XG5cbiAgICAgIHZhciB4ID0gdHJhbnNsYXRlSW5pdCxcbiAgICAgICAgICBkaXN0ID0gZ2V0RGlzdChsYXN0UG9zaXRpb24sIGluaXRQb3NpdGlvbik7XG4gICAgICBpZiAoIWhvcml6b250YWwgfHwgZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpIHtcbiAgICAgICAgeCArPSBkaXN0O1xuICAgICAgICB4ICs9ICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcGVyY2VudGFnZVggPSBUUkFOU0ZPUk0gPyBkaXN0ICogaXRlbXMgKiAxMDAgLyAoKHZpZXdwb3J0ICsgZ3V0dGVyKSAqIHNsaWRlQ291bnROZXcpOiBkaXN0ICogMTAwIC8gKHZpZXdwb3J0ICsgZ3V0dGVyKTtcbiAgICAgICAgeCArPSBwZXJjZW50YWdlWDtcbiAgICAgICAgeCArPSAnJSc7XG4gICAgICB9XG5cbiAgICAgIGNvbnRhaW5lci5zdHlsZVt0cmFuc2Zvcm1BdHRyXSA9IHRyYW5zZm9ybVByZWZpeCArIHggKyB0cmFuc2Zvcm1Qb3N0Zml4O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uUGFuRW5kIChlKSB7XG4gICAgaWYgKHBhblN0YXJ0KSB7XG4gICAgICBpZiAocmFmSW5kZXgpIHtcbiAgICAgICAgY2FmKHJhZkluZGV4KTtcbiAgICAgICAgcmFmSW5kZXggPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKGNhcm91c2VsKSB7IHJlc2V0RHVyYXRpb24oY29udGFpbmVyLCAnJyk7IH1cbiAgICAgIHBhblN0YXJ0ID0gZmFsc2U7XG5cbiAgICAgIHZhciAkID0gZ2V0RXZlbnQoZSk7XG4gICAgICBsYXN0UG9zaXRpb24ueCA9ICQuY2xpZW50WDtcbiAgICAgIGxhc3RQb3NpdGlvbi55ID0gJC5jbGllbnRZO1xuICAgICAgdmFyIGRpc3QgPSBnZXREaXN0KGxhc3RQb3NpdGlvbiwgaW5pdFBvc2l0aW9uKTtcblxuICAgICAgaWYgKE1hdGguYWJzKGRpc3QpKSB7XG4gICAgICAgIC8vIGRyYWcgdnMgY2xpY2tcbiAgICAgICAgaWYgKCFpc1RvdWNoRXZlbnQoZSkpIHtcbiAgICAgICAgICAvLyBwcmV2ZW50IFwiY2xpY2tcIlxuICAgICAgICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoZSk7XG4gICAgICAgICAgYWRkRXZlbnRzKHRhcmdldCwgeydjbGljayc6IGZ1bmN0aW9uIHByZXZlbnRDbGljayAoZSkge1xuICAgICAgICAgICAgcHJldmVudERlZmF1bHRCZWhhdmlvcihlKTtcbiAgICAgICAgICAgIHJlbW92ZUV2ZW50cyh0YXJnZXQsIHsnY2xpY2snOiBwcmV2ZW50Q2xpY2t9KTtcbiAgICAgICAgICB9fSk7IFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgICAgcmFmSW5kZXggPSByYWYoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoKSB7XG4gICAgICAgICAgICAgIHZhciBpbmRleE1vdmVkID0gLSBkaXN0ICogaXRlbXMgLyAodmlld3BvcnQgKyBndXR0ZXIpO1xuICAgICAgICAgICAgICBpbmRleE1vdmVkID0gZGlzdCA+IDAgPyBNYXRoLmZsb29yKGluZGV4TW92ZWQpIDogTWF0aC5jZWlsKGluZGV4TW92ZWQpO1xuICAgICAgICAgICAgICBpbmRleCArPSBpbmRleE1vdmVkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdmFyIG1vdmVkID0gLSAodHJhbnNsYXRlSW5pdCArIGRpc3QpO1xuICAgICAgICAgICAgICBpZiAobW92ZWQgPD0gMCkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXhNaW47XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAobW92ZWQgPj0gc2xpZGVQb3NpdGlvbnNbc2xpZGVDb3VudE5ldyAtIDFdKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleE1heDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGkgPCBzbGlkZUNvdW50TmV3ICYmIG1vdmVkID49IHNsaWRlUG9zaXRpb25zW2ldKSB7XG4gICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICBpZiAobW92ZWQgPiBzbGlkZVBvc2l0aW9uc1tpXSAmJiBkaXN0IDwgMCkgeyBpbmRleCArPSAxOyB9XG4gICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlbmRlcihlLCBkaXN0KTtcbiAgICAgICAgICAgIGV2ZW50cy5lbWl0KGlzVG91Y2hFdmVudChlKSA/ICd0b3VjaEVuZCcgOiAnZHJhZ0VuZCcsIGluZm8oZSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQpIHtcbiAgICAgICAgICAgIG9uQ29udHJvbHNDbGljayhlLCBkaXN0ID4gMCA/IC0xIDogMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVzZXRcbiAgICBpZiAob3B0aW9ucy5wcmV2ZW50U2Nyb2xsT25Ub3VjaCA9PT0gJ2F1dG8nKSB7IHByZXZlbnRTY3JvbGwgPSBmYWxzZTsgfVxuICAgIGlmIChzd2lwZUFuZ2xlKSB7IG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9ICc/JzsgfSBcbiAgICBpZiAoYXV0b3BsYXkgJiYgIWFuaW1hdGluZykgeyBzZXRBdXRvcGxheVRpbWVyKCk7IH1cbiAgfVxuXG4gIC8vID09PSBSRVNJWkUgRlVOQ1RJT05TID09PSAvL1xuICAvLyAoc2xpZGVQb3NpdGlvbnMsIGluZGV4LCBpdGVtcykgPT4gdmVydGljYWxfY29uZW50V3JhcHBlci5oZWlnaHRcbiAgZnVuY3Rpb24gdXBkYXRlQ29udGVudFdyYXBwZXJIZWlnaHQgKCkge1xuICAgIHZhciB3cCA9IG1pZGRsZVdyYXBwZXIgPyBtaWRkbGVXcmFwcGVyIDogaW5uZXJXcmFwcGVyO1xuICAgIHdwLnN0eWxlLmhlaWdodCA9IHNsaWRlUG9zaXRpb25zW2luZGV4ICsgaXRlbXNdIC0gc2xpZGVQb3NpdGlvbnNbaW5kZXhdICsgJ3B4JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBhZ2VzICgpIHtcbiAgICB2YXIgcm91Z2ggPSBmaXhlZFdpZHRoID8gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogc2xpZGVDb3VudCAvIHZpZXdwb3J0IDogc2xpZGVDb3VudCAvIGl0ZW1zO1xuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLmNlaWwocm91Z2gpLCBzbGlkZUNvdW50KTtcbiAgfVxuXG4gIC8qXG4gICAqIDEuIHVwZGF0ZSB2aXNpYmxlIG5hdiBpdGVtcyBsaXN0XG4gICAqIDIuIGFkZCBcImhpZGRlblwiIGF0dHJpYnV0ZXMgdG8gcHJldmlvdXMgdmlzaWJsZSBuYXYgaXRlbXNcbiAgICogMy4gcmVtb3ZlIFwiaGlkZGVuXCIgYXR0cnVidXRlcyB0byBuZXcgdmlzaWJsZSBuYXYgaXRlbXNcbiAgICovXG4gIGZ1bmN0aW9uIHVwZGF0ZU5hdlZpc2liaWxpdHkgKCkge1xuICAgIGlmICghbmF2IHx8IG5hdkFzVGh1bWJuYWlscykgeyByZXR1cm47IH1cblxuICAgIGlmIChwYWdlcyAhPT0gcGFnZXNDYWNoZWQpIHtcbiAgICAgIHZhciBtaW4gPSBwYWdlc0NhY2hlZCxcbiAgICAgICAgICBtYXggPSBwYWdlcyxcbiAgICAgICAgICBmbiA9IHNob3dFbGVtZW50O1xuXG4gICAgICBpZiAocGFnZXNDYWNoZWQgPiBwYWdlcykge1xuICAgICAgICBtaW4gPSBwYWdlcztcbiAgICAgICAgbWF4ID0gcGFnZXNDYWNoZWQ7XG4gICAgICAgIGZuID0gaGlkZUVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChtaW4gPCBtYXgpIHtcbiAgICAgICAgZm4obmF2SXRlbXNbbWluXSk7XG4gICAgICAgIG1pbisrO1xuICAgICAgfVxuXG4gICAgICAvLyBjYWNoZSBwYWdlc1xuICAgICAgcGFnZXNDYWNoZWQgPSBwYWdlcztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbmZvIChlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRhaW5lcjogY29udGFpbmVyLFxuICAgICAgc2xpZGVJdGVtczogc2xpZGVJdGVtcyxcbiAgICAgIG5hdkNvbnRhaW5lcjogbmF2Q29udGFpbmVyLFxuICAgICAgbmF2SXRlbXM6IG5hdkl0ZW1zLFxuICAgICAgY29udHJvbHNDb250YWluZXI6IGNvbnRyb2xzQ29udGFpbmVyLFxuICAgICAgaGFzQ29udHJvbHM6IGhhc0NvbnRyb2xzLFxuICAgICAgcHJldkJ1dHRvbjogcHJldkJ1dHRvbixcbiAgICAgIG5leHRCdXR0b246IG5leHRCdXR0b24sXG4gICAgICBpdGVtczogaXRlbXMsXG4gICAgICBzbGlkZUJ5OiBzbGlkZUJ5LFxuICAgICAgY2xvbmVDb3VudDogY2xvbmVDb3VudCxcbiAgICAgIHNsaWRlQ291bnQ6IHNsaWRlQ291bnQsXG4gICAgICBzbGlkZUNvdW50TmV3OiBzbGlkZUNvdW50TmV3LFxuICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgaW5kZXhDYWNoZWQ6IGluZGV4Q2FjaGVkLFxuICAgICAgZGlzcGxheUluZGV4OiBnZXRDdXJyZW50U2xpZGUoKSxcbiAgICAgIG5hdkN1cnJlbnRJbmRleDogbmF2Q3VycmVudEluZGV4LFxuICAgICAgbmF2Q3VycmVudEluZGV4Q2FjaGVkOiBuYXZDdXJyZW50SW5kZXhDYWNoZWQsXG4gICAgICBwYWdlczogcGFnZXMsXG4gICAgICBwYWdlc0NhY2hlZDogcGFnZXNDYWNoZWQsXG4gICAgICBzaGVldDogc2hlZXQsXG4gICAgICBpc09uOiBpc09uLFxuICAgICAgZXZlbnQ6IGUgfHwge30sXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdmVyc2lvbjogJzIuOS4yJyxcbiAgICBnZXRJbmZvOiBpbmZvLFxuICAgIGV2ZW50czogZXZlbnRzLFxuICAgIGdvVG86IGdvVG8sXG4gICAgcGxheTogcGxheSxcbiAgICBwYXVzZTogcGF1c2UsXG4gICAgaXNPbjogaXNPbixcbiAgICB1cGRhdGVTbGlkZXJIZWlnaHQ6IHVwZGF0ZUlubmVyV3JhcHBlckhlaWdodCxcbiAgICByZWZyZXNoOiBpbml0U2xpZGVyVHJhbnNmb3JtLFxuICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgcmVidWlsZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdG5zKGV4dGVuZChvcHRpb25zLCBvcHRpb25zRWxlbWVudHMpKTtcbiAgICB9XG4gIH07XG59O1xuXG5yZXR1cm4gdG5zO1xufSkoKTsiLCJjb25zdCBoYW5kbGVUb2dnbGUgPSAoZXZlbnQpID0+IHtcbiAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgdmFyIHBhcmVudE5vZGUgPSB0YXJnZXQuY2xvc2VzdCgnLmZhcS1pdGVtJyk7XG5cbiAgcGFyZW50Tm9kZS5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuJyk7XG59O1xuXG4vLyBBZGQgZXZlbnRMaXN0ZW5lcnMuXG52YXIgdG9nZ2xlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1mYXEtaXRlbS10b2dnbGUnKTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCB0b2dnbGVzLmxlbmd0aDsgaSsrKSB7XG4gIHZhciBpdGVtID0gdG9nZ2xlc1tpXTtcblxuICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlVG9nZ2xlKTtcbn1cbiIsIihmdW5jdGlvbigpIHtcbiAgY29uc3QgaGFuZGxlVG9nZ2xlID0gKGV2ZW50KSA9PiB7XG4gICAgdmFyIHNpZGViYXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNpZGViYXInKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2lkZWJhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzaWRlYmFyID0gc2lkZWJhcnNbaV07XG5cbiAgICAgIHNpZGViYXIuY2xhc3NMaXN0LnRvZ2dsZSgnb3BlbicpO1xuICAgIH1cbiAgfTtcblxuICAvLyBBZGQgZXZlbnRMaXN0ZW5lcnMuXG4gIHZhciB0b2dnbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXNpZGViYXItdG9nZ2xlJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2dnbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSB0b2dnbGVzW2ldO1xuXG4gICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZVRvZ2dsZSk7XG4gIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGhhbmRsZVRvZ2dsZShldmVudCkge1xuICAgIHZhciBjbGlja2VkRWxlbWVudCA9IHRoaXM7XG4gICAgdmFyIHdyYXBwZXIgPSBjbGlja2VkRWxlbWVudC5jbG9zZXN0KCcudGFiYmEnKTtcbiAgICB2YXIgdG9nZ2xlcyA9IHdyYXBwZXIucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRhYmJhLXRvZ2dsZScpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2dnbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdG9nZ2xlID0gdG9nZ2xlc1tpXTtcbiAgICAgIHZhciB0b2dnbGVXcmFwcGVyID0gdG9nZ2xlLmNsb3Nlc3QoJy50YWJiYScpO1xuICAgICAgdmFyIG5vZGVJc1NhbWUgPSB0b2dnbGUuaXNTYW1lTm9kZShjbGlja2VkRWxlbWVudCk7XG4gICAgICB2YXIgd3JhcHBlcklzU2FtZSA9IHRvZ2dsZVdyYXBwZXIuaXNTYW1lTm9kZSh3cmFwcGVyKTtcblxuICAgICAgaWYgKG5vZGVJc1NhbWUgJiYgd3JhcHBlcklzU2FtZSkge1xuICAgICAgICB0b2dnbGVFbGVtZW50KHdyYXBwZXIsIGkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZUVsZW1lbnQod3JhcHBlciwgaW5kZXgpIHtcbiAgICB2YXIgdG9nZ2xlcyA9IHdyYXBwZXIucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRhYmJhLXRvZ2dsZScpO1xuICAgIHZhciBjb250ZW50SXRlbXMgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWJiYS1pdGVtJyk7XG5cbiAgICAvLyBTaG93IGNvbnRlbnQgaXRlbVxuICAgIHZhciBjb250ZW50SXRlbUluZGV4ID0gMDtcbiAgICBmb3IgKHZhciBjb250ZW50SXRlbUludCA9IDA7IGNvbnRlbnRJdGVtSW50IDwgY29udGVudEl0ZW1zLmxlbmd0aDsgY29udGVudEl0ZW1JbnQrKykge1xuICAgICAgdmFyIGNvbnRlbnRJdGVtID0gY29udGVudEl0ZW1zW2NvbnRlbnRJdGVtSW50XTtcbiAgICAgIHZhciBjb250ZW50SXRlbVdyYXBwZXIgPSBjb250ZW50SXRlbS5jbG9zZXN0KCcudGFiYmEnKTtcbiAgICAgIHZhciBjb250ZW50V3JhcHBlcklzU2FtZSA9IGNvbnRlbnRJdGVtV3JhcHBlci5pc1NhbWVOb2RlKHdyYXBwZXIpO1xuXG4gICAgICBpZiAoY29udGVudFdyYXBwZXJJc1NhbWUpIHtcblxuICAgICAgICBpZiAoaW5kZXggPT09IGNvbnRlbnRJdGVtSW5kZXgpIHtcbiAgICAgICAgICBjb250ZW50SXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250ZW50SXRlbS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRlbnRJdGVtSW5kZXgrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgYWN0aXZlIGNsYXNzIG9uIHRvZ2dsZS5cbiAgICB2YXIgdG9nZ2xlSW5kZXggPSAwO1xuICAgIGZvciAodmFyIHRvZ2dsZUludCA9IDA7IHRvZ2dsZUludCA8IHRvZ2dsZXMubGVuZ3RoOyB0b2dnbGVJbnQrKykge1xuICAgICAgdmFyIHRvZ2dsZSA9IHRvZ2dsZXNbdG9nZ2xlSW50XTtcbiAgICAgIHZhciB0b2dnbGVXcmFwcGVyID0gdG9nZ2xlLmNsb3Nlc3QoJy50YWJiYScpO1xuICAgICAgdmFyIHRvZ2dsZVdyYXBwZXJJc1NhbWUgPSB0b2dnbGVXcmFwcGVyLmlzU2FtZU5vZGUod3JhcHBlcik7XG5cbiAgICAgIGlmICh0b2dnbGVXcmFwcGVySXNTYW1lKSB7XG5cbiAgICAgICAgaWYgKGluZGV4ID09PSB0b2dnbGVJbmRleCkge1xuICAgICAgICAgIHRvZ2dsZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b2dnbGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0b2dnbGVJbmRleCsrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEFkZCBldmVudExpc3RlbmVycy5cbiAgdmFyIHdyYXBwZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYmJhJyk7XG5cbiAgZm9yICh2YXIgd3JhcHBlckludCA9IDA7IHdyYXBwZXJJbnQgPCB3cmFwcGVycy5sZW5ndGg7IHdyYXBwZXJJbnQrKykge1xuICAgIHZhciB3cmFwcGVyID0gd3JhcHBlcnNbd3JhcHBlckludF07XG4gICAgdmFyIHRvZ2dsZXMgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy10YWJiYS10b2dnbGUnKTtcblxuICAgIC8vIFNob3cgdGhlIGZpcnN0IGVsZW1lbnQgdXBvbiBwYWdlIGxvYWQuXG4gICAgdG9nZ2xlRWxlbWVudCh3cmFwcGVyLCAwKTtcblxuICAgIC8vIFJ1biB0aHJvdWdoIHRvZ2dsZXMuXG4gICAgZm9yICh2YXIgdG9nZ2xlSW50ID0gMDsgdG9nZ2xlSW50IDwgdG9nZ2xlcy5sZW5ndGg7IHRvZ2dsZUludCsrKSB7XG4gICAgICB2YXIgdG9nZ2xlID0gdG9nZ2xlc1t0b2dnbGVJbnRdO1xuXG4gICAgICB0b2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVUb2dnbGUpO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsImpRdWVyeShmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gRmxleHkgaGVhZGVyXG4gIC8vIGZsZXh5X2hlYWRlci5pbml0KCk7XG5cbiAgLy8gU2lkclxuICAkKCcuc2xpbmt5LW1lbnUnKVxuICAgIC5maW5kKCd1bCwgbGksIGEnKVxuICAgIC5yZW1vdmVDbGFzcygpO1xuXG4gIC8vIEVuYWJsZSB0b29sdGlwcy5cbiAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcblxuICAvLyBTaG93Y2FzZXMuXG4gIHZhciBzbGlkZXIgPSB0bnMoe1xuICAgIGNvbnRhaW5lcjogJy5zaG93Y2FzZXMnLFxuICAgIGl0ZW1zOiAxLFxuICAgIHNsaWRlQnk6ICdwYWdlJyxcbiAgICBhdXRvcGxheTogdHJ1ZVxuICB9KTtcbn0pO1xuIl19
