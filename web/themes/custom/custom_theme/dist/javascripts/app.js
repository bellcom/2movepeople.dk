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

// |--------------------------------------------------------------------------
// | Flexy navigation
// |--------------------------------------------------------------------------
// |
// | This jQuery script is written by
// |
// | Morten Nissen
// | hjemmesidekongen.dk
// |

var flexy_navigation = function ($) {
    'use strict';

    var pub = {},
        layout_classes = {
        'navigation': '.flexy-navigation',
        'obfuscator': '.flexy-navigation__obfuscator',
        'dropdown': '.flexy-navigation__item--dropdown',
        'dropdown_megamenu': '.flexy-navigation__item__dropdown-megamenu',

        'is_upgraded': 'is-upgraded',
        'navigation_has_megamenu': 'has-megamenu',
        'dropdown_has_megamenu': 'flexy-navigation__item--dropdown-with-megamenu'
    };

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

        // Upgrade
        upgrade();
    }

    /**
     * Register event handlers
     */
    function registerEventHandlers() {}

    /**
     * Upgrade elements.
     * Add classes to elements, based upon attached classes.
     */
    function upgrade() {
        var $navigations = $(layout_classes.navigation);

        // Navigations
        if ($navigations.length > 0) {
            $navigations.each(function (index, element) {
                var $navigation = $(this),
                    $megamenus = $navigation.find(layout_classes.dropdown_megamenu),
                    $dropdown_megamenu = $navigation.find(layout_classes.dropdown_has_megamenu);

                // Has already been upgraded
                if ($navigation.hasClass(layout_classes.is_upgraded)) {
                    return;
                }

                // Has megamenu
                if ($megamenus.length > 0) {
                    $navigation.addClass(layout_classes.navigation_has_megamenu);

                    // Run through all megamenus
                    $megamenus.each(function (index, element) {
                        var $megamenu = $(this),
                            has_obfuscator = $('html').hasClass('has-obfuscator') ? true : false;

                        $megamenu.parents(layout_classes.dropdown).addClass(layout_classes.dropdown_has_megamenu).hover(function () {

                            if (has_obfuscator) {
                                obfuscator.show();
                            }
                        }, function () {

                            if (has_obfuscator) {
                                obfuscator.hide();
                            }
                        });
                    });
                }

                // Is upgraded
                $navigation.addClass(layout_classes.is_upgraded);
            });
        }
    }

    return pub;
}(jQuery);
"use strict";

/*! sidr - v2.2.1 - 2016-02-17
 * http://www.berriart.com/sidr/
 * Copyright (c) 2013-2016 Alberto Varela; Licensed MIT */

(function () {
  'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  var sidrStatus = {
    moving: false,
    opened: false
  };

  var helper = {
    // Check for valids urls
    // From : http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url

    isUrl: function isUrl(str) {
      var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

      if (pattern.test(str)) {
        return true;
      } else {
        return false;
      }
    },

    // Add sidr prefixes
    addPrefixes: function addPrefixes($element) {
      this.addPrefix($element, 'id');
      this.addPrefix($element, 'class');
      $element.removeAttr('style');
    },
    addPrefix: function addPrefix($element, attribute) {
      var toReplace = $element.attr(attribute);

      if (typeof toReplace === 'string' && toReplace !== '' && toReplace !== 'sidr-inner') {
        $element.attr(attribute, toReplace.replace(/([A-Za-z0-9_.\-]+)/g, 'sidr-' + attribute + '-$1'));
      }
    },

    // Check if transitions is supported
    transitions: function () {
      var body = document.body || document.documentElement,
          style = body.style,
          supported = false,
          property = 'transition';

      if (property in style) {
        supported = true;
      } else {
        (function () {
          var prefixes = ['moz', 'webkit', 'o', 'ms'],
              prefix = undefined,
              i = undefined;

          property = property.charAt(0).toUpperCase() + property.substr(1);
          supported = function () {
            for (i = 0; i < prefixes.length; i++) {
              prefix = prefixes[i];
              if (prefix + property in style) {
                return true;
              }
            }

            return false;
          }();
          property = supported ? '-' + prefix.toLowerCase() + '-' + property.toLowerCase() : null;
        })();
      }

      return {
        supported: supported,
        property: property
      };
    }()
  };

  var $$2 = jQuery;

  var bodyAnimationClass = 'sidr-animating';
  var openAction = 'open';
  var closeAction = 'close';
  var transitionEndEvent = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
  var Menu = function () {
    function Menu(name) {
      babelHelpers.classCallCheck(this, Menu);

      this.name = name;
      this.item = $$2('#' + name);
      this.openClass = name === 'sidr' ? 'sidr-open' : 'sidr-open ' + name + '-open';
      this.menuWidth = this.item.outerWidth(true);
      this.speed = this.item.data('speed');
      this.side = this.item.data('side');
      this.displace = this.item.data('displace');
      this.timing = this.item.data('timing');
      this.method = this.item.data('method');
      this.onOpenCallback = this.item.data('onOpen');
      this.onCloseCallback = this.item.data('onClose');
      this.onOpenEndCallback = this.item.data('onOpenEnd');
      this.onCloseEndCallback = this.item.data('onCloseEnd');
      this.body = $$2(this.item.data('body'));
    }

    babelHelpers.createClass(Menu, [{
      key: 'getAnimation',
      value: function getAnimation(action, element) {
        var animation = {},
            prop = this.side;

        if (action === 'open' && element === 'body') {
          animation[prop] = this.menuWidth + 'px';
        } else if (action === 'close' && element === 'menu') {
          animation[prop] = '-' + this.menuWidth + 'px';
        } else {
          animation[prop] = 0;
        }

        return animation;
      }
    }, {
      key: 'prepareBody',
      value: function prepareBody(action) {
        var prop = action === 'open' ? 'hidden' : '';

        // Prepare page if container is body
        if (this.body.is('body')) {
          var $html = $$2('html'),
              scrollTop = $html.scrollTop();

          $html.css('overflow-x', prop).scrollTop(scrollTop);
        }
      }
    }, {
      key: 'openBody',
      value: function openBody() {
        if (this.displace) {
          var transitions = helper.transitions,
              $body = this.body;

          if (transitions.supported) {
            $body.css(transitions.property, this.side + ' ' + this.speed / 1000 + 's ' + this.timing).css(this.side, 0).css({
              width: $body.width(),
              position: 'absolute'
            });
            $body.css(this.side, this.menuWidth + 'px');
          } else {
            var bodyAnimation = this.getAnimation(openAction, 'body');

            $body.css({
              width: $body.width(),
              position: 'absolute'
            }).animate(bodyAnimation, {
              queue: false,
              duration: this.speed
            });
          }
        }
      }
    }, {
      key: 'onCloseBody',
      value: function onCloseBody() {
        var transitions = helper.transitions,
            resetStyles = {
          width: '',
          position: '',
          right: '',
          left: ''
        };

        if (transitions.supported) {
          resetStyles[transitions.property] = '';
        }

        this.body.css(resetStyles).unbind(transitionEndEvent);
      }
    }, {
      key: 'closeBody',
      value: function closeBody() {
        var _this = this;

        if (this.displace) {
          if (helper.transitions.supported) {
            this.body.css(this.side, 0).one(transitionEndEvent, function () {
              _this.onCloseBody();
            });
          } else {
            var bodyAnimation = this.getAnimation(closeAction, 'body');

            this.body.animate(bodyAnimation, {
              queue: false,
              duration: this.speed,
              complete: function complete() {
                _this.onCloseBody();
              }
            });
          }
        }
      }
    }, {
      key: 'moveBody',
      value: function moveBody(action) {
        if (action === openAction) {
          this.openBody();
        } else {
          this.closeBody();
        }
      }
    }, {
      key: 'onOpenMenu',
      value: function onOpenMenu(callback) {
        var name = this.name;

        sidrStatus.moving = false;
        sidrStatus.opened = name;

        this.item.unbind(transitionEndEvent);

        this.body.removeClass(bodyAnimationClass).addClass(this.openClass);

        this.onOpenEndCallback();

        if (typeof callback === 'function') {
          callback(name);
        }
      }
    }, {
      key: 'openMenu',
      value: function openMenu(callback) {
        var _this2 = this;

        var $item = this.item;

        if (helper.transitions.supported) {
          $item.css(this.side, 0).one(transitionEndEvent, function () {
            _this2.onOpenMenu(callback);
          });
        } else {
          var menuAnimation = this.getAnimation(openAction, 'menu');

          $item.css('display', 'block').animate(menuAnimation, {
            queue: false,
            duration: this.speed,
            complete: function complete() {
              _this2.onOpenMenu(callback);
            }
          });
        }
      }
    }, {
      key: 'onCloseMenu',
      value: function onCloseMenu(callback) {
        this.item.css({
          left: '',
          right: ''
        }).unbind(transitionEndEvent);
        $$2('html').css('overflow-x', '');

        sidrStatus.moving = false;
        sidrStatus.opened = false;

        this.body.removeClass(bodyAnimationClass).removeClass(this.openClass);

        this.onCloseEndCallback();

        // Callback
        if (typeof callback === 'function') {
          callback(name);
        }
      }
    }, {
      key: 'closeMenu',
      value: function closeMenu(callback) {
        var _this3 = this;

        var item = this.item;

        if (helper.transitions.supported) {
          item.css(this.side, '').one(transitionEndEvent, function () {
            _this3.onCloseMenu(callback);
          });
        } else {
          var menuAnimation = this.getAnimation(closeAction, 'menu');

          item.animate(menuAnimation, {
            queue: false,
            duration: this.speed,
            complete: function complete() {
              _this3.onCloseMenu();
            }
          });
        }
      }
    }, {
      key: 'moveMenu',
      value: function moveMenu(action, callback) {
        this.body.addClass(bodyAnimationClass);

        if (action === openAction) {
          this.openMenu(callback);
        } else {
          this.closeMenu(callback);
        }
      }
    }, {
      key: 'move',
      value: function move(action, callback) {
        // Lock sidr
        sidrStatus.moving = true;

        this.prepareBody(action);
        this.moveBody(action);
        this.moveMenu(action, callback);
      }
    }, {
      key: 'open',
      value: function open(callback) {
        var _this4 = this;

        // Check if is already opened or moving
        if (sidrStatus.opened === this.name || sidrStatus.moving) {
          return;
        }

        // If another menu opened close first
        if (sidrStatus.opened !== false) {
          var alreadyOpenedMenu = new Menu(sidrStatus.opened);

          alreadyOpenedMenu.close(function () {
            _this4.open(callback);
          });

          return;
        }

        this.move('open', callback);

        // onOpen callback
        this.onOpenCallback();
      }
    }, {
      key: 'close',
      value: function close(callback) {
        // Check if is already closed or moving
        if (sidrStatus.opened !== this.name || sidrStatus.moving) {
          return;
        }

        this.move('close', callback);

        // onClose callback
        this.onCloseCallback();
      }
    }, {
      key: 'toggle',
      value: function toggle(callback) {
        if (sidrStatus.opened === this.name) {
          this.close(callback);
        } else {
          this.open(callback);
        }
      }
    }]);
    return Menu;
  }();

  var $$1 = jQuery;

  function execute(action, name, callback) {
    var sidr = new Menu(name);

    switch (action) {
      case 'open':
        sidr.open(callback);
        break;
      case 'close':
        sidr.close(callback);
        break;
      case 'toggle':
        sidr.toggle(callback);
        break;
      default:
        $$1.error('Method ' + action + ' does not exist on jQuery.sidr');
        break;
    }
  }

  var i;
  var $ = jQuery;
  var publicMethods = ['open', 'close', 'toggle'];
  var methodName;
  var methods = {};
  var getMethod = function getMethod(methodName) {
    return function (name, callback) {
      // Check arguments
      if (typeof name === 'function') {
        callback = name;
        name = 'sidr';
      } else if (!name) {
        name = 'sidr';
      }

      execute(methodName, name, callback);
    };
  };
  for (i = 0; i < publicMethods.length; i++) {
    methodName = publicMethods[i];
    methods[methodName] = getMethod(methodName);
  }

  function sidr(method) {
    if (method === 'status') {
      return sidrStatus;
    } else if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'function' || typeof method === 'string' || !method) {
      return methods.toggle.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sidr');
    }
  }

  var $$3 = jQuery;

  function fillContent($sideMenu, settings) {
    // The menu content
    if (typeof settings.source === 'function') {
      var newContent = settings.source(name);

      $sideMenu.html(newContent);
    } else if (typeof settings.source === 'string' && helper.isUrl(settings.source)) {
      $$3.get(settings.source, function (data) {
        $sideMenu.html(data);
      });
    } else if (typeof settings.source === 'string') {
      var htmlContent = '',
          selectors = settings.source.split(',');

      $$3.each(selectors, function (index, element) {
        htmlContent += '<div class="sidr-inner">' + $$3(element).html() + '</div>';
      });

      // Renaming ids and classes
      if (settings.renaming) {
        var $htmlContent = $$3('<div />').html(htmlContent);

        $htmlContent.find('*').each(function (index, element) {
          var $element = $$3(element);

          helper.addPrefixes($element);
        });
        htmlContent = $htmlContent.html();
      }

      $sideMenu.html(htmlContent);
    } else if (settings.source !== null) {
      $$3.error('Invalid Sidr Source');
    }

    return $sideMenu;
  }

  function fnSidr(options) {
    var transitions = helper.transitions,
        settings = $$3.extend({
      name: 'sidr', // Name for the 'sidr'
      speed: 200, // Accepts standard jQuery effects speeds (i.e. fast, normal or milliseconds)
      side: 'left', // Accepts 'left' or 'right'
      source: null, // Override the source of the content.
      renaming: true, // The ids and classes will be prepended with a prefix when loading existent content
      body: 'body', // Page container selector,
      displace: true, // Displace the body content or not
      timing: 'ease', // Timing function for CSS transitions
      method: 'toggle', // The method to call when element is clicked
      bind: 'touchstart click', // The event(s) to trigger the menu
      onOpen: function onOpen() {},
      // Callback when sidr start opening
      onClose: function onClose() {},
      // Callback when sidr start closing
      onOpenEnd: function onOpenEnd() {},
      // Callback when sidr end opening
      onCloseEnd: function onCloseEnd() {} // Callback when sidr end closing

    }, options),
        name = settings.name,
        $sideMenu = $$3('#' + name);

    // If the side menu do not exist create it
    if ($sideMenu.length === 0) {
      $sideMenu = $$3('<div />').attr('id', name).appendTo($$3('body'));
    }

    // Add transition to menu if are supported
    if (transitions.supported) {
      $sideMenu.css(transitions.property, settings.side + ' ' + settings.speed / 1000 + 's ' + settings.timing);
    }

    // Adding styles and options
    $sideMenu.addClass('sidr').addClass(settings.side).data({
      speed: settings.speed,
      side: settings.side,
      body: settings.body,
      displace: settings.displace,
      timing: settings.timing,
      method: settings.method,
      onOpen: settings.onOpen,
      onClose: settings.onClose,
      onOpenEnd: settings.onOpenEnd,
      onCloseEnd: settings.onCloseEnd
    });

    $sideMenu = fillContent($sideMenu, settings);

    return this.each(function () {
      var $this = $$3(this),
          data = $this.data('sidr'),
          flag = false;

      // If the plugin hasn't been initialized yet
      if (!data) {
        sidrStatus.moving = false;
        sidrStatus.opened = false;

        $this.data('sidr', name);

        $this.bind(settings.bind, function (event) {
          event.preventDefault();

          if (!flag) {
            flag = true;
            sidr(settings.method, name);

            setTimeout(function () {
              flag = false;
            }, 100);
          }
        });
      }
    });
  }

  jQuery.sidr = sidr;
  jQuery.fn.sidr = fnSidr;
})();
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
'use strict';

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvb3RzdHJhcC5qcyIsImZsZXh5LWhlYWRlci5qcyIsImZsZXh5LW5hdmlnYXRpb24uanMiLCJqcXVlcnkuc2lkci5qcyIsInBhY2UuanMiLCJhcHAuanMiXSwibmFtZXMiOlsialF1ZXJ5IiwiRXJyb3IiLCIkIiwidmVyc2lvbiIsImZuIiwianF1ZXJ5Iiwic3BsaXQiLCJ0cmFuc2l0aW9uRW5kIiwiZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ0cmFuc0VuZEV2ZW50TmFtZXMiLCJXZWJraXRUcmFuc2l0aW9uIiwiTW96VHJhbnNpdGlvbiIsIk9UcmFuc2l0aW9uIiwidHJhbnNpdGlvbiIsIm5hbWUiLCJzdHlsZSIsInVuZGVmaW5lZCIsImVuZCIsImVtdWxhdGVUcmFuc2l0aW9uRW5kIiwiZHVyYXRpb24iLCJjYWxsZWQiLCIkZWwiLCJvbmUiLCJjYWxsYmFjayIsInRyaWdnZXIiLCJzdXBwb3J0Iiwic2V0VGltZW91dCIsImV2ZW50Iiwic3BlY2lhbCIsImJzVHJhbnNpdGlvbkVuZCIsImJpbmRUeXBlIiwiZGVsZWdhdGVUeXBlIiwiaGFuZGxlIiwiZSIsInRhcmdldCIsImlzIiwiaGFuZGxlT2JqIiwiaGFuZGxlciIsImFwcGx5IiwiYXJndW1lbnRzIiwiZGlzbWlzcyIsIkFsZXJ0Iiwib24iLCJjbG9zZSIsIlZFUlNJT04iLCJUUkFOU0lUSU9OX0RVUkFUSU9OIiwicHJvdG90eXBlIiwiJHRoaXMiLCJzZWxlY3RvciIsImF0dHIiLCJyZXBsYWNlIiwiJHBhcmVudCIsImZpbmQiLCJwcmV2ZW50RGVmYXVsdCIsImxlbmd0aCIsImNsb3Nlc3QiLCJFdmVudCIsImlzRGVmYXVsdFByZXZlbnRlZCIsInJlbW92ZUNsYXNzIiwicmVtb3ZlRWxlbWVudCIsImRldGFjaCIsInJlbW92ZSIsImhhc0NsYXNzIiwiUGx1Z2luIiwib3B0aW9uIiwiZWFjaCIsImRhdGEiLCJjYWxsIiwib2xkIiwiYWxlcnQiLCJDb25zdHJ1Y3RvciIsIm5vQ29uZmxpY3QiLCJCdXR0b24iLCJlbGVtZW50Iiwib3B0aW9ucyIsIiRlbGVtZW50IiwiZXh0ZW5kIiwiREVGQVVMVFMiLCJpc0xvYWRpbmciLCJsb2FkaW5nVGV4dCIsInNldFN0YXRlIiwic3RhdGUiLCJkIiwidmFsIiwicmVzZXRUZXh0IiwicHJveHkiLCJhZGRDbGFzcyIsInByb3AiLCJyZW1vdmVBdHRyIiwidG9nZ2xlIiwiY2hhbmdlZCIsIiRpbnB1dCIsInRvZ2dsZUNsYXNzIiwiYnV0dG9uIiwiJGJ0biIsImZpcnN0IiwidGVzdCIsInR5cGUiLCJDYXJvdXNlbCIsIiRpbmRpY2F0b3JzIiwicGF1c2VkIiwic2xpZGluZyIsImludGVydmFsIiwiJGFjdGl2ZSIsIiRpdGVtcyIsImtleWJvYXJkIiwia2V5ZG93biIsInBhdXNlIiwiZG9jdW1lbnRFbGVtZW50IiwiY3ljbGUiLCJ3cmFwIiwidGFnTmFtZSIsIndoaWNoIiwicHJldiIsIm5leHQiLCJjbGVhckludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJnZXRJdGVtSW5kZXgiLCJpdGVtIiwicGFyZW50IiwiY2hpbGRyZW4iLCJpbmRleCIsImdldEl0ZW1Gb3JEaXJlY3Rpb24iLCJkaXJlY3Rpb24iLCJhY3RpdmUiLCJhY3RpdmVJbmRleCIsIndpbGxXcmFwIiwiZGVsdGEiLCJpdGVtSW5kZXgiLCJlcSIsInRvIiwicG9zIiwidGhhdCIsInNsaWRlIiwiJG5leHQiLCJpc0N5Y2xpbmciLCJyZWxhdGVkVGFyZ2V0Iiwic2xpZGVFdmVudCIsIiRuZXh0SW5kaWNhdG9yIiwic2xpZEV2ZW50Iiwib2Zmc2V0V2lkdGgiLCJqb2luIiwiYWN0aW9uIiwiY2Fyb3VzZWwiLCJjbGlja0hhbmRsZXIiLCJocmVmIiwiJHRhcmdldCIsInNsaWRlSW5kZXgiLCJ3aW5kb3ciLCIkY2Fyb3VzZWwiLCJDb2xsYXBzZSIsIiR0cmlnZ2VyIiwiaWQiLCJ0cmFuc2l0aW9uaW5nIiwiZ2V0UGFyZW50IiwiYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzIiwiZGltZW5zaW9uIiwiaGFzV2lkdGgiLCJzaG93IiwiYWN0aXZlc0RhdGEiLCJhY3RpdmVzIiwic3RhcnRFdmVudCIsImNvbXBsZXRlIiwic2Nyb2xsU2l6ZSIsImNhbWVsQ2FzZSIsImhpZGUiLCJvZmZzZXRIZWlnaHQiLCJpIiwiZ2V0VGFyZ2V0RnJvbVRyaWdnZXIiLCJpc09wZW4iLCJjb2xsYXBzZSIsImJhY2tkcm9wIiwiRHJvcGRvd24iLCJjbGVhck1lbnVzIiwiY29udGFpbnMiLCJpc0FjdGl2ZSIsImluc2VydEFmdGVyIiwic3RvcFByb3BhZ2F0aW9uIiwiZGVzYyIsImRyb3Bkb3duIiwiTW9kYWwiLCIkYm9keSIsImJvZHkiLCIkZGlhbG9nIiwiJGJhY2tkcm9wIiwiaXNTaG93biIsIm9yaWdpbmFsQm9keVBhZCIsInNjcm9sbGJhcldpZHRoIiwiaWdub3JlQmFja2Ryb3BDbGljayIsImZpeGVkQ29udGVudCIsInJlbW90ZSIsImxvYWQiLCJCQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OIiwiX3JlbGF0ZWRUYXJnZXQiLCJjaGVja1Njcm9sbGJhciIsInNldFNjcm9sbGJhciIsImVzY2FwZSIsInJlc2l6ZSIsImFwcGVuZFRvIiwic2Nyb2xsVG9wIiwiYWRqdXN0RGlhbG9nIiwiZW5mb3JjZUZvY3VzIiwib2ZmIiwiaGlkZU1vZGFsIiwiaGFzIiwiaGFuZGxlVXBkYXRlIiwicmVzZXRBZGp1c3RtZW50cyIsInJlc2V0U2Nyb2xsYmFyIiwicmVtb3ZlQmFja2Ryb3AiLCJhbmltYXRlIiwiZG9BbmltYXRlIiwiY3VycmVudFRhcmdldCIsImZvY3VzIiwiY2FsbGJhY2tSZW1vdmUiLCJtb2RhbElzT3ZlcmZsb3dpbmciLCJzY3JvbGxIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJjc3MiLCJwYWRkaW5nTGVmdCIsImJvZHlJc092ZXJmbG93aW5nIiwicGFkZGluZ1JpZ2h0IiwiZnVsbFdpbmRvd1dpZHRoIiwiaW5uZXJXaWR0aCIsImRvY3VtZW50RWxlbWVudFJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJyaWdodCIsIk1hdGgiLCJhYnMiLCJsZWZ0IiwiY2xpZW50V2lkdGgiLCJtZWFzdXJlU2Nyb2xsYmFyIiwiYm9keVBhZCIsInBhcnNlSW50IiwiYWN0dWFsUGFkZGluZyIsImNhbGN1bGF0ZWRQYWRkaW5nIiwicGFyc2VGbG9hdCIsInBhZGRpbmciLCJyZW1vdmVEYXRhIiwic2Nyb2xsRGl2IiwiY2xhc3NOYW1lIiwiYXBwZW5kIiwicmVtb3ZlQ2hpbGQiLCJtb2RhbCIsInNob3dFdmVudCIsIkRJU0FMTE9XRURfQVRUUklCVVRFUyIsInVyaUF0dHJzIiwiQVJJQV9BVFRSSUJVVEVfUEFUVEVSTiIsIkRlZmF1bHRXaGl0ZWxpc3QiLCJhIiwiYXJlYSIsImIiLCJiciIsImNvbCIsImNvZGUiLCJkaXYiLCJlbSIsImhyIiwiaDEiLCJoMiIsImgzIiwiaDQiLCJoNSIsImg2IiwiaW1nIiwibGkiLCJvbCIsInAiLCJwcmUiLCJzIiwic21hbGwiLCJzcGFuIiwic3ViIiwic3VwIiwic3Ryb25nIiwidSIsInVsIiwiU0FGRV9VUkxfUEFUVEVSTiIsIkRBVEFfVVJMX1BBVFRFUk4iLCJhbGxvd2VkQXR0cmlidXRlIiwiYWxsb3dlZEF0dHJpYnV0ZUxpc3QiLCJhdHRyTmFtZSIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJpbkFycmF5IiwiQm9vbGVhbiIsIm5vZGVWYWx1ZSIsIm1hdGNoIiwicmVnRXhwIiwiZmlsdGVyIiwidmFsdWUiLCJSZWdFeHAiLCJsIiwic2FuaXRpemVIdG1sIiwidW5zYWZlSHRtbCIsIndoaXRlTGlzdCIsInNhbml0aXplRm4iLCJpbXBsZW1lbnRhdGlvbiIsImNyZWF0ZUhUTUxEb2N1bWVudCIsImNyZWF0ZWREb2N1bWVudCIsImlubmVySFRNTCIsIndoaXRlbGlzdEtleXMiLCJtYXAiLCJlbGVtZW50cyIsImxlbiIsImVsTmFtZSIsInBhcmVudE5vZGUiLCJhdHRyaWJ1dGVMaXN0IiwiYXR0cmlidXRlcyIsIndoaXRlbGlzdGVkQXR0cmlidXRlcyIsImNvbmNhdCIsImoiLCJsZW4yIiwicmVtb3ZlQXR0cmlidXRlIiwiVG9vbHRpcCIsImVuYWJsZWQiLCJ0aW1lb3V0IiwiaG92ZXJTdGF0ZSIsImluU3RhdGUiLCJpbml0IiwiYW5pbWF0aW9uIiwicGxhY2VtZW50IiwidGVtcGxhdGUiLCJ0aXRsZSIsImRlbGF5IiwiaHRtbCIsImNvbnRhaW5lciIsInZpZXdwb3J0Iiwic2FuaXRpemUiLCJnZXRPcHRpb25zIiwiJHZpZXdwb3J0IiwiaXNGdW5jdGlvbiIsImNsaWNrIiwiaG92ZXIiLCJjb25zdHJ1Y3RvciIsInRyaWdnZXJzIiwiZXZlbnRJbiIsImV2ZW50T3V0IiwiZW50ZXIiLCJsZWF2ZSIsIl9vcHRpb25zIiwiZml4VGl0bGUiLCJnZXREZWZhdWx0cyIsImRhdGFBdHRyaWJ1dGVzIiwiZGF0YUF0dHIiLCJoYXNPd25Qcm9wZXJ0eSIsImdldERlbGVnYXRlT3B0aW9ucyIsImRlZmF1bHRzIiwia2V5Iiwib2JqIiwic2VsZiIsInRpcCIsImNsZWFyVGltZW91dCIsImlzSW5TdGF0ZVRydWUiLCJoYXNDb250ZW50IiwiaW5Eb20iLCJvd25lckRvY3VtZW50IiwiJHRpcCIsInRpcElkIiwiZ2V0VUlEIiwic2V0Q29udGVudCIsImF1dG9Ub2tlbiIsImF1dG9QbGFjZSIsInRvcCIsImRpc3BsYXkiLCJnZXRQb3NpdGlvbiIsImFjdHVhbFdpZHRoIiwiYWN0dWFsSGVpZ2h0Iiwib3JnUGxhY2VtZW50Iiwidmlld3BvcnREaW0iLCJib3R0b20iLCJ3aWR0aCIsImNhbGN1bGF0ZWRPZmZzZXQiLCJnZXRDYWxjdWxhdGVkT2Zmc2V0IiwiYXBwbHlQbGFjZW1lbnQiLCJwcmV2SG92ZXJTdGF0ZSIsIm9mZnNldCIsImhlaWdodCIsIm1hcmdpblRvcCIsIm1hcmdpbkxlZnQiLCJpc05hTiIsInNldE9mZnNldCIsInVzaW5nIiwicHJvcHMiLCJyb3VuZCIsImdldFZpZXdwb3J0QWRqdXN0ZWREZWx0YSIsImlzVmVydGljYWwiLCJhcnJvd0RlbHRhIiwiYXJyb3dPZmZzZXRQb3NpdGlvbiIsInJlcGxhY2VBcnJvdyIsImFycm93IiwiZ2V0VGl0bGUiLCJ0ZXh0IiwiJGUiLCJpc0JvZHkiLCJlbFJlY3QiLCJpc1N2ZyIsIlNWR0VsZW1lbnQiLCJlbE9mZnNldCIsInNjcm9sbCIsIm91dGVyRGltcyIsInZpZXdwb3J0UGFkZGluZyIsInZpZXdwb3J0RGltZW5zaW9ucyIsInRvcEVkZ2VPZmZzZXQiLCJib3R0b21FZGdlT2Zmc2V0IiwibGVmdEVkZ2VPZmZzZXQiLCJyaWdodEVkZ2VPZmZzZXQiLCJvIiwicHJlZml4IiwicmFuZG9tIiwiZ2V0RWxlbWVudEJ5SWQiLCIkYXJyb3ciLCJlbmFibGUiLCJkaXNhYmxlIiwidG9nZ2xlRW5hYmxlZCIsImRlc3Ryb3kiLCJ0b29sdGlwIiwiUG9wb3ZlciIsImNvbnRlbnQiLCJnZXRDb250ZW50IiwidHlwZUNvbnRlbnQiLCJwb3BvdmVyIiwiU2Nyb2xsU3B5IiwiJHNjcm9sbEVsZW1lbnQiLCJvZmZzZXRzIiwidGFyZ2V0cyIsImFjdGl2ZVRhcmdldCIsInByb2Nlc3MiLCJyZWZyZXNoIiwiZ2V0U2Nyb2xsSGVpZ2h0IiwibWF4Iiwib2Zmc2V0TWV0aG9kIiwib2Zmc2V0QmFzZSIsImlzV2luZG93IiwiJGhyZWYiLCJzb3J0IiwicHVzaCIsIm1heFNjcm9sbCIsImFjdGl2YXRlIiwiY2xlYXIiLCJwYXJlbnRzIiwicGFyZW50c1VudGlsIiwic2Nyb2xsc3B5IiwiJHNweSIsIlRhYiIsIiR1bCIsIiRwcmV2aW91cyIsImhpZGVFdmVudCIsInRhYiIsIkFmZml4IiwiY2hlY2tQb3NpdGlvbiIsImNoZWNrUG9zaXRpb25XaXRoRXZlbnRMb29wIiwiYWZmaXhlZCIsInVucGluIiwicGlubmVkT2Zmc2V0IiwiUkVTRVQiLCJnZXRTdGF0ZSIsIm9mZnNldFRvcCIsIm9mZnNldEJvdHRvbSIsInBvc2l0aW9uIiwidGFyZ2V0SGVpZ2h0IiwiaW5pdGlhbGl6aW5nIiwiY29sbGlkZXJUb3AiLCJjb2xsaWRlckhlaWdodCIsImdldFBpbm5lZE9mZnNldCIsImFmZml4IiwiYWZmaXhUeXBlIiwiZmxleHlfaGVhZGVyIiwicHViIiwiJGhlYWRlcl9zdGF0aWMiLCIkaGVhZGVyX3N0aWNreSIsInVwZGF0ZV9pbnRlcnZhbCIsInRvbGVyYW5jZSIsInVwd2FyZCIsImRvd253YXJkIiwiX2dldF9vZmZzZXRfZnJvbV9lbGVtZW50c19ib3R0b20iLCJjbGFzc2VzIiwicGlubmVkIiwidW5waW5uZWQiLCJ3YXNfc2Nyb2xsZWQiLCJsYXN0X2Rpc3RhbmNlX2Zyb21fdG9wIiwicmVnaXN0ZXJFdmVudEhhbmRsZXJzIiwicmVnaXN0ZXJCb290RXZlbnRIYW5kbGVycyIsImRvY3VtZW50X3dhc19zY3JvbGxlZCIsImVsZW1lbnRfaGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJlbGVtZW50X29mZnNldCIsImN1cnJlbnRfZGlzdGFuY2VfZnJvbV90b3AiLCJmbGV4eV9uYXZpZ2F0aW9uIiwibGF5b3V0X2NsYXNzZXMiLCJ1cGdyYWRlIiwiJG5hdmlnYXRpb25zIiwibmF2aWdhdGlvbiIsIiRuYXZpZ2F0aW9uIiwiJG1lZ2FtZW51cyIsImRyb3Bkb3duX21lZ2FtZW51IiwiJGRyb3Bkb3duX21lZ2FtZW51IiwiZHJvcGRvd25faGFzX21lZ2FtZW51IiwiaXNfdXBncmFkZWQiLCJuYXZpZ2F0aW9uX2hhc19tZWdhbWVudSIsIiRtZWdhbWVudSIsImhhc19vYmZ1c2NhdG9yIiwib2JmdXNjYXRvciIsImJhYmVsSGVscGVycyIsImNsYXNzQ2FsbENoZWNrIiwiaW5zdGFuY2UiLCJUeXBlRXJyb3IiLCJjcmVhdGVDbGFzcyIsImRlZmluZVByb3BlcnRpZXMiLCJkZXNjcmlwdG9yIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJwcm90b1Byb3BzIiwic3RhdGljUHJvcHMiLCJzaWRyU3RhdHVzIiwibW92aW5nIiwib3BlbmVkIiwiaGVscGVyIiwiaXNVcmwiLCJzdHIiLCJwYXR0ZXJuIiwiYWRkUHJlZml4ZXMiLCJhZGRQcmVmaXgiLCJhdHRyaWJ1dGUiLCJ0b1JlcGxhY2UiLCJ0cmFuc2l0aW9ucyIsInN1cHBvcnRlZCIsInByb3BlcnR5IiwicHJlZml4ZXMiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInN1YnN0ciIsIiQkMiIsImJvZHlBbmltYXRpb25DbGFzcyIsIm9wZW5BY3Rpb24iLCJjbG9zZUFjdGlvbiIsInRyYW5zaXRpb25FbmRFdmVudCIsIk1lbnUiLCJvcGVuQ2xhc3MiLCJtZW51V2lkdGgiLCJvdXRlcldpZHRoIiwic3BlZWQiLCJzaWRlIiwiZGlzcGxhY2UiLCJ0aW1pbmciLCJtZXRob2QiLCJvbk9wZW5DYWxsYmFjayIsIm9uQ2xvc2VDYWxsYmFjayIsIm9uT3BlbkVuZENhbGxiYWNrIiwib25DbG9zZUVuZENhbGxiYWNrIiwiZ2V0QW5pbWF0aW9uIiwicHJlcGFyZUJvZHkiLCIkaHRtbCIsIm9wZW5Cb2R5IiwiYm9keUFuaW1hdGlvbiIsInF1ZXVlIiwib25DbG9zZUJvZHkiLCJyZXNldFN0eWxlcyIsInVuYmluZCIsImNsb3NlQm9keSIsIl90aGlzIiwibW92ZUJvZHkiLCJvbk9wZW5NZW51Iiwib3Blbk1lbnUiLCJfdGhpczIiLCIkaXRlbSIsIm1lbnVBbmltYXRpb24iLCJvbkNsb3NlTWVudSIsImNsb3NlTWVudSIsIl90aGlzMyIsIm1vdmVNZW51IiwibW92ZSIsIm9wZW4iLCJfdGhpczQiLCJhbHJlYWR5T3BlbmVkTWVudSIsIiQkMSIsImV4ZWN1dGUiLCJzaWRyIiwiZXJyb3IiLCJwdWJsaWNNZXRob2RzIiwibWV0aG9kTmFtZSIsIm1ldGhvZHMiLCJnZXRNZXRob2QiLCJBcnJheSIsInNsaWNlIiwiJCQzIiwiZmlsbENvbnRlbnQiLCIkc2lkZU1lbnUiLCJzZXR0aW5ncyIsInNvdXJjZSIsIm5ld0NvbnRlbnQiLCJnZXQiLCJodG1sQ29udGVudCIsInNlbGVjdG9ycyIsInJlbmFtaW5nIiwiJGh0bWxDb250ZW50IiwiZm5TaWRyIiwiYmluZCIsIm9uT3BlbiIsIm9uQ2xvc2UiLCJvbk9wZW5FbmQiLCJvbkNsb3NlRW5kIiwiZmxhZyIsIkFqYXhNb25pdG9yIiwiQmFyIiwiRG9jdW1lbnRNb25pdG9yIiwiRWxlbWVudE1vbml0b3IiLCJFbGVtZW50VHJhY2tlciIsIkV2ZW50TGFnTW9uaXRvciIsIkV2ZW50ZWQiLCJFdmVudHMiLCJOb1RhcmdldEVycm9yIiwiUGFjZSIsIlJlcXVlc3RJbnRlcmNlcHQiLCJTT1VSQ0VfS0VZUyIsIlNjYWxlciIsIlNvY2tldFJlcXVlc3RUcmFja2VyIiwiWEhSUmVxdWVzdFRyYWNrZXIiLCJhdmdBbXBsaXR1ZGUiLCJiYXIiLCJjYW5jZWxBbmltYXRpb24iLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImRlZmF1bHRPcHRpb25zIiwiZXh0ZW5kTmF0aXZlIiwiZ2V0RnJvbURPTSIsImdldEludGVyY2VwdCIsImhhbmRsZVB1c2hTdGF0ZSIsImlnbm9yZVN0YWNrIiwibm93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwicmVzdWx0IiwicnVuQW5pbWF0aW9uIiwic2NhbGVycyIsInNob3VsZElnbm9yZVVSTCIsInNob3VsZFRyYWNrIiwic291cmNlcyIsInVuaVNjYWxlciIsIl9XZWJTb2NrZXQiLCJfWERvbWFpblJlcXVlc3QiLCJfWE1MSHR0cFJlcXVlc3QiLCJfaSIsIl9pbnRlcmNlcHQiLCJfbGVuIiwiX3B1c2hTdGF0ZSIsIl9yZWYiLCJfcmVmMSIsIl9yZXBsYWNlU3RhdGUiLCJfX3NsaWNlIiwiX19oYXNQcm9wIiwiX19leHRlbmRzIiwiY2hpbGQiLCJjdG9yIiwiX19zdXBlcl9fIiwiX19pbmRleE9mIiwiaW5kZXhPZiIsImNhdGNodXBUaW1lIiwiaW5pdGlhbFJhdGUiLCJtaW5UaW1lIiwiZ2hvc3RUaW1lIiwibWF4UHJvZ3Jlc3NQZXJGcmFtZSIsImVhc2VGYWN0b3IiLCJzdGFydE9uUGFnZUxvYWQiLCJyZXN0YXJ0T25QdXNoU3RhdGUiLCJyZXN0YXJ0T25SZXF1ZXN0QWZ0ZXIiLCJjaGVja0ludGVydmFsIiwiZXZlbnRMYWciLCJtaW5TYW1wbGVzIiwic2FtcGxlQ291bnQiLCJsYWdUaHJlc2hvbGQiLCJhamF4IiwidHJhY2tNZXRob2RzIiwidHJhY2tXZWJTb2NrZXRzIiwiaWdub3JlVVJMcyIsInBlcmZvcm1hbmNlIiwiRGF0ZSIsIm1velJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJsYXN0IiwidGljayIsImRpZmYiLCJhcmdzIiwib3V0IiwiYXJyIiwiY291bnQiLCJzdW0iLCJ2IiwianNvbiIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRBdHRyaWJ1dGUiLCJKU09OIiwicGFyc2UiLCJfZXJyb3IiLCJjb25zb2xlIiwiY3R4Iiwib25jZSIsIl9iYXNlIiwiYmluZGluZ3MiLCJfcmVzdWx0cyIsInNwbGljZSIsInBhY2VPcHRpb25zIiwiX3N1cGVyIiwicHJvZ3Jlc3MiLCJnZXRFbGVtZW50IiwidGFyZ2V0RWxlbWVudCIsImZpcnN0Q2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJhcHBlbmRDaGlsZCIsImZpbmlzaCIsInVwZGF0ZSIsInByb2ciLCJyZW5kZXIiLCJwcm9ncmVzc1N0ciIsInRyYW5zZm9ybSIsIl9qIiwiX2xlbjEiLCJfcmVmMiIsImxhc3RSZW5kZXJlZFByb2dyZXNzIiwic2V0QXR0cmlidXRlIiwiZG9uZSIsImJpbmRpbmciLCJYTUxIdHRwUmVxdWVzdCIsIlhEb21haW5SZXF1ZXN0IiwiV2ViU29ja2V0IiwiZnJvbSIsImlnbm9yZSIsInJldCIsInVuc2hpZnQiLCJzaGlmdCIsInRyYWNrIiwibW9uaXRvclhIUiIsInJlcSIsIl9vcGVuIiwidXJsIiwiYXN5bmMiLCJyZXF1ZXN0IiwiZmxhZ3MiLCJwcm90b2NvbHMiLCJfYXJnIiwiYWZ0ZXIiLCJydW5uaW5nIiwic3RpbGxBY3RpdmUiLCJfcmVmMyIsInJlYWR5U3RhdGUiLCJyZXN0YXJ0Iiwid2F0Y2giLCJ0cmFja2VyIiwic2l6ZSIsIl9vbnJlYWR5c3RhdGVjaGFuZ2UiLCJQcm9ncmVzc0V2ZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2dCIsImxlbmd0aENvbXB1dGFibGUiLCJsb2FkZWQiLCJ0b3RhbCIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsImNoZWNrIiwic3RhdGVzIiwibG9hZGluZyIsImludGVyYWN0aXZlIiwiYXZnIiwicG9pbnRzIiwic2FtcGxlcyIsInNpbmNlTGFzdFVwZGF0ZSIsInJhdGUiLCJjYXRjaHVwIiwibGFzdFByb2dyZXNzIiwiZnJhbWVUaW1lIiwic2NhbGluZyIsInBvdyIsIm1pbiIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJyZXBsYWNlU3RhdGUiLCJfayIsIl9sZW4yIiwiX3JlZjQiLCJleHRyYVNvdXJjZXMiLCJzdG9wIiwic3RhcnQiLCJnbyIsImVucXVldWVOZXh0RnJhbWUiLCJyZW1haW5pbmciLCJzY2FsZXIiLCJzY2FsZXJMaXN0IiwiZGVmaW5lIiwiYW1kIiwiZXhwb3J0cyIsIm1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7Ozs7QUFNQSxJQUFJLE9BQU9BLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUM7QUFDakMsUUFBTSxJQUFJQyxLQUFKLENBQVUseUNBQVYsQ0FBTjtBQUNEOztBQUVELENBQUMsVUFBVUMsQ0FBVixFQUFhO0FBQ1o7O0FBQ0EsTUFBSUMsVUFBVUQsRUFBRUUsRUFBRixDQUFLQyxNQUFMLENBQVlDLEtBQVosQ0FBa0IsR0FBbEIsRUFBdUIsQ0FBdkIsRUFBMEJBLEtBQTFCLENBQWdDLEdBQWhDLENBQWQ7QUFDQSxNQUFLSCxRQUFRLENBQVIsSUFBYSxDQUFiLElBQWtCQSxRQUFRLENBQVIsSUFBYSxDQUFoQyxJQUF1Q0EsUUFBUSxDQUFSLEtBQWMsQ0FBZCxJQUFtQkEsUUFBUSxDQUFSLEtBQWMsQ0FBakMsSUFBc0NBLFFBQVEsQ0FBUixJQUFhLENBQTFGLElBQWlHQSxRQUFRLENBQVIsSUFBYSxDQUFsSCxFQUFzSDtBQUNwSCxVQUFNLElBQUlGLEtBQUosQ0FBVSwyRkFBVixDQUFO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b3RzdHJhcCB2My40LjEgKGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS8pXG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG5cbmlmICh0eXBlb2YgalF1ZXJ5ID09PSAndW5kZWZpbmVkJykge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0Jvb3RzdHJhcFxcJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnknKVxufVxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgdmVyc2lvbiA9ICQuZm4uanF1ZXJ5LnNwbGl0KCcgJylbMF0uc3BsaXQoJy4nKVxuICBpZiAoKHZlcnNpb25bMF0gPCAyICYmIHZlcnNpb25bMV0gPCA5KSB8fCAodmVyc2lvblswXSA9PSAxICYmIHZlcnNpb25bMV0gPT0gOSAmJiB2ZXJzaW9uWzJdIDwgMSkgfHwgKHZlcnNpb25bMF0gPiAzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQm9vdHN0cmFwXFwncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeSB2ZXJzaW9uIDEuOS4xIG9yIGhpZ2hlciwgYnV0IGxvd2VyIHRoYW4gdmVyc2lvbiA0JylcbiAgfVxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdHJhbnNpdGlvbi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyN0cmFuc2l0aW9uc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIENTUyBUUkFOU0lUSU9OIFNVUFBPUlQgKFNob3V0b3V0OiBodHRwczovL21vZGVybml6ci5jb20vKVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiB0cmFuc2l0aW9uRW5kKCkge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Jvb3RzdHJhcCcpXG5cbiAgICB2YXIgdHJhbnNFbmRFdmVudE5hbWVzID0ge1xuICAgICAgV2Via2l0VHJhbnNpdGlvbiA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgIE1velRyYW5zaXRpb24gICAgOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICBPVHJhbnNpdGlvbiAgICAgIDogJ29UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kJyxcbiAgICAgIHRyYW5zaXRpb24gICAgICAgOiAndHJhbnNpdGlvbmVuZCdcbiAgICB9XG5cbiAgICBmb3IgKHZhciBuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgaWYgKGVsLnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHsgZW5kOiB0cmFuc0VuZEV2ZW50TmFtZXNbbmFtZV0gfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZSAvLyBleHBsaWNpdCBmb3IgaWU4ICggIC5fLilcbiAgfVxuXG4gIC8vIGh0dHBzOi8vYmxvZy5hbGV4bWFjY2F3LmNvbS9jc3MtdHJhbnNpdGlvbnNcbiAgJC5mbi5lbXVsYXRlVHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uIChkdXJhdGlvbikge1xuICAgIHZhciBjYWxsZWQgPSBmYWxzZVxuICAgIHZhciAkZWwgPSB0aGlzXG4gICAgJCh0aGlzKS5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uICgpIHsgY2FsbGVkID0gdHJ1ZSB9KVxuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgaWYgKCFjYWxsZWQpICQoJGVsKS50cmlnZ2VyKCQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCkgfVxuICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIGR1cmF0aW9uKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAkKGZ1bmN0aW9uICgpIHtcbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiA9IHRyYW5zaXRpb25FbmQoKVxuXG4gICAgaWYgKCEkLnN1cHBvcnQudHJhbnNpdGlvbikgcmV0dXJuXG5cbiAgICAkLmV2ZW50LnNwZWNpYWwuYnNUcmFuc2l0aW9uRW5kID0ge1xuICAgICAgYmluZFR5cGU6ICQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCxcbiAgICAgIGRlbGVnYXRlVHlwZTogJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLFxuICAgICAgaGFuZGxlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoJChlLnRhcmdldCkuaXModGhpcykpIHJldHVybiBlLmhhbmRsZU9iai5oYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGFsZXJ0LmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2FsZXJ0c1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEFMRVJUIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBkaXNtaXNzID0gJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXSdcbiAgdmFyIEFsZXJ0ICAgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAkKGVsKS5vbignY2xpY2snLCBkaXNtaXNzLCB0aGlzLmNsb3NlKVxuICB9XG5cbiAgQWxlcnQuVkVSU0lPTiA9ICczLjQuMSdcblxuICBBbGVydC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgQWxlcnQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgICAgPSAkKHRoaXMpXG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKVxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vIHN0cmlwIGZvciBpZTdcbiAgICB9XG5cbiAgICBzZWxlY3RvciAgICA9IHNlbGVjdG9yID09PSAnIycgPyBbXSA6IHNlbGVjdG9yXG4gICAgdmFyICRwYXJlbnQgPSAkKGRvY3VtZW50KS5maW5kKHNlbGVjdG9yKVxuXG4gICAgaWYgKGUpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgaWYgKCEkcGFyZW50Lmxlbmd0aCkge1xuICAgICAgJHBhcmVudCA9ICR0aGlzLmNsb3Nlc3QoJy5hbGVydCcpXG4gICAgfVxuXG4gICAgJHBhcmVudC50cmlnZ2VyKGUgPSAkLkV2ZW50KCdjbG9zZS5icy5hbGVydCcpKVxuXG4gICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgJHBhcmVudC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudCgpIHtcbiAgICAgIC8vIGRldGFjaCBmcm9tIHBhcmVudCwgZmlyZSBldmVudCB0aGVuIGNsZWFuIHVwIGRhdGFcbiAgICAgICRwYXJlbnQuZGV0YWNoKCkudHJpZ2dlcignY2xvc2VkLmJzLmFsZXJ0JykucmVtb3ZlKClcbiAgICB9XG5cbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiAkcGFyZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgJHBhcmVudFxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCByZW1vdmVFbGVtZW50KVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQWxlcnQuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgcmVtb3ZlRWxlbWVudCgpXG4gIH1cblxuXG4gIC8vIEFMRVJUIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMuYWxlcnQnKVxuXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmFsZXJ0JywgKGRhdGEgPSBuZXcgQWxlcnQodGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXS5jYWxsKCR0aGlzKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5hbGVydFxuXG4gICQuZm4uYWxlcnQgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5hbGVydC5Db25zdHJ1Y3RvciA9IEFsZXJ0XG5cblxuICAvLyBBTEVSVCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uYWxlcnQubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmFsZXJ0ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQUxFUlQgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT1cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suYnMuYWxlcnQuZGF0YS1hcGknLCBkaXNtaXNzLCBBbGVydC5wcm90b3R5cGUuY2xvc2UpXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGJ1dHRvbi5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNidXR0b25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQlVUVE9OIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBCdXR0b24gPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyAgID0gJC5leHRlbmQoe30sIEJ1dHRvbi5ERUZBVUxUUywgb3B0aW9ucylcbiAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXG4gIH1cblxuICBCdXR0b24uVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQnV0dG9uLkRFRkFVTFRTID0ge1xuICAgIGxvYWRpbmdUZXh0OiAnbG9hZGluZy4uLidcbiAgfVxuXG4gIEJ1dHRvbi5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgZCAgICA9ICdkaXNhYmxlZCdcbiAgICB2YXIgJGVsICA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgdmFsICA9ICRlbC5pcygnaW5wdXQnKSA/ICd2YWwnIDogJ2h0bWwnXG4gICAgdmFyIGRhdGEgPSAkZWwuZGF0YSgpXG5cbiAgICBzdGF0ZSArPSAnVGV4dCdcblxuICAgIGlmIChkYXRhLnJlc2V0VGV4dCA9PSBudWxsKSAkZWwuZGF0YSgncmVzZXRUZXh0JywgJGVsW3ZhbF0oKSlcblxuICAgIC8vIHB1c2ggdG8gZXZlbnQgbG9vcCB0byBhbGxvdyBmb3JtcyB0byBzdWJtaXRcbiAgICBzZXRUaW1lb3V0KCQucHJveHkoZnVuY3Rpb24gKCkge1xuICAgICAgJGVsW3ZhbF0oZGF0YVtzdGF0ZV0gPT0gbnVsbCA/IHRoaXMub3B0aW9uc1tzdGF0ZV0gOiBkYXRhW3N0YXRlXSlcblxuICAgICAgaWYgKHN0YXRlID09ICdsb2FkaW5nVGV4dCcpIHtcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlXG4gICAgICAgICRlbC5hZGRDbGFzcyhkKS5hdHRyKGQsIGQpLnByb3AoZCwgdHJ1ZSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0xvYWRpbmcpIHtcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxuICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoZCkucmVtb3ZlQXR0cihkKS5wcm9wKGQsIGZhbHNlKVxuICAgICAgfVxuICAgIH0sIHRoaXMpLCAwKVxuICB9XG5cbiAgQnV0dG9uLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNoYW5nZWQgPSB0cnVlXG4gICAgdmFyICRwYXJlbnQgPSB0aGlzLiRlbGVtZW50LmNsb3Nlc3QoJ1tkYXRhLXRvZ2dsZT1cImJ1dHRvbnNcIl0nKVxuXG4gICAgaWYgKCRwYXJlbnQubGVuZ3RoKSB7XG4gICAgICB2YXIgJGlucHV0ID0gdGhpcy4kZWxlbWVudC5maW5kKCdpbnB1dCcpXG4gICAgICBpZiAoJGlucHV0LnByb3AoJ3R5cGUnKSA9PSAncmFkaW8nKSB7XG4gICAgICAgIGlmICgkaW5wdXQucHJvcCgnY2hlY2tlZCcpKSBjaGFuZ2VkID0gZmFsc2VcbiAgICAgICAgJHBhcmVudC5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB9IGVsc2UgaWYgKCRpbnB1dC5wcm9wKCd0eXBlJykgPT0gJ2NoZWNrYm94Jykge1xuICAgICAgICBpZiAoKCRpbnB1dC5wcm9wKCdjaGVja2VkJykpICE9PSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSkgY2hhbmdlZCA9IGZhbHNlXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB9XG4gICAgICAkaW5wdXQucHJvcCgnY2hlY2tlZCcsIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2FjdGl2ZScpKVxuICAgICAgaWYgKGNoYW5nZWQpICRpbnB1dC50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtcHJlc3NlZCcsICF0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSlcbiAgICAgIHRoaXMuJGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuICB9XG5cblxuICAvLyBCVVRUT04gUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmJ1dHRvbicpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYnV0dG9uJywgKGRhdGEgPSBuZXcgQnV0dG9uKHRoaXMsIG9wdGlvbnMpKSlcblxuICAgICAgaWYgKG9wdGlvbiA9PSAndG9nZ2xlJykgZGF0YS50b2dnbGUoKVxuICAgICAgZWxzZSBpZiAob3B0aW9uKSBkYXRhLnNldFN0YXRlKG9wdGlvbilcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYnV0dG9uXG5cbiAgJC5mbi5idXR0b24gICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5idXR0b24uQ29uc3RydWN0b3IgPSBCdXR0b25cblxuXG4gIC8vIEJVVFRPTiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmJ1dHRvbi5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uYnV0dG9uID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQlVUVE9OIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy5idXR0b24uZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlXj1cImJ1dHRvblwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgJGJ0biA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5idG4nKVxuICAgICAgUGx1Z2luLmNhbGwoJGJ0biwgJ3RvZ2dsZScpXG4gICAgICBpZiAoISgkKGUudGFyZ2V0KS5pcygnaW5wdXRbdHlwZT1cInJhZGlvXCJdLCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKSkpIHtcbiAgICAgICAgLy8gUHJldmVudCBkb3VibGUgY2xpY2sgb24gcmFkaW9zLCBhbmQgdGhlIGRvdWJsZSBzZWxlY3Rpb25zIChzbyBjYW5jZWxsYXRpb24pIG9uIGNoZWNrYm94ZXNcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIC8vIFRoZSB0YXJnZXQgY29tcG9uZW50IHN0aWxsIHJlY2VpdmUgdGhlIGZvY3VzXG4gICAgICAgIGlmICgkYnRuLmlzKCdpbnB1dCxidXR0b24nKSkgJGJ0bi50cmlnZ2VyKCdmb2N1cycpXG4gICAgICAgIGVsc2UgJGJ0bi5maW5kKCdpbnB1dDp2aXNpYmxlLGJ1dHRvbjp2aXNpYmxlJykuZmlyc3QoKS50cmlnZ2VyKCdmb2N1cycpXG4gICAgICB9XG4gICAgfSlcbiAgICAub24oJ2ZvY3VzLmJzLmJ1dHRvbi5kYXRhLWFwaSBibHVyLmJzLmJ1dHRvbi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGVePVwiYnV0dG9uXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICQoZS50YXJnZXQpLmNsb3Nlc3QoJy5idG4nKS50b2dnbGVDbGFzcygnZm9jdXMnLCAvXmZvY3VzKGluKT8kLy50ZXN0KGUudHlwZSkpXG4gICAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogY2Fyb3VzZWwuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jY2Fyb3VzZWxcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBDQVJPVVNFTCBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQ2Fyb3VzZWwgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy4kaW5kaWNhdG9ycyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLmNhcm91c2VsLWluZGljYXRvcnMnKVxuICAgIHRoaXMub3B0aW9ucyAgICAgPSBvcHRpb25zXG4gICAgdGhpcy5wYXVzZWQgICAgICA9IG51bGxcbiAgICB0aGlzLnNsaWRpbmcgICAgID0gbnVsbFxuICAgIHRoaXMuaW50ZXJ2YWwgICAgPSBudWxsXG4gICAgdGhpcy4kYWN0aXZlICAgICA9IG51bGxcbiAgICB0aGlzLiRpdGVtcyAgICAgID0gbnVsbFxuXG4gICAgdGhpcy5vcHRpb25zLmtleWJvYXJkICYmIHRoaXMuJGVsZW1lbnQub24oJ2tleWRvd24uYnMuY2Fyb3VzZWwnLCAkLnByb3h5KHRoaXMua2V5ZG93biwgdGhpcykpXG5cbiAgICB0aGlzLm9wdGlvbnMucGF1c2UgPT0gJ2hvdmVyJyAmJiAhKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkgJiYgdGhpcy4kZWxlbWVudFxuICAgICAgLm9uKCdtb3VzZWVudGVyLmJzLmNhcm91c2VsJywgJC5wcm94eSh0aGlzLnBhdXNlLCB0aGlzKSlcbiAgICAgIC5vbignbW91c2VsZWF2ZS5icy5jYXJvdXNlbCcsICQucHJveHkodGhpcy5jeWNsZSwgdGhpcykpXG4gIH1cblxuICBDYXJvdXNlbC5WRVJTSU9OICA9ICczLjQuMSdcblxuICBDYXJvdXNlbC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gNjAwXG5cbiAgQ2Fyb3VzZWwuREVGQVVMVFMgPSB7XG4gICAgaW50ZXJ2YWw6IDUwMDAsXG4gICAgcGF1c2U6ICdob3ZlcicsXG4gICAgd3JhcDogdHJ1ZSxcbiAgICBrZXlib2FyZDogdHJ1ZVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmICgvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGUudGFyZ2V0LnRhZ05hbWUpKSByZXR1cm5cbiAgICBzd2l0Y2ggKGUud2hpY2gpIHtcbiAgICAgIGNhc2UgMzc6IHRoaXMucHJldigpOyBicmVha1xuICAgICAgY2FzZSAzOTogdGhpcy5uZXh0KCk7IGJyZWFrXG4gICAgICBkZWZhdWx0OiByZXR1cm5cbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5jeWNsZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZSB8fCAodGhpcy5wYXVzZWQgPSBmYWxzZSlcblxuICAgIHRoaXMuaW50ZXJ2YWwgJiYgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKVxuXG4gICAgdGhpcy5vcHRpb25zLmludGVydmFsXG4gICAgICAmJiAhdGhpcy5wYXVzZWRcbiAgICAgICYmICh0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoJC5wcm94eSh0aGlzLm5leHQsIHRoaXMpLCB0aGlzLm9wdGlvbnMuaW50ZXJ2YWwpKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5nZXRJdGVtSW5kZXggPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIHRoaXMuJGl0ZW1zID0gaXRlbS5wYXJlbnQoKS5jaGlsZHJlbignLml0ZW0nKVxuICAgIHJldHVybiB0aGlzLiRpdGVtcy5pbmRleChpdGVtIHx8IHRoaXMuJGFjdGl2ZSlcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZS5nZXRJdGVtRm9yRGlyZWN0aW9uID0gZnVuY3Rpb24gKGRpcmVjdGlvbiwgYWN0aXZlKSB7XG4gICAgdmFyIGFjdGl2ZUluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgoYWN0aXZlKVxuICAgIHZhciB3aWxsV3JhcCA9IChkaXJlY3Rpb24gPT0gJ3ByZXYnICYmIGFjdGl2ZUluZGV4ID09PSAwKVxuICAgICAgICAgICAgICAgIHx8IChkaXJlY3Rpb24gPT0gJ25leHQnICYmIGFjdGl2ZUluZGV4ID09ICh0aGlzLiRpdGVtcy5sZW5ndGggLSAxKSlcbiAgICBpZiAod2lsbFdyYXAgJiYgIXRoaXMub3B0aW9ucy53cmFwKSByZXR1cm4gYWN0aXZlXG4gICAgdmFyIGRlbHRhID0gZGlyZWN0aW9uID09ICdwcmV2JyA/IC0xIDogMVxuICAgIHZhciBpdGVtSW5kZXggPSAoYWN0aXZlSW5kZXggKyBkZWx0YSkgJSB0aGlzLiRpdGVtcy5sZW5ndGhcbiAgICByZXR1cm4gdGhpcy4kaXRlbXMuZXEoaXRlbUluZGV4KVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnRvID0gZnVuY3Rpb24gKHBvcykge1xuICAgIHZhciB0aGF0ICAgICAgICA9IHRoaXNcbiAgICB2YXIgYWN0aXZlSW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleCh0aGlzLiRhY3RpdmUgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5pdGVtLmFjdGl2ZScpKVxuXG4gICAgaWYgKHBvcyA+ICh0aGlzLiRpdGVtcy5sZW5ndGggLSAxKSB8fCBwb3MgPCAwKSByZXR1cm5cblxuICAgIGlmICh0aGlzLnNsaWRpbmcpICAgICAgIHJldHVybiB0aGlzLiRlbGVtZW50Lm9uZSgnc2xpZC5icy5jYXJvdXNlbCcsIGZ1bmN0aW9uICgpIHsgdGhhdC50byhwb3MpIH0pIC8vIHllcywgXCJzbGlkXCJcbiAgICBpZiAoYWN0aXZlSW5kZXggPT0gcG9zKSByZXR1cm4gdGhpcy5wYXVzZSgpLmN5Y2xlKClcblxuICAgIHJldHVybiB0aGlzLnNsaWRlKHBvcyA+IGFjdGl2ZUluZGV4ID8gJ25leHQnIDogJ3ByZXYnLCB0aGlzLiRpdGVtcy5lcShwb3MpKVxuICB9XG5cbiAgQ2Fyb3VzZWwucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlIHx8ICh0aGlzLnBhdXNlZCA9IHRydWUpXG5cbiAgICBpZiAodGhpcy4kZWxlbWVudC5maW5kKCcubmV4dCwgLnByZXYnKS5sZW5ndGggJiYgJC5zdXBwb3J0LnRyYW5zaXRpb24pIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcigkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpXG4gICAgICB0aGlzLmN5Y2xlKHRydWUpXG4gICAgfVxuXG4gICAgdGhpcy5pbnRlcnZhbCA9IGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zbGlkaW5nKSByZXR1cm5cbiAgICByZXR1cm4gdGhpcy5zbGlkZSgnbmV4dCcpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zbGlkaW5nKSByZXR1cm5cbiAgICByZXR1cm4gdGhpcy5zbGlkZSgncHJldicpXG4gIH1cblxuICBDYXJvdXNlbC5wcm90b3R5cGUuc2xpZGUgPSBmdW5jdGlvbiAodHlwZSwgbmV4dCkge1xuICAgIHZhciAkYWN0aXZlICAgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5pdGVtLmFjdGl2ZScpXG4gICAgdmFyICRuZXh0ICAgICA9IG5leHQgfHwgdGhpcy5nZXRJdGVtRm9yRGlyZWN0aW9uKHR5cGUsICRhY3RpdmUpXG4gICAgdmFyIGlzQ3ljbGluZyA9IHRoaXMuaW50ZXJ2YWxcbiAgICB2YXIgZGlyZWN0aW9uID0gdHlwZSA9PSAnbmV4dCcgPyAnbGVmdCcgOiAncmlnaHQnXG4gICAgdmFyIHRoYXQgICAgICA9IHRoaXNcblxuICAgIGlmICgkbmV4dC5oYXNDbGFzcygnYWN0aXZlJykpIHJldHVybiAodGhpcy5zbGlkaW5nID0gZmFsc2UpXG5cbiAgICB2YXIgcmVsYXRlZFRhcmdldCA9ICRuZXh0WzBdXG4gICAgdmFyIHNsaWRlRXZlbnQgPSAkLkV2ZW50KCdzbGlkZS5icy5jYXJvdXNlbCcsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6IHJlbGF0ZWRUYXJnZXQsXG4gICAgICBkaXJlY3Rpb246IGRpcmVjdGlvblxuICAgIH0pXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHNsaWRlRXZlbnQpXG4gICAgaWYgKHNsaWRlRXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdGhpcy5zbGlkaW5nID0gdHJ1ZVxuXG4gICAgaXNDeWNsaW5nICYmIHRoaXMucGF1c2UoKVxuXG4gICAgaWYgKHRoaXMuJGluZGljYXRvcnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLiRpbmRpY2F0b3JzLmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgIHZhciAkbmV4dEluZGljYXRvciA9ICQodGhpcy4kaW5kaWNhdG9ycy5jaGlsZHJlbigpW3RoaXMuZ2V0SXRlbUluZGV4KCRuZXh0KV0pXG4gICAgICAkbmV4dEluZGljYXRvciAmJiAkbmV4dEluZGljYXRvci5hZGRDbGFzcygnYWN0aXZlJylcbiAgICB9XG5cbiAgICB2YXIgc2xpZEV2ZW50ID0gJC5FdmVudCgnc2xpZC5icy5jYXJvdXNlbCcsIHsgcmVsYXRlZFRhcmdldDogcmVsYXRlZFRhcmdldCwgZGlyZWN0aW9uOiBkaXJlY3Rpb24gfSkgLy8geWVzLCBcInNsaWRcIlxuICAgIGlmICgkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdzbGlkZScpKSB7XG4gICAgICAkbmV4dC5hZGRDbGFzcyh0eXBlKVxuICAgICAgaWYgKHR5cGVvZiAkbmV4dCA9PT0gJ29iamVjdCcgJiYgJG5leHQubGVuZ3RoKSB7XG4gICAgICAgICRuZXh0WzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuICAgICAgfVxuICAgICAgJGFjdGl2ZS5hZGRDbGFzcyhkaXJlY3Rpb24pXG4gICAgICAkbmV4dC5hZGRDbGFzcyhkaXJlY3Rpb24pXG4gICAgICAkYWN0aXZlXG4gICAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkbmV4dC5yZW1vdmVDbGFzcyhbdHlwZSwgZGlyZWN0aW9uXS5qb2luKCcgJykpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoWydhY3RpdmUnLCBkaXJlY3Rpb25dLmpvaW4oJyAnKSlcbiAgICAgICAgICB0aGF0LnNsaWRpbmcgPSBmYWxzZVxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKHNsaWRFdmVudClcbiAgICAgICAgICB9LCAwKVxuICAgICAgICB9KVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoQ2Fyb3VzZWwuVFJBTlNJVElPTl9EVVJBVElPTilcbiAgICB9IGVsc2Uge1xuICAgICAgJGFjdGl2ZS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICRuZXh0LmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgdGhpcy5zbGlkaW5nID0gZmFsc2VcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzbGlkRXZlbnQpXG4gICAgfVxuXG4gICAgaXNDeWNsaW5nICYmIHRoaXMuY3ljbGUoKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQ0FST1VTRUwgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMuY2Fyb3VzZWwnKVxuICAgICAgdmFyIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgQ2Fyb3VzZWwuREVGQVVMVFMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG4gICAgICB2YXIgYWN0aW9uICA9IHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycgPyBvcHRpb24gOiBvcHRpb25zLnNsaWRlXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuY2Fyb3VzZWwnLCAoZGF0YSA9IG5ldyBDYXJvdXNlbCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnbnVtYmVyJykgZGF0YS50byhvcHRpb24pXG4gICAgICBlbHNlIGlmIChhY3Rpb24pIGRhdGFbYWN0aW9uXSgpXG4gICAgICBlbHNlIGlmIChvcHRpb25zLmludGVydmFsKSBkYXRhLnBhdXNlKCkuY3ljbGUoKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5jYXJvdXNlbFxuXG4gICQuZm4uY2Fyb3VzZWwgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5jYXJvdXNlbC5Db25zdHJ1Y3RvciA9IENhcm91c2VsXG5cblxuICAvLyBDQVJPVVNFTCBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uY2Fyb3VzZWwubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmNhcm91c2VsID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLy8gQ0FST1VTRUwgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICB2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICB2YXIgaHJlZiAgICA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgIGlmIChocmVmKSB7XG4gICAgICBocmVmID0gaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIHZhciB0YXJnZXQgID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSB8fCBocmVmXG4gICAgdmFyICR0YXJnZXQgPSAkKGRvY3VtZW50KS5maW5kKHRhcmdldClcblxuICAgIGlmICghJHRhcmdldC5oYXNDbGFzcygnY2Fyb3VzZWwnKSkgcmV0dXJuXG5cbiAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkdGFyZ2V0LmRhdGEoKSwgJHRoaXMuZGF0YSgpKVxuICAgIHZhciBzbGlkZUluZGV4ID0gJHRoaXMuYXR0cignZGF0YS1zbGlkZS10bycpXG4gICAgaWYgKHNsaWRlSW5kZXgpIG9wdGlvbnMuaW50ZXJ2YWwgPSBmYWxzZVxuXG4gICAgUGx1Z2luLmNhbGwoJHRhcmdldCwgb3B0aW9ucylcblxuICAgIGlmIChzbGlkZUluZGV4KSB7XG4gICAgICAkdGFyZ2V0LmRhdGEoJ2JzLmNhcm91c2VsJykudG8oc2xpZGVJbmRleClcbiAgICB9XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgfVxuXG4gICQoZG9jdW1lbnQpXG4gICAgLm9uKCdjbGljay5icy5jYXJvdXNlbC5kYXRhLWFwaScsICdbZGF0YS1zbGlkZV0nLCBjbGlja0hhbmRsZXIpXG4gICAgLm9uKCdjbGljay5icy5jYXJvdXNlbC5kYXRhLWFwaScsICdbZGF0YS1zbGlkZS10b10nLCBjbGlja0hhbmRsZXIpXG5cbiAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICQoJ1tkYXRhLXJpZGU9XCJjYXJvdXNlbFwiXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRjYXJvdXNlbCA9ICQodGhpcylcbiAgICAgIFBsdWdpbi5jYWxsKCRjYXJvdXNlbCwgJGNhcm91c2VsLmRhdGEoKSlcbiAgICB9KVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBjb2xsYXBzZS5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNjb2xsYXBzZVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoganNoaW50IGxhdGVkZWY6IGZhbHNlICovXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gQ09MTEFQU0UgUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgQ29sbGFwc2UgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgICAgICA9ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICAgICAgPSAkLmV4dGVuZCh7fSwgQ29sbGFwc2UuREVGQVVMVFMsIG9wdGlvbnMpXG4gICAgdGhpcy4kdHJpZ2dlciAgICAgID0gJCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1baHJlZj1cIiMnICsgZWxlbWVudC5pZCArICdcIl0sJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl1bZGF0YS10YXJnZXQ9XCIjJyArIGVsZW1lbnQuaWQgKyAnXCJdJylcbiAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSBudWxsXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnBhcmVudCkge1xuICAgICAgdGhpcy4kcGFyZW50ID0gdGhpcy5nZXRQYXJlbnQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZEFyaWFBbmRDb2xsYXBzZWRDbGFzcyh0aGlzLiRlbGVtZW50LCB0aGlzLiR0cmlnZ2VyKVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMudG9nZ2xlKSB0aGlzLnRvZ2dsZSgpXG4gIH1cblxuICBDb2xsYXBzZS5WRVJTSU9OICA9ICczLjQuMSdcblxuICBDb2xsYXBzZS5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMzUwXG5cbiAgQ29sbGFwc2UuREVGQVVMVFMgPSB7XG4gICAgdG9nZ2xlOiB0cnVlXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuZGltZW5zaW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYXNXaWR0aCA9IHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ3dpZHRoJylcbiAgICByZXR1cm4gaGFzV2lkdGggPyAnd2lkdGgnIDogJ2hlaWdodCdcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnRyYW5zaXRpb25pbmcgfHwgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSkgcmV0dXJuXG5cbiAgICB2YXIgYWN0aXZlc0RhdGFcbiAgICB2YXIgYWN0aXZlcyA9IHRoaXMuJHBhcmVudCAmJiB0aGlzLiRwYXJlbnQuY2hpbGRyZW4oJy5wYW5lbCcpLmNoaWxkcmVuKCcuaW4sIC5jb2xsYXBzaW5nJylcblxuICAgIGlmIChhY3RpdmVzICYmIGFjdGl2ZXMubGVuZ3RoKSB7XG4gICAgICBhY3RpdmVzRGF0YSA9IGFjdGl2ZXMuZGF0YSgnYnMuY29sbGFwc2UnKVxuICAgICAgaWYgKGFjdGl2ZXNEYXRhICYmIGFjdGl2ZXNEYXRhLnRyYW5zaXRpb25pbmcpIHJldHVyblxuICAgIH1cblxuICAgIHZhciBzdGFydEV2ZW50ID0gJC5FdmVudCgnc2hvdy5icy5jb2xsYXBzZScpXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKHN0YXJ0RXZlbnQpXG4gICAgaWYgKHN0YXJ0RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgaWYgKGFjdGl2ZXMgJiYgYWN0aXZlcy5sZW5ndGgpIHtcbiAgICAgIFBsdWdpbi5jYWxsKGFjdGl2ZXMsICdoaWRlJylcbiAgICAgIGFjdGl2ZXNEYXRhIHx8IGFjdGl2ZXMuZGF0YSgnYnMuY29sbGFwc2UnLCBudWxsKVxuICAgIH1cblxuICAgIHZhciBkaW1lbnNpb24gPSB0aGlzLmRpbWVuc2lvbigpXG5cbiAgICB0aGlzLiRlbGVtZW50XG4gICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlJylcbiAgICAgIC5hZGRDbGFzcygnY29sbGFwc2luZycpW2RpbWVuc2lvbl0oMClcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcblxuICAgIHRoaXMuJHRyaWdnZXJcbiAgICAgIC5yZW1vdmVDbGFzcygnY29sbGFwc2VkJylcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcblxuICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDFcblxuICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzaW5nJylcbiAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZSBpbicpW2RpbWVuc2lvbl0oJycpXG4gICAgICB0aGlzLnRyYW5zaXRpb25pbmcgPSAwXG4gICAgICB0aGlzLiRlbGVtZW50XG4gICAgICAgIC50cmlnZ2VyKCdzaG93bi5icy5jb2xsYXBzZScpXG4gICAgfVxuXG4gICAgaWYgKCEkLnN1cHBvcnQudHJhbnNpdGlvbikgcmV0dXJuIGNvbXBsZXRlLmNhbGwodGhpcylcblxuICAgIHZhciBzY3JvbGxTaXplID0gJC5jYW1lbENhc2UoWydzY3JvbGwnLCBkaW1lbnNpb25dLmpvaW4oJy0nKSlcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5vbmUoJ2JzVHJhbnNpdGlvbkVuZCcsICQucHJveHkoY29tcGxldGUsIHRoaXMpKVxuICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKENvbGxhcHNlLlRSQU5TSVRJT05fRFVSQVRJT04pW2RpbWVuc2lvbl0odGhpcy4kZWxlbWVudFswXVtzY3JvbGxTaXplXSlcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnRyYW5zaXRpb25pbmcgfHwgIXRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykpIHJldHVyblxuXG4gICAgdmFyIHN0YXJ0RXZlbnQgPSAkLkV2ZW50KCdoaWRlLmJzLmNvbGxhcHNlJylcbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoc3RhcnRFdmVudClcbiAgICBpZiAoc3RhcnRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB2YXIgZGltZW5zaW9uID0gdGhpcy5kaW1lbnNpb24oKVxuXG4gICAgdGhpcy4kZWxlbWVudFtkaW1lbnNpb25dKHRoaXMuJGVsZW1lbnRbZGltZW5zaW9uXSgpKVswXS5vZmZzZXRIZWlnaHRcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIC5hZGRDbGFzcygnY29sbGFwc2luZycpXG4gICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlIGluJylcbiAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpXG5cbiAgICB0aGlzLiR0cmlnZ2VyXG4gICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpXG4gICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMVxuXG4gICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy50cmFuc2l0aW9uaW5nID0gMFxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNpbmcnKVxuICAgICAgICAuYWRkQ2xhc3MoJ2NvbGxhcHNlJylcbiAgICAgICAgLnRyaWdnZXIoJ2hpZGRlbi5icy5jb2xsYXBzZScpXG4gICAgfVxuXG4gICAgaWYgKCEkLnN1cHBvcnQudHJhbnNpdGlvbikgcmV0dXJuIGNvbXBsZXRlLmNhbGwodGhpcylcblxuICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgIFtkaW1lbnNpb25dKDApXG4gICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KGNvbXBsZXRlLCB0aGlzKSlcbiAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChDb2xsYXBzZS5UUkFOU0lUSU9OX0RVUkFUSU9OKVxuICB9XG5cbiAgQ29sbGFwc2UucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzW3RoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2luJykgPyAnaGlkZScgOiAnc2hvdyddKClcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZS5nZXRQYXJlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICQoZG9jdW1lbnQpLmZpbmQodGhpcy5vcHRpb25zLnBhcmVudClcbiAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXVtkYXRhLXBhcmVudD1cIicgKyB0aGlzLm9wdGlvbnMucGFyZW50ICsgJ1wiXScpXG4gICAgICAuZWFjaCgkLnByb3h5KGZ1bmN0aW9uIChpLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICAgICAgdGhpcy5hZGRBcmlhQW5kQ29sbGFwc2VkQ2xhc3MoZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoJGVsZW1lbnQpLCAkZWxlbWVudClcbiAgICAgIH0sIHRoaXMpKVxuICAgICAgLmVuZCgpXG4gIH1cblxuICBDb2xsYXBzZS5wcm90b3R5cGUuYWRkQXJpYUFuZENvbGxhcHNlZENsYXNzID0gZnVuY3Rpb24gKCRlbGVtZW50LCAkdHJpZ2dlcikge1xuICAgIHZhciBpc09wZW4gPSAkZWxlbWVudC5oYXNDbGFzcygnaW4nKVxuXG4gICAgJGVsZW1lbnQuYXR0cignYXJpYS1leHBhbmRlZCcsIGlzT3BlbilcbiAgICAkdHJpZ2dlclxuICAgICAgLnRvZ2dsZUNsYXNzKCdjb2xsYXBzZWQnLCAhaXNPcGVuKVxuICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBpc09wZW4pXG4gIH1cblxuICBmdW5jdGlvbiBnZXRUYXJnZXRGcm9tVHJpZ2dlcigkdHJpZ2dlcikge1xuICAgIHZhciBocmVmXG4gICAgdmFyIHRhcmdldCA9ICR0cmlnZ2VyLmF0dHIoJ2RhdGEtdGFyZ2V0JylcbiAgICAgIHx8IChocmVmID0gJHRyaWdnZXIuYXR0cignaHJlZicpKSAmJiBocmVmLnJlcGxhY2UoLy4qKD89I1teXFxzXSskKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG5cbiAgICByZXR1cm4gJChkb2N1bWVudCkuZmluZCh0YXJnZXQpXG4gIH1cblxuXG4gIC8vIENPTExBUFNFIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLmNvbGxhcHNlJylcbiAgICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe30sIENvbGxhcHNlLkRFRkFVTFRTLCAkdGhpcy5kYXRhKCksIHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uKVxuXG4gICAgICBpZiAoIWRhdGEgJiYgb3B0aW9ucy50b2dnbGUgJiYgL3Nob3d8aGlkZS8udGVzdChvcHRpb24pKSBvcHRpb25zLnRvZ2dsZSA9IGZhbHNlXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2JzLmNvbGxhcHNlJywgKGRhdGEgPSBuZXcgQ29sbGFwc2UodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLmNvbGxhcHNlXG5cbiAgJC5mbi5jb2xsYXBzZSAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLmNvbGxhcHNlLkNvbnN0cnVjdG9yID0gQ29sbGFwc2VcblxuXG4gIC8vIENPTExBUFNFIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5jb2xsYXBzZS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uY29sbGFwc2UgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBDT0xMQVBTRSBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT09PT09PVxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5icy5jb2xsYXBzZS5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG5cbiAgICBpZiAoISR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JykpIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgdmFyICR0YXJnZXQgPSBnZXRUYXJnZXRGcm9tVHJpZ2dlcigkdGhpcylcbiAgICB2YXIgZGF0YSAgICA9ICR0YXJnZXQuZGF0YSgnYnMuY29sbGFwc2UnKVxuICAgIHZhciBvcHRpb24gID0gZGF0YSA/ICd0b2dnbGUnIDogJHRoaXMuZGF0YSgpXG5cbiAgICBQbHVnaW4uY2FsbCgkdGFyZ2V0LCBvcHRpb24pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IGRyb3Bkb3duLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI2Ryb3Bkb3duc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIERST1BET1dOIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBiYWNrZHJvcCA9ICcuZHJvcGRvd24tYmFja2Ryb3AnXG4gIHZhciB0b2dnbGUgICA9ICdbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXSdcbiAgdmFyIERyb3Bkb3duID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAkKGVsZW1lbnQpLm9uKCdjbGljay5icy5kcm9wZG93bicsIHRoaXMudG9nZ2xlKVxuICB9XG5cbiAgRHJvcGRvd24uVkVSU0lPTiA9ICczLjQuMSdcblxuICBmdW5jdGlvbiBnZXRQYXJlbnQoJHRoaXMpIHtcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXG5cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiAvI1tBLVphLXpdLy50ZXN0KHNlbGVjdG9yKSAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy8gc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgIHZhciAkcGFyZW50ID0gc2VsZWN0b3IgIT09ICcjJyA/ICQoZG9jdW1lbnQpLmZpbmQoc2VsZWN0b3IpIDogbnVsbFxuXG4gICAgcmV0dXJuICRwYXJlbnQgJiYgJHBhcmVudC5sZW5ndGggPyAkcGFyZW50IDogJHRoaXMucGFyZW50KClcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyTWVudXMoZSkge1xuICAgIGlmIChlICYmIGUud2hpY2ggPT09IDMpIHJldHVyblxuICAgICQoYmFja2Ryb3ApLnJlbW92ZSgpXG4gICAgJCh0b2dnbGUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgICAgICAgPSAkKHRoaXMpXG4gICAgICB2YXIgJHBhcmVudCAgICAgICA9IGdldFBhcmVudCgkdGhpcylcbiAgICAgIHZhciByZWxhdGVkVGFyZ2V0ID0geyByZWxhdGVkVGFyZ2V0OiB0aGlzIH1cblxuICAgICAgaWYgKCEkcGFyZW50Lmhhc0NsYXNzKCdvcGVuJykpIHJldHVyblxuXG4gICAgICBpZiAoZSAmJiBlLnR5cGUgPT0gJ2NsaWNrJyAmJiAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KGUudGFyZ2V0LnRhZ05hbWUpICYmICQuY29udGFpbnMoJHBhcmVudFswXSwgZS50YXJnZXQpKSByZXR1cm5cblxuICAgICAgJHBhcmVudC50cmlnZ2VyKGUgPSAkLkV2ZW50KCdoaWRlLmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG5cbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICAgJHRoaXMuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpXG4gICAgICAkcGFyZW50LnJlbW92ZUNsYXNzKCdvcGVuJykudHJpZ2dlcigkLkV2ZW50KCdoaWRkZW4uYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcbiAgICB9KVxuICB9XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxuXG4gICAgaWYgKCR0aGlzLmlzKCcuZGlzYWJsZWQsIDpkaXNhYmxlZCcpKSByZXR1cm5cblxuICAgIHZhciAkcGFyZW50ICA9IGdldFBhcmVudCgkdGhpcylcbiAgICB2YXIgaXNBY3RpdmUgPSAkcGFyZW50Lmhhc0NsYXNzKCdvcGVuJylcblxuICAgIGNsZWFyTWVudXMoKVxuXG4gICAgaWYgKCFpc0FjdGl2ZSkge1xuICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiAhJHBhcmVudC5jbG9zZXN0KCcubmF2YmFyLW5hdicpLmxlbmd0aCkge1xuICAgICAgICAvLyBpZiBtb2JpbGUgd2UgdXNlIGEgYmFja2Ryb3AgYmVjYXVzZSBjbGljayBldmVudHMgZG9uJ3QgZGVsZWdhdGVcbiAgICAgICAgJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSlcbiAgICAgICAgICAuYWRkQ2xhc3MoJ2Ryb3Bkb3duLWJhY2tkcm9wJylcbiAgICAgICAgICAuaW5zZXJ0QWZ0ZXIoJCh0aGlzKSlcbiAgICAgICAgICAub24oJ2NsaWNrJywgY2xlYXJNZW51cylcbiAgICAgIH1cblxuICAgICAgdmFyIHJlbGF0ZWRUYXJnZXQgPSB7IHJlbGF0ZWRUYXJnZXQ6IHRoaXMgfVxuICAgICAgJHBhcmVudC50cmlnZ2VyKGUgPSAkLkV2ZW50KCdzaG93LmJzLmRyb3Bkb3duJywgcmVsYXRlZFRhcmdldCkpXG5cbiAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICAgJHRoaXNcbiAgICAgICAgLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgICAgLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpXG5cbiAgICAgICRwYXJlbnRcbiAgICAgICAgLnRvZ2dsZUNsYXNzKCdvcGVuJylcbiAgICAgICAgLnRyaWdnZXIoJC5FdmVudCgnc2hvd24uYnMuZHJvcGRvd24nLCByZWxhdGVkVGFyZ2V0KSlcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIERyb3Bkb3duLnByb3RvdHlwZS5rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoIS8oMzh8NDB8Mjd8MzIpLy50ZXN0KGUud2hpY2gpIHx8IC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoZS50YXJnZXQudGFnTmFtZSkpIHJldHVyblxuXG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgaWYgKCR0aGlzLmlzKCcuZGlzYWJsZWQsIDpkaXNhYmxlZCcpKSByZXR1cm5cblxuICAgIHZhciAkcGFyZW50ICA9IGdldFBhcmVudCgkdGhpcylcbiAgICB2YXIgaXNBY3RpdmUgPSAkcGFyZW50Lmhhc0NsYXNzKCdvcGVuJylcblxuICAgIGlmICghaXNBY3RpdmUgJiYgZS53aGljaCAhPSAyNyB8fCBpc0FjdGl2ZSAmJiBlLndoaWNoID09IDI3KSB7XG4gICAgICBpZiAoZS53aGljaCA9PSAyNykgJHBhcmVudC5maW5kKHRvZ2dsZSkudHJpZ2dlcignZm9jdXMnKVxuICAgICAgcmV0dXJuICR0aGlzLnRyaWdnZXIoJ2NsaWNrJylcbiAgICB9XG5cbiAgICB2YXIgZGVzYyA9ICcgbGk6bm90KC5kaXNhYmxlZCk6dmlzaWJsZSBhJ1xuICAgIHZhciAkaXRlbXMgPSAkcGFyZW50LmZpbmQoJy5kcm9wZG93bi1tZW51JyArIGRlc2MpXG5cbiAgICBpZiAoISRpdGVtcy5sZW5ndGgpIHJldHVyblxuXG4gICAgdmFyIGluZGV4ID0gJGl0ZW1zLmluZGV4KGUudGFyZ2V0KVxuXG4gICAgaWYgKGUud2hpY2ggPT0gMzggJiYgaW5kZXggPiAwKSAgICAgICAgICAgICAgICAgaW5kZXgtLSAgICAgICAgIC8vIHVwXG4gICAgaWYgKGUud2hpY2ggPT0gNDAgJiYgaW5kZXggPCAkaXRlbXMubGVuZ3RoIC0gMSkgaW5kZXgrKyAgICAgICAgIC8vIGRvd25cbiAgICBpZiAoIX5pbmRleCkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IDBcblxuICAgICRpdGVtcy5lcShpbmRleCkudHJpZ2dlcignZm9jdXMnKVxuICB9XG5cblxuICAvLyBEUk9QRE9XTiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICA9ICR0aGlzLmRhdGEoJ2JzLmRyb3Bkb3duJylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5kcm9wZG93bicsIChkYXRhID0gbmV3IERyb3Bkb3duKHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0uY2FsbCgkdGhpcylcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uZHJvcGRvd25cblxuICAkLmZuLmRyb3Bkb3duICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uZHJvcGRvd24uQ29uc3RydWN0b3IgPSBEcm9wZG93blxuXG5cbiAgLy8gRFJPUERPV04gTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmRyb3Bkb3duLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5kcm9wZG93biA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFQUExZIFRPIFNUQU5EQVJEIERST1BET1dOIEVMRU1FTlRTXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudClcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgY2xlYXJNZW51cylcbiAgICAub24oJ2NsaWNrLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgJy5kcm9wZG93biBmb3JtJywgZnVuY3Rpb24gKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKSB9KVxuICAgIC5vbignY2xpY2suYnMuZHJvcGRvd24uZGF0YS1hcGknLCB0b2dnbGUsIERyb3Bkb3duLnByb3RvdHlwZS50b2dnbGUpXG4gICAgLm9uKCdrZXlkb3duLmJzLmRyb3Bkb3duLmRhdGEtYXBpJywgdG9nZ2xlLCBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93bilcbiAgICAub24oJ2tleWRvd24uYnMuZHJvcGRvd24uZGF0YS1hcGknLCAnLmRyb3Bkb3duLW1lbnUnLCBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93bilcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogbW9kYWwuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jbW9kYWxzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gTU9EQUwgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09XG5cbiAgdmFyIE1vZGFsID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy4kYm9keSA9ICQoZG9jdW1lbnQuYm9keSlcbiAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgIHRoaXMuJGRpYWxvZyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLm1vZGFsLWRpYWxvZycpXG4gICAgdGhpcy4kYmFja2Ryb3AgPSBudWxsXG4gICAgdGhpcy5pc1Nob3duID0gbnVsbFxuICAgIHRoaXMub3JpZ2luYWxCb2R5UGFkID0gbnVsbFxuICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSAwXG4gICAgdGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrID0gZmFsc2VcbiAgICB0aGlzLmZpeGVkQ29udGVudCA9ICcubmF2YmFyLWZpeGVkLXRvcCwgLm5hdmJhci1maXhlZC1ib3R0b20nXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnJlbW90ZSkge1xuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAuZmluZCgnLm1vZGFsLWNvbnRlbnQnKVxuICAgICAgICAubG9hZCh0aGlzLm9wdGlvbnMucmVtb3RlLCAkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2xvYWRlZC5icy5tb2RhbCcpXG4gICAgICAgIH0sIHRoaXMpKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLlZFUlNJT04gPSAnMy40LjEnXG5cbiAgTW9kYWwuVFJBTlNJVElPTl9EVVJBVElPTiA9IDMwMFxuICBNb2RhbC5CQUNLRFJPUF9UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgTW9kYWwuREVGQVVMVFMgPSB7XG4gICAgYmFja2Ryb3A6IHRydWUsXG4gICAga2V5Ym9hcmQ6IHRydWUsXG4gICAgc2hvdzogdHJ1ZVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChfcmVsYXRlZFRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLmlzU2hvd24gPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdyhfcmVsYXRlZFRhcmdldClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKF9yZWxhdGVkVGFyZ2V0KSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdmFyIGUgPSAkLkV2ZW50KCdzaG93LmJzLm1vZGFsJywgeyByZWxhdGVkVGFyZ2V0OiBfcmVsYXRlZFRhcmdldCB9KVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAodGhpcy5pc1Nob3duIHx8IGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdGhpcy5pc1Nob3duID0gdHJ1ZVxuXG4gICAgdGhpcy5jaGVja1Njcm9sbGJhcigpXG4gICAgdGhpcy5zZXRTY3JvbGxiYXIoKVxuICAgIHRoaXMuJGJvZHkuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nKVxuXG4gICAgdGhpcy5lc2NhcGUoKVxuICAgIHRoaXMucmVzaXplKClcblxuICAgIHRoaXMuJGVsZW1lbnQub24oJ2NsaWNrLmRpc21pc3MuYnMubW9kYWwnLCAnW2RhdGEtZGlzbWlzcz1cIm1vZGFsXCJdJywgJC5wcm94eSh0aGlzLmhpZGUsIHRoaXMpKVxuXG4gICAgdGhpcy4kZGlhbG9nLm9uKCdtb3VzZWRvd24uZGlzbWlzcy5icy5tb2RhbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoYXQuJGVsZW1lbnQub25lKCdtb3VzZXVwLmRpc21pc3MuYnMubW9kYWwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoJChlLnRhcmdldCkuaXModGhhdC4kZWxlbWVudCkpIHRoYXQuaWdub3JlQmFja2Ryb3BDbGljayA9IHRydWVcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMuYmFja2Ryb3AoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRyYW5zaXRpb24gPSAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGF0LiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJylcblxuICAgICAgaWYgKCF0aGF0LiRlbGVtZW50LnBhcmVudCgpLmxlbmd0aCkge1xuICAgICAgICB0aGF0LiRlbGVtZW50LmFwcGVuZFRvKHRoYXQuJGJvZHkpIC8vIGRvbid0IG1vdmUgbW9kYWxzIGRvbSBwb3NpdGlvblxuICAgICAgfVxuXG4gICAgICB0aGF0LiRlbGVtZW50XG4gICAgICAgIC5zaG93KClcbiAgICAgICAgLnNjcm9sbFRvcCgwKVxuXG4gICAgICB0aGF0LmFkanVzdERpYWxvZygpXG5cbiAgICAgIGlmICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHRoYXQuJGVsZW1lbnRbMF0ub2Zmc2V0V2lkdGggLy8gZm9yY2UgcmVmbG93XG4gICAgICB9XG5cbiAgICAgIHRoYXQuJGVsZW1lbnQuYWRkQ2xhc3MoJ2luJylcblxuICAgICAgdGhhdC5lbmZvcmNlRm9jdXMoKVxuXG4gICAgICB2YXIgZSA9ICQuRXZlbnQoJ3Nob3duLmJzLm1vZGFsJywgeyByZWxhdGVkVGFyZ2V0OiBfcmVsYXRlZFRhcmdldCB9KVxuXG4gICAgICB0cmFuc2l0aW9uID9cbiAgICAgICAgdGhhdC4kZGlhbG9nIC8vIHdhaXQgZm9yIG1vZGFsIHRvIHNsaWRlIGluXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdmb2N1cycpLnRyaWdnZXIoZSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lbXVsYXRlVHJhbnNpdGlvbkVuZChNb2RhbC5UUkFOU0lUSU9OX0RVUkFUSU9OKSA6XG4gICAgICAgIHRoYXQuJGVsZW1lbnQudHJpZ2dlcignZm9jdXMnKS50cmlnZ2VyKGUpXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBlID0gJC5FdmVudCgnaGlkZS5icy5tb2RhbCcpXG5cbiAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgIGlmICghdGhpcy5pc1Nob3duIHx8IGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgdGhpcy5pc1Nob3duID0gZmFsc2VcblxuICAgIHRoaXMuZXNjYXBlKClcbiAgICB0aGlzLnJlc2l6ZSgpXG5cbiAgICAkKGRvY3VtZW50KS5vZmYoJ2ZvY3VzaW4uYnMubW9kYWwnKVxuXG4gICAgdGhpcy4kZWxlbWVudFxuICAgICAgLnJlbW92ZUNsYXNzKCdpbicpXG4gICAgICAub2ZmKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJylcbiAgICAgIC5vZmYoJ21vdXNldXAuZGlzbWlzcy5icy5tb2RhbCcpXG5cbiAgICB0aGlzLiRkaWFsb2cub2ZmKCdtb3VzZWRvd24uZGlzbWlzcy5icy5tb2RhbCcpXG5cbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCAkLnByb3h5KHRoaXMuaGlkZU1vZGFsLCB0aGlzKSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIHRoaXMuaGlkZU1vZGFsKClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5lbmZvcmNlRm9jdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJChkb2N1bWVudClcbiAgICAgIC5vZmYoJ2ZvY3VzaW4uYnMubW9kYWwnKSAvLyBndWFyZCBhZ2FpbnN0IGluZmluaXRlIGZvY3VzIGxvb3BcbiAgICAgIC5vbignZm9jdXNpbi5icy5tb2RhbCcsICQucHJveHkoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50ICE9PSBlLnRhcmdldCAmJlxuICAgICAgICAgIHRoaXMuJGVsZW1lbnRbMF0gIT09IGUudGFyZ2V0ICYmXG4gICAgICAgICAgIXRoaXMuJGVsZW1lbnQuaGFzKGUudGFyZ2V0KS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcykpXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUuZXNjYXBlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzU2hvd24gJiYgdGhpcy5vcHRpb25zLmtleWJvYXJkKSB7XG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duLmRpc21pc3MuYnMubW9kYWwnLCAkLnByb3h5KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUud2hpY2ggPT0gMjcgJiYgdGhpcy5oaWRlKClcbiAgICAgIH0sIHRoaXMpKVxuICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNTaG93bikge1xuICAgICAgdGhpcy4kZWxlbWVudC5vZmYoJ2tleWRvd24uZGlzbWlzcy5icy5tb2RhbCcpXG4gICAgfVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc1Nob3duKSB7XG4gICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5icy5tb2RhbCcsICQucHJveHkodGhpcy5oYW5kbGVVcGRhdGUsIHRoaXMpKVxuICAgIH0gZWxzZSB7XG4gICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuYnMubW9kYWwnKVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5oaWRlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgdGhpcy4kZWxlbWVudC5oaWRlKClcbiAgICB0aGlzLmJhY2tkcm9wKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoYXQuJGJvZHkucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKVxuICAgICAgdGhhdC5yZXNldEFkanVzdG1lbnRzKClcbiAgICAgIHRoYXQucmVzZXRTY3JvbGxiYXIoKVxuICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdoaWRkZW4uYnMubW9kYWwnKVxuICAgIH0pXG4gIH1cblxuICBNb2RhbC5wcm90b3R5cGUucmVtb3ZlQmFja2Ryb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kYmFja2Ryb3AgJiYgdGhpcy4kYmFja2Ryb3AucmVtb3ZlKClcbiAgICB0aGlzLiRiYWNrZHJvcCA9IG51bGxcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5iYWNrZHJvcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciBhbmltYXRlID0gdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID8gJ2ZhZGUnIDogJydcblxuICAgIGlmICh0aGlzLmlzU2hvd24gJiYgdGhpcy5vcHRpb25zLmJhY2tkcm9wKSB7XG4gICAgICB2YXIgZG9BbmltYXRlID0gJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgYW5pbWF0ZVxuXG4gICAgICB0aGlzLiRiYWNrZHJvcCA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXG4gICAgICAgIC5hZGRDbGFzcygnbW9kYWwtYmFja2Ryb3AgJyArIGFuaW1hdGUpXG4gICAgICAgIC5hcHBlbmRUbyh0aGlzLiRib2R5KVxuXG4gICAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay5kaXNtaXNzLmJzLm1vZGFsJywgJC5wcm94eShmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrKSB7XG4gICAgICAgICAgdGhpcy5pZ25vcmVCYWNrZHJvcENsaWNrID0gZmFsc2VcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAoZS50YXJnZXQgIT09IGUuY3VycmVudFRhcmdldCkgcmV0dXJuXG4gICAgICAgIHRoaXMub3B0aW9ucy5iYWNrZHJvcCA9PSAnc3RhdGljJ1xuICAgICAgICAgID8gdGhpcy4kZWxlbWVudFswXS5mb2N1cygpXG4gICAgICAgICAgOiB0aGlzLmhpZGUoKVxuICAgICAgfSwgdGhpcykpXG5cbiAgICAgIGlmIChkb0FuaW1hdGUpIHRoaXMuJGJhY2tkcm9wWzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuXG4gICAgICB0aGlzLiRiYWNrZHJvcC5hZGRDbGFzcygnaW4nKVxuXG4gICAgICBpZiAoIWNhbGxiYWNrKSByZXR1cm5cblxuICAgICAgZG9BbmltYXRlID9cbiAgICAgICAgdGhpcy4kYmFja2Ryb3BcbiAgICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjYWxsYmFjaylcbiAgICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoTW9kYWwuQkFDS0RST1BfVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICBjYWxsYmFjaygpXG5cbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2hvd24gJiYgdGhpcy4kYmFja2Ryb3ApIHtcbiAgICAgIHRoaXMuJGJhY2tkcm9wLnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICAgIHZhciBjYWxsYmFja1JlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhhdC5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAgIHRoaXMuJGJhY2tkcm9wXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY2FsbGJhY2tSZW1vdmUpXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKE1vZGFsLkJBQ0tEUk9QX1RSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgICAgY2FsbGJhY2tSZW1vdmUoKVxuXG4gICAgfSBlbHNlIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuXG4gIC8vIHRoZXNlIGZvbGxvd2luZyBtZXRob2RzIGFyZSB1c2VkIHRvIGhhbmRsZSBvdmVyZmxvd2luZyBtb2RhbHNcblxuICBNb2RhbC5wcm90b3R5cGUuaGFuZGxlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYWRqdXN0RGlhbG9nKClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5hZGp1c3REaWFsb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGFsSXNPdmVyZmxvd2luZyA9IHRoaXMuJGVsZW1lbnRbMF0uc2Nyb2xsSGVpZ2h0ID4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuXG4gICAgdGhpcy4kZWxlbWVudC5jc3Moe1xuICAgICAgcGFkZGluZ0xlZnQ6ICF0aGlzLmJvZHlJc092ZXJmbG93aW5nICYmIG1vZGFsSXNPdmVyZmxvd2luZyA/IHRoaXMuc2Nyb2xsYmFyV2lkdGggOiAnJyxcbiAgICAgIHBhZGRpbmdSaWdodDogdGhpcy5ib2R5SXNPdmVyZmxvd2luZyAmJiAhbW9kYWxJc092ZXJmbG93aW5nID8gdGhpcy5zY3JvbGxiYXJXaWR0aCA6ICcnXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNldEFkanVzdG1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGVsZW1lbnQuY3NzKHtcbiAgICAgIHBhZGRpbmdMZWZ0OiAnJyxcbiAgICAgIHBhZGRpbmdSaWdodDogJydcbiAgICB9KVxuICB9XG5cbiAgTW9kYWwucHJvdG90eXBlLmNoZWNrU2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmdWxsV2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIGlmICghZnVsbFdpbmRvd1dpZHRoKSB7IC8vIHdvcmthcm91bmQgZm9yIG1pc3Npbmcgd2luZG93LmlubmVyV2lkdGggaW4gSUU4XG4gICAgICB2YXIgZG9jdW1lbnRFbGVtZW50UmVjdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgZnVsbFdpbmRvd1dpZHRoID0gZG9jdW1lbnRFbGVtZW50UmVjdC5yaWdodCAtIE1hdGguYWJzKGRvY3VtZW50RWxlbWVudFJlY3QubGVmdClcbiAgICB9XG4gICAgdGhpcy5ib2R5SXNPdmVyZmxvd2luZyA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPCBmdWxsV2luZG93V2lkdGhcbiAgICB0aGlzLnNjcm9sbGJhcldpZHRoID0gdGhpcy5tZWFzdXJlU2Nyb2xsYmFyKClcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5zZXRTY3JvbGxiYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJvZHlQYWQgPSBwYXJzZUludCgodGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnKSB8fCAwKSwgMTApXG4gICAgdGhpcy5vcmlnaW5hbEJvZHlQYWQgPSBkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCB8fCAnJ1xuICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHRoaXMuc2Nyb2xsYmFyV2lkdGhcbiAgICBpZiAodGhpcy5ib2R5SXNPdmVyZmxvd2luZykge1xuICAgICAgdGhpcy4kYm9keS5jc3MoJ3BhZGRpbmctcmlnaHQnLCBib2R5UGFkICsgc2Nyb2xsYmFyV2lkdGgpXG4gICAgICAkKHRoaXMuZml4ZWRDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICB2YXIgYWN0dWFsUGFkZGluZyA9IGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0XG4gICAgICAgIHZhciBjYWxjdWxhdGVkUGFkZGluZyA9ICQoZWxlbWVudCkuY3NzKCdwYWRkaW5nLXJpZ2h0JylcbiAgICAgICAgJChlbGVtZW50KVxuICAgICAgICAgIC5kYXRhKCdwYWRkaW5nLXJpZ2h0JywgYWN0dWFsUGFkZGluZylcbiAgICAgICAgICAuY3NzKCdwYWRkaW5nLXJpZ2h0JywgcGFyc2VGbG9hdChjYWxjdWxhdGVkUGFkZGluZykgKyBzY3JvbGxiYXJXaWR0aCArICdweCcpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5yZXNldFNjcm9sbGJhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRib2R5LmNzcygncGFkZGluZy1yaWdodCcsIHRoaXMub3JpZ2luYWxCb2R5UGFkKVxuICAgICQodGhpcy5maXhlZENvbnRlbnQpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICB2YXIgcGFkZGluZyA9ICQoZWxlbWVudCkuZGF0YSgncGFkZGluZy1yaWdodCcpXG4gICAgICAkKGVsZW1lbnQpLnJlbW92ZURhdGEoJ3BhZGRpbmctcmlnaHQnKVxuICAgICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBwYWRkaW5nID8gcGFkZGluZyA6ICcnXG4gICAgfSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZS5tZWFzdXJlU2Nyb2xsYmFyID0gZnVuY3Rpb24gKCkgeyAvLyB0aHggd2Fsc2hcbiAgICB2YXIgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBzY3JvbGxEaXYuY2xhc3NOYW1lID0gJ21vZGFsLXNjcm9sbGJhci1tZWFzdXJlJ1xuICAgIHRoaXMuJGJvZHkuYXBwZW5kKHNjcm9sbERpdilcbiAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGhcbiAgICB0aGlzLiRib2R5WzBdLnJlbW92ZUNoaWxkKHNjcm9sbERpdilcbiAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGhcbiAgfVxuXG5cbiAgLy8gTU9EQUwgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uLCBfcmVsYXRlZFRhcmdldCkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCdicy5tb2RhbCcpXG4gICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBNb2RhbC5ERUZBVUxUUywgJHRoaXMuZGF0YSgpLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5tb2RhbCcsIChkYXRhID0gbmV3IE1vZGFsKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oX3JlbGF0ZWRUYXJnZXQpXG4gICAgICBlbHNlIGlmIChvcHRpb25zLnNob3cpIGRhdGEuc2hvdyhfcmVsYXRlZFRhcmdldClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4ubW9kYWxcblxuICAkLmZuLm1vZGFsID0gUGx1Z2luXG4gICQuZm4ubW9kYWwuQ29uc3RydWN0b3IgPSBNb2RhbFxuXG5cbiAgLy8gTU9EQUwgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLm1vZGFsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5tb2RhbCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIE1PREFMIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmJzLm1vZGFsLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgdmFyIGhyZWYgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICB2YXIgdGFyZ2V0ID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSB8fFxuICAgICAgKGhyZWYgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykpIC8vIHN0cmlwIGZvciBpZTdcblxuICAgIHZhciAkdGFyZ2V0ID0gJChkb2N1bWVudCkuZmluZCh0YXJnZXQpXG4gICAgdmFyIG9wdGlvbiA9ICR0YXJnZXQuZGF0YSgnYnMubW9kYWwnKSA/ICd0b2dnbGUnIDogJC5leHRlbmQoeyByZW1vdGU6ICEvIy8udGVzdChocmVmKSAmJiBocmVmIH0sICR0YXJnZXQuZGF0YSgpLCAkdGhpcy5kYXRhKCkpXG5cbiAgICBpZiAoJHRoaXMuaXMoJ2EnKSkgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAkdGFyZ2V0Lm9uZSgnc2hvdy5icy5tb2RhbCcsIGZ1bmN0aW9uIChzaG93RXZlbnQpIHtcbiAgICAgIGlmIChzaG93RXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVybiAvLyBvbmx5IHJlZ2lzdGVyIGZvY3VzIHJlc3RvcmVyIGlmIG1vZGFsIHdpbGwgYWN0dWFsbHkgZ2V0IHNob3duXG4gICAgICAkdGFyZ2V0Lm9uZSgnaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAkdGhpcy5pcygnOnZpc2libGUnKSAmJiAkdGhpcy50cmlnZ2VyKCdmb2N1cycpXG4gICAgICB9KVxuICAgIH0pXG4gICAgUGx1Z2luLmNhbGwoJHRhcmdldCwgb3B0aW9uLCB0aGlzKVxuICB9KVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiB0b29sdGlwLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3Rvb2x0aXBcbiAqIEluc3BpcmVkIGJ5IHRoZSBvcmlnaW5hbCBqUXVlcnkudGlwc3kgYnkgSmFzb24gRnJhbWVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIERJU0FMTE9XRURfQVRUUklCVVRFUyA9IFsnc2FuaXRpemUnLCAnd2hpdGVMaXN0JywgJ3Nhbml0aXplRm4nXVxuXG4gIHZhciB1cmlBdHRycyA9IFtcbiAgICAnYmFja2dyb3VuZCcsXG4gICAgJ2NpdGUnLFxuICAgICdocmVmJyxcbiAgICAnaXRlbXR5cGUnLFxuICAgICdsb25nZGVzYycsXG4gICAgJ3Bvc3RlcicsXG4gICAgJ3NyYycsXG4gICAgJ3hsaW5rOmhyZWYnXG4gIF1cblxuICB2YXIgQVJJQV9BVFRSSUJVVEVfUEFUVEVSTiA9IC9eYXJpYS1bXFx3LV0qJC9pXG5cbiAgdmFyIERlZmF1bHRXaGl0ZWxpc3QgPSB7XG4gICAgLy8gR2xvYmFsIGF0dHJpYnV0ZXMgYWxsb3dlZCBvbiBhbnkgc3VwcGxpZWQgZWxlbWVudCBiZWxvdy5cbiAgICAnKic6IFsnY2xhc3MnLCAnZGlyJywgJ2lkJywgJ2xhbmcnLCAncm9sZScsIEFSSUFfQVRUUklCVVRFX1BBVFRFUk5dLFxuICAgIGE6IFsndGFyZ2V0JywgJ2hyZWYnLCAndGl0bGUnLCAncmVsJ10sXG4gICAgYXJlYTogW10sXG4gICAgYjogW10sXG4gICAgYnI6IFtdLFxuICAgIGNvbDogW10sXG4gICAgY29kZTogW10sXG4gICAgZGl2OiBbXSxcbiAgICBlbTogW10sXG4gICAgaHI6IFtdLFxuICAgIGgxOiBbXSxcbiAgICBoMjogW10sXG4gICAgaDM6IFtdLFxuICAgIGg0OiBbXSxcbiAgICBoNTogW10sXG4gICAgaDY6IFtdLFxuICAgIGk6IFtdLFxuICAgIGltZzogWydzcmMnLCAnYWx0JywgJ3RpdGxlJywgJ3dpZHRoJywgJ2hlaWdodCddLFxuICAgIGxpOiBbXSxcbiAgICBvbDogW10sXG4gICAgcDogW10sXG4gICAgcHJlOiBbXSxcbiAgICBzOiBbXSxcbiAgICBzbWFsbDogW10sXG4gICAgc3BhbjogW10sXG4gICAgc3ViOiBbXSxcbiAgICBzdXA6IFtdLFxuICAgIHN0cm9uZzogW10sXG4gICAgdTogW10sXG4gICAgdWw6IFtdXG4gIH1cblxuICAvKipcbiAgICogQSBwYXR0ZXJuIHRoYXQgcmVjb2duaXplcyBhIGNvbW1vbmx5IHVzZWZ1bCBzdWJzZXQgb2YgVVJMcyB0aGF0IGFyZSBzYWZlLlxuICAgKlxuICAgKiBTaG91dG91dCB0byBBbmd1bGFyIDcgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9ibG9iLzcuMi40L3BhY2thZ2VzL2NvcmUvc3JjL3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyLnRzXG4gICAqL1xuICB2YXIgU0FGRV9VUkxfUEFUVEVSTiA9IC9eKD86KD86aHR0cHM/fG1haWx0b3xmdHB8dGVsfGZpbGUpOnxbXiY6Lz8jXSooPzpbLz8jXXwkKSkvZ2lcblxuICAvKipcbiAgICogQSBwYXR0ZXJuIHRoYXQgbWF0Y2hlcyBzYWZlIGRhdGEgVVJMcy4gT25seSBtYXRjaGVzIGltYWdlLCB2aWRlbyBhbmQgYXVkaW8gdHlwZXMuXG4gICAqXG4gICAqIFNob3V0b3V0IHRvIEFuZ3VsYXIgNyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2Jsb2IvNy4yLjQvcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL3VybF9zYW5pdGl6ZXIudHNcbiAgICovXG4gIHZhciBEQVRBX1VSTF9QQVRURVJOID0gL15kYXRhOig/OmltYWdlXFwvKD86Ym1wfGdpZnxqcGVnfGpwZ3xwbmd8dGlmZnx3ZWJwKXx2aWRlb1xcLyg/Om1wZWd8bXA0fG9nZ3x3ZWJtKXxhdWRpb1xcLyg/Om1wM3xvZ2F8b2dnfG9wdXMpKTtiYXNlNjQsW2EtejAtOSsvXSs9KiQvaVxuXG4gIGZ1bmN0aW9uIGFsbG93ZWRBdHRyaWJ1dGUoYXR0ciwgYWxsb3dlZEF0dHJpYnV0ZUxpc3QpIHtcbiAgICB2YXIgYXR0ck5hbWUgPSBhdHRyLm5vZGVOYW1lLnRvTG93ZXJDYXNlKClcblxuICAgIGlmICgkLmluQXJyYXkoYXR0ck5hbWUsIGFsbG93ZWRBdHRyaWJ1dGVMaXN0KSAhPT0gLTEpIHtcbiAgICAgIGlmICgkLmluQXJyYXkoYXR0ck5hbWUsIHVyaUF0dHJzKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4oYXR0ci5ub2RlVmFsdWUubWF0Y2goU0FGRV9VUkxfUEFUVEVSTikgfHwgYXR0ci5ub2RlVmFsdWUubWF0Y2goREFUQV9VUkxfUEFUVEVSTikpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgdmFyIHJlZ0V4cCA9ICQoYWxsb3dlZEF0dHJpYnV0ZUxpc3QpLmZpbHRlcihmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBSZWdFeHBcbiAgICB9KVxuXG4gICAgLy8gQ2hlY2sgaWYgYSByZWd1bGFyIGV4cHJlc3Npb24gdmFsaWRhdGVzIHRoZSBhdHRyaWJ1dGUuXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWdFeHAubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoYXR0ck5hbWUubWF0Y2gocmVnRXhwW2ldKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZnVuY3Rpb24gc2FuaXRpemVIdG1sKHVuc2FmZUh0bWwsIHdoaXRlTGlzdCwgc2FuaXRpemVGbikge1xuICAgIGlmICh1bnNhZmVIdG1sLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHVuc2FmZUh0bWxcbiAgICB9XG5cbiAgICBpZiAoc2FuaXRpemVGbiAmJiB0eXBlb2Ygc2FuaXRpemVGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHNhbml0aXplRm4odW5zYWZlSHRtbClcbiAgICB9XG5cbiAgICAvLyBJRSA4IGFuZCBiZWxvdyBkb24ndCBzdXBwb3J0IGNyZWF0ZUhUTUxEb2N1bWVudFxuICAgIGlmICghZG9jdW1lbnQuaW1wbGVtZW50YXRpb24gfHwgIWRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCkge1xuICAgICAgcmV0dXJuIHVuc2FmZUh0bWxcbiAgICB9XG5cbiAgICB2YXIgY3JlYXRlZERvY3VtZW50ID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KCdzYW5pdGl6YXRpb24nKVxuICAgIGNyZWF0ZWREb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IHVuc2FmZUh0bWxcblxuICAgIHZhciB3aGl0ZWxpc3RLZXlzID0gJC5tYXAod2hpdGVMaXN0LCBmdW5jdGlvbiAoZWwsIGkpIHsgcmV0dXJuIGkgfSlcbiAgICB2YXIgZWxlbWVudHMgPSAkKGNyZWF0ZWREb2N1bWVudC5ib2R5KS5maW5kKCcqJylcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIGVsID0gZWxlbWVudHNbaV1cbiAgICAgIHZhciBlbE5hbWUgPSBlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICAgIGlmICgkLmluQXJyYXkoZWxOYW1lLCB3aGl0ZWxpc3RLZXlzKSA9PT0gLTEpIHtcbiAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbClcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICB2YXIgYXR0cmlidXRlTGlzdCA9ICQubWFwKGVsLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChlbCkgeyByZXR1cm4gZWwgfSlcbiAgICAgIHZhciB3aGl0ZWxpc3RlZEF0dHJpYnV0ZXMgPSBbXS5jb25jYXQod2hpdGVMaXN0WycqJ10gfHwgW10sIHdoaXRlTGlzdFtlbE5hbWVdIHx8IFtdKVxuXG4gICAgICBmb3IgKHZhciBqID0gMCwgbGVuMiA9IGF0dHJpYnV0ZUxpc3QubGVuZ3RoOyBqIDwgbGVuMjsgaisrKSB7XG4gICAgICAgIGlmICghYWxsb3dlZEF0dHJpYnV0ZShhdHRyaWJ1dGVMaXN0W2pdLCB3aGl0ZWxpc3RlZEF0dHJpYnV0ZXMpKSB7XG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUxpc3Rbal0ubm9kZU5hbWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlZERvY3VtZW50LmJvZHkuaW5uZXJIVE1MXG4gIH1cblxuICAvLyBUT09MVElQIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy50eXBlICAgICAgID0gbnVsbFxuICAgIHRoaXMub3B0aW9ucyAgICA9IG51bGxcbiAgICB0aGlzLmVuYWJsZWQgICAgPSBudWxsXG4gICAgdGhpcy50aW1lb3V0ICAgID0gbnVsbFxuICAgIHRoaXMuaG92ZXJTdGF0ZSA9IG51bGxcbiAgICB0aGlzLiRlbGVtZW50ICAgPSBudWxsXG4gICAgdGhpcy5pblN0YXRlICAgID0gbnVsbFxuXG4gICAgdGhpcy5pbml0KCd0b29sdGlwJywgZWxlbWVudCwgb3B0aW9ucylcbiAgfVxuXG4gIFRvb2x0aXAuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgVG9vbHRpcC5UUkFOU0lUSU9OX0RVUkFUSU9OID0gMTUwXG5cbiAgVG9vbHRpcC5ERUZBVUxUUyA9IHtcbiAgICBhbmltYXRpb246IHRydWUsXG4gICAgcGxhY2VtZW50OiAndG9wJyxcbiAgICBzZWxlY3RvcjogZmFsc2UsXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwidG9vbHRpcFwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cInRvb2x0aXAtYXJyb3dcIj48L2Rpdj48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjwvZGl2PjwvZGl2PicsXG4gICAgdHJpZ2dlcjogJ2hvdmVyIGZvY3VzJyxcbiAgICB0aXRsZTogJycsXG4gICAgZGVsYXk6IDAsXG4gICAgaHRtbDogZmFsc2UsXG4gICAgY29udGFpbmVyOiBmYWxzZSxcbiAgICB2aWV3cG9ydDoge1xuICAgICAgc2VsZWN0b3I6ICdib2R5JyxcbiAgICAgIHBhZGRpbmc6IDBcbiAgICB9LFxuICAgIHNhbml0aXplIDogdHJ1ZSxcbiAgICBzYW5pdGl6ZUZuIDogbnVsbCxcbiAgICB3aGl0ZUxpc3QgOiBEZWZhdWx0V2hpdGVsaXN0XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKHR5cGUsIGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmVuYWJsZWQgICA9IHRydWVcbiAgICB0aGlzLnR5cGUgICAgICA9IHR5cGVcbiAgICB0aGlzLiRlbGVtZW50ICA9ICQoZWxlbWVudClcbiAgICB0aGlzLm9wdGlvbnMgICA9IHRoaXMuZ2V0T3B0aW9ucyhvcHRpb25zKVxuICAgIHRoaXMuJHZpZXdwb3J0ID0gdGhpcy5vcHRpb25zLnZpZXdwb3J0ICYmICQoZG9jdW1lbnQpLmZpbmQoJC5pc0Z1bmN0aW9uKHRoaXMub3B0aW9ucy52aWV3cG9ydCkgPyB0aGlzLm9wdGlvbnMudmlld3BvcnQuY2FsbCh0aGlzLCB0aGlzLiRlbGVtZW50KSA6ICh0aGlzLm9wdGlvbnMudmlld3BvcnQuc2VsZWN0b3IgfHwgdGhpcy5vcHRpb25zLnZpZXdwb3J0KSlcbiAgICB0aGlzLmluU3RhdGUgICA9IHsgY2xpY2s6IGZhbHNlLCBob3ZlcjogZmFsc2UsIGZvY3VzOiBmYWxzZSB9XG5cbiAgICBpZiAodGhpcy4kZWxlbWVudFswXSBpbnN0YW5jZW9mIGRvY3VtZW50LmNvbnN0cnVjdG9yICYmICF0aGlzLm9wdGlvbnMuc2VsZWN0b3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYHNlbGVjdG9yYCBvcHRpb24gbXVzdCBiZSBzcGVjaWZpZWQgd2hlbiBpbml0aWFsaXppbmcgJyArIHRoaXMudHlwZSArICcgb24gdGhlIHdpbmRvdy5kb2N1bWVudCBvYmplY3QhJylcbiAgICB9XG5cbiAgICB2YXIgdHJpZ2dlcnMgPSB0aGlzLm9wdGlvbnMudHJpZ2dlci5zcGxpdCgnICcpXG5cbiAgICBmb3IgKHZhciBpID0gdHJpZ2dlcnMubGVuZ3RoOyBpLS07KSB7XG4gICAgICB2YXIgdHJpZ2dlciA9IHRyaWdnZXJzW2ldXG5cbiAgICAgIGlmICh0cmlnZ2VyID09ICdjbGljaycpIHtcbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbignY2xpY2suJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMudG9nZ2xlLCB0aGlzKSlcbiAgICAgIH0gZWxzZSBpZiAodHJpZ2dlciAhPSAnbWFudWFsJykge1xuICAgICAgICB2YXIgZXZlbnRJbiAgPSB0cmlnZ2VyID09ICdob3ZlcicgPyAnbW91c2VlbnRlcicgOiAnZm9jdXNpbidcbiAgICAgICAgdmFyIGV2ZW50T3V0ID0gdHJpZ2dlciA9PSAnaG92ZXInID8gJ21vdXNlbGVhdmUnIDogJ2ZvY3Vzb3V0J1xuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQub24oZXZlbnRJbiAgKyAnLicgKyB0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zZWxlY3RvciwgJC5wcm94eSh0aGlzLmVudGVyLCB0aGlzKSlcbiAgICAgICAgdGhpcy4kZWxlbWVudC5vbihldmVudE91dCArICcuJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMubGVhdmUsIHRoaXMpKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub3B0aW9ucy5zZWxlY3RvciA/XG4gICAgICAodGhpcy5fb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIHsgdHJpZ2dlcjogJ21hbnVhbCcsIHNlbGVjdG9yOiAnJyB9KSkgOlxuICAgICAgdGhpcy5maXhUaXRsZSgpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5nZXREZWZhdWx0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gVG9vbHRpcC5ERUZBVUxUU1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIGRhdGFBdHRyaWJ1dGVzID0gdGhpcy4kZWxlbWVudC5kYXRhKClcblxuICAgIGZvciAodmFyIGRhdGFBdHRyIGluIGRhdGFBdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAoZGF0YUF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoZGF0YUF0dHIpICYmICQuaW5BcnJheShkYXRhQXR0ciwgRElTQUxMT1dFRF9BVFRSSUJVVEVTKSAhPT0gLTEpIHtcbiAgICAgICAgZGVsZXRlIGRhdGFBdHRyaWJ1dGVzW2RhdGFBdHRyXVxuICAgICAgfVxuICAgIH1cblxuICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgdGhpcy5nZXREZWZhdWx0cygpLCBkYXRhQXR0cmlidXRlcywgb3B0aW9ucylcblxuICAgIGlmIChvcHRpb25zLmRlbGF5ICYmIHR5cGVvZiBvcHRpb25zLmRlbGF5ID09ICdudW1iZXInKSB7XG4gICAgICBvcHRpb25zLmRlbGF5ID0ge1xuICAgICAgICBzaG93OiBvcHRpb25zLmRlbGF5LFxuICAgICAgICBoaWRlOiBvcHRpb25zLmRlbGF5XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICAgIG9wdGlvbnMudGVtcGxhdGUgPSBzYW5pdGl6ZUh0bWwob3B0aW9ucy50ZW1wbGF0ZSwgb3B0aW9ucy53aGl0ZUxpc3QsIG9wdGlvbnMuc2FuaXRpemVGbilcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9uc1xuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0RGVsZWdhdGVPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zICA9IHt9XG4gICAgdmFyIGRlZmF1bHRzID0gdGhpcy5nZXREZWZhdWx0cygpXG5cbiAgICB0aGlzLl9vcHRpb25zICYmICQuZWFjaCh0aGlzLl9vcHRpb25zLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKGRlZmF1bHRzW2tleV0gIT0gdmFsdWUpIG9wdGlvbnNba2V5XSA9IHZhbHVlXG4gICAgfSlcblxuICAgIHJldHVybiBvcHRpb25zXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5lbnRlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgc2VsZiA9IG9iaiBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IgP1xuICAgICAgb2JqIDogJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICghc2VsZikge1xuICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG9iai5jdXJyZW50VGFyZ2V0LCB0aGlzLmdldERlbGVnYXRlT3B0aW9ucygpKVxuICAgICAgJChvYmouY3VycmVudFRhcmdldCkuZGF0YSgnYnMuJyArIHRoaXMudHlwZSwgc2VsZilcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgJC5FdmVudCkge1xuICAgICAgc2VsZi5pblN0YXRlW29iai50eXBlID09ICdmb2N1c2luJyA/ICdmb2N1cycgOiAnaG92ZXInXSA9IHRydWVcbiAgICB9XG5cbiAgICBpZiAoc2VsZi50aXAoKS5oYXNDbGFzcygnaW4nKSB8fCBzZWxmLmhvdmVyU3RhdGUgPT0gJ2luJykge1xuICAgICAgc2VsZi5ob3ZlclN0YXRlID0gJ2luJ1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcblxuICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdpbidcblxuICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuc2hvdykgcmV0dXJuIHNlbGYuc2hvdygpXG5cbiAgICBzZWxmLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ2luJykgc2VsZi5zaG93KClcbiAgICB9LCBzZWxmLm9wdGlvbnMuZGVsYXkuc2hvdylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmlzSW5TdGF0ZVRydWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuaW5TdGF0ZSkge1xuICAgICAgaWYgKHRoaXMuaW5TdGF0ZVtrZXldKSByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUubGVhdmUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHNlbGYgPSBvYmogaW5zdGFuY2VvZiB0aGlzLmNvbnN0cnVjdG9yID9cbiAgICAgIG9iaiA6ICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBpZiAoIXNlbGYpIHtcbiAgICAgIHNlbGYgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihvYmouY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICQob2JqLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgfVxuXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mICQuRXZlbnQpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZVtvYmoudHlwZSA9PSAnZm9jdXNvdXQnID8gJ2ZvY3VzJyA6ICdob3ZlciddID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5pc0luU3RhdGVUcnVlKCkpIHJldHVyblxuXG4gICAgY2xlYXJUaW1lb3V0KHNlbGYudGltZW91dClcblxuICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdvdXQnXG5cbiAgICBpZiAoIXNlbGYub3B0aW9ucy5kZWxheSB8fCAhc2VsZi5vcHRpb25zLmRlbGF5LmhpZGUpIHJldHVybiBzZWxmLmhpZGUoKVxuXG4gICAgc2VsZi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoc2VsZi5ob3ZlclN0YXRlID09ICdvdXQnKSBzZWxmLmhpZGUoKVxuICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheS5oaWRlKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZSA9ICQuRXZlbnQoJ3Nob3cuYnMuJyArIHRoaXMudHlwZSlcblxuICAgIGlmICh0aGlzLmhhc0NvbnRlbnQoKSAmJiB0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgICB2YXIgaW5Eb20gPSAkLmNvbnRhaW5zKHRoaXMuJGVsZW1lbnRbMF0ub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHRoaXMuJGVsZW1lbnRbMF0pXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSB8fCAhaW5Eb20pIHJldHVyblxuICAgICAgdmFyIHRoYXQgPSB0aGlzXG5cbiAgICAgIHZhciAkdGlwID0gdGhpcy50aXAoKVxuXG4gICAgICB2YXIgdGlwSWQgPSB0aGlzLmdldFVJRCh0aGlzLnR5cGUpXG5cbiAgICAgIHRoaXMuc2V0Q29udGVudCgpXG4gICAgICAkdGlwLmF0dHIoJ2lkJywgdGlwSWQpXG4gICAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCB0aXBJZClcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24pICR0aXAuYWRkQ2xhc3MoJ2ZhZGUnKVxuXG4gICAgICB2YXIgcGxhY2VtZW50ID0gdHlwZW9mIHRoaXMub3B0aW9ucy5wbGFjZW1lbnQgPT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZW1lbnQuY2FsbCh0aGlzLCAkdGlwWzBdLCB0aGlzLiRlbGVtZW50WzBdKSA6XG4gICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZW1lbnRcblxuICAgICAgdmFyIGF1dG9Ub2tlbiA9IC9cXHM/YXV0bz9cXHM/L2lcbiAgICAgIHZhciBhdXRvUGxhY2UgPSBhdXRvVG9rZW4udGVzdChwbGFjZW1lbnQpXG4gICAgICBpZiAoYXV0b1BsYWNlKSBwbGFjZW1lbnQgPSBwbGFjZW1lbnQucmVwbGFjZShhdXRvVG9rZW4sICcnKSB8fCAndG9wJ1xuXG4gICAgICAkdGlwXG4gICAgICAgIC5kZXRhY2goKVxuICAgICAgICAuY3NzKHsgdG9wOiAwLCBsZWZ0OiAwLCBkaXNwbGF5OiAnYmxvY2snIH0pXG4gICAgICAgIC5hZGRDbGFzcyhwbGFjZW1lbnQpXG4gICAgICAgIC5kYXRhKCdicy4nICsgdGhpcy50eXBlLCB0aGlzKVxuXG4gICAgICB0aGlzLm9wdGlvbnMuY29udGFpbmVyID8gJHRpcC5hcHBlbmRUbygkKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy5jb250YWluZXIpKSA6ICR0aXAuaW5zZXJ0QWZ0ZXIodGhpcy4kZWxlbWVudClcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignaW5zZXJ0ZWQuYnMuJyArIHRoaXMudHlwZSlcblxuICAgICAgdmFyIHBvcyAgICAgICAgICA9IHRoaXMuZ2V0UG9zaXRpb24oKVxuICAgICAgdmFyIGFjdHVhbFdpZHRoICA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICAgIHZhciBhY3R1YWxIZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuXG4gICAgICBpZiAoYXV0b1BsYWNlKSB7XG4gICAgICAgIHZhciBvcmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRcbiAgICAgICAgdmFyIHZpZXdwb3J0RGltID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydClcblxuICAgICAgICBwbGFjZW1lbnQgPSBwbGFjZW1lbnQgPT0gJ2JvdHRvbScgJiYgcG9zLmJvdHRvbSArIGFjdHVhbEhlaWdodCA+IHZpZXdwb3J0RGltLmJvdHRvbSA/ICd0b3AnICAgIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICd0b3AnICAgICYmIHBvcy50b3AgICAgLSBhY3R1YWxIZWlnaHQgPCB2aWV3cG9ydERpbS50b3AgICAgPyAnYm90dG9tJyA6XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAncmlnaHQnICAmJiBwb3MucmlnaHQgICsgYWN0dWFsV2lkdGggID4gdmlld3BvcnREaW0ud2lkdGggID8gJ2xlZnQnICAgOlxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ2xlZnQnICAgJiYgcG9zLmxlZnQgICAtIGFjdHVhbFdpZHRoICA8IHZpZXdwb3J0RGltLmxlZnQgICA/ICdyaWdodCcgIDpcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50XG5cbiAgICAgICAgJHRpcFxuICAgICAgICAgIC5yZW1vdmVDbGFzcyhvcmdQbGFjZW1lbnQpXG4gICAgICAgICAgLmFkZENsYXNzKHBsYWNlbWVudClcbiAgICAgIH1cblxuICAgICAgdmFyIGNhbGN1bGF0ZWRPZmZzZXQgPSB0aGlzLmdldENhbGN1bGF0ZWRPZmZzZXQocGxhY2VtZW50LCBwb3MsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpXG5cbiAgICAgIHRoaXMuYXBwbHlQbGFjZW1lbnQoY2FsY3VsYXRlZE9mZnNldCwgcGxhY2VtZW50KVxuXG4gICAgICB2YXIgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwcmV2SG92ZXJTdGF0ZSA9IHRoYXQuaG92ZXJTdGF0ZVxuICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ3Nob3duLmJzLicgKyB0aGF0LnR5cGUpXG4gICAgICAgIHRoYXQuaG92ZXJTdGF0ZSA9IG51bGxcblxuICAgICAgICBpZiAocHJldkhvdmVyU3RhdGUgPT0gJ291dCcpIHRoYXQubGVhdmUodGhhdClcbiAgICAgIH1cblxuICAgICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kdGlwLmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgICAkdGlwXG4gICAgICAgICAgLm9uZSgnYnNUcmFuc2l0aW9uRW5kJywgY29tcGxldGUpXG4gICAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgICBjb21wbGV0ZSgpXG4gICAgfVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuYXBwbHlQbGFjZW1lbnQgPSBmdW5jdGlvbiAob2Zmc2V0LCBwbGFjZW1lbnQpIHtcbiAgICB2YXIgJHRpcCAgID0gdGhpcy50aXAoKVxuICAgIHZhciB3aWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgdmFyIGhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICAvLyBtYW51YWxseSByZWFkIG1hcmdpbnMgYmVjYXVzZSBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaW5jbHVkZXMgZGlmZmVyZW5jZVxuICAgIHZhciBtYXJnaW5Ub3AgPSBwYXJzZUludCgkdGlwLmNzcygnbWFyZ2luLXRvcCcpLCAxMClcbiAgICB2YXIgbWFyZ2luTGVmdCA9IHBhcnNlSW50KCR0aXAuY3NzKCdtYXJnaW4tbGVmdCcpLCAxMClcblxuICAgIC8vIHdlIG11c3QgY2hlY2sgZm9yIE5hTiBmb3IgaWUgOC85XG4gICAgaWYgKGlzTmFOKG1hcmdpblRvcCkpICBtYXJnaW5Ub3AgID0gMFxuICAgIGlmIChpc05hTihtYXJnaW5MZWZ0KSkgbWFyZ2luTGVmdCA9IDBcblxuICAgIG9mZnNldC50b3AgICs9IG1hcmdpblRvcFxuICAgIG9mZnNldC5sZWZ0ICs9IG1hcmdpbkxlZnRcblxuICAgIC8vICQuZm4ub2Zmc2V0IGRvZXNuJ3Qgcm91bmQgcGl4ZWwgdmFsdWVzXG4gICAgLy8gc28gd2UgdXNlIHNldE9mZnNldCBkaXJlY3RseSB3aXRoIG91ciBvd24gZnVuY3Rpb24gQi0wXG4gICAgJC5vZmZzZXQuc2V0T2Zmc2V0KCR0aXBbMF0sICQuZXh0ZW5kKHtcbiAgICAgIHVzaW5nOiBmdW5jdGlvbiAocHJvcHMpIHtcbiAgICAgICAgJHRpcC5jc3Moe1xuICAgICAgICAgIHRvcDogTWF0aC5yb3VuZChwcm9wcy50b3ApLFxuICAgICAgICAgIGxlZnQ6IE1hdGgucm91bmQocHJvcHMubGVmdClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LCBvZmZzZXQpLCAwKVxuXG4gICAgJHRpcC5hZGRDbGFzcygnaW4nKVxuXG4gICAgLy8gY2hlY2sgdG8gc2VlIGlmIHBsYWNpbmcgdGlwIGluIG5ldyBvZmZzZXQgY2F1c2VkIHRoZSB0aXAgdG8gcmVzaXplIGl0c2VsZlxuICAgIHZhciBhY3R1YWxXaWR0aCAgPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgdmFyIGFjdHVhbEhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICBpZiAocGxhY2VtZW50ID09ICd0b3AnICYmIGFjdHVhbEhlaWdodCAhPSBoZWlnaHQpIHtcbiAgICAgIG9mZnNldC50b3AgPSBvZmZzZXQudG9wICsgaGVpZ2h0IC0gYWN0dWFsSGVpZ2h0XG4gICAgfVxuXG4gICAgdmFyIGRlbHRhID0gdGhpcy5nZXRWaWV3cG9ydEFkanVzdGVkRGVsdGEocGxhY2VtZW50LCBvZmZzZXQsIGFjdHVhbFdpZHRoLCBhY3R1YWxIZWlnaHQpXG5cbiAgICBpZiAoZGVsdGEubGVmdCkgb2Zmc2V0LmxlZnQgKz0gZGVsdGEubGVmdFxuICAgIGVsc2Ugb2Zmc2V0LnRvcCArPSBkZWx0YS50b3BcblxuICAgIHZhciBpc1ZlcnRpY2FsICAgICAgICAgID0gL3RvcHxib3R0b20vLnRlc3QocGxhY2VtZW50KVxuICAgIHZhciBhcnJvd0RlbHRhICAgICAgICAgID0gaXNWZXJ0aWNhbCA/IGRlbHRhLmxlZnQgKiAyIC0gd2lkdGggKyBhY3R1YWxXaWR0aCA6IGRlbHRhLnRvcCAqIDIgLSBoZWlnaHQgKyBhY3R1YWxIZWlnaHRcbiAgICB2YXIgYXJyb3dPZmZzZXRQb3NpdGlvbiA9IGlzVmVydGljYWwgPyAnb2Zmc2V0V2lkdGgnIDogJ29mZnNldEhlaWdodCdcblxuICAgICR0aXAub2Zmc2V0KG9mZnNldClcbiAgICB0aGlzLnJlcGxhY2VBcnJvdyhhcnJvd0RlbHRhLCAkdGlwWzBdW2Fycm93T2Zmc2V0UG9zaXRpb25dLCBpc1ZlcnRpY2FsKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUucmVwbGFjZUFycm93ID0gZnVuY3Rpb24gKGRlbHRhLCBkaW1lbnNpb24sIGlzVmVydGljYWwpIHtcbiAgICB0aGlzLmFycm93KClcbiAgICAgIC5jc3MoaXNWZXJ0aWNhbCA/ICdsZWZ0JyA6ICd0b3AnLCA1MCAqICgxIC0gZGVsdGEgLyBkaW1lbnNpb24pICsgJyUnKVxuICAgICAgLmNzcyhpc1ZlcnRpY2FsID8gJ3RvcCcgOiAnbGVmdCcsICcnKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuc2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHRpcCAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHRpdGxlID0gdGhpcy5nZXRUaXRsZSgpXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmh0bWwpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICAgICAgdGl0bGUgPSBzYW5pdGl6ZUh0bWwodGl0bGUsIHRoaXMub3B0aW9ucy53aGl0ZUxpc3QsIHRoaXMub3B0aW9ucy5zYW5pdGl6ZUZuKVxuICAgICAgfVxuXG4gICAgICAkdGlwLmZpbmQoJy50b29sdGlwLWlubmVyJykuaHRtbCh0aXRsZSlcbiAgICB9IGVsc2Uge1xuICAgICAgJHRpcC5maW5kKCcudG9vbHRpcC1pbm5lcicpLnRleHQodGl0bGUpXG4gICAgfVxuXG4gICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSBpbiB0b3AgYm90dG9tIGxlZnQgcmlnaHQnKVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHZhciB0aGF0ID0gdGhpc1xuICAgIHZhciAkdGlwID0gJCh0aGlzLiR0aXApXG4gICAgdmFyIGUgICAgPSAkLkV2ZW50KCdoaWRlLmJzLicgKyB0aGlzLnR5cGUpXG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgIGlmICh0aGF0LmhvdmVyU3RhdGUgIT0gJ2luJykgJHRpcC5kZXRhY2goKVxuICAgICAgaWYgKHRoYXQuJGVsZW1lbnQpIHsgLy8gVE9ETzogQ2hlY2sgd2hldGhlciBndWFyZGluZyB0aGlzIGNvZGUgd2l0aCB0aGlzIGBpZmAgaXMgcmVhbGx5IG5lY2Vzc2FyeS5cbiAgICAgICAgdGhhdC4kZWxlbWVudFxuICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JylcbiAgICAgICAgICAudHJpZ2dlcignaGlkZGVuLmJzLicgKyB0aGF0LnR5cGUpXG4gICAgICB9XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAkdGlwLnJlbW92ZUNsYXNzKCdpbicpXG5cbiAgICAkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiAkdGlwLmhhc0NsYXNzKCdmYWRlJykgP1xuICAgICAgJHRpcFxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBjb21wbGV0ZSlcbiAgICAgICAgLmVtdWxhdGVUcmFuc2l0aW9uRW5kKFRvb2x0aXAuVFJBTlNJVElPTl9EVVJBVElPTikgOlxuICAgICAgY29tcGxldGUoKVxuXG4gICAgdGhpcy5ob3ZlclN0YXRlID0gbnVsbFxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmZpeFRpdGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICBpZiAoJGUuYXR0cigndGl0bGUnKSB8fCB0eXBlb2YgJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScpICE9ICdzdHJpbmcnKSB7XG4gICAgICAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJywgJGUuYXR0cigndGl0bGUnKSB8fCAnJykuYXR0cigndGl0bGUnLCAnJylcbiAgICB9XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5oYXNDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFRpdGxlKClcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFBvc2l0aW9uID0gZnVuY3Rpb24gKCRlbGVtZW50KSB7XG4gICAgJGVsZW1lbnQgICA9ICRlbGVtZW50IHx8IHRoaXMuJGVsZW1lbnRcblxuICAgIHZhciBlbCAgICAgPSAkZWxlbWVudFswXVxuICAgIHZhciBpc0JvZHkgPSBlbC50YWdOYW1lID09ICdCT0RZJ1xuXG4gICAgdmFyIGVsUmVjdCAgICA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgaWYgKGVsUmVjdC53aWR0aCA9PSBudWxsKSB7XG4gICAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSBtaXNzaW5nIGluIElFOCwgc28gY29tcHV0ZSB0aGVtIG1hbnVhbGx5OyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8xNDA5M1xuICAgICAgZWxSZWN0ID0gJC5leHRlbmQoe30sIGVsUmVjdCwgeyB3aWR0aDogZWxSZWN0LnJpZ2h0IC0gZWxSZWN0LmxlZnQsIGhlaWdodDogZWxSZWN0LmJvdHRvbSAtIGVsUmVjdC50b3AgfSlcbiAgICB9XG4gICAgdmFyIGlzU3ZnID0gd2luZG93LlNWR0VsZW1lbnQgJiYgZWwgaW5zdGFuY2VvZiB3aW5kb3cuU1ZHRWxlbWVudFxuICAgIC8vIEF2b2lkIHVzaW5nICQub2Zmc2V0KCkgb24gU1ZHcyBzaW5jZSBpdCBnaXZlcyBpbmNvcnJlY3QgcmVzdWx0cyBpbiBqUXVlcnkgMy5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8yMDI4MFxuICAgIHZhciBlbE9mZnNldCAgPSBpc0JvZHkgPyB7IHRvcDogMCwgbGVmdDogMCB9IDogKGlzU3ZnID8gbnVsbCA6ICRlbGVtZW50Lm9mZnNldCgpKVxuICAgIHZhciBzY3JvbGwgICAgPSB7IHNjcm9sbDogaXNCb2R5ID8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA6ICRlbGVtZW50LnNjcm9sbFRvcCgpIH1cbiAgICB2YXIgb3V0ZXJEaW1zID0gaXNCb2R5ID8geyB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpIH0gOiBudWxsXG5cbiAgICByZXR1cm4gJC5leHRlbmQoe30sIGVsUmVjdCwgc2Nyb2xsLCBvdXRlckRpbXMsIGVsT2Zmc2V0KVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0Q2FsY3VsYXRlZE9mZnNldCA9IGZ1bmN0aW9uIChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodCkge1xuICAgIHJldHVybiBwbGFjZW1lbnQgPT0gJ2JvdHRvbScgPyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQsICAgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyIH0gOlxuICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ3RvcCcgICAgPyB7IHRvcDogcG9zLnRvcCAtIGFjdHVhbEhlaWdodCwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyIH0gOlxuICAgICAgICAgICBwbGFjZW1lbnQgPT0gJ2xlZnQnICAgPyB7IHRvcDogcG9zLnRvcCArIHBvcy5oZWlnaHQgLyAyIC0gYWN0dWFsSGVpZ2h0IC8gMiwgbGVmdDogcG9zLmxlZnQgLSBhY3R1YWxXaWR0aCB9IDpcbiAgICAgICAgLyogcGxhY2VtZW50ID09ICdyaWdodCcgKi8geyB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRoIH1cblxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0Vmlld3BvcnRBZGp1c3RlZERlbHRhID0gZnVuY3Rpb24gKHBsYWNlbWVudCwgcG9zLCBhY3R1YWxXaWR0aCwgYWN0dWFsSGVpZ2h0KSB7XG4gICAgdmFyIGRlbHRhID0geyB0b3A6IDAsIGxlZnQ6IDAgfVxuICAgIGlmICghdGhpcy4kdmlld3BvcnQpIHJldHVybiBkZWx0YVxuXG4gICAgdmFyIHZpZXdwb3J0UGFkZGluZyA9IHRoaXMub3B0aW9ucy52aWV3cG9ydCAmJiB0aGlzLm9wdGlvbnMudmlld3BvcnQucGFkZGluZyB8fCAwXG4gICAgdmFyIHZpZXdwb3J0RGltZW5zaW9ucyA9IHRoaXMuZ2V0UG9zaXRpb24odGhpcy4kdmlld3BvcnQpXG5cbiAgICBpZiAoL3JpZ2h0fGxlZnQvLnRlc3QocGxhY2VtZW50KSkge1xuICAgICAgdmFyIHRvcEVkZ2VPZmZzZXQgICAgPSBwb3MudG9wIC0gdmlld3BvcnRQYWRkaW5nIC0gdmlld3BvcnREaW1lbnNpb25zLnNjcm9sbFxuICAgICAgdmFyIGJvdHRvbUVkZ2VPZmZzZXQgPSBwb3MudG9wICsgdmlld3BvcnRQYWRkaW5nIC0gdmlld3BvcnREaW1lbnNpb25zLnNjcm9sbCArIGFjdHVhbEhlaWdodFxuICAgICAgaWYgKHRvcEVkZ2VPZmZzZXQgPCB2aWV3cG9ydERpbWVuc2lvbnMudG9wKSB7IC8vIHRvcCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS50b3AgPSB2aWV3cG9ydERpbWVuc2lvbnMudG9wIC0gdG9wRWRnZU9mZnNldFxuICAgICAgfSBlbHNlIGlmIChib3R0b21FZGdlT2Zmc2V0ID4gdmlld3BvcnREaW1lbnNpb25zLnRvcCArIHZpZXdwb3J0RGltZW5zaW9ucy5oZWlnaHQpIHsgLy8gYm90dG9tIG92ZXJmbG93XG4gICAgICAgIGRlbHRhLnRvcCA9IHZpZXdwb3J0RGltZW5zaW9ucy50b3AgKyB2aWV3cG9ydERpbWVuc2lvbnMuaGVpZ2h0IC0gYm90dG9tRWRnZU9mZnNldFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbGVmdEVkZ2VPZmZzZXQgID0gcG9zLmxlZnQgLSB2aWV3cG9ydFBhZGRpbmdcbiAgICAgIHZhciByaWdodEVkZ2VPZmZzZXQgPSBwb3MubGVmdCArIHZpZXdwb3J0UGFkZGluZyArIGFjdHVhbFdpZHRoXG4gICAgICBpZiAobGVmdEVkZ2VPZmZzZXQgPCB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCkgeyAvLyBsZWZ0IG92ZXJmbG93XG4gICAgICAgIGRlbHRhLmxlZnQgPSB2aWV3cG9ydERpbWVuc2lvbnMubGVmdCAtIGxlZnRFZGdlT2Zmc2V0XG4gICAgICB9IGVsc2UgaWYgKHJpZ2h0RWRnZU9mZnNldCA+IHZpZXdwb3J0RGltZW5zaW9ucy5yaWdodCkgeyAvLyByaWdodCBvdmVyZmxvd1xuICAgICAgICBkZWx0YS5sZWZ0ID0gdmlld3BvcnREaW1lbnNpb25zLmxlZnQgKyB2aWV3cG9ydERpbWVuc2lvbnMud2lkdGggLSByaWdodEVkZ2VPZmZzZXRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVsdGFcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmdldFRpdGxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0aXRsZVxuICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICB2YXIgbyAgPSB0aGlzLm9wdGlvbnNcblxuICAgIHRpdGxlID0gJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScpXG4gICAgICB8fCAodHlwZW9mIG8udGl0bGUgPT0gJ2Z1bmN0aW9uJyA/IG8udGl0bGUuY2FsbCgkZVswXSkgOiAgby50aXRsZSlcblxuICAgIHJldHVybiB0aXRsZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZ2V0VUlEID0gZnVuY3Rpb24gKHByZWZpeCkge1xuICAgIGRvIHByZWZpeCArPSB+fihNYXRoLnJhbmRvbSgpICogMTAwMDAwMClcbiAgICB3aGlsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJlZml4KSlcbiAgICByZXR1cm4gcHJlZml4XG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50aXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLiR0aXApIHtcbiAgICAgIHRoaXMuJHRpcCA9ICQodGhpcy5vcHRpb25zLnRlbXBsYXRlKVxuICAgICAgaWYgKHRoaXMuJHRpcC5sZW5ndGggIT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy50eXBlICsgJyBgdGVtcGxhdGVgIG9wdGlvbiBtdXN0IGNvbnNpc3Qgb2YgZXhhY3RseSAxIHRvcC1sZXZlbCBlbGVtZW50IScpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLiR0aXBcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmFycm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAodGhpcy4kYXJyb3cgPSB0aGlzLiRhcnJvdyB8fCB0aGlzLnRpcCgpLmZpbmQoJy50b29sdGlwLWFycm93JykpXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZVxuICB9XG5cbiAgVG9vbHRpcC5wcm90b3R5cGUudG9nZ2xlRW5hYmxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSAhdGhpcy5lbmFibGVkXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGlmIChlKSB7XG4gICAgICBzZWxmID0gJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUpXG4gICAgICBpZiAoIXNlbGYpIHtcbiAgICAgICAgc2VsZiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGUuY3VycmVudFRhcmdldCwgdGhpcy5nZXREZWxlZ2F0ZU9wdGlvbnMoKSlcbiAgICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmRhdGEoJ2JzLicgKyB0aGlzLnR5cGUsIHNlbGYpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGUpIHtcbiAgICAgIHNlbGYuaW5TdGF0ZS5jbGljayA9ICFzZWxmLmluU3RhdGUuY2xpY2tcbiAgICAgIGlmIChzZWxmLmlzSW5TdGF0ZVRydWUoKSkgc2VsZi5lbnRlcihzZWxmKVxuICAgICAgZWxzZSBzZWxmLmxlYXZlKHNlbGYpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYudGlwKCkuaGFzQ2xhc3MoJ2luJykgPyBzZWxmLmxlYXZlKHNlbGYpIDogc2VsZi5lbnRlcihzZWxmKVxuICAgIH1cbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgICB0aGlzLmhpZGUoZnVuY3Rpb24gKCkge1xuICAgICAgdGhhdC4kZWxlbWVudC5vZmYoJy4nICsgdGhhdC50eXBlKS5yZW1vdmVEYXRhKCdicy4nICsgdGhhdC50eXBlKVxuICAgICAgaWYgKHRoYXQuJHRpcCkge1xuICAgICAgICB0aGF0LiR0aXAuZGV0YWNoKClcbiAgICAgIH1cbiAgICAgIHRoYXQuJHRpcCA9IG51bGxcbiAgICAgIHRoYXQuJGFycm93ID0gbnVsbFxuICAgICAgdGhhdC4kdmlld3BvcnQgPSBudWxsXG4gICAgICB0aGF0LiRlbGVtZW50ID0gbnVsbFxuICAgIH0pXG4gIH1cblxuICBUb29sdGlwLnByb3RvdHlwZS5zYW5pdGl6ZUh0bWwgPSBmdW5jdGlvbiAodW5zYWZlSHRtbCkge1xuICAgIHJldHVybiBzYW5pdGl6ZUh0bWwodW5zYWZlSHRtbCwgdGhpcy5vcHRpb25zLndoaXRlTGlzdCwgdGhpcy5vcHRpb25zLnNhbml0aXplRm4pXG4gIH1cblxuICAvLyBUT09MVElQIFBMVUdJTiBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBQbHVnaW4ob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgICA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhICAgID0gJHRoaXMuZGF0YSgnYnMudG9vbHRpcCcpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSAmJiAvZGVzdHJveXxoaWRlLy50ZXN0KG9wdGlvbikpIHJldHVyblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy50b29sdGlwJywgKGRhdGEgPSBuZXcgVG9vbHRpcCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4udG9vbHRpcFxuXG4gICQuZm4udG9vbHRpcCAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnRvb2x0aXAuQ29uc3RydWN0b3IgPSBUb29sdGlwXG5cblxuICAvLyBUT09MVElQIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT1cblxuICAkLmZuLnRvb2x0aXAubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnRvb2x0aXAgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbn0oalF1ZXJ5KTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBCb290c3RyYXA6IHBvcG92ZXIuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jcG9wb3ZlcnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBQT1BPVkVSIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICB2YXIgUG9wb3ZlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5pbml0KCdwb3BvdmVyJywgZWxlbWVudCwgb3B0aW9ucylcbiAgfVxuXG4gIGlmICghJC5mbi50b29sdGlwKSB0aHJvdyBuZXcgRXJyb3IoJ1BvcG92ZXIgcmVxdWlyZXMgdG9vbHRpcC5qcycpXG5cbiAgUG9wb3Zlci5WRVJTSU9OICA9ICczLjQuMSdcblxuICBQb3BvdmVyLkRFRkFVTFRTID0gJC5leHRlbmQoe30sICQuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5ERUZBVUxUUywge1xuICAgIHBsYWNlbWVudDogJ3JpZ2h0JyxcbiAgICB0cmlnZ2VyOiAnY2xpY2snLFxuICAgIGNvbnRlbnQ6ICcnLFxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PjxoMyBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2gzPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnRcIj48L2Rpdj48L2Rpdj4nXG4gIH0pXG5cblxuICAvLyBOT1RFOiBQT1BPVkVSIEVYVEVORFMgdG9vbHRpcC5qc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIFBvcG92ZXIucHJvdG90eXBlID0gJC5leHRlbmQoe30sICQuZm4udG9vbHRpcC5Db25zdHJ1Y3Rvci5wcm90b3R5cGUpXG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQb3BvdmVyXG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuZ2V0RGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFBvcG92ZXIuREVGQVVMVFNcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLnNldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aXAgICAgPSB0aGlzLnRpcCgpXG4gICAgdmFyIHRpdGxlICAgPSB0aGlzLmdldFRpdGxlKClcbiAgICB2YXIgY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmh0bWwpIHtcbiAgICAgIHZhciB0eXBlQ29udGVudCA9IHR5cGVvZiBjb250ZW50XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICAgICAgdGl0bGUgPSB0aGlzLnNhbml0aXplSHRtbCh0aXRsZSlcblxuICAgICAgICBpZiAodHlwZUNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29udGVudCA9IHRoaXMuc2FuaXRpemVIdG1sKGNvbnRlbnQpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJHRpcC5maW5kKCcucG9wb3Zlci10aXRsZScpLmh0bWwodGl0bGUpXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLWNvbnRlbnQnKS5jaGlsZHJlbigpLmRldGFjaCgpLmVuZCgpW1xuICAgICAgICB0eXBlQ29udGVudCA9PT0gJ3N0cmluZycgPyAnaHRtbCcgOiAnYXBwZW5kJ1xuICAgICAgXShjb250ZW50KVxuICAgIH0gZWxzZSB7XG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLXRpdGxlJykudGV4dCh0aXRsZSlcbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItY29udGVudCcpLmNoaWxkcmVuKCkuZGV0YWNoKCkuZW5kKCkudGV4dChjb250ZW50KVxuICAgIH1cblxuICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2ZhZGUgdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0IGluJylcblxuICAgIC8vIElFOCBkb2Vzbid0IGFjY2VwdCBoaWRpbmcgdmlhIHRoZSBgOmVtcHR5YCBwc2V1ZG8gc2VsZWN0b3IsIHdlIGhhdmUgdG8gZG9cbiAgICAvLyB0aGlzIG1hbnVhbGx5IGJ5IGNoZWNraW5nIHRoZSBjb250ZW50cy5cbiAgICBpZiAoISR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS5odG1sKCkpICR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKS5oaWRlKClcbiAgfVxuXG4gIFBvcG92ZXIucHJvdG90eXBlLmhhc0NvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGl0bGUoKSB8fCB0aGlzLmdldENvbnRlbnQoKVxuICB9XG5cbiAgUG9wb3Zlci5wcm90b3R5cGUuZ2V0Q29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGUgPSB0aGlzLiRlbGVtZW50XG4gICAgdmFyIG8gID0gdGhpcy5vcHRpb25zXG5cbiAgICByZXR1cm4gJGUuYXR0cignZGF0YS1jb250ZW50JylcbiAgICAgIHx8ICh0eXBlb2Ygby5jb250ZW50ID09ICdmdW5jdGlvbicgP1xuICAgICAgICBvLmNvbnRlbnQuY2FsbCgkZVswXSkgOlxuICAgICAgICBvLmNvbnRlbnQpXG4gIH1cblxuICBQb3BvdmVyLnByb3RvdHlwZS5hcnJvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKHRoaXMuJGFycm93ID0gdGhpcy4kYXJyb3cgfHwgdGhpcy50aXAoKS5maW5kKCcuYXJyb3cnKSlcbiAgfVxuXG5cbiAgLy8gUE9QT1ZFUiBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnBvcG92ZXInKVxuICAgICAgdmFyIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuXG4gICAgICBpZiAoIWRhdGEgJiYgL2Rlc3Ryb3l8aGlkZS8udGVzdChvcHRpb24pKSByZXR1cm5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMucG9wb3ZlcicsIChkYXRhID0gbmV3IFBvcG92ZXIodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnBvcG92ZXJcblxuICAkLmZuLnBvcG92ZXIgICAgICAgICAgICAgPSBQbHVnaW5cbiAgJC5mbi5wb3BvdmVyLkNvbnN0cnVjdG9yID0gUG9wb3ZlclxuXG5cbiAgLy8gUE9QT1ZFUiBOTyBDT05GTElDVFxuICAvLyA9PT09PT09PT09PT09PT09PT09XG5cbiAgJC5mbi5wb3BvdmVyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5wb3BvdmVyID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBzY3JvbGxzcHkuanMgdjMuNC4xXG4gKiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy8zLjQvamF2YXNjcmlwdC8jc2Nyb2xsc3B5XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDExLTIwMTkgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbitmdW5jdGlvbiAoJCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gU0NST0xMU1BZIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICBmdW5jdGlvbiBTY3JvbGxTcHkoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGJvZHkgICAgICAgICAgPSAkKGRvY3VtZW50LmJvZHkpXG4gICAgdGhpcy4kc2Nyb2xsRWxlbWVudCA9ICQoZWxlbWVudCkuaXMoZG9jdW1lbnQuYm9keSkgPyAkKHdpbmRvdykgOiAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zICAgICAgICA9ICQuZXh0ZW5kKHt9LCBTY3JvbGxTcHkuREVGQVVMVFMsIG9wdGlvbnMpXG4gICAgdGhpcy5zZWxlY3RvciAgICAgICA9ICh0aGlzLm9wdGlvbnMudGFyZ2V0IHx8ICcnKSArICcgLm5hdiBsaSA+IGEnXG4gICAgdGhpcy5vZmZzZXRzICAgICAgICA9IFtdXG4gICAgdGhpcy50YXJnZXRzICAgICAgICA9IFtdXG4gICAgdGhpcy5hY3RpdmVUYXJnZXQgICA9IG51bGxcbiAgICB0aGlzLnNjcm9sbEhlaWdodCAgID0gMFxuXG4gICAgdGhpcy4kc2Nyb2xsRWxlbWVudC5vbignc2Nyb2xsLmJzLnNjcm9sbHNweScsICQucHJveHkodGhpcy5wcm9jZXNzLCB0aGlzKSlcbiAgICB0aGlzLnJlZnJlc2goKVxuICAgIHRoaXMucHJvY2VzcygpXG4gIH1cblxuICBTY3JvbGxTcHkuVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgU2Nyb2xsU3B5LkRFRkFVTFRTID0ge1xuICAgIG9mZnNldDogMTBcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUuZ2V0U2Nyb2xsSGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLiRzY3JvbGxFbGVtZW50WzBdLnNjcm9sbEhlaWdodCB8fCBNYXRoLm1heCh0aGlzLiRib2R5WzBdLnNjcm9sbEhlaWdodCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodClcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGhhdCAgICAgICAgICA9IHRoaXNcbiAgICB2YXIgb2Zmc2V0TWV0aG9kICA9ICdvZmZzZXQnXG4gICAgdmFyIG9mZnNldEJhc2UgICAgPSAwXG5cbiAgICB0aGlzLm9mZnNldHMgICAgICA9IFtdXG4gICAgdGhpcy50YXJnZXRzICAgICAgPSBbXVxuICAgIHRoaXMuc2Nyb2xsSGVpZ2h0ID0gdGhpcy5nZXRTY3JvbGxIZWlnaHQoKVxuXG4gICAgaWYgKCEkLmlzV2luZG93KHRoaXMuJHNjcm9sbEVsZW1lbnRbMF0pKSB7XG4gICAgICBvZmZzZXRNZXRob2QgPSAncG9zaXRpb24nXG4gICAgICBvZmZzZXRCYXNlICAgPSB0aGlzLiRzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCgpXG4gICAgfVxuXG4gICAgdGhpcy4kYm9keVxuICAgICAgLmZpbmQodGhpcy5zZWxlY3RvcilcbiAgICAgIC5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJGVsICAgPSAkKHRoaXMpXG4gICAgICAgIHZhciBocmVmICA9ICRlbC5kYXRhKCd0YXJnZXQnKSB8fCAkZWwuYXR0cignaHJlZicpXG4gICAgICAgIHZhciAkaHJlZiA9IC9eIy4vLnRlc3QoaHJlZikgJiYgJChocmVmKVxuXG4gICAgICAgIHJldHVybiAoJGhyZWZcbiAgICAgICAgICAmJiAkaHJlZi5sZW5ndGhcbiAgICAgICAgICAmJiAkaHJlZi5pcygnOnZpc2libGUnKVxuICAgICAgICAgICYmIFtbJGhyZWZbb2Zmc2V0TWV0aG9kXSgpLnRvcCArIG9mZnNldEJhc2UsIGhyZWZdXSkgfHwgbnVsbFxuICAgICAgfSlcbiAgICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhWzBdIC0gYlswXSB9KVxuICAgICAgLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0Lm9mZnNldHMucHVzaCh0aGlzWzBdKVxuICAgICAgICB0aGF0LnRhcmdldHMucHVzaCh0aGlzWzFdKVxuICAgICAgfSlcbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2Nyb2xsVG9wICAgID0gdGhpcy4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKSArIHRoaXMub3B0aW9ucy5vZmZzZXRcbiAgICB2YXIgc2Nyb2xsSGVpZ2h0ID0gdGhpcy5nZXRTY3JvbGxIZWlnaHQoKVxuICAgIHZhciBtYXhTY3JvbGwgICAgPSB0aGlzLm9wdGlvbnMub2Zmc2V0ICsgc2Nyb2xsSGVpZ2h0IC0gdGhpcy4kc2Nyb2xsRWxlbWVudC5oZWlnaHQoKVxuICAgIHZhciBvZmZzZXRzICAgICAgPSB0aGlzLm9mZnNldHNcbiAgICB2YXIgdGFyZ2V0cyAgICAgID0gdGhpcy50YXJnZXRzXG4gICAgdmFyIGFjdGl2ZVRhcmdldCA9IHRoaXMuYWN0aXZlVGFyZ2V0XG4gICAgdmFyIGlcblxuICAgIGlmICh0aGlzLnNjcm9sbEhlaWdodCAhPSBzY3JvbGxIZWlnaHQpIHtcbiAgICAgIHRoaXMucmVmcmVzaCgpXG4gICAgfVxuXG4gICAgaWYgKHNjcm9sbFRvcCA+PSBtYXhTY3JvbGwpIHtcbiAgICAgIHJldHVybiBhY3RpdmVUYXJnZXQgIT0gKGkgPSB0YXJnZXRzW3RhcmdldHMubGVuZ3RoIC0gMV0pICYmIHRoaXMuYWN0aXZhdGUoaSlcbiAgICB9XG5cbiAgICBpZiAoYWN0aXZlVGFyZ2V0ICYmIHNjcm9sbFRvcCA8IG9mZnNldHNbMF0pIHtcbiAgICAgIHRoaXMuYWN0aXZlVGFyZ2V0ID0gbnVsbFxuICAgICAgcmV0dXJuIHRoaXMuY2xlYXIoKVxuICAgIH1cblxuICAgIGZvciAoaSA9IG9mZnNldHMubGVuZ3RoOyBpLS07KSB7XG4gICAgICBhY3RpdmVUYXJnZXQgIT0gdGFyZ2V0c1tpXVxuICAgICAgICAmJiBzY3JvbGxUb3AgPj0gb2Zmc2V0c1tpXVxuICAgICAgICAmJiAob2Zmc2V0c1tpICsgMV0gPT09IHVuZGVmaW5lZCB8fCBzY3JvbGxUb3AgPCBvZmZzZXRzW2kgKyAxXSlcbiAgICAgICAgJiYgdGhpcy5hY3RpdmF0ZSh0YXJnZXRzW2ldKVxuICAgIH1cbiAgfVxuXG4gIFNjcm9sbFNweS5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdGhpcy5hY3RpdmVUYXJnZXQgPSB0YXJnZXRcblxuICAgIHRoaXMuY2xlYXIoKVxuXG4gICAgdmFyIHNlbGVjdG9yID0gdGhpcy5zZWxlY3RvciArXG4gICAgICAnW2RhdGEtdGFyZ2V0PVwiJyArIHRhcmdldCArICdcIl0sJyArXG4gICAgICB0aGlzLnNlbGVjdG9yICsgJ1tocmVmPVwiJyArIHRhcmdldCArICdcIl0nXG5cbiAgICB2YXIgYWN0aXZlID0gJChzZWxlY3RvcilcbiAgICAgIC5wYXJlbnRzKCdsaScpXG4gICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG5cbiAgICBpZiAoYWN0aXZlLnBhcmVudCgnLmRyb3Bkb3duLW1lbnUnKS5sZW5ndGgpIHtcbiAgICAgIGFjdGl2ZSA9IGFjdGl2ZVxuICAgICAgICAuY2xvc2VzdCgnbGkuZHJvcGRvd24nKVxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICAgYWN0aXZlLnRyaWdnZXIoJ2FjdGl2YXRlLmJzLnNjcm9sbHNweScpXG4gIH1cblxuICBTY3JvbGxTcHkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICQodGhpcy5zZWxlY3RvcilcbiAgICAgIC5wYXJlbnRzVW50aWwodGhpcy5vcHRpb25zLnRhcmdldCwgJy5hY3RpdmUnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICB9XG5cblxuICAvLyBTQ1JPTExTUFkgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzICAgPSAkKHRoaXMpXG4gICAgICB2YXIgZGF0YSAgICA9ICR0aGlzLmRhdGEoJ2JzLnNjcm9sbHNweScpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuc2Nyb2xsc3B5JywgKGRhdGEgPSBuZXcgU2Nyb2xsU3B5KHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICB2YXIgb2xkID0gJC5mbi5zY3JvbGxzcHlcblxuICAkLmZuLnNjcm9sbHNweSAgICAgICAgICAgICA9IFBsdWdpblxuICAkLmZuLnNjcm9sbHNweS5Db25zdHJ1Y3RvciA9IFNjcm9sbFNweVxuXG5cbiAgLy8gU0NST0xMU1BZIE5PIENPTkZMSUNUXG4gIC8vID09PT09PT09PT09PT09PT09PT09PVxuXG4gICQuZm4uc2Nyb2xsc3B5Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5zY3JvbGxzcHkgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuICAvLyBTQ1JPTExTUFkgREFUQS1BUElcbiAgLy8gPT09PT09PT09PT09PT09PT09XG5cbiAgJCh3aW5kb3cpLm9uKCdsb2FkLmJzLnNjcm9sbHNweS5kYXRhLWFwaScsIGZ1bmN0aW9uICgpIHtcbiAgICAkKCdbZGF0YS1zcHk9XCJzY3JvbGxcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkc3B5ID0gJCh0aGlzKVxuICAgICAgUGx1Z2luLmNhbGwoJHNweSwgJHNweS5kYXRhKCkpXG4gICAgfSlcbiAgfSlcblxufShqUXVlcnkpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIEJvb3RzdHJhcDogdGFiLmpzIHYzLjQuMVxuICogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvMy40L2phdmFzY3JpcHQvI3RhYnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTEtMjAxOSBUd2l0dGVyLCBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuK2Z1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBUQUIgQ0xBU1MgREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBUYWIgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIC8vIGpzY3M6ZGlzYWJsZSByZXF1aXJlRG9sbGFyQmVmb3JlalF1ZXJ5QXNzaWdubWVudFxuICAgIHRoaXMuZWxlbWVudCA9ICQoZWxlbWVudClcbiAgICAvLyBqc2NzOmVuYWJsZSByZXF1aXJlRG9sbGFyQmVmb3JlalF1ZXJ5QXNzaWdubWVudFxuICB9XG5cbiAgVGFiLlZFUlNJT04gPSAnMy40LjEnXG5cbiAgVGFiLlRSQU5TSVRJT05fRFVSQVRJT04gPSAxNTBcblxuICBUYWIucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR0aGlzICAgID0gdGhpcy5lbGVtZW50XG4gICAgdmFyICR1bCAgICAgID0gJHRoaXMuY2xvc2VzdCgndWw6bm90KC5kcm9wZG93bi1tZW51KScpXG4gICAgdmFyIHNlbGVjdG9yID0gJHRoaXMuZGF0YSgndGFyZ2V0JylcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIHNlbGVjdG9yLnJlcGxhY2UoLy4qKD89I1teXFxzXSokKS8sICcnKSAvLyBzdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgaWYgKCR0aGlzLnBhcmVudCgnbGknKS5oYXNDbGFzcygnYWN0aXZlJykpIHJldHVyblxuXG4gICAgdmFyICRwcmV2aW91cyA9ICR1bC5maW5kKCcuYWN0aXZlOmxhc3QgYScpXG4gICAgdmFyIGhpZGVFdmVudCA9ICQuRXZlbnQoJ2hpZGUuYnMudGFiJywge1xuICAgICAgcmVsYXRlZFRhcmdldDogJHRoaXNbMF1cbiAgICB9KVxuICAgIHZhciBzaG93RXZlbnQgPSAkLkV2ZW50KCdzaG93LmJzLnRhYicsIHtcbiAgICAgIHJlbGF0ZWRUYXJnZXQ6ICRwcmV2aW91c1swXVxuICAgIH0pXG5cbiAgICAkcHJldmlvdXMudHJpZ2dlcihoaWRlRXZlbnQpXG4gICAgJHRoaXMudHJpZ2dlcihzaG93RXZlbnQpXG5cbiAgICBpZiAoc2hvd0V2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpIHx8IGhpZGVFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICB2YXIgJHRhcmdldCA9ICQoZG9jdW1lbnQpLmZpbmQoc2VsZWN0b3IpXG5cbiAgICB0aGlzLmFjdGl2YXRlKCR0aGlzLmNsb3Nlc3QoJ2xpJyksICR1bClcbiAgICB0aGlzLmFjdGl2YXRlKCR0YXJnZXQsICR0YXJnZXQucGFyZW50KCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICRwcmV2aW91cy50cmlnZ2VyKHtcbiAgICAgICAgdHlwZTogJ2hpZGRlbi5icy50YWInLFxuICAgICAgICByZWxhdGVkVGFyZ2V0OiAkdGhpc1swXVxuICAgICAgfSlcbiAgICAgICR0aGlzLnRyaWdnZXIoe1xuICAgICAgICB0eXBlOiAnc2hvd24uYnMudGFiJyxcbiAgICAgICAgcmVsYXRlZFRhcmdldDogJHByZXZpb3VzWzBdXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBUYWIucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lciwgY2FsbGJhY2spIHtcbiAgICB2YXIgJGFjdGl2ZSAgICA9IGNvbnRhaW5lci5maW5kKCc+IC5hY3RpdmUnKVxuICAgIHZhciB0cmFuc2l0aW9uID0gY2FsbGJhY2tcbiAgICAgICYmICQuc3VwcG9ydC50cmFuc2l0aW9uXG4gICAgICAmJiAoJGFjdGl2ZS5sZW5ndGggJiYgJGFjdGl2ZS5oYXNDbGFzcygnZmFkZScpIHx8ICEhY29udGFpbmVyLmZpbmQoJz4gLmZhZGUnKS5sZW5ndGgpXG5cbiAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgJGFjdGl2ZVxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIC5maW5kKCc+IC5kcm9wZG93bi1tZW51ID4gLmFjdGl2ZScpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmVuZCgpXG4gICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsIGZhbHNlKVxuXG4gICAgICBlbGVtZW50XG4gICAgICAgIC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgLmZpbmQoJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScpXG4gICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcblxuICAgICAgaWYgKHRyYW5zaXRpb24pIHtcbiAgICAgICAgZWxlbWVudFswXS5vZmZzZXRXaWR0aCAvLyByZWZsb3cgZm9yIHRyYW5zaXRpb25cbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnaW4nKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnZmFkZScpXG4gICAgICB9XG5cbiAgICAgIGlmIChlbGVtZW50LnBhcmVudCgnLmRyb3Bkb3duLW1lbnUnKS5sZW5ndGgpIHtcbiAgICAgICAgZWxlbWVudFxuICAgICAgICAgIC5jbG9zZXN0KCdsaS5kcm9wZG93bicpXG4gICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgIC5lbmQoKVxuICAgICAgICAgIC5maW5kKCdbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKVxuICAgICAgICAgIC5hdHRyKCdhcmlhLWV4cGFuZGVkJywgdHJ1ZSlcbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgIH1cblxuICAgICRhY3RpdmUubGVuZ3RoICYmIHRyYW5zaXRpb24gP1xuICAgICAgJGFjdGl2ZVxuICAgICAgICAub25lKCdic1RyYW5zaXRpb25FbmQnLCBuZXh0KVxuICAgICAgICAuZW11bGF0ZVRyYW5zaXRpb25FbmQoVGFiLlRSQU5TSVRJT05fRFVSQVRJT04pIDpcbiAgICAgIG5leHQoKVxuXG4gICAgJGFjdGl2ZS5yZW1vdmVDbGFzcygnaW4nKVxuICB9XG5cblxuICAvLyBUQUIgUExVR0lOIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09XG5cbiAgZnVuY3Rpb24gUGx1Z2luKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgID0gJHRoaXMuZGF0YSgnYnMudGFiJylcblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy50YWInLCAoZGF0YSA9IG5ldyBUYWIodGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBvbGQgPSAkLmZuLnRhYlxuXG4gICQuZm4udGFiICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4udGFiLkNvbnN0cnVjdG9yID0gVGFiXG5cblxuICAvLyBUQUIgTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09XG5cbiAgJC5mbi50YWIubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnRhYiA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIFRBQiBEQVRBLUFQSVxuICAvLyA9PT09PT09PT09PT1cblxuICB2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBQbHVnaW4uY2FsbCgkKHRoaXMpLCAnc2hvdycpXG4gIH1cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suYnMudGFiLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1cInRhYlwiXScsIGNsaWNrSGFuZGxlcilcbiAgICAub24oJ2NsaWNrLmJzLnRhYi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJwaWxsXCJdJywgY2xpY2tIYW5kbGVyKVxuXG59KGpRdWVyeSk7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQm9vdHN0cmFwOiBhZmZpeC5qcyB2My40LjFcbiAqIGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzMuNC9qYXZhc2NyaXB0LyNhZmZpeFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDE5IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4rZnVuY3Rpb24gKCQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEFGRklYIENMQVNTIERFRklOSVRJT05cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxuXG4gIHZhciBBZmZpeCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIEFmZml4LkRFRkFVTFRTLCBvcHRpb25zKVxuXG4gICAgdmFyIHRhcmdldCA9IHRoaXMub3B0aW9ucy50YXJnZXQgPT09IEFmZml4LkRFRkFVTFRTLnRhcmdldCA/ICQodGhpcy5vcHRpb25zLnRhcmdldCkgOiAkKGRvY3VtZW50KS5maW5kKHRoaXMub3B0aW9ucy50YXJnZXQpXG5cbiAgICB0aGlzLiR0YXJnZXQgPSB0YXJnZXRcbiAgICAgIC5vbignc2Nyb2xsLmJzLmFmZml4LmRhdGEtYXBpJywgJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sIHRoaXMpKVxuICAgICAgLm9uKCdjbGljay5icy5hZmZpeC5kYXRhLWFwaScsICAkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbldpdGhFdmVudExvb3AsIHRoaXMpKVxuXG4gICAgdGhpcy4kZWxlbWVudCAgICAgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5hZmZpeGVkICAgICAgPSBudWxsXG4gICAgdGhpcy51bnBpbiAgICAgICAgPSBudWxsXG4gICAgdGhpcy5waW5uZWRPZmZzZXQgPSBudWxsXG5cbiAgICB0aGlzLmNoZWNrUG9zaXRpb24oKVxuICB9XG5cbiAgQWZmaXguVkVSU0lPTiAgPSAnMy40LjEnXG5cbiAgQWZmaXguUkVTRVQgICAgPSAnYWZmaXggYWZmaXgtdG9wIGFmZml4LWJvdHRvbSdcblxuICBBZmZpeC5ERUZBVUxUUyA9IHtcbiAgICBvZmZzZXQ6IDAsXG4gICAgdGFyZ2V0OiB3aW5kb3dcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uIChzY3JvbGxIZWlnaHQsIGhlaWdodCwgb2Zmc2V0VG9wLCBvZmZzZXRCb3R0b20pIHtcbiAgICB2YXIgc2Nyb2xsVG9wICAgID0gdGhpcy4kdGFyZ2V0LnNjcm9sbFRvcCgpXG4gICAgdmFyIHBvc2l0aW9uICAgICA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KClcbiAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gdGhpcy4kdGFyZ2V0LmhlaWdodCgpXG5cbiAgICBpZiAob2Zmc2V0VG9wICE9IG51bGwgJiYgdGhpcy5hZmZpeGVkID09ICd0b3AnKSByZXR1cm4gc2Nyb2xsVG9wIDwgb2Zmc2V0VG9wID8gJ3RvcCcgOiBmYWxzZVxuXG4gICAgaWYgKHRoaXMuYWZmaXhlZCA9PSAnYm90dG9tJykge1xuICAgICAgaWYgKG9mZnNldFRvcCAhPSBudWxsKSByZXR1cm4gKHNjcm9sbFRvcCArIHRoaXMudW5waW4gPD0gcG9zaXRpb24udG9wKSA/IGZhbHNlIDogJ2JvdHRvbSdcbiAgICAgIHJldHVybiAoc2Nyb2xsVG9wICsgdGFyZ2V0SGVpZ2h0IDw9IHNjcm9sbEhlaWdodCAtIG9mZnNldEJvdHRvbSkgPyBmYWxzZSA6ICdib3R0b20nXG4gICAgfVxuXG4gICAgdmFyIGluaXRpYWxpemluZyAgID0gdGhpcy5hZmZpeGVkID09IG51bGxcbiAgICB2YXIgY29sbGlkZXJUb3AgICAgPSBpbml0aWFsaXppbmcgPyBzY3JvbGxUb3AgOiBwb3NpdGlvbi50b3BcbiAgICB2YXIgY29sbGlkZXJIZWlnaHQgPSBpbml0aWFsaXppbmcgPyB0YXJnZXRIZWlnaHQgOiBoZWlnaHRcblxuICAgIGlmIChvZmZzZXRUb3AgIT0gbnVsbCAmJiBzY3JvbGxUb3AgPD0gb2Zmc2V0VG9wKSByZXR1cm4gJ3RvcCdcbiAgICBpZiAob2Zmc2V0Qm90dG9tICE9IG51bGwgJiYgKGNvbGxpZGVyVG9wICsgY29sbGlkZXJIZWlnaHQgPj0gc2Nyb2xsSGVpZ2h0IC0gb2Zmc2V0Qm90dG9tKSkgcmV0dXJuICdib3R0b20nXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIEFmZml4LnByb3RvdHlwZS5nZXRQaW5uZWRPZmZzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucGlubmVkT2Zmc2V0KSByZXR1cm4gdGhpcy5waW5uZWRPZmZzZXRcbiAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKEFmZml4LlJFU0VUKS5hZGRDbGFzcygnYWZmaXgnKVxuICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLiR0YXJnZXQuc2Nyb2xsVG9wKClcbiAgICB2YXIgcG9zaXRpb24gID0gdGhpcy4kZWxlbWVudC5vZmZzZXQoKVxuICAgIHJldHVybiAodGhpcy5waW5uZWRPZmZzZXQgPSBwb3NpdGlvbi50b3AgLSBzY3JvbGxUb3ApXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbldpdGhFdmVudExvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2V0VGltZW91dCgkLnByb3h5KHRoaXMuY2hlY2tQb3NpdGlvbiwgdGhpcyksIDEpXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuJGVsZW1lbnQuaXMoJzp2aXNpYmxlJykpIHJldHVyblxuXG4gICAgdmFyIGhlaWdodCAgICAgICA9IHRoaXMuJGVsZW1lbnQuaGVpZ2h0KClcbiAgICB2YXIgb2Zmc2V0ICAgICAgID0gdGhpcy5vcHRpb25zLm9mZnNldFxuICAgIHZhciBvZmZzZXRUb3AgICAgPSBvZmZzZXQudG9wXG4gICAgdmFyIG9mZnNldEJvdHRvbSA9IG9mZnNldC5ib3R0b21cbiAgICB2YXIgc2Nyb2xsSGVpZ2h0ID0gTWF0aC5tYXgoJChkb2N1bWVudCkuaGVpZ2h0KCksICQoZG9jdW1lbnQuYm9keSkuaGVpZ2h0KCkpXG5cbiAgICBpZiAodHlwZW9mIG9mZnNldCAhPSAnb2JqZWN0JykgICAgICAgICBvZmZzZXRCb3R0b20gPSBvZmZzZXRUb3AgPSBvZmZzZXRcbiAgICBpZiAodHlwZW9mIG9mZnNldFRvcCA9PSAnZnVuY3Rpb24nKSAgICBvZmZzZXRUb3AgICAgPSBvZmZzZXQudG9wKHRoaXMuJGVsZW1lbnQpXG4gICAgaWYgKHR5cGVvZiBvZmZzZXRCb3R0b20gPT0gJ2Z1bmN0aW9uJykgb2Zmc2V0Qm90dG9tID0gb2Zmc2V0LmJvdHRvbSh0aGlzLiRlbGVtZW50KVxuXG4gICAgdmFyIGFmZml4ID0gdGhpcy5nZXRTdGF0ZShzY3JvbGxIZWlnaHQsIGhlaWdodCwgb2Zmc2V0VG9wLCBvZmZzZXRCb3R0b20pXG5cbiAgICBpZiAodGhpcy5hZmZpeGVkICE9IGFmZml4KSB7XG4gICAgICBpZiAodGhpcy51bnBpbiAhPSBudWxsKSB0aGlzLiRlbGVtZW50LmNzcygndG9wJywgJycpXG5cbiAgICAgIHZhciBhZmZpeFR5cGUgPSAnYWZmaXgnICsgKGFmZml4ID8gJy0nICsgYWZmaXggOiAnJylcbiAgICAgIHZhciBlICAgICAgICAgPSAkLkV2ZW50KGFmZml4VHlwZSArICcuYnMuYWZmaXgnKVxuXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoZSlcblxuICAgICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICB0aGlzLmFmZml4ZWQgPSBhZmZpeFxuICAgICAgdGhpcy51bnBpbiA9IGFmZml4ID09ICdib3R0b20nID8gdGhpcy5nZXRQaW5uZWRPZmZzZXQoKSA6IG51bGxcblxuICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAucmVtb3ZlQ2xhc3MoQWZmaXguUkVTRVQpXG4gICAgICAgIC5hZGRDbGFzcyhhZmZpeFR5cGUpXG4gICAgICAgIC50cmlnZ2VyKGFmZml4VHlwZS5yZXBsYWNlKCdhZmZpeCcsICdhZmZpeGVkJykgKyAnLmJzLmFmZml4JylcbiAgICB9XG5cbiAgICBpZiAoYWZmaXggPT0gJ2JvdHRvbScpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnQub2Zmc2V0KHtcbiAgICAgICAgdG9wOiBzY3JvbGxIZWlnaHQgLSBoZWlnaHQgLSBvZmZzZXRCb3R0b21cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cblxuICAvLyBBRkZJWCBQTFVHSU4gREVGSU5JVElPTlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyAgID0gJCh0aGlzKVxuICAgICAgdmFyIGRhdGEgICAgPSAkdGhpcy5kYXRhKCdicy5hZmZpeCcpXG4gICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG5cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnMuYWZmaXgnLCAoZGF0YSA9IG5ldyBBZmZpeCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG9sZCA9ICQuZm4uYWZmaXhcblxuICAkLmZuLmFmZml4ICAgICAgICAgICAgID0gUGx1Z2luXG4gICQuZm4uYWZmaXguQ29uc3RydWN0b3IgPSBBZmZpeFxuXG5cbiAgLy8gQUZGSVggTk8gQ09ORkxJQ1RcbiAgLy8gPT09PT09PT09PT09PT09PT1cblxuICAkLmZuLmFmZml4Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5hZmZpeCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gIC8vIEFGRklYIERBVEEtQVBJXG4gIC8vID09PT09PT09PT09PT09XG5cbiAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICQoJ1tkYXRhLXNweT1cImFmZml4XCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHNweSA9ICQodGhpcylcbiAgICAgIHZhciBkYXRhID0gJHNweS5kYXRhKClcblxuICAgICAgZGF0YS5vZmZzZXQgPSBkYXRhLm9mZnNldCB8fCB7fVxuXG4gICAgICBpZiAoZGF0YS5vZmZzZXRCb3R0b20gIT0gbnVsbCkgZGF0YS5vZmZzZXQuYm90dG9tID0gZGF0YS5vZmZzZXRCb3R0b21cbiAgICAgIGlmIChkYXRhLm9mZnNldFRvcCAgICAhPSBudWxsKSBkYXRhLm9mZnNldC50b3AgICAgPSBkYXRhLm9mZnNldFRvcFxuXG4gICAgICBQbHVnaW4uY2FsbCgkc3B5LCBkYXRhKVxuICAgIH0pXG4gIH0pXG5cbn0oalF1ZXJ5KTtcbiIsIi8vIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gfCBGbGV4eSBoZWFkZXJcbi8vIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gfFxuLy8gfCBUaGlzIGpRdWVyeSBzY3JpcHQgaXMgd3JpdHRlbiBieVxuLy8gfFxuLy8gfCBNb3J0ZW4gTmlzc2VuXG4vLyB8IGhqZW1tZXNpZGVrb25nZW4uZGtcbi8vIHxcblxudmFyIGZsZXh5X2hlYWRlciA9IChmdW5jdGlvbiAoJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBwdWIgPSB7fSxcbiAgICAgICAgJGhlYWRlcl9zdGF0aWMgPSAkKCcuZmxleHktaGVhZGVyLS1zdGF0aWMnKSxcbiAgICAgICAgJGhlYWRlcl9zdGlja3kgPSAkKCcuZmxleHktaGVhZGVyLS1zdGlja3knKSxcbiAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHVwZGF0ZV9pbnRlcnZhbDogMTAwLFxuICAgICAgICAgICAgdG9sZXJhbmNlOiB7XG4gICAgICAgICAgICAgICAgdXB3YXJkOiAyMCxcbiAgICAgICAgICAgICAgICBkb3dud2FyZDogMTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvZmZzZXQ6IF9nZXRfb2Zmc2V0X2Zyb21fZWxlbWVudHNfYm90dG9tKCRoZWFkZXJfc3RhdGljKSxcbiAgICAgICAgICAgIGNsYXNzZXM6IHtcbiAgICAgICAgICAgICAgICBwaW5uZWQ6IFwiZmxleHktaGVhZGVyLS1waW5uZWRcIixcbiAgICAgICAgICAgICAgICB1bnBpbm5lZDogXCJmbGV4eS1oZWFkZXItLXVucGlubmVkXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgd2FzX3Njcm9sbGVkID0gZmFsc2UsXG4gICAgICAgIGxhc3RfZGlzdGFuY2VfZnJvbV90b3AgPSAwO1xuXG4gICAgLyoqXG4gICAgICogSW5zdGFudGlhdGVcbiAgICAgKi9cbiAgICBwdWIuaW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHJlZ2lzdGVyRXZlbnRIYW5kbGVycygpO1xuICAgICAgICByZWdpc3RlckJvb3RFdmVudEhhbmRsZXJzKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGJvb3QgZXZlbnQgaGFuZGxlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWdpc3RlckJvb3RFdmVudEhhbmRsZXJzKCkge1xuICAgICAgICAkaGVhZGVyX3N0aWNreS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzZXMudW5waW5uZWQpO1xuXG4gICAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICBpZiAod2FzX3Njcm9sbGVkKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnRfd2FzX3Njcm9sbGVkKCk7XG5cbiAgICAgICAgICAgICAgICB3YXNfc2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgb3B0aW9ucy51cGRhdGVfaW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVyIGV2ZW50IGhhbmRsZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJFdmVudEhhbmRsZXJzKCkge1xuICAgICAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB3YXNfc2Nyb2xsZWQgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgb2Zmc2V0IGZyb20gZWxlbWVudCBib3R0b21cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZ2V0X29mZnNldF9mcm9tX2VsZW1lbnRzX2JvdHRvbSgkZWxlbWVudCkge1xuICAgICAgICB2YXIgZWxlbWVudF9oZWlnaHQgPSAkZWxlbWVudC5vdXRlckhlaWdodCh0cnVlKSxcbiAgICAgICAgICAgIGVsZW1lbnRfb2Zmc2V0ID0gJGVsZW1lbnQub2Zmc2V0KCkudG9wO1xuXG4gICAgICAgIHJldHVybiAoZWxlbWVudF9oZWlnaHQgKyBlbGVtZW50X29mZnNldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG9jdW1lbnQgd2FzIHNjcm9sbGVkXG4gICAgICovXG4gICAgZnVuY3Rpb24gZG9jdW1lbnRfd2FzX3Njcm9sbGVkKCkge1xuICAgICAgICB2YXIgY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgICAgICAvLyBJZiBwYXN0IG9mZnNldFxuICAgICAgICBpZiAoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCA+PSBvcHRpb25zLm9mZnNldCkge1xuXG4gICAgICAgICAgICAvLyBEb3dud2FyZHMgc2Nyb2xsXG4gICAgICAgICAgICBpZiAoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCA+IGxhc3RfZGlzdGFuY2VfZnJvbV90b3ApIHtcblxuICAgICAgICAgICAgICAgIC8vIE9iZXkgdGhlIGRvd253YXJkIHRvbGVyYW5jZVxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wIC0gbGFzdF9kaXN0YW5jZV9mcm9tX3RvcCkgPD0gb3B0aW9ucy50b2xlcmFuY2UuZG93bndhcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRoZWFkZXJfc3RpY2t5LnJlbW92ZUNsYXNzKG9wdGlvbnMuY2xhc3Nlcy5waW5uZWQpLmFkZENsYXNzKG9wdGlvbnMuY2xhc3Nlcy51bnBpbm5lZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFVwd2FyZHMgc2Nyb2xsXG4gICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vIE9iZXkgdGhlIHVwd2FyZCB0b2xlcmFuY2VcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoY3VycmVudF9kaXN0YW5jZV9mcm9tX3RvcCAtIGxhc3RfZGlzdGFuY2VfZnJvbV90b3ApIDw9IG9wdGlvbnMudG9sZXJhbmNlLnVwd2FyZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gV2UgYXJlIG5vdCBzY3JvbGxlZCBwYXN0IHRoZSBkb2N1bWVudCB3aGljaCBpcyBwb3NzaWJsZSBvbiB0aGUgTWFjXG4gICAgICAgICAgICAgICAgaWYgKChjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wICsgJCh3aW5kb3cpLmhlaWdodCgpKSA8ICQoZG9jdW1lbnQpLmhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICRoZWFkZXJfc3RpY2t5LnJlbW92ZUNsYXNzKG9wdGlvbnMuY2xhc3Nlcy51bnBpbm5lZCkuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnBpbm5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm90IHBhc3Qgb2Zmc2V0XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJGhlYWRlcl9zdGlja3kucmVtb3ZlQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnBpbm5lZCkuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc2VzLnVucGlubmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxhc3RfZGlzdGFuY2VfZnJvbV90b3AgPSBjdXJyZW50X2Rpc3RhbmNlX2Zyb21fdG9wO1xuICAgIH1cblxuICAgIHJldHVybiBwdWI7XG59KShqUXVlcnkpO1xuIiwiLy8gfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyB8IEZsZXh5IG5hdmlnYXRpb25cbi8vIHwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gfFxuLy8gfCBUaGlzIGpRdWVyeSBzY3JpcHQgaXMgd3JpdHRlbiBieVxuLy8gfFxuLy8gfCBNb3J0ZW4gTmlzc2VuXG4vLyB8IGhqZW1tZXNpZGVrb25nZW4uZGtcbi8vIHxcblxudmFyIGZsZXh5X25hdmlnYXRpb24gPSAoZnVuY3Rpb24gKCQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgcHViID0ge30sXG4gICAgICAgIGxheW91dF9jbGFzc2VzID0ge1xuICAgICAgICAgICAgJ25hdmlnYXRpb24nOiAnLmZsZXh5LW5hdmlnYXRpb24nLFxuICAgICAgICAgICAgJ29iZnVzY2F0b3InOiAnLmZsZXh5LW5hdmlnYXRpb25fX29iZnVzY2F0b3InLFxuICAgICAgICAgICAgJ2Ryb3Bkb3duJzogJy5mbGV4eS1uYXZpZ2F0aW9uX19pdGVtLS1kcm9wZG93bicsXG4gICAgICAgICAgICAnZHJvcGRvd25fbWVnYW1lbnUnOiAnLmZsZXh5LW5hdmlnYXRpb25fX2l0ZW1fX2Ryb3Bkb3duLW1lZ2FtZW51JyxcblxuICAgICAgICAgICAgJ2lzX3VwZ3JhZGVkJzogJ2lzLXVwZ3JhZGVkJyxcbiAgICAgICAgICAgICduYXZpZ2F0aW9uX2hhc19tZWdhbWVudSc6ICdoYXMtbWVnYW1lbnUnLFxuICAgICAgICAgICAgJ2Ryb3Bkb3duX2hhc19tZWdhbWVudSc6ICdmbGV4eS1uYXZpZ2F0aW9uX19pdGVtLS1kcm9wZG93bi13aXRoLW1lZ2FtZW51JyxcbiAgICAgICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluc3RhbnRpYXRlXG4gICAgICovXG4gICAgcHViLmluaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICByZWdpc3RlckV2ZW50SGFuZGxlcnMoKTtcbiAgICAgICAgcmVnaXN0ZXJCb290RXZlbnRIYW5kbGVycygpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBib290IGV2ZW50IGhhbmRsZXJzXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJCb290RXZlbnRIYW5kbGVycygpIHtcblxuICAgICAgICAvLyBVcGdyYWRlXG4gICAgICAgIHVwZ3JhZGUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlciBldmVudCBoYW5kbGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyRXZlbnRIYW5kbGVycygpIHt9XG5cbiAgICAvKipcbiAgICAgKiBVcGdyYWRlIGVsZW1lbnRzLlxuICAgICAqIEFkZCBjbGFzc2VzIHRvIGVsZW1lbnRzLCBiYXNlZCB1cG9uIGF0dGFjaGVkIGNsYXNzZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXBncmFkZSgpIHtcbiAgICAgICAgdmFyICRuYXZpZ2F0aW9ucyA9ICQobGF5b3V0X2NsYXNzZXMubmF2aWdhdGlvbik7XG5cbiAgICAgICAgLy8gTmF2aWdhdGlvbnNcbiAgICAgICAgaWYgKCRuYXZpZ2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkbmF2aWdhdGlvbnMuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHZhciAkbmF2aWdhdGlvbiA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICRtZWdhbWVudXMgPSAkbmF2aWdhdGlvbi5maW5kKGxheW91dF9jbGFzc2VzLmRyb3Bkb3duX21lZ2FtZW51KSxcbiAgICAgICAgICAgICAgICAgICAgJGRyb3Bkb3duX21lZ2FtZW51ID0gJG5hdmlnYXRpb24uZmluZChsYXlvdXRfY2xhc3Nlcy5kcm9wZG93bl9oYXNfbWVnYW1lbnUpO1xuXG4gICAgICAgICAgICAgICAgLy8gSGFzIGFscmVhZHkgYmVlbiB1cGdyYWRlZFxuICAgICAgICAgICAgICAgIGlmICgkbmF2aWdhdGlvbi5oYXNDbGFzcyhsYXlvdXRfY2xhc3Nlcy5pc191cGdyYWRlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEhhcyBtZWdhbWVudVxuICAgICAgICAgICAgICAgIGlmICgkbWVnYW1lbnVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJG5hdmlnYXRpb24uYWRkQ2xhc3MobGF5b3V0X2NsYXNzZXMubmF2aWdhdGlvbl9oYXNfbWVnYW1lbnUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biB0aHJvdWdoIGFsbCBtZWdhbWVudXNcbiAgICAgICAgICAgICAgICAgICAgJG1lZ2FtZW51cy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJG1lZ2FtZW51ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNfb2JmdXNjYXRvciA9ICQoJ2h0bWwnKS5oYXNDbGFzcygnaGFzLW9iZnVzY2F0b3InKSA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJG1lZ2FtZW51LnBhcmVudHMobGF5b3V0X2NsYXNzZXMuZHJvcGRvd24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKGxheW91dF9jbGFzc2VzLmRyb3Bkb3duX2hhc19tZWdhbWVudSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaG92ZXIoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc19vYmZ1c2NhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmZ1c2NhdG9yLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc19vYmZ1c2NhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmZ1c2NhdG9yLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJcyB1cGdyYWRlZFxuICAgICAgICAgICAgICAgICRuYXZpZ2F0aW9uLmFkZENsYXNzKGxheW91dF9jbGFzc2VzLmlzX3VwZ3JhZGVkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHB1Yjtcbn0pKGpRdWVyeSk7XG4iLCIvKiEgc2lkciAtIHYyLjIuMSAtIDIwMTYtMDItMTdcbiAqIGh0dHA6Ly93d3cuYmVycmlhcnQuY29tL3NpZHIvXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBBbGJlcnRvIFZhcmVsYTsgTGljZW5zZWQgTUlUICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgYmFiZWxIZWxwZXJzID0ge307XG5cbiAgYmFiZWxIZWxwZXJzLmNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgfTtcblxuICBiYWJlbEhlbHBlcnMuY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9O1xuICB9KCk7XG5cbiAgYmFiZWxIZWxwZXJzO1xuXG4gIHZhciBzaWRyU3RhdHVzID0ge1xuICAgIG1vdmluZzogZmFsc2UsXG4gICAgb3BlbmVkOiBmYWxzZVxuICB9O1xuXG4gIHZhciBoZWxwZXIgPSB7XG4gICAgLy8gQ2hlY2sgZm9yIHZhbGlkcyB1cmxzXG4gICAgLy8gRnJvbSA6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTcxNzA5My9jaGVjay1pZi1hLWphdmFzY3JpcHQtc3RyaW5nLWlzLWFuLXVybFxuXG4gICAgaXNVcmw6IGZ1bmN0aW9uIGlzVXJsKHN0cikge1xuICAgICAgdmFyIHBhdHRlcm4gPSBuZXcgUmVnRXhwKCdeKGh0dHBzPzpcXFxcL1xcXFwvKT8nICsgLy8gcHJvdG9jb2xcbiAgICAgICcoKChbYS16XFxcXGRdKFthLXpcXFxcZC1dKlthLXpcXFxcZF0pKilcXFxcLj8pK1thLXpdezIsfXwnICsgLy8gZG9tYWluIG5hbWVcbiAgICAgICcoKFxcXFxkezEsM31cXFxcLil7M31cXFxcZHsxLDN9KSknICsgLy8gT1IgaXAgKHY0KSBhZGRyZXNzXG4gICAgICAnKFxcXFw6XFxcXGQrKT8oXFxcXC9bLWEtelxcXFxkJV8ufitdKikqJyArIC8vIHBvcnQgYW5kIHBhdGhcbiAgICAgICcoXFxcXD9bOyZhLXpcXFxcZCVfLn4rPS1dKik/JyArIC8vIHF1ZXJ5IHN0cmluZ1xuICAgICAgJyhcXFxcI1stYS16XFxcXGRfXSopPyQnLCAnaScpOyAvLyBmcmFnbWVudCBsb2NhdG9yXG5cbiAgICAgIGlmIChwYXR0ZXJuLnRlc3Qoc3RyKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9LFxuXG5cbiAgICAvLyBBZGQgc2lkciBwcmVmaXhlc1xuICAgIGFkZFByZWZpeGVzOiBmdW5jdGlvbiBhZGRQcmVmaXhlcygkZWxlbWVudCkge1xuICAgICAgdGhpcy5hZGRQcmVmaXgoJGVsZW1lbnQsICdpZCcpO1xuICAgICAgdGhpcy5hZGRQcmVmaXgoJGVsZW1lbnQsICdjbGFzcycpO1xuICAgICAgJGVsZW1lbnQucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgICB9LFxuICAgIGFkZFByZWZpeDogZnVuY3Rpb24gYWRkUHJlZml4KCRlbGVtZW50LCBhdHRyaWJ1dGUpIHtcbiAgICAgIHZhciB0b1JlcGxhY2UgPSAkZWxlbWVudC5hdHRyKGF0dHJpYnV0ZSk7XG5cbiAgICAgIGlmICh0eXBlb2YgdG9SZXBsYWNlID09PSAnc3RyaW5nJyAmJiB0b1JlcGxhY2UgIT09ICcnICYmIHRvUmVwbGFjZSAhPT0gJ3NpZHItaW5uZXInKSB7XG4gICAgICAgICRlbGVtZW50LmF0dHIoYXR0cmlidXRlLCB0b1JlcGxhY2UucmVwbGFjZSgvKFtBLVphLXowLTlfLlxcLV0rKS9nLCAnc2lkci0nICsgYXR0cmlidXRlICsgJy0kMScpKTtcbiAgICAgIH1cbiAgICB9LFxuXG5cbiAgICAvLyBDaGVjayBpZiB0cmFuc2l0aW9ucyBpcyBzdXBwb3J0ZWRcbiAgICB0cmFuc2l0aW9uczogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgICBzdHlsZSA9IGJvZHkuc3R5bGUsXG4gICAgICAgICAgc3VwcG9ydGVkID0gZmFsc2UsXG4gICAgICAgICAgcHJvcGVydHkgPSAndHJhbnNpdGlvbic7XG5cbiAgICAgIGlmIChwcm9wZXJ0eSBpbiBzdHlsZSkge1xuICAgICAgICBzdXBwb3J0ZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgcHJlZml4ZXMgPSBbJ21veicsICd3ZWJraXQnLCAnbycsICdtcyddLFxuICAgICAgICAgICAgICBwcmVmaXggPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIGkgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBwcm9wZXJ0eSA9IHByb3BlcnR5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc3Vic3RyKDEpO1xuICAgICAgICAgIHN1cHBvcnRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBwcmVmaXggPSBwcmVmaXhlc1tpXTtcbiAgICAgICAgICAgICAgaWYgKHByZWZpeCArIHByb3BlcnR5IGluIHN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0oKTtcbiAgICAgICAgICBwcm9wZXJ0eSA9IHN1cHBvcnRlZCA/ICctJyArIHByZWZpeC50b0xvd2VyQ2FzZSgpICsgJy0nICsgcHJvcGVydHkudG9Mb3dlckNhc2UoKSA6IG51bGw7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1cHBvcnRlZDogc3VwcG9ydGVkLFxuICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHlcbiAgICAgIH07XG4gICAgfSgpXG4gIH07XG5cbiAgdmFyICQkMiA9IGpRdWVyeTtcblxuICB2YXIgYm9keUFuaW1hdGlvbkNsYXNzID0gJ3NpZHItYW5pbWF0aW5nJztcbiAgdmFyIG9wZW5BY3Rpb24gPSAnb3Blbic7XG4gIHZhciBjbG9zZUFjdGlvbiA9ICdjbG9zZSc7XG4gIHZhciB0cmFuc2l0aW9uRW5kRXZlbnQgPSAnd2Via2l0VHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBvVHJhbnNpdGlvbkVuZCBtc1RyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZCc7XG4gIHZhciBNZW51ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1lbnUobmFtZSkge1xuICAgICAgYmFiZWxIZWxwZXJzLmNsYXNzQ2FsbENoZWNrKHRoaXMsIE1lbnUpO1xuXG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgdGhpcy5pdGVtID0gJCQyKCcjJyArIG5hbWUpO1xuICAgICAgdGhpcy5vcGVuQ2xhc3MgPSBuYW1lID09PSAnc2lkcicgPyAnc2lkci1vcGVuJyA6ICdzaWRyLW9wZW4gJyArIG5hbWUgKyAnLW9wZW4nO1xuICAgICAgdGhpcy5tZW51V2lkdGggPSB0aGlzLml0ZW0ub3V0ZXJXaWR0aCh0cnVlKTtcbiAgICAgIHRoaXMuc3BlZWQgPSB0aGlzLml0ZW0uZGF0YSgnc3BlZWQnKTtcbiAgICAgIHRoaXMuc2lkZSA9IHRoaXMuaXRlbS5kYXRhKCdzaWRlJyk7XG4gICAgICB0aGlzLmRpc3BsYWNlID0gdGhpcy5pdGVtLmRhdGEoJ2Rpc3BsYWNlJyk7XG4gICAgICB0aGlzLnRpbWluZyA9IHRoaXMuaXRlbS5kYXRhKCd0aW1pbmcnKTtcbiAgICAgIHRoaXMubWV0aG9kID0gdGhpcy5pdGVtLmRhdGEoJ21ldGhvZCcpO1xuICAgICAgdGhpcy5vbk9wZW5DYWxsYmFjayA9IHRoaXMuaXRlbS5kYXRhKCdvbk9wZW4nKTtcbiAgICAgIHRoaXMub25DbG9zZUNhbGxiYWNrID0gdGhpcy5pdGVtLmRhdGEoJ29uQ2xvc2UnKTtcbiAgICAgIHRoaXMub25PcGVuRW5kQ2FsbGJhY2sgPSB0aGlzLml0ZW0uZGF0YSgnb25PcGVuRW5kJyk7XG4gICAgICB0aGlzLm9uQ2xvc2VFbmRDYWxsYmFjayA9IHRoaXMuaXRlbS5kYXRhKCdvbkNsb3NlRW5kJyk7XG4gICAgICB0aGlzLmJvZHkgPSAkJDIodGhpcy5pdGVtLmRhdGEoJ2JvZHknKSk7XG4gICAgfVxuXG4gICAgYmFiZWxIZWxwZXJzLmNyZWF0ZUNsYXNzKE1lbnUsIFt7XG4gICAgICBrZXk6ICdnZXRBbmltYXRpb24nLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEFuaW1hdGlvbihhY3Rpb24sIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGFuaW1hdGlvbiA9IHt9LFxuICAgICAgICAgICAgcHJvcCA9IHRoaXMuc2lkZTtcblxuICAgICAgICBpZiAoYWN0aW9uID09PSAnb3BlbicgJiYgZWxlbWVudCA9PT0gJ2JvZHknKSB7XG4gICAgICAgICAgYW5pbWF0aW9uW3Byb3BdID0gdGhpcy5tZW51V2lkdGggKyAncHgnO1xuICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ2Nsb3NlJyAmJiBlbGVtZW50ID09PSAnbWVudScpIHtcbiAgICAgICAgICBhbmltYXRpb25bcHJvcF0gPSAnLScgKyB0aGlzLm1lbnVXaWR0aCArICdweCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYW5pbWF0aW9uW3Byb3BdID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbmltYXRpb247XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAncHJlcGFyZUJvZHknLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHByZXBhcmVCb2R5KGFjdGlvbikge1xuICAgICAgICB2YXIgcHJvcCA9IGFjdGlvbiA9PT0gJ29wZW4nID8gJ2hpZGRlbicgOiAnJztcblxuICAgICAgICAvLyBQcmVwYXJlIHBhZ2UgaWYgY29udGFpbmVyIGlzIGJvZHlcbiAgICAgICAgaWYgKHRoaXMuYm9keS5pcygnYm9keScpKSB7XG4gICAgICAgICAgdmFyICRodG1sID0gJCQyKCdodG1sJyksXG4gICAgICAgICAgICAgIHNjcm9sbFRvcCA9ICRodG1sLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgICAgJGh0bWwuY3NzKCdvdmVyZmxvdy14JywgcHJvcCkuc2Nyb2xsVG9wKHNjcm9sbFRvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvcGVuQm9keScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb3BlbkJvZHkoKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc3BsYWNlKSB7XG4gICAgICAgICAgdmFyIHRyYW5zaXRpb25zID0gaGVscGVyLnRyYW5zaXRpb25zLFxuICAgICAgICAgICAgICAkYm9keSA9IHRoaXMuYm9keTtcblxuICAgICAgICAgIGlmICh0cmFuc2l0aW9ucy5zdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgICRib2R5LmNzcyh0cmFuc2l0aW9ucy5wcm9wZXJ0eSwgdGhpcy5zaWRlICsgJyAnICsgdGhpcy5zcGVlZCAvIDEwMDAgKyAncyAnICsgdGhpcy50aW1pbmcpLmNzcyh0aGlzLnNpZGUsIDApLmNzcyh7XG4gICAgICAgICAgICAgIHdpZHRoOiAkYm9keS53aWR0aCgpLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkYm9keS5jc3ModGhpcy5zaWRlLCB0aGlzLm1lbnVXaWR0aCArICdweCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYm9keUFuaW1hdGlvbiA9IHRoaXMuZ2V0QW5pbWF0aW9uKG9wZW5BY3Rpb24sICdib2R5Jyk7XG5cbiAgICAgICAgICAgICRib2R5LmNzcyh7XG4gICAgICAgICAgICAgIHdpZHRoOiAkYm9keS53aWR0aCgpLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICAgICAgfSkuYW5pbWF0ZShib2R5QW5pbWF0aW9uLCB7XG4gICAgICAgICAgICAgIHF1ZXVlOiBmYWxzZSxcbiAgICAgICAgICAgICAgZHVyYXRpb246IHRoaXMuc3BlZWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ29uQ2xvc2VCb2R5JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNsb3NlQm9keSgpIHtcbiAgICAgICAgdmFyIHRyYW5zaXRpb25zID0gaGVscGVyLnRyYW5zaXRpb25zLFxuICAgICAgICAgICAgcmVzZXRTdHlsZXMgPSB7XG4gICAgICAgICAgd2lkdGg6ICcnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnJyxcbiAgICAgICAgICByaWdodDogJycsXG4gICAgICAgICAgbGVmdDogJydcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodHJhbnNpdGlvbnMuc3VwcG9ydGVkKSB7XG4gICAgICAgICAgcmVzZXRTdHlsZXNbdHJhbnNpdGlvbnMucHJvcGVydHldID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJvZHkuY3NzKHJlc2V0U3R5bGVzKS51bmJpbmQodHJhbnNpdGlvbkVuZEV2ZW50KTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjbG9zZUJvZHknLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNsb3NlQm9keSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5kaXNwbGFjZSkge1xuICAgICAgICAgIGlmIChoZWxwZXIudHJhbnNpdGlvbnMuc3VwcG9ydGVkKSB7XG4gICAgICAgICAgICB0aGlzLmJvZHkuY3NzKHRoaXMuc2lkZSwgMCkub25lKHRyYW5zaXRpb25FbmRFdmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBfdGhpcy5vbkNsb3NlQm9keSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBib2R5QW5pbWF0aW9uID0gdGhpcy5nZXRBbmltYXRpb24oY2xvc2VBY3Rpb24sICdib2R5Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuYm9keS5hbmltYXRlKGJvZHlBbmltYXRpb24sIHtcbiAgICAgICAgICAgICAgcXVldWU6IGZhbHNlLFxuICAgICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5zcGVlZCxcbiAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLm9uQ2xvc2VCb2R5KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ21vdmVCb2R5JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBtb3ZlQm9keShhY3Rpb24pIHtcbiAgICAgICAgaWYgKGFjdGlvbiA9PT0gb3BlbkFjdGlvbikge1xuICAgICAgICAgIHRoaXMub3BlbkJvZHkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNsb3NlQm9keSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb25PcGVuTWVudScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb25PcGVuTWVudShjYWxsYmFjaykge1xuICAgICAgICB2YXIgbmFtZSA9IHRoaXMubmFtZTtcblxuICAgICAgICBzaWRyU3RhdHVzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgICBzaWRyU3RhdHVzLm9wZW5lZCA9IG5hbWU7XG5cbiAgICAgICAgdGhpcy5pdGVtLnVuYmluZCh0cmFuc2l0aW9uRW5kRXZlbnQpO1xuXG4gICAgICAgIHRoaXMuYm9keS5yZW1vdmVDbGFzcyhib2R5QW5pbWF0aW9uQ2xhc3MpLmFkZENsYXNzKHRoaXMub3BlbkNsYXNzKTtcblxuICAgICAgICB0aGlzLm9uT3BlbkVuZENhbGxiYWNrKCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNhbGxiYWNrKG5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb3Blbk1lbnUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9wZW5NZW51KGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgIHZhciAkaXRlbSA9IHRoaXMuaXRlbTtcblxuICAgICAgICBpZiAoaGVscGVyLnRyYW5zaXRpb25zLnN1cHBvcnRlZCkge1xuICAgICAgICAgICRpdGVtLmNzcyh0aGlzLnNpZGUsIDApLm9uZSh0cmFuc2l0aW9uRW5kRXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzMi5vbk9wZW5NZW51KGNhbGxiYWNrKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbWVudUFuaW1hdGlvbiA9IHRoaXMuZ2V0QW5pbWF0aW9uKG9wZW5BY3Rpb24sICdtZW51Jyk7XG5cbiAgICAgICAgICAkaXRlbS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKS5hbmltYXRlKG1lbnVBbmltYXRpb24sIHtcbiAgICAgICAgICAgIHF1ZXVlOiBmYWxzZSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiB0aGlzLnNwZWVkLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xuICAgICAgICAgICAgICBfdGhpczIub25PcGVuTWVudShjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvbkNsb3NlTWVudScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb25DbG9zZU1lbnUoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5pdGVtLmNzcyh7XG4gICAgICAgICAgbGVmdDogJycsXG4gICAgICAgICAgcmlnaHQ6ICcnXG4gICAgICAgIH0pLnVuYmluZCh0cmFuc2l0aW9uRW5kRXZlbnQpO1xuICAgICAgICAkJDIoJ2h0bWwnKS5jc3MoJ292ZXJmbG93LXgnLCAnJyk7XG5cbiAgICAgICAgc2lkclN0YXR1cy5tb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgc2lkclN0YXR1cy5vcGVuZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmJvZHkucmVtb3ZlQ2xhc3MoYm9keUFuaW1hdGlvbkNsYXNzKS5yZW1vdmVDbGFzcyh0aGlzLm9wZW5DbGFzcyk7XG5cbiAgICAgICAgdGhpcy5vbkNsb3NlRW5kQ2FsbGJhY2soKTtcblxuICAgICAgICAvLyBDYWxsYmFja1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY2FsbGJhY2sobmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjbG9zZU1lbnUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNsb3NlTWVudShjYWxsYmFjaykge1xuICAgICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuaXRlbTtcblxuICAgICAgICBpZiAoaGVscGVyLnRyYW5zaXRpb25zLnN1cHBvcnRlZCkge1xuICAgICAgICAgIGl0ZW0uY3NzKHRoaXMuc2lkZSwgJycpLm9uZSh0cmFuc2l0aW9uRW5kRXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzMy5vbkNsb3NlTWVudShjYWxsYmFjayk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIG1lbnVBbmltYXRpb24gPSB0aGlzLmdldEFuaW1hdGlvbihjbG9zZUFjdGlvbiwgJ21lbnUnKTtcblxuICAgICAgICAgIGl0ZW0uYW5pbWF0ZShtZW51QW5pbWF0aW9uLCB7XG4gICAgICAgICAgICBxdWV1ZTogZmFsc2UsXG4gICAgICAgICAgICBkdXJhdGlvbjogdGhpcy5zcGVlZCxcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcbiAgICAgICAgICAgICAgX3RoaXMzLm9uQ2xvc2VNZW51KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdtb3ZlTWVudScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gbW92ZU1lbnUoYWN0aW9uLCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmJvZHkuYWRkQ2xhc3MoYm9keUFuaW1hdGlvbkNsYXNzKTtcblxuICAgICAgICBpZiAoYWN0aW9uID09PSBvcGVuQWN0aW9uKSB7XG4gICAgICAgICAgdGhpcy5vcGVuTWVudShjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jbG9zZU1lbnUoY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnbW92ZScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gbW92ZShhY3Rpb24sIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIExvY2sgc2lkclxuICAgICAgICBzaWRyU3RhdHVzLm1vdmluZyA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5wcmVwYXJlQm9keShhY3Rpb24pO1xuICAgICAgICB0aGlzLm1vdmVCb2R5KGFjdGlvbik7XG4gICAgICAgIHRoaXMubW92ZU1lbnUoYWN0aW9uLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb3BlbicsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb3BlbihjYWxsYmFjaykge1xuICAgICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgICAvLyBDaGVjayBpZiBpcyBhbHJlYWR5IG9wZW5lZCBvciBtb3ZpbmdcbiAgICAgICAgaWYgKHNpZHJTdGF0dXMub3BlbmVkID09PSB0aGlzLm5hbWUgfHwgc2lkclN0YXR1cy5tb3ZpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBhbm90aGVyIG1lbnUgb3BlbmVkIGNsb3NlIGZpcnN0XG4gICAgICAgIGlmIChzaWRyU3RhdHVzLm9wZW5lZCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICB2YXIgYWxyZWFkeU9wZW5lZE1lbnUgPSBuZXcgTWVudShzaWRyU3RhdHVzLm9wZW5lZCk7XG5cbiAgICAgICAgICBhbHJlYWR5T3BlbmVkTWVudS5jbG9zZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczQub3BlbihjYWxsYmFjayk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1vdmUoJ29wZW4nLCBjYWxsYmFjayk7XG5cbiAgICAgICAgLy8gb25PcGVuIGNhbGxiYWNrXG4gICAgICAgIHRoaXMub25PcGVuQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjbG9zZScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2xvc2UoY2FsbGJhY2spIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgaXMgYWxyZWFkeSBjbG9zZWQgb3IgbW92aW5nXG4gICAgICAgIGlmIChzaWRyU3RhdHVzLm9wZW5lZCAhPT0gdGhpcy5uYW1lIHx8IHNpZHJTdGF0dXMubW92aW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tb3ZlKCdjbG9zZScsIGNhbGxiYWNrKTtcblxuICAgICAgICAvLyBvbkNsb3NlIGNhbGxiYWNrXG4gICAgICAgIHRoaXMub25DbG9zZUNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAndG9nZ2xlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB0b2dnbGUoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHNpZHJTdGF0dXMub3BlbmVkID09PSB0aGlzLm5hbWUpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlKGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9wZW4oY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBNZW51O1xuICB9KCk7XG5cbiAgdmFyICQkMSA9IGpRdWVyeTtcblxuICBmdW5jdGlvbiBleGVjdXRlKGFjdGlvbiwgbmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgc2lkciA9IG5ldyBNZW51KG5hbWUpO1xuXG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIGNhc2UgJ29wZW4nOlxuICAgICAgICBzaWRyLm9wZW4oY2FsbGJhY2spO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nsb3NlJzpcbiAgICAgICAgc2lkci5jbG9zZShjYWxsYmFjayk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndG9nZ2xlJzpcbiAgICAgICAgc2lkci50b2dnbGUoY2FsbGJhY2spO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgICQkMS5lcnJvcignTWV0aG9kICcgKyBhY3Rpb24gKyAnIGRvZXMgbm90IGV4aXN0IG9uIGpRdWVyeS5zaWRyJyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBpO1xuICB2YXIgJCA9IGpRdWVyeTtcbiAgdmFyIHB1YmxpY01ldGhvZHMgPSBbJ29wZW4nLCAnY2xvc2UnLCAndG9nZ2xlJ107XG4gIHZhciBtZXRob2ROYW1lO1xuICB2YXIgbWV0aG9kcyA9IHt9O1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gZ2V0TWV0aG9kKG1ldGhvZE5hbWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAvLyBDaGVjayBhcmd1bWVudHNcbiAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IG5hbWU7XG4gICAgICAgIG5hbWUgPSAnc2lkcic7XG4gICAgICB9IGVsc2UgaWYgKCFuYW1lKSB7XG4gICAgICAgIG5hbWUgPSAnc2lkcic7XG4gICAgICB9XG5cbiAgICAgIGV4ZWN1dGUobWV0aG9kTmFtZSwgbmFtZSwgY2FsbGJhY2spO1xuICAgIH07XG4gIH07XG4gIGZvciAoaSA9IDA7IGkgPCBwdWJsaWNNZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgbWV0aG9kTmFtZSA9IHB1YmxpY01ldGhvZHNbaV07XG4gICAgbWV0aG9kc1ttZXRob2ROYW1lXSA9IGdldE1ldGhvZChtZXRob2ROYW1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNpZHIobWV0aG9kKSB7XG4gICAgaWYgKG1ldGhvZCA9PT0gJ3N0YXR1cycpIHtcbiAgICAgIHJldHVybiBzaWRyU3RhdHVzO1xuICAgIH0gZWxzZSBpZiAobWV0aG9kc1ttZXRob2RdKSB7XG4gICAgICByZXR1cm4gbWV0aG9kc1ttZXRob2RdLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgbWV0aG9kID09PSAnc3RyaW5nJyB8fCAhbWV0aG9kKSB7XG4gICAgICByZXR1cm4gbWV0aG9kcy50b2dnbGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJC5lcnJvcignTWV0aG9kICcgKyBtZXRob2QgKyAnIGRvZXMgbm90IGV4aXN0IG9uIGpRdWVyeS5zaWRyJyk7XG4gICAgfVxuICB9XG5cbiAgdmFyICQkMyA9IGpRdWVyeTtcblxuICBmdW5jdGlvbiBmaWxsQ29udGVudCgkc2lkZU1lbnUsIHNldHRpbmdzKSB7XG4gICAgLy8gVGhlIG1lbnUgY29udGVudFxuICAgIGlmICh0eXBlb2Ygc2V0dGluZ3Muc291cmNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgbmV3Q29udGVudCA9IHNldHRpbmdzLnNvdXJjZShuYW1lKTtcblxuICAgICAgJHNpZGVNZW51Lmh0bWwobmV3Q29udGVudCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2V0dGluZ3Muc291cmNlID09PSAnc3RyaW5nJyAmJiBoZWxwZXIuaXNVcmwoc2V0dGluZ3Muc291cmNlKSkge1xuICAgICAgJCQzLmdldChzZXR0aW5ncy5zb3VyY2UsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICRzaWRlTWVudS5odG1sKGRhdGEpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2V0dGluZ3Muc291cmNlID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIGh0bWxDb250ZW50ID0gJycsXG4gICAgICAgICAgc2VsZWN0b3JzID0gc2V0dGluZ3Muc291cmNlLnNwbGl0KCcsJyk7XG5cbiAgICAgICQkMy5lYWNoKHNlbGVjdG9ycywgZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgIGh0bWxDb250ZW50ICs9ICc8ZGl2IGNsYXNzPVwic2lkci1pbm5lclwiPicgKyAkJDMoZWxlbWVudCkuaHRtbCgpICsgJzwvZGl2Pic7XG4gICAgICB9KTtcblxuICAgICAgLy8gUmVuYW1pbmcgaWRzIGFuZCBjbGFzc2VzXG4gICAgICBpZiAoc2V0dGluZ3MucmVuYW1pbmcpIHtcbiAgICAgICAgdmFyICRodG1sQ29udGVudCA9ICQkMygnPGRpdiAvPicpLmh0bWwoaHRtbENvbnRlbnQpO1xuXG4gICAgICAgICRodG1sQ29udGVudC5maW5kKCcqJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICB2YXIgJGVsZW1lbnQgPSAkJDMoZWxlbWVudCk7XG5cbiAgICAgICAgICBoZWxwZXIuYWRkUHJlZml4ZXMoJGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgaHRtbENvbnRlbnQgPSAkaHRtbENvbnRlbnQuaHRtbCgpO1xuICAgICAgfVxuXG4gICAgICAkc2lkZU1lbnUuaHRtbChodG1sQ29udGVudCk7XG4gICAgfSBlbHNlIGlmIChzZXR0aW5ncy5zb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICQkMy5lcnJvcignSW52YWxpZCBTaWRyIFNvdXJjZScpO1xuICAgIH1cblxuICAgIHJldHVybiAkc2lkZU1lbnU7XG4gIH1cblxuICBmdW5jdGlvbiBmblNpZHIob3B0aW9ucykge1xuICAgIHZhciB0cmFuc2l0aW9ucyA9IGhlbHBlci50cmFuc2l0aW9ucyxcbiAgICAgICAgc2V0dGluZ3MgPSAkJDMuZXh0ZW5kKHtcbiAgICAgIG5hbWU6ICdzaWRyJywgLy8gTmFtZSBmb3IgdGhlICdzaWRyJ1xuICAgICAgc3BlZWQ6IDIwMCwgLy8gQWNjZXB0cyBzdGFuZGFyZCBqUXVlcnkgZWZmZWN0cyBzcGVlZHMgKGkuZS4gZmFzdCwgbm9ybWFsIG9yIG1pbGxpc2Vjb25kcylcbiAgICAgIHNpZGU6ICdsZWZ0JywgLy8gQWNjZXB0cyAnbGVmdCcgb3IgJ3JpZ2h0J1xuICAgICAgc291cmNlOiBudWxsLCAvLyBPdmVycmlkZSB0aGUgc291cmNlIG9mIHRoZSBjb250ZW50LlxuICAgICAgcmVuYW1pbmc6IHRydWUsIC8vIFRoZSBpZHMgYW5kIGNsYXNzZXMgd2lsbCBiZSBwcmVwZW5kZWQgd2l0aCBhIHByZWZpeCB3aGVuIGxvYWRpbmcgZXhpc3RlbnQgY29udGVudFxuICAgICAgYm9keTogJ2JvZHknLCAvLyBQYWdlIGNvbnRhaW5lciBzZWxlY3RvcixcbiAgICAgIGRpc3BsYWNlOiB0cnVlLCAvLyBEaXNwbGFjZSB0aGUgYm9keSBjb250ZW50IG9yIG5vdFxuICAgICAgdGltaW5nOiAnZWFzZScsIC8vIFRpbWluZyBmdW5jdGlvbiBmb3IgQ1NTIHRyYW5zaXRpb25zXG4gICAgICBtZXRob2Q6ICd0b2dnbGUnLCAvLyBUaGUgbWV0aG9kIHRvIGNhbGwgd2hlbiBlbGVtZW50IGlzIGNsaWNrZWRcbiAgICAgIGJpbmQ6ICd0b3VjaHN0YXJ0IGNsaWNrJywgLy8gVGhlIGV2ZW50KHMpIHRvIHRyaWdnZXIgdGhlIG1lbnVcbiAgICAgIG9uT3BlbjogZnVuY3Rpb24gb25PcGVuKCkge30sXG4gICAgICAvLyBDYWxsYmFjayB3aGVuIHNpZHIgc3RhcnQgb3BlbmluZ1xuICAgICAgb25DbG9zZTogZnVuY3Rpb24gb25DbG9zZSgpIHt9LFxuICAgICAgLy8gQ2FsbGJhY2sgd2hlbiBzaWRyIHN0YXJ0IGNsb3NpbmdcbiAgICAgIG9uT3BlbkVuZDogZnVuY3Rpb24gb25PcGVuRW5kKCkge30sXG4gICAgICAvLyBDYWxsYmFjayB3aGVuIHNpZHIgZW5kIG9wZW5pbmdcbiAgICAgIG9uQ2xvc2VFbmQ6IGZ1bmN0aW9uIG9uQ2xvc2VFbmQoKSB7fSAvLyBDYWxsYmFjayB3aGVuIHNpZHIgZW5kIGNsb3NpbmdcblxuICAgIH0sIG9wdGlvbnMpLFxuICAgICAgICBuYW1lID0gc2V0dGluZ3MubmFtZSxcbiAgICAgICAgJHNpZGVNZW51ID0gJCQzKCcjJyArIG5hbWUpO1xuXG4gICAgLy8gSWYgdGhlIHNpZGUgbWVudSBkbyBub3QgZXhpc3QgY3JlYXRlIGl0XG4gICAgaWYgKCRzaWRlTWVudS5sZW5ndGggPT09IDApIHtcbiAgICAgICRzaWRlTWVudSA9ICQkMygnPGRpdiAvPicpLmF0dHIoJ2lkJywgbmFtZSkuYXBwZW5kVG8oJCQzKCdib2R5JykpO1xuICAgIH1cblxuICAgIC8vIEFkZCB0cmFuc2l0aW9uIHRvIG1lbnUgaWYgYXJlIHN1cHBvcnRlZFxuICAgIGlmICh0cmFuc2l0aW9ucy5zdXBwb3J0ZWQpIHtcbiAgICAgICRzaWRlTWVudS5jc3ModHJhbnNpdGlvbnMucHJvcGVydHksIHNldHRpbmdzLnNpZGUgKyAnICcgKyBzZXR0aW5ncy5zcGVlZCAvIDEwMDAgKyAncyAnICsgc2V0dGluZ3MudGltaW5nKTtcbiAgICB9XG5cbiAgICAvLyBBZGRpbmcgc3R5bGVzIGFuZCBvcHRpb25zXG4gICAgJHNpZGVNZW51LmFkZENsYXNzKCdzaWRyJykuYWRkQ2xhc3Moc2V0dGluZ3Muc2lkZSkuZGF0YSh7XG4gICAgICBzcGVlZDogc2V0dGluZ3Muc3BlZWQsXG4gICAgICBzaWRlOiBzZXR0aW5ncy5zaWRlLFxuICAgICAgYm9keTogc2V0dGluZ3MuYm9keSxcbiAgICAgIGRpc3BsYWNlOiBzZXR0aW5ncy5kaXNwbGFjZSxcbiAgICAgIHRpbWluZzogc2V0dGluZ3MudGltaW5nLFxuICAgICAgbWV0aG9kOiBzZXR0aW5ncy5tZXRob2QsXG4gICAgICBvbk9wZW46IHNldHRpbmdzLm9uT3BlbixcbiAgICAgIG9uQ2xvc2U6IHNldHRpbmdzLm9uQ2xvc2UsXG4gICAgICBvbk9wZW5FbmQ6IHNldHRpbmdzLm9uT3BlbkVuZCxcbiAgICAgIG9uQ2xvc2VFbmQ6IHNldHRpbmdzLm9uQ2xvc2VFbmRcbiAgICB9KTtcblxuICAgICRzaWRlTWVudSA9IGZpbGxDb250ZW50KCRzaWRlTWVudSwgc2V0dGluZ3MpO1xuXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkJDModGhpcyksXG4gICAgICAgICAgZGF0YSA9ICR0aGlzLmRhdGEoJ3NpZHInKSxcbiAgICAgICAgICBmbGFnID0gZmFsc2U7XG5cbiAgICAgIC8vIElmIHRoZSBwbHVnaW4gaGFzbid0IGJlZW4gaW5pdGlhbGl6ZWQgeWV0XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgc2lkclN0YXR1cy5tb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgc2lkclN0YXR1cy5vcGVuZWQgPSBmYWxzZTtcblxuICAgICAgICAkdGhpcy5kYXRhKCdzaWRyJywgbmFtZSk7XG5cbiAgICAgICAgJHRoaXMuYmluZChzZXR0aW5ncy5iaW5kLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgaWYgKCFmbGFnKSB7XG4gICAgICAgICAgICBmbGFnID0gdHJ1ZTtcbiAgICAgICAgICAgIHNpZHIoc2V0dGluZ3MubWV0aG9kLCBuYW1lKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGZsYWcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGpRdWVyeS5zaWRyID0gc2lkcjtcbiAgalF1ZXJ5LmZuLnNpZHIgPSBmblNpZHI7XG5cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuICB2YXIgQWpheE1vbml0b3IsIEJhciwgRG9jdW1lbnRNb25pdG9yLCBFbGVtZW50TW9uaXRvciwgRWxlbWVudFRyYWNrZXIsIEV2ZW50TGFnTW9uaXRvciwgRXZlbnRlZCwgRXZlbnRzLCBOb1RhcmdldEVycm9yLCBQYWNlLCBSZXF1ZXN0SW50ZXJjZXB0LCBTT1VSQ0VfS0VZUywgU2NhbGVyLCBTb2NrZXRSZXF1ZXN0VHJhY2tlciwgWEhSUmVxdWVzdFRyYWNrZXIsIGFuaW1hdGlvbiwgYXZnQW1wbGl0dWRlLCBiYXIsIGNhbmNlbEFuaW1hdGlvbiwgY2FuY2VsQW5pbWF0aW9uRnJhbWUsIGRlZmF1bHRPcHRpb25zLCBleHRlbmQsIGV4dGVuZE5hdGl2ZSwgZ2V0RnJvbURPTSwgZ2V0SW50ZXJjZXB0LCBoYW5kbGVQdXNoU3RhdGUsIGlnbm9yZVN0YWNrLCBpbml0LCBub3csIG9wdGlvbnMsIHJlcXVlc3RBbmltYXRpb25GcmFtZSwgcmVzdWx0LCBydW5BbmltYXRpb24sIHNjYWxlcnMsIHNob3VsZElnbm9yZVVSTCwgc2hvdWxkVHJhY2ssIHNvdXJjZSwgc291cmNlcywgdW5pU2NhbGVyLCBfV2ViU29ja2V0LCBfWERvbWFpblJlcXVlc3QsIF9YTUxIdHRwUmVxdWVzdCwgX2ksIF9pbnRlcmNlcHQsIF9sZW4sIF9wdXNoU3RhdGUsIF9yZWYsIF9yZWYxLCBfcmVwbGFjZVN0YXRlLFxuICAgIF9fc2xpY2UgPSBbXS5zbGljZSxcbiAgICBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcbiAgICBfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgICBfX2luZGV4T2YgPSBbXS5pbmRleE9mIHx8IGZ1bmN0aW9uKGl0ZW0pIHsgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykgeyBpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHJldHVybiBpOyB9IHJldHVybiAtMTsgfTtcblxuICBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBjYXRjaHVwVGltZTogMTAwLFxuICAgIGluaXRpYWxSYXRlOiAuMDMsXG4gICAgbWluVGltZTogMjUwLFxuICAgIGdob3N0VGltZTogMTAwLFxuICAgIG1heFByb2dyZXNzUGVyRnJhbWU6IDIwLFxuICAgIGVhc2VGYWN0b3I6IDEuMjUsXG4gICAgc3RhcnRPblBhZ2VMb2FkOiB0cnVlLFxuICAgIHJlc3RhcnRPblB1c2hTdGF0ZTogdHJ1ZSxcbiAgICByZXN0YXJ0T25SZXF1ZXN0QWZ0ZXI6IDUwMCxcbiAgICB0YXJnZXQ6ICdib2R5JyxcbiAgICBlbGVtZW50czoge1xuICAgICAgY2hlY2tJbnRlcnZhbDogMTAwLFxuICAgICAgc2VsZWN0b3JzOiBbJ2JvZHknXVxuICAgIH0sXG4gICAgZXZlbnRMYWc6IHtcbiAgICAgIG1pblNhbXBsZXM6IDEwLFxuICAgICAgc2FtcGxlQ291bnQ6IDMsXG4gICAgICBsYWdUaHJlc2hvbGQ6IDNcbiAgICB9LFxuICAgIGFqYXg6IHtcbiAgICAgIHRyYWNrTWV0aG9kczogWydHRVQnXSxcbiAgICAgIHRyYWNrV2ViU29ja2V0czogdHJ1ZSxcbiAgICAgIGlnbm9yZVVSTHM6IFtdXG4gICAgfVxuICB9O1xuXG4gIG5vdyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBfcmVmO1xuICAgIHJldHVybiAoX3JlZiA9IHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwZXJmb3JtYW5jZSAhPT0gbnVsbCA/IHR5cGVvZiBwZXJmb3JtYW5jZS5ub3cgPT09IFwiZnVuY3Rpb25cIiA/IHBlcmZvcm1hbmNlLm5vdygpIDogdm9pZCAwIDogdm9pZCAwKSAhPSBudWxsID8gX3JlZiA6ICsobmV3IERhdGUpO1xuICB9O1xuXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZTtcblxuICBjYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWU7XG5cbiAgaWYgKHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PSBudWxsKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZuLCA1MCk7XG4gICAgfTtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9O1xuICB9XG5cbiAgcnVuQW5pbWF0aW9uID0gZnVuY3Rpb24oZm4pIHtcbiAgICB2YXIgbGFzdCwgdGljaztcbiAgICBsYXN0ID0gbm93KCk7XG4gICAgdGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRpZmY7XG4gICAgICBkaWZmID0gbm93KCkgLSBsYXN0O1xuICAgICAgaWYgKGRpZmYgPj0gMzMpIHtcbiAgICAgICAgbGFzdCA9IG5vdygpO1xuICAgICAgICByZXR1cm4gZm4oZGlmZiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dCh0aWNrLCAzMyAtIGRpZmYpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHRpY2soKTtcbiAgfTtcblxuICByZXN1bHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncywga2V5LCBvYmo7XG4gICAgb2JqID0gYXJndW1lbnRzWzBdLCBrZXkgPSBhcmd1bWVudHNbMV0sIGFyZ3MgPSAzIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IFtdO1xuICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XS5hcHBseShvYmosIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgfVxuICB9O1xuXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBrZXksIG91dCwgc291cmNlLCBzb3VyY2VzLCB2YWwsIF9pLCBfbGVuO1xuICAgIG91dCA9IGFyZ3VtZW50c1swXSwgc291cmNlcyA9IDIgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpIDogW107XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBzb3VyY2VzLmxlbmd0aDsgX2kgPCBfbGVuOyBfaSsrKSB7XG4gICAgICBzb3VyY2UgPSBzb3VyY2VzW19pXTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKCFfX2hhc1Byb3AuY2FsbChzb3VyY2UsIGtleSkpIGNvbnRpbnVlO1xuICAgICAgICAgIHZhbCA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgIGlmICgob3V0W2tleV0gIT0gbnVsbCkgJiYgdHlwZW9mIG91dFtrZXldID09PSAnb2JqZWN0JyAmJiAodmFsICE9IG51bGwpICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBleHRlbmQob3V0W2tleV0sIHZhbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dFtrZXldID0gdmFsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuICB9O1xuXG4gIGF2Z0FtcGxpdHVkZSA9IGZ1bmN0aW9uKGFycikge1xuICAgIHZhciBjb3VudCwgc3VtLCB2LCBfaSwgX2xlbjtcbiAgICBzdW0gPSBjb3VudCA9IDA7XG4gICAgZm9yIChfaSA9IDAsIF9sZW4gPSBhcnIubGVuZ3RoOyBfaSA8IF9sZW47IF9pKyspIHtcbiAgICAgIHYgPSBhcnJbX2ldO1xuICAgICAgc3VtICs9IE1hdGguYWJzKHYpO1xuICAgICAgY291bnQrKztcbiAgICB9XG4gICAgcmV0dXJuIHN1bSAvIGNvdW50O1xuICB9O1xuXG4gIGdldEZyb21ET00gPSBmdW5jdGlvbihrZXksIGpzb24pIHtcbiAgICB2YXIgZGF0YSwgZSwgZWw7XG4gICAgaWYgKGtleSA9PSBudWxsKSB7XG4gICAgICBrZXkgPSAnb3B0aW9ucyc7XG4gICAgfVxuICAgIGlmIChqc29uID09IG51bGwpIHtcbiAgICAgIGpzb24gPSB0cnVlO1xuICAgIH1cbiAgICBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1wYWNlLVwiICsga2V5ICsgXCJdXCIpO1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGF0YSA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGFjZS1cIiArIGtleSk7XG4gICAgaWYgKCFqc29uKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgZSA9IF9lcnJvcjtcbiAgICAgIHJldHVybiB0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlICE9PSBudWxsID8gY29uc29sZS5lcnJvcihcIkVycm9yIHBhcnNpbmcgaW5saW5lIHBhY2Ugb3B0aW9uc1wiLCBlKSA6IHZvaWQgMDtcbiAgICB9XG4gIH07XG5cbiAgRXZlbnRlZCA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFdmVudGVkKCkge31cblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZlbnQsIGhhbmRsZXIsIGN0eCwgb25jZSkge1xuICAgICAgdmFyIF9iYXNlO1xuICAgICAgaWYgKG9uY2UgPT0gbnVsbCkge1xuICAgICAgICBvbmNlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5iaW5kaW5ncyA9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSB7fTtcbiAgICAgIH1cbiAgICAgIGlmICgoX2Jhc2UgPSB0aGlzLmJpbmRpbmdzKVtldmVudF0gPT0gbnVsbCkge1xuICAgICAgICBfYmFzZVtldmVudF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzW2V2ZW50XS5wdXNoKHtcbiAgICAgICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICAgICAgY3R4OiBjdHgsXG4gICAgICAgIG9uY2U6IG9uY2VcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBFdmVudGVkLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGhhbmRsZXIsIGN0eCkge1xuICAgICAgcmV0dXJuIHRoaXMub24oZXZlbnQsIGhhbmRsZXIsIGN0eCwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIEV2ZW50ZWQucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICB2YXIgaSwgX3JlZiwgX3Jlc3VsdHM7XG4gICAgICBpZiAoKChfcmVmID0gdGhpcy5iaW5kaW5ncykgIT0gbnVsbCA/IF9yZWZbZXZlbnRdIDogdm9pZCAwKSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChoYW5kbGVyID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGRlbGV0ZSB0aGlzLmJpbmRpbmdzW2V2ZW50XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMuYmluZGluZ3NbZXZlbnRdLmxlbmd0aCkge1xuICAgICAgICAgIGlmICh0aGlzLmJpbmRpbmdzW2V2ZW50XVtpXS5oYW5kbGVyID09PSBoYW5kbGVyKSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKHRoaXMuYmluZGluZ3NbZXZlbnRdLnNwbGljZShpLCAxKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goaSsrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBFdmVudGVkLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncywgY3R4LCBldmVudCwgaGFuZGxlciwgaSwgb25jZSwgX3JlZiwgX3JlZjEsIF9yZXN1bHRzO1xuICAgICAgZXZlbnQgPSBhcmd1bWVudHNbMF0sIGFyZ3MgPSAyIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBfX3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSA6IFtdO1xuICAgICAgaWYgKChfcmVmID0gdGhpcy5iaW5kaW5ncykgIT0gbnVsbCA/IF9yZWZbZXZlbnRdIDogdm9pZCAwKSB7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMuYmluZGluZ3NbZXZlbnRdLmxlbmd0aCkge1xuICAgICAgICAgIF9yZWYxID0gdGhpcy5iaW5kaW5nc1tldmVudF1baV0sIGhhbmRsZXIgPSBfcmVmMS5oYW5kbGVyLCBjdHggPSBfcmVmMS5jdHgsIG9uY2UgPSBfcmVmMS5vbmNlO1xuICAgICAgICAgIGhhbmRsZXIuYXBwbHkoY3R4ICE9IG51bGwgPyBjdHggOiB0aGlzLCBhcmdzKTtcbiAgICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaCh0aGlzLmJpbmRpbmdzW2V2ZW50XS5zcGxpY2UoaSwgMSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcmVzdWx0cy5wdXNoKGkrKyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfcmVzdWx0cztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIEV2ZW50ZWQ7XG5cbiAgfSkoKTtcblxuICBQYWNlID0gd2luZG93LlBhY2UgfHwge307XG5cbiAgd2luZG93LlBhY2UgPSBQYWNlO1xuXG4gIGV4dGVuZChQYWNlLCBFdmVudGVkLnByb3RvdHlwZSk7XG5cbiAgb3B0aW9ucyA9IFBhY2Uub3B0aW9ucyA9IGV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIHdpbmRvdy5wYWNlT3B0aW9ucywgZ2V0RnJvbURPTSgpKTtcblxuICBfcmVmID0gWydhamF4JywgJ2RvY3VtZW50JywgJ2V2ZW50TGFnJywgJ2VsZW1lbnRzJ107XG4gIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgIHNvdXJjZSA9IF9yZWZbX2ldO1xuICAgIGlmIChvcHRpb25zW3NvdXJjZV0gPT09IHRydWUpIHtcbiAgICAgIG9wdGlvbnNbc291cmNlXSA9IGRlZmF1bHRPcHRpb25zW3NvdXJjZV07XG4gICAgfVxuICB9XG5cbiAgTm9UYXJnZXRFcnJvciA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTm9UYXJnZXRFcnJvciwgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIE5vVGFyZ2V0RXJyb3IoKSB7XG4gICAgICBfcmVmMSA9IE5vVGFyZ2V0RXJyb3IuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gX3JlZjE7XG4gICAgfVxuXG4gICAgcmV0dXJuIE5vVGFyZ2V0RXJyb3I7XG5cbiAgfSkoRXJyb3IpO1xuXG4gIEJhciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBCYXIoKSB7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICB9XG5cbiAgICBCYXIucHJvdG90eXBlLmdldEVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0YXJnZXRFbGVtZW50O1xuICAgICAgaWYgKHRoaXMuZWwgPT0gbnVsbCkge1xuICAgICAgICB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLnRhcmdldCk7XG4gICAgICAgIGlmICghdGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgIHRocm93IG5ldyBOb1RhcmdldEVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5lbC5jbGFzc05hbWUgPSBcInBhY2UgcGFjZS1hY3RpdmVcIjtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgPSBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZS5yZXBsYWNlKC9wYWNlLWRvbmUvZywgJycpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSArPSAnIHBhY2UtcnVubmluZyc7XG4gICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJwYWNlLXByb2dyZXNzXCI+XFxuICA8ZGl2IGNsYXNzPVwicGFjZS1wcm9ncmVzcy1pbm5lclwiPjwvZGl2PlxcbjwvZGl2PlxcbjxkaXYgY2xhc3M9XCJwYWNlLWFjdGl2aXR5XCI+PC9kaXY+JztcbiAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQuZmlyc3RDaGlsZCAhPSBudWxsKSB7XG4gICAgICAgICAgdGFyZ2V0RWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy5lbCwgdGFyZ2V0RWxlbWVudC5maXJzdENoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbDtcbiAgICAgIGVsID0gdGhpcy5nZXRFbGVtZW50KCk7XG4gICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZSgncGFjZS1hY3RpdmUnLCAnJyk7XG4gICAgICBlbC5jbGFzc05hbWUgKz0gJyBwYWNlLWluYWN0aXZlJztcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lID0gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUucmVwbGFjZSgncGFjZS1ydW5uaW5nJywgJycpO1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lICs9ICcgcGFjZS1kb25lJztcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihwcm9nKSB7XG4gICAgICB0aGlzLnByb2dyZXNzID0gcHJvZztcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlcigpO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudCgpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5nZXRFbGVtZW50KCkpO1xuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgIE5vVGFyZ2V0RXJyb3IgPSBfZXJyb3I7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5lbCA9IHZvaWQgMDtcbiAgICB9O1xuXG4gICAgQmFyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlbCwga2V5LCBwcm9ncmVzc1N0ciwgdHJhbnNmb3JtLCBfaiwgX2xlbjEsIF9yZWYyO1xuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy50YXJnZXQpID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZWwgPSB0aGlzLmdldEVsZW1lbnQoKTtcbiAgICAgIHRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoXCIgKyB0aGlzLnByb2dyZXNzICsgXCIlLCAwLCAwKVwiO1xuICAgICAgX3JlZjIgPSBbJ3dlYmtpdFRyYW5zZm9ybScsICdtc1RyYW5zZm9ybScsICd0cmFuc2Zvcm0nXTtcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBrZXkgPSBfcmVmMltfal07XG4gICAgICAgIGVsLmNoaWxkcmVuWzBdLnN0eWxlW2tleV0gPSB0cmFuc2Zvcm07XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMubGFzdFJlbmRlcmVkUHJvZ3Jlc3MgfHwgdGhpcy5sYXN0UmVuZGVyZWRQcm9ncmVzcyB8IDAgIT09IHRoaXMucHJvZ3Jlc3MgfCAwKSB7XG4gICAgICAgIGVsLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9ncmVzcy10ZXh0JywgXCJcIiArICh0aGlzLnByb2dyZXNzIHwgMCkgKyBcIiVcIik7XG4gICAgICAgIGlmICh0aGlzLnByb2dyZXNzID49IDEwMCkge1xuICAgICAgICAgIHByb2dyZXNzU3RyID0gJzk5JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9ncmVzc1N0ciA9IHRoaXMucHJvZ3Jlc3MgPCAxMCA/IFwiMFwiIDogXCJcIjtcbiAgICAgICAgICBwcm9ncmVzc1N0ciArPSB0aGlzLnByb2dyZXNzIHwgMDtcbiAgICAgICAgfVxuICAgICAgICBlbC5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcHJvZ3Jlc3MnLCBcIlwiICsgcHJvZ3Jlc3NTdHIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMubGFzdFJlbmRlcmVkUHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzO1xuICAgIH07XG5cbiAgICBCYXIucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2dyZXNzID49IDEwMDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEJhcjtcblxuICB9KSgpO1xuXG4gIEV2ZW50cyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBFdmVudHMoKSB7XG4gICAgICB0aGlzLmJpbmRpbmdzID0ge307XG4gICAgfVxuXG4gICAgRXZlbnRzLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24obmFtZSwgdmFsKSB7XG4gICAgICB2YXIgYmluZGluZywgX2osIF9sZW4xLCBfcmVmMiwgX3Jlc3VsdHM7XG4gICAgICBpZiAodGhpcy5iaW5kaW5nc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgIF9yZWYyID0gdGhpcy5iaW5kaW5nc1tuYW1lXTtcbiAgICAgICAgX3Jlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICAgICAgYmluZGluZyA9IF9yZWYyW19qXTtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKGJpbmRpbmcuY2FsbCh0aGlzLCB2YWwpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3Jlc3VsdHM7XG4gICAgICB9XG4gICAgfTtcblxuICAgIEV2ZW50cy5wcm90b3R5cGUub24gPSBmdW5jdGlvbihuYW1lLCBmbikge1xuICAgICAgdmFyIF9iYXNlO1xuICAgICAgaWYgKChfYmFzZSA9IHRoaXMuYmluZGluZ3MpW25hbWVdID09IG51bGwpIHtcbiAgICAgICAgX2Jhc2VbbmFtZV0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzW25hbWVdLnB1c2goZm4pO1xuICAgIH07XG5cbiAgICByZXR1cm4gRXZlbnRzO1xuXG4gIH0pKCk7XG5cbiAgX1hNTEh0dHBSZXF1ZXN0ID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xuXG4gIF9YRG9tYWluUmVxdWVzdCA9IHdpbmRvdy5YRG9tYWluUmVxdWVzdDtcblxuICBfV2ViU29ja2V0ID0gd2luZG93LldlYlNvY2tldDtcblxuICBleHRlbmROYXRpdmUgPSBmdW5jdGlvbih0bywgZnJvbSkge1xuICAgIHZhciBlLCBrZXksIF9yZXN1bHRzO1xuICAgIF9yZXN1bHRzID0gW107XG4gICAgZm9yIChrZXkgaW4gZnJvbS5wcm90b3R5cGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICgodG9ba2V5XSA9PSBudWxsKSAmJiB0eXBlb2YgZnJvbVtrZXldICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goT2JqZWN0LmRlZmluZVByb3BlcnR5KHRvLCBrZXksIHtcbiAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbS5wcm90b3R5cGVba2V5XTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godG9ba2V5XSA9IGZyb20ucHJvdG90eXBlW2tleV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX3Jlc3VsdHM7XG4gIH07XG5cbiAgaWdub3JlU3RhY2sgPSBbXTtcblxuICBQYWNlLmlnbm9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBmbiwgcmV0O1xuICAgIGZuID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBpZ25vcmVTdGFjay51bnNoaWZ0KCdpZ25vcmUnKTtcbiAgICByZXQgPSBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICBpZ25vcmVTdGFjay5zaGlmdCgpO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgUGFjZS50cmFjayA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzLCBmbiwgcmV0O1xuICAgIGZuID0gYXJndW1lbnRzWzBdLCBhcmdzID0gMiA8PSBhcmd1bWVudHMubGVuZ3RoID8gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkgOiBbXTtcbiAgICBpZ25vcmVTdGFjay51bnNoaWZ0KCd0cmFjaycpO1xuICAgIHJldCA9IGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIGlnbm9yZVN0YWNrLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBzaG91bGRUcmFjayA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIHZhciBfcmVmMjtcbiAgICBpZiAobWV0aG9kID09IG51bGwpIHtcbiAgICAgIG1ldGhvZCA9ICdHRVQnO1xuICAgIH1cbiAgICBpZiAoaWdub3JlU3RhY2tbMF0gPT09ICd0cmFjaycpIHtcbiAgICAgIHJldHVybiAnZm9yY2UnO1xuICAgIH1cbiAgICBpZiAoIWlnbm9yZVN0YWNrLmxlbmd0aCAmJiBvcHRpb25zLmFqYXgpIHtcbiAgICAgIGlmIChtZXRob2QgPT09ICdzb2NrZXQnICYmIG9wdGlvbnMuYWpheC50cmFja1dlYlNvY2tldHMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKF9yZWYyID0gbWV0aG9kLnRvVXBwZXJDYXNlKCksIF9faW5kZXhPZi5jYWxsKG9wdGlvbnMuYWpheC50cmFja01ldGhvZHMsIF9yZWYyKSA+PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgUmVxdWVzdEludGVyY2VwdCA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUmVxdWVzdEludGVyY2VwdCwgX3N1cGVyKTtcblxuICAgIGZ1bmN0aW9uIFJlcXVlc3RJbnRlcmNlcHQoKSB7XG4gICAgICB2YXIgbW9uaXRvclhIUixcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgUmVxdWVzdEludGVyY2VwdC5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIG1vbml0b3JYSFIgPSBmdW5jdGlvbihyZXEpIHtcbiAgICAgICAgdmFyIF9vcGVuO1xuICAgICAgICBfb3BlbiA9IHJlcS5vcGVuO1xuICAgICAgICByZXR1cm4gcmVxLm9wZW4gPSBmdW5jdGlvbih0eXBlLCB1cmwsIGFzeW5jKSB7XG4gICAgICAgICAgaWYgKHNob3VsZFRyYWNrKHR5cGUpKSB7XG4gICAgICAgICAgICBfdGhpcy50cmlnZ2VyKCdyZXF1ZXN0Jywge1xuICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgcmVxdWVzdDogcmVxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9vcGVuLmFwcGx5KHJlcSwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgPSBmdW5jdGlvbihmbGFncykge1xuICAgICAgICB2YXIgcmVxO1xuICAgICAgICByZXEgPSBuZXcgX1hNTEh0dHBSZXF1ZXN0KGZsYWdzKTtcbiAgICAgICAgbW9uaXRvclhIUihyZXEpO1xuICAgICAgICByZXR1cm4gcmVxO1xuICAgICAgfTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV4dGVuZE5hdGl2ZSh3aW5kb3cuWE1MSHR0cFJlcXVlc3QsIF9YTUxIdHRwUmVxdWVzdCk7XG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICBpZiAoX1hEb21haW5SZXF1ZXN0ICE9IG51bGwpIHtcbiAgICAgICAgd2luZG93LlhEb21haW5SZXF1ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHJlcTtcbiAgICAgICAgICByZXEgPSBuZXcgX1hEb21haW5SZXF1ZXN0O1xuICAgICAgICAgIG1vbml0b3JYSFIocmVxKTtcbiAgICAgICAgICByZXR1cm4gcmVxO1xuICAgICAgICB9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGV4dGVuZE5hdGl2ZSh3aW5kb3cuWERvbWFpblJlcXVlc3QsIF9YRG9tYWluUmVxdWVzdCk7XG4gICAgICAgIH0gY2F0Y2ggKF9lcnJvcikge31cbiAgICAgIH1cbiAgICAgIGlmICgoX1dlYlNvY2tldCAhPSBudWxsKSAmJiBvcHRpb25zLmFqYXgudHJhY2tXZWJTb2NrZXRzKSB7XG4gICAgICAgIHdpbmRvdy5XZWJTb2NrZXQgPSBmdW5jdGlvbih1cmwsIHByb3RvY29scykge1xuICAgICAgICAgIHZhciByZXE7XG4gICAgICAgICAgaWYgKHByb3RvY29scyAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXEgPSBuZXcgX1dlYlNvY2tldCh1cmwsIHByb3RvY29scyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcSA9IG5ldyBfV2ViU29ja2V0KHVybCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzaG91bGRUcmFjaygnc29ja2V0JykpIHtcbiAgICAgICAgICAgIF90aGlzLnRyaWdnZXIoJ3JlcXVlc3QnLCB7XG4gICAgICAgICAgICAgIHR5cGU6ICdzb2NrZXQnLFxuICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgcHJvdG9jb2xzOiBwcm90b2NvbHMsXG4gICAgICAgICAgICAgIHJlcXVlc3Q6IHJlcVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXE7XG4gICAgICAgIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZXh0ZW5kTmF0aXZlKHdpbmRvdy5XZWJTb2NrZXQsIF9XZWJTb2NrZXQpO1xuICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlcXVlc3RJbnRlcmNlcHQ7XG5cbiAgfSkoRXZlbnRzKTtcblxuICBfaW50ZXJjZXB0ID0gbnVsbDtcblxuICBnZXRJbnRlcmNlcHQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoX2ludGVyY2VwdCA9PSBudWxsKSB7XG4gICAgICBfaW50ZXJjZXB0ID0gbmV3IFJlcXVlc3RJbnRlcmNlcHQ7XG4gICAgfVxuICAgIHJldHVybiBfaW50ZXJjZXB0O1xuICB9O1xuXG4gIHNob3VsZElnbm9yZVVSTCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBwYXR0ZXJuLCBfaiwgX2xlbjEsIF9yZWYyO1xuICAgIF9yZWYyID0gb3B0aW9ucy5hamF4Lmlnbm9yZVVSTHM7XG4gICAgZm9yIChfaiA9IDAsIF9sZW4xID0gX3JlZjIubGVuZ3RoOyBfaiA8IF9sZW4xOyBfaisrKSB7XG4gICAgICBwYXR0ZXJuID0gX3JlZjJbX2pdO1xuICAgICAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAodXJsLmluZGV4T2YocGF0dGVybikgIT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwYXR0ZXJuLnRlc3QodXJsKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBnZXRJbnRlcmNlcHQoKS5vbigncmVxdWVzdCcsIGZ1bmN0aW9uKF9hcmcpIHtcbiAgICB2YXIgYWZ0ZXIsIGFyZ3MsIHJlcXVlc3QsIHR5cGUsIHVybDtcbiAgICB0eXBlID0gX2FyZy50eXBlLCByZXF1ZXN0ID0gX2FyZy5yZXF1ZXN0LCB1cmwgPSBfYXJnLnVybDtcbiAgICBpZiAoc2hvdWxkSWdub3JlVVJMKHVybCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFQYWNlLnJ1bm5pbmcgJiYgKG9wdGlvbnMucmVzdGFydE9uUmVxdWVzdEFmdGVyICE9PSBmYWxzZSB8fCBzaG91bGRUcmFjayh0eXBlKSA9PT0gJ2ZvcmNlJykpIHtcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBhZnRlciA9IG9wdGlvbnMucmVzdGFydE9uUmVxdWVzdEFmdGVyIHx8IDA7XG4gICAgICBpZiAodHlwZW9mIGFmdGVyID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgYWZ0ZXIgPSAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdGlsbEFjdGl2ZSwgX2osIF9sZW4xLCBfcmVmMiwgX3JlZjMsIF9yZXN1bHRzO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ3NvY2tldCcpIHtcbiAgICAgICAgICBzdGlsbEFjdGl2ZSA9IHJlcXVlc3QucmVhZHlTdGF0ZSA8IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RpbGxBY3RpdmUgPSAoMCA8IChfcmVmMiA9IHJlcXVlc3QucmVhZHlTdGF0ZSkgJiYgX3JlZjIgPCA0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RpbGxBY3RpdmUpIHtcbiAgICAgICAgICBQYWNlLnJlc3RhcnQoKTtcbiAgICAgICAgICBfcmVmMyA9IFBhY2Uuc291cmNlcztcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYzLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgICAgc291cmNlID0gX3JlZjNbX2pdO1xuICAgICAgICAgICAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFqYXhNb25pdG9yKSB7XG4gICAgICAgICAgICAgIHNvdXJjZS53YXRjaC5hcHBseShzb3VyY2UsIGFyZ3MpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yZXN1bHRzO1xuICAgICAgICB9XG4gICAgICB9LCBhZnRlcik7XG4gICAgfVxuICB9KTtcblxuICBBamF4TW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBBamF4TW9uaXRvcigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICBnZXRJbnRlcmNlcHQoKS5vbigncmVxdWVzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMud2F0Y2guYXBwbHkoX3RoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBBamF4TW9uaXRvci5wcm90b3R5cGUud2F0Y2ggPSBmdW5jdGlvbihfYXJnKSB7XG4gICAgICB2YXIgcmVxdWVzdCwgdHJhY2tlciwgdHlwZSwgdXJsO1xuICAgICAgdHlwZSA9IF9hcmcudHlwZSwgcmVxdWVzdCA9IF9hcmcucmVxdWVzdCwgdXJsID0gX2FyZy51cmw7XG4gICAgICBpZiAoc2hvdWxkSWdub3JlVVJMKHVybCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICdzb2NrZXQnKSB7XG4gICAgICAgIHRyYWNrZXIgPSBuZXcgU29ja2V0UmVxdWVzdFRyYWNrZXIocmVxdWVzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cmFja2VyID0gbmV3IFhIUlJlcXVlc3RUcmFja2VyKHJlcXVlc3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHMucHVzaCh0cmFja2VyKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEFqYXhNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgWEhSUmVxdWVzdFRyYWNrZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gWEhSUmVxdWVzdFRyYWNrZXIocmVxdWVzdCkge1xuICAgICAgdmFyIGV2ZW50LCBzaXplLCBfaiwgX2xlbjEsIF9vbnJlYWR5c3RhdGVjaGFuZ2UsIF9yZWYyLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIGlmICh3aW5kb3cuUHJvZ3Jlc3NFdmVudCAhPSBudWxsKSB7XG4gICAgICAgIHNpemUgPSBudWxsO1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAgaWYgKGV2dC5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSBfdGhpcy5wcm9ncmVzcyArICgxMDAgLSBfdGhpcy5wcm9ncmVzcykgLyAyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICBfcmVmMiA9IFsnbG9hZCcsICdhYm9ydCcsICd0aW1lb3V0JywgJ2Vycm9yJ107XG4gICAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICAgIGV2ZW50ID0gX3JlZjJbX2pdO1xuICAgICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfb25yZWFkeXN0YXRlY2hhbmdlID0gcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2U7XG4gICAgICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIF9yZWYzO1xuICAgICAgICAgIGlmICgoX3JlZjMgPSByZXF1ZXN0LnJlYWR5U3RhdGUpID09PSAwIHx8IF9yZWYzID09PSA0KSB7XG4gICAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gMykge1xuICAgICAgICAgICAgX3RoaXMucHJvZ3Jlc3MgPSA1MDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHR5cGVvZiBfb25yZWFkeXN0YXRlY2hhbmdlID09PSBcImZ1bmN0aW9uXCIgPyBfb25yZWFkeXN0YXRlY2hhbmdlLmFwcGx5KG51bGwsIGFyZ3VtZW50cykgOiB2b2lkIDA7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFhIUlJlcXVlc3RUcmFja2VyO1xuXG4gIH0pKCk7XG5cbiAgU29ja2V0UmVxdWVzdFRyYWNrZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gU29ja2V0UmVxdWVzdFRyYWNrZXIocmVxdWVzdCkge1xuICAgICAgdmFyIGV2ZW50LCBfaiwgX2xlbjEsIF9yZWYyLFxuICAgICAgICBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIF9yZWYyID0gWydlcnJvcicsICdvcGVuJ107XG4gICAgICBmb3IgKF9qID0gMCwgX2xlbjEgPSBfcmVmMi5sZW5ndGg7IF9qIDwgX2xlbjE7IF9qKyspIHtcbiAgICAgICAgZXZlbnQgPSBfcmVmMltfal07XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFNvY2tldFJlcXVlc3RUcmFja2VyO1xuXG4gIH0pKCk7XG5cbiAgRWxlbWVudE1vbml0b3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gRWxlbWVudE1vbml0b3Iob3B0aW9ucykge1xuICAgICAgdmFyIHNlbGVjdG9yLCBfaiwgX2xlbjEsIF9yZWYyO1xuICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG4gICAgICB0aGlzLmVsZW1lbnRzID0gW107XG4gICAgICBpZiAob3B0aW9ucy5zZWxlY3RvcnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLnNlbGVjdG9ycyA9IFtdO1xuICAgICAgfVxuICAgICAgX3JlZjIgPSBvcHRpb25zLnNlbGVjdG9ycztcbiAgICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgICBzZWxlY3RvciA9IF9yZWYyW19qXTtcbiAgICAgICAgdGhpcy5lbGVtZW50cy5wdXNoKG5ldyBFbGVtZW50VHJhY2tlcihzZWxlY3RvcikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBFbGVtZW50TW9uaXRvcjtcblxuICB9KSgpO1xuXG4gIEVsZW1lbnRUcmFja2VyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEVsZW1lbnRUcmFja2VyKHNlbGVjdG9yKSB7XG4gICAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgIHRoaXMuY2hlY2soKTtcbiAgICB9XG5cbiAgICBFbGVtZW50VHJhY2tlci5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kb25lKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmNoZWNrKCk7XG4gICAgICAgIH0pLCBvcHRpb25zLmVsZW1lbnRzLmNoZWNrSW50ZXJ2YWwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBFbGVtZW50VHJhY2tlci5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgfTtcblxuICAgIHJldHVybiBFbGVtZW50VHJhY2tlcjtcblxuICB9KSgpO1xuXG4gIERvY3VtZW50TW9uaXRvciA9IChmdW5jdGlvbigpIHtcbiAgICBEb2N1bWVudE1vbml0b3IucHJvdG90eXBlLnN0YXRlcyA9IHtcbiAgICAgIGxvYWRpbmc6IDAsXG4gICAgICBpbnRlcmFjdGl2ZTogNTAsXG4gICAgICBjb21wbGV0ZTogMTAwXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIERvY3VtZW50TW9uaXRvcigpIHtcbiAgICAgIHZhciBfb25yZWFkeXN0YXRlY2hhbmdlLCBfcmVmMixcbiAgICAgICAgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IChfcmVmMiA9IHRoaXMuc3RhdGVzW2RvY3VtZW50LnJlYWR5U3RhdGVdKSAhPSBudWxsID8gX3JlZjIgOiAxMDA7XG4gICAgICBfb25yZWFkeXN0YXRlY2hhbmdlID0gZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlO1xuICAgICAgZG9jdW1lbnQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChfdGhpcy5zdGF0ZXNbZG9jdW1lbnQucmVhZHlTdGF0ZV0gIT0gbnVsbCkge1xuICAgICAgICAgIF90aGlzLnByb2dyZXNzID0gX3RoaXMuc3RhdGVzW2RvY3VtZW50LnJlYWR5U3RhdGVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlb2YgX29ucmVhZHlzdGF0ZWNoYW5nZSA9PT0gXCJmdW5jdGlvblwiID8gX29ucmVhZHlzdGF0ZWNoYW5nZS5hcHBseShudWxsLCBhcmd1bWVudHMpIDogdm9pZCAwO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gRG9jdW1lbnRNb25pdG9yO1xuXG4gIH0pKCk7XG5cbiAgRXZlbnRMYWdNb25pdG9yID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50TGFnTW9uaXRvcigpIHtcbiAgICAgIHZhciBhdmcsIGludGVydmFsLCBsYXN0LCBwb2ludHMsIHNhbXBsZXMsXG4gICAgICAgIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgYXZnID0gMDtcbiAgICAgIHNhbXBsZXMgPSBbXTtcbiAgICAgIHBvaW50cyA9IDA7XG4gICAgICBsYXN0ID0gbm93KCk7XG4gICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGlmZjtcbiAgICAgICAgZGlmZiA9IG5vdygpIC0gbGFzdCAtIDUwO1xuICAgICAgICBsYXN0ID0gbm93KCk7XG4gICAgICAgIHNhbXBsZXMucHVzaChkaWZmKTtcbiAgICAgICAgaWYgKHNhbXBsZXMubGVuZ3RoID4gb3B0aW9ucy5ldmVudExhZy5zYW1wbGVDb3VudCkge1xuICAgICAgICAgIHNhbXBsZXMuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgICBhdmcgPSBhdmdBbXBsaXR1ZGUoc2FtcGxlcyk7XG4gICAgICAgIGlmICgrK3BvaW50cyA+PSBvcHRpb25zLmV2ZW50TGFnLm1pblNhbXBsZXMgJiYgYXZnIDwgb3B0aW9ucy5ldmVudExhZy5sYWdUaHJlc2hvbGQpIHtcbiAgICAgICAgICBfdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICByZXR1cm4gY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnByb2dyZXNzID0gMTAwICogKDMgLyAoYXZnICsgMykpO1xuICAgICAgICB9XG4gICAgICB9LCA1MCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEV2ZW50TGFnTW9uaXRvcjtcblxuICB9KSgpO1xuXG4gIFNjYWxlciA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBTY2FsZXIoc291cmNlKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMubGFzdCA9IHRoaXMuc2luY2VMYXN0VXBkYXRlID0gMDtcbiAgICAgIHRoaXMucmF0ZSA9IG9wdGlvbnMuaW5pdGlhbFJhdGU7XG4gICAgICB0aGlzLmNhdGNodXAgPSAwO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IHRoaXMubGFzdFByb2dyZXNzID0gMDtcbiAgICAgIGlmICh0aGlzLnNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3MgPSByZXN1bHQodGhpcy5zb3VyY2UsICdwcm9ncmVzcycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIFNjYWxlci5wcm90b3R5cGUudGljayA9IGZ1bmN0aW9uKGZyYW1lVGltZSwgdmFsKSB7XG4gICAgICB2YXIgc2NhbGluZztcbiAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICB2YWwgPSByZXN1bHQodGhpcy5zb3VyY2UsICdwcm9ncmVzcycpO1xuICAgICAgfVxuICAgICAgaWYgKHZhbCA+PSAxMDApIHtcbiAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWwgPT09IHRoaXMubGFzdCkge1xuICAgICAgICB0aGlzLnNpbmNlTGFzdFVwZGF0ZSArPSBmcmFtZVRpbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5zaW5jZUxhc3RVcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLnJhdGUgPSAodmFsIC0gdGhpcy5sYXN0KSAvIHRoaXMuc2luY2VMYXN0VXBkYXRlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2F0Y2h1cCA9ICh2YWwgLSB0aGlzLnByb2dyZXNzKSAvIG9wdGlvbnMuY2F0Y2h1cFRpbWU7XG4gICAgICAgIHRoaXMuc2luY2VMYXN0VXBkYXRlID0gMDtcbiAgICAgICAgdGhpcy5sYXN0ID0gdmFsO1xuICAgICAgfVxuICAgICAgaWYgKHZhbCA+IHRoaXMucHJvZ3Jlc3MpIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyArPSB0aGlzLmNhdGNodXAgKiBmcmFtZVRpbWU7XG4gICAgICB9XG4gICAgICBzY2FsaW5nID0gMSAtIE1hdGgucG93KHRoaXMucHJvZ3Jlc3MgLyAxMDAsIG9wdGlvbnMuZWFzZUZhY3Rvcik7XG4gICAgICB0aGlzLnByb2dyZXNzICs9IHNjYWxpbmcgKiB0aGlzLnJhdGUgKiBmcmFtZVRpbWU7XG4gICAgICB0aGlzLnByb2dyZXNzID0gTWF0aC5taW4odGhpcy5sYXN0UHJvZ3Jlc3MgKyBvcHRpb25zLm1heFByb2dyZXNzUGVyRnJhbWUsIHRoaXMucHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgubWF4KDAsIHRoaXMucHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgubWluKDEwMCwgdGhpcy5wcm9ncmVzcyk7XG4gICAgICB0aGlzLmxhc3RQcm9ncmVzcyA9IHRoaXMucHJvZ3Jlc3M7XG4gICAgICByZXR1cm4gdGhpcy5wcm9ncmVzcztcbiAgICB9O1xuXG4gICAgcmV0dXJuIFNjYWxlcjtcblxuICB9KSgpO1xuXG4gIHNvdXJjZXMgPSBudWxsO1xuXG4gIHNjYWxlcnMgPSBudWxsO1xuXG4gIGJhciA9IG51bGw7XG5cbiAgdW5pU2NhbGVyID0gbnVsbDtcblxuICBhbmltYXRpb24gPSBudWxsO1xuXG4gIGNhbmNlbEFuaW1hdGlvbiA9IG51bGw7XG5cbiAgUGFjZS5ydW5uaW5nID0gZmFsc2U7XG5cbiAgaGFuZGxlUHVzaFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG9wdGlvbnMucmVzdGFydE9uUHVzaFN0YXRlKSB7XG4gICAgICByZXR1cm4gUGFjZS5yZXN0YXJ0KCk7XG4gICAgfVxuICB9O1xuXG4gIGlmICh3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgIT0gbnVsbCkge1xuICAgIF9wdXNoU3RhdGUgPSB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGU7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBoYW5kbGVQdXNoU3RhdGUoKTtcbiAgICAgIHJldHVybiBfcHVzaFN0YXRlLmFwcGx5KHdpbmRvdy5oaXN0b3J5LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAod2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlICE9IG51bGwpIHtcbiAgICBfcmVwbGFjZVN0YXRlID0gd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlO1xuICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaGFuZGxlUHVzaFN0YXRlKCk7XG4gICAgICByZXR1cm4gX3JlcGxhY2VTdGF0ZS5hcHBseSh3aW5kb3cuaGlzdG9yeSwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgU09VUkNFX0tFWVMgPSB7XG4gICAgYWpheDogQWpheE1vbml0b3IsXG4gICAgZWxlbWVudHM6IEVsZW1lbnRNb25pdG9yLFxuICAgIGRvY3VtZW50OiBEb2N1bWVudE1vbml0b3IsXG4gICAgZXZlbnRMYWc6IEV2ZW50TGFnTW9uaXRvclxuICB9O1xuXG4gIChpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHR5cGUsIF9qLCBfaywgX2xlbjEsIF9sZW4yLCBfcmVmMiwgX3JlZjMsIF9yZWY0O1xuICAgIFBhY2Uuc291cmNlcyA9IHNvdXJjZXMgPSBbXTtcbiAgICBfcmVmMiA9IFsnYWpheCcsICdlbGVtZW50cycsICdkb2N1bWVudCcsICdldmVudExhZyddO1xuICAgIGZvciAoX2ogPSAwLCBfbGVuMSA9IF9yZWYyLmxlbmd0aDsgX2ogPCBfbGVuMTsgX2orKykge1xuICAgICAgdHlwZSA9IF9yZWYyW19qXTtcbiAgICAgIGlmIChvcHRpb25zW3R5cGVdICE9PSBmYWxzZSkge1xuICAgICAgICBzb3VyY2VzLnB1c2gobmV3IFNPVVJDRV9LRVlTW3R5cGVdKG9wdGlvbnNbdHlwZV0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgX3JlZjQgPSAoX3JlZjMgPSBvcHRpb25zLmV4dHJhU291cmNlcykgIT0gbnVsbCA/IF9yZWYzIDogW107XG4gICAgZm9yIChfayA9IDAsIF9sZW4yID0gX3JlZjQubGVuZ3RoOyBfayA8IF9sZW4yOyBfaysrKSB7XG4gICAgICBzb3VyY2UgPSBfcmVmNFtfa107XG4gICAgICBzb3VyY2VzLnB1c2gobmV3IHNvdXJjZShvcHRpb25zKSk7XG4gICAgfVxuICAgIFBhY2UuYmFyID0gYmFyID0gbmV3IEJhcjtcbiAgICBzY2FsZXJzID0gW107XG4gICAgcmV0dXJuIHVuaVNjYWxlciA9IG5ldyBTY2FsZXI7XG4gIH0pKCk7XG5cbiAgUGFjZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgUGFjZS50cmlnZ2VyKCdzdG9wJyk7XG4gICAgUGFjZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgYmFyLmRlc3Ryb3koKTtcbiAgICBjYW5jZWxBbmltYXRpb24gPSB0cnVlO1xuICAgIGlmIChhbmltYXRpb24gIT0gbnVsbCkge1xuICAgICAgaWYgKHR5cGVvZiBjYW5jZWxBbmltYXRpb25GcmFtZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbik7XG4gICAgICB9XG4gICAgICBhbmltYXRpb24gPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gaW5pdCgpO1xuICB9O1xuXG4gIFBhY2UucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgIFBhY2UudHJpZ2dlcigncmVzdGFydCcpO1xuICAgIFBhY2Uuc3RvcCgpO1xuICAgIHJldHVybiBQYWNlLnN0YXJ0KCk7XG4gIH07XG5cbiAgUGFjZS5nbyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFydDtcbiAgICBQYWNlLnJ1bm5pbmcgPSB0cnVlO1xuICAgIGJhci5yZW5kZXIoKTtcbiAgICBzdGFydCA9IG5vdygpO1xuICAgIGNhbmNlbEFuaW1hdGlvbiA9IGZhbHNlO1xuICAgIHJldHVybiBhbmltYXRpb24gPSBydW5BbmltYXRpb24oZnVuY3Rpb24oZnJhbWVUaW1lLCBlbnF1ZXVlTmV4dEZyYW1lKSB7XG4gICAgICB2YXIgYXZnLCBjb3VudCwgZG9uZSwgZWxlbWVudCwgZWxlbWVudHMsIGksIGosIHJlbWFpbmluZywgc2NhbGVyLCBzY2FsZXJMaXN0LCBzdW0sIF9qLCBfaywgX2xlbjEsIF9sZW4yLCBfcmVmMjtcbiAgICAgIHJlbWFpbmluZyA9IDEwMCAtIGJhci5wcm9ncmVzcztcbiAgICAgIGNvdW50ID0gc3VtID0gMDtcbiAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgZm9yIChpID0gX2ogPSAwLCBfbGVuMSA9IHNvdXJjZXMubGVuZ3RoOyBfaiA8IF9sZW4xOyBpID0gKytfaikge1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2VzW2ldO1xuICAgICAgICBzY2FsZXJMaXN0ID0gc2NhbGVyc1tpXSAhPSBudWxsID8gc2NhbGVyc1tpXSA6IHNjYWxlcnNbaV0gPSBbXTtcbiAgICAgICAgZWxlbWVudHMgPSAoX3JlZjIgPSBzb3VyY2UuZWxlbWVudHMpICE9IG51bGwgPyBfcmVmMiA6IFtzb3VyY2VdO1xuICAgICAgICBmb3IgKGogPSBfayA9IDAsIF9sZW4yID0gZWxlbWVudHMubGVuZ3RoOyBfayA8IF9sZW4yOyBqID0gKytfaykge1xuICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50c1tqXTtcbiAgICAgICAgICBzY2FsZXIgPSBzY2FsZXJMaXN0W2pdICE9IG51bGwgPyBzY2FsZXJMaXN0W2pdIDogc2NhbGVyTGlzdFtqXSA9IG5ldyBTY2FsZXIoZWxlbWVudCk7XG4gICAgICAgICAgZG9uZSAmPSBzY2FsZXIuZG9uZTtcbiAgICAgICAgICBpZiAoc2NhbGVyLmRvbmUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgIHN1bSArPSBzY2FsZXIudGljayhmcmFtZVRpbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhdmcgPSBzdW0gLyBjb3VudDtcbiAgICAgIGJhci51cGRhdGUodW5pU2NhbGVyLnRpY2soZnJhbWVUaW1lLCBhdmcpKTtcbiAgICAgIGlmIChiYXIuZG9uZSgpIHx8IGRvbmUgfHwgY2FuY2VsQW5pbWF0aW9uKSB7XG4gICAgICAgIGJhci51cGRhdGUoMTAwKTtcbiAgICAgICAgUGFjZS50cmlnZ2VyKCdkb25lJyk7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGJhci5maW5pc2goKTtcbiAgICAgICAgICBQYWNlLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gUGFjZS50cmlnZ2VyKCdoaWRlJyk7XG4gICAgICAgIH0sIE1hdGgubWF4KG9wdGlvbnMuZ2hvc3RUaW1lLCBNYXRoLm1heChvcHRpb25zLm1pblRpbWUgLSAobm93KCkgLSBzdGFydCksIDApKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZW5xdWV1ZU5leHRGcmFtZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFBhY2Uuc3RhcnQgPSBmdW5jdGlvbihfb3B0aW9ucykge1xuICAgIGV4dGVuZChvcHRpb25zLCBfb3B0aW9ucyk7XG4gICAgUGFjZS5ydW5uaW5nID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgYmFyLnJlbmRlcigpO1xuICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgTm9UYXJnZXRFcnJvciA9IF9lcnJvcjtcbiAgICB9XG4gICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGFjZScpKSB7XG4gICAgICByZXR1cm4gc2V0VGltZW91dChQYWNlLnN0YXJ0LCA1MCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIFBhY2UudHJpZ2dlcignc3RhcnQnKTtcbiAgICAgIHJldHVybiBQYWNlLmdvKCk7XG4gICAgfVxuICB9O1xuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydwYWNlJ10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFBhY2U7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBQYWNlO1xuICB9IGVsc2Uge1xuICAgIGlmIChvcHRpb25zLnN0YXJ0T25QYWdlTG9hZCkge1xuICAgICAgUGFjZS5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG59KS5jYWxsKHRoaXMpO1xuIiwialF1ZXJ5KGZ1bmN0aW9uICgkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBGbGV4eSBoZWFkZXJcbiAgLy8gZmxleHlfaGVhZGVyLmluaXQoKTtcblxuICAkKCcuc2lkci10b2dnbGUtLXJpZ2h0Jykuc2lkcih7XG4gICAgbmFtZTogJ3NpZHItbWFpbicsXG4gICAgZGlzcGxhY2U6IGZhbHNlLFxuICAgIHNpZGU6ICdyaWdodCcsXG4gICAgcmVuYW1pbmc6IGZhbHNlLFxuICAgIGJvZHk6ICcubGF5b3V0X193cmFwcGVyJyxcbiAgICBzb3VyY2U6ICcuc2lkci1zb3VyY2UtcHJvdmlkZXInXG4gIH0pO1xuXG4gIC8vIEVuYWJsZSB0b29sdGlwcy5cbiAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLnRvb2x0aXAoKTtcbn0pO1xuIl19
